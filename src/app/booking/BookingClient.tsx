"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import ServicePickerModal from "@/components/ServicePickerModal";
import BookingConfirmationCard from "@/components/booking/BookingConfirmationCard";
import DateTimeAvailabilityField from "@/components/booking/DateTimeAvailabilityField";
import { Service } from "@/types/service";
import { ICON_MAP } from "@/lib/iconMap";
import { reportConversionAwait } from "@/lib/ads";
import { Messages } from "@/lib/getMessages";
import { CountryCodePicker } from "@/components/CountryCode";

/* ------------------------- Google Ads / gtag setup ------------------------- */

type Gtag = {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, config?: Record<string, unknown>): void;
  (command: "event", eventName: string, params?: Record<string, unknown>): void;
};

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

type Props = {
  services: Service[];
  domain: string;
  m: Messages["bookingPage"];
};

/* --------------------------------- Helpers -------------------------------- */

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

type LocalPhoto = { file: File; url: string };

const ALIASES: Record<string, string> = {
  "door-maintenance": "door-replacement",
  "door-repair": "door-replacement",
  "heater-service": "heater-maintenance",
  "heating-maintenance": "heater-maintenance",
  "light-replacement": "lights-replacement",
  "light-install": "lights-replacement",
  "tap-repair": "tap-replacement",
  "washing-machine-install": "fit-washing-dishwasher",
  "dishwasher-install": "fit-washing-dishwasher",
  "tv-install": "tv-assembly",
  "tv-mount": "tv-assembly",
  curtains: "curtain-installation",
  blinds: "curtain-installation",
  "shower-fix": "shower-repair",
};

function normalize(v: string) {
  return v.toLowerCase().trim().replace(/\s+/g, "-");
}

function findServiceSlug(input: string | null, services: Service[]): string {
  if (!input) return "";
  const q = normalize(input);
  if (services.some((s) => s.slug === q)) return q;
  if (ALIASES[q]) return ALIASES[q];

  const qWords = q.replace(/-/g, " ");
  const byTitle = services.find((s) => s.title.toLowerCase().includes(qWords));
  if (byTitle) return byTitle.slug;

  const bySlug = services.find((s) => s.slug.includes(q));
  return bySlug ? bySlug.slug : "";
}

/* --------------------------------- Component -------------------------------- */

export default function BookingClient({ services, domain, m }: Props) {
  const search = useSearchParams();
  const [service, setService] = useState<string>("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  const [confirmedBooking, setConfirmedBooking] = useState<null | {
    bookingId: string;
    service: string;
    date: string;
    time: string;
    name: string;
    address: string;
    eircode: string;
  }>(null);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const raw = search.get("service") ?? search.get("type");
    const chosen = findServiceSlug(raw, services);
    setService(chosen);
  }, [search, services]);

  const selected = useMemo(
    () => services.find((s) => s.slug === service),
    [service, services],
  );
  useEffect(() => {
    if (confirmedBooking) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [confirmedBooking]);

  /* ------------------------------ Photo handlers ----------------------------- */

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    const maxEach = 5 * 1024 * 1024;
    const maxCount = 5;

    const next: LocalPhoto[] = [];
    for (const f of files) {
      if (!allowed.includes(f.type)) {
        // 💡 Auditoria: Erro traduzido
        setError("Apenas imagens JPG, PNG, WEBP ou HEIC são permitidas.");
        continue;
      }
      if (f.size > maxEach) {
        // 💡 Auditoria: Erro traduzido
        setError("Cada imagem deve ter 5MB ou menos.");
        continue;
      }
      next.push({ file: f, url: URL.createObjectURL(f) });
    }

    setPhotos((prev) => [...prev, ...next].slice(0, maxCount));
    e.currentTarget.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  }

  function clearPhotos() {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }

  // 💡 AUDITORIA: Prevenir memory leak quando o componente desmontar
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  /* --------------------------------- Submit ---------------------------------- */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      if (!selected) {
        toast.error(`${m.messages.selectService}`);
        setIsSubmitting(false);
        return;
      }

      const form = e.currentTarget;
      const fd = new FormData(form);
      const dateStr = fd.get("date") as string;

      // 💡 AUDITORIA: BARREIRA DE PROTEÇÃO CONTRA DATAS NO PASSADO 💡
      if (dateStr) {
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignorar horas, focar só no dia
        
        if (selectedDate < today) {
          const pastDateMsg = "Não é possível agendar um serviço para uma data que já passou.";
          setError(pastDateMsg);
          toast.error(pastDateMsg);
          setIsSubmitting(false);
          return; // Para a execução do código aqui!
        }
      }

      fd.set("service", selected.slug);
      photos.forEach((p) => fd.append("photos", p.file));

      const res = await fetch("/api/booking", {
        method: "POST",
        body: fd,
      });

      // ✅ read ONCE
      const data: { id?: string; error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `${m.messages.errors.generic}`);
      }

      if (!data.id) {
        throw new Error(`${m.messages.errors.missingId}`);
      }

      await reportConversionAwait(
        { value: 1.0, currency: "EUR", domain },
        2000,
      );

      toast.success(`${m.messages.success}`);

      setConfirmedBooking({
        bookingId: data.id,
        service: selected.slug,
        date: fd.get("date") as string,
        time: fd.get("time") as string,
        name: fd.get("name") as string,
        address: fd.get("address") as string,
        eircode: fd.get("eircode") as string,
      });

      clearPhotos();
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---------------------------------- UI ------------------------------------ */

  return (
    <main ref={topRef} className="mx-auto max-w-3xl px-6 py-10 space-y-8">
      {confirmedBooking ? (
        <BookingConfirmationCard booking={confirmedBooking} />
      ) : (
        <>
          <header className="space-y-3">
            <h1 className="text-3xl font-extrabold text-slate-900">
              {m.booking.title}
            </h1>

            <div className="flex items-center gap-3">
              <span className="text-slate-600">{m.booking.selectedLabel}</span>
              {selected ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1.5 text-cyan-800 ring-1 ring-cyan-200">
                  {selected &&
                    (() => {
                      const Icon = ICON_MAP[selected.icon];
                      return <Icon className="h-4 w-4" />;
                    })()}
                  <span className="font-medium">{selected.title}</span>
                </span>
              ) : (
                <span className="text-slate-400">{m.booking.noneSelected}</span>
              )}
            </div>

            <ServicePickerModal
              value={service}
              onChange={setService}
              services={services}
              ctaText={
                selected
                  ? `${m.booking.changeService}`
                  : `${m.booking.chooseService}`
              }
            />
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            {/* Date & Time */}
            <DateTimeAvailabilityField m={m} />

            {/* Details */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                {m.form.sections.details}
              </label>
              <input
                name="name"
                placeholder={m.form.fields.name}
                required
                className="rounded-md border border-slate-300 px-3 py-2"
              />
              <CountryCodePicker m={m} />

              <input
                name="phone"
                placeholder={m.form.fields.phone}
                required
                className="rounded-md border border-slate-300 px-3 py-2"
              />

              <div className="grid gap-3 sm:grid-cols-[1fr,200px]">
                <input
                  name="address"
                  placeholder={m.form.fields.address}
                  required
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
                <input
                  name="eircode"
                  placeholder={m.form.fields.eircode}
                  required
                  className="rounded-md border border-slate-300 px-3 py-2 uppercase"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                {m.form.sections.description}
              </label>
              <textarea
                name="description"
                rows={4}
                required
                className="rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-cyan-600"
              />
            </div>

            {/* Photos */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                {m.form.sections.photos}
              </label>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFilesChange}
                className="hidden"
              />
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFilesChange}
                className="hidden"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="rounded-md bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-800 transition"
                >
                  {m.form.buttons.takePhoto}
                </button>
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="rounded-md border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2 transition"
                >
                  {m.form.buttons.choosePhotos}
                </button>
              </div>

              {photos.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((p, i) => (
                    <div key={p.url} className="relative aspect-square">
                      <Image
                        src={p.url}
                        alt=""
                        fill
                        className="rounded-md object-cover border border-slate-200"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded hover:bg-black/80 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm text-rose-700 font-medium bg-rose-50 p-3 rounded-md border border-rose-200">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-cyan-700 py-3 text-white font-bold hover:bg-cyan-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? `${m.form.buttons.submitting}`
                : `${m.form.buttons.submit}`}
            </button>
          </form>
        </>
      )}
    </main>
  );
}