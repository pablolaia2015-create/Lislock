"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Review } from "@/types/review";

type LocalPhoto = { file: File; url: string };

const MAX_COUNT = 5;
const MAX_EACH = 5 * 1024 * 1024;
const MAX_OPINION_LEN = 500;

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            className={[
              "text-xl leading-none",
              active ? "text-amber-500" : "text-slate-300",
              onChange ? "hover:opacity-80" : "cursor-default",
            ].join(" ")}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({
  serviceSlug,
  onSuccess,
}: {
  serviceSlug: string;
  onSuccess: (review: Review) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(5);
  const [opinion, setOpinion] = useState("");
  const [photos, setPhotos] = useState<LocalPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  function onFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");

    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const next: LocalPhoto[] = [];

    for (const f of files) {
      if (!ALLOWED.has(f.type)) {
        setError("Apenas imagens JPG, PNG e WEBP são permitidas.");
        continue;
      }

      if (f.size > MAX_EACH) {
        setError("Cada imagem deve ter 5MB ou menos.");
        continue;
      }

      next.push({
        file: f,
        url: URL.createObjectURL(f),
      });
    }

    setPhotos((prev) => [...prev, ...next].slice(0, MAX_COUNT));

    e.currentTarget.value = "";
  }

  function removeLocalPhoto(index: number) {
    setPhotos((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  }

  function clearLocalPhotos() {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }

  async function submitReview() {
    if (submitting) return;

    setError("");

    if (!customerName.trim()) return setError("Por favor, introduza o seu nome.");

    if (!opinion.trim()) return setError("Por favor, escreva a sua avaliação.");

    if (opinion.length > MAX_OPINION_LEN) {
      return setError(`A avaliação deve ter ${MAX_OPINION_LEN} caracteres ou menos.`);
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.set("serviceSlug", serviceSlug);
      fd.set("customerName", customerName.trim());
      fd.set("rating", String(rating));
      fd.set("opinion", opinion.trim());

      photos.forEach((p) => fd.append("photos", p.file));

      const res = await fetch("/api/reviews", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Falha ao enviar a avaliação.");

      onSuccess(data.review);

      setCustomerName("");
      setRating(5);
      setOpinion("");
      clearLocalPhotos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao enviar a avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div>
        <p className="text-md font-bold text-slate-900">Escreva uma avaliação</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr,200px]">
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700">
            O seu nome
          </label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-slate-900"
            placeholder="Ex: João Silva"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700">Classificação</label>
          <div className="h-10 flex items-center">
            <Stars value={rating} onChange={setRating} />
          </div>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-700">
          A sua avaliação
        </label>
        <textarea
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          rows={4}
          maxLength={MAX_OPINION_LEN}
          placeholder="Descreva a sua experiência com este serviço..."
          className="rounded-md border border-slate-300 px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-cyan-600 text-slate-900"
        />
        <p className="text-xs text-slate-500">
          {opinion.length}/{MAX_OPINION_LEN}
        </p>
      </div>

      {/* Inputs Ocultos */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={onFilesChange}
        className="hidden"
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onFilesChange}
        className="hidden"
      />

      {/* Botões */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="inline-flex items-center justify-center rounded-md bg-cyan-700 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-800 transition"
        >
          Tirar foto
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Escolher da galeria
        </button>
        {photos.length > 0 && (
          <button
            type="button"
            onClick={clearLocalPhotos}
            className="inline-flex items-center justify-center rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 transition"
          >
            Limpar fotos
          </button>
        )}
      </div>
      
      {/* Pré-visualização das fotos */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {photos.map((p, idx) => (
            <div key={p.url} className="relative aspect-square">
              <Image
                src={p.url}
                alt={`Nova foto ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, 20vw"
                className="rounded-md object-cover ring-1 ring-slate-200"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeLocalPhoto(idx)}
                className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
                aria-label="Remover imagem"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Até 5 imagens, máx 5MB cada. Recomendado: JPG/PNG/WEBP.
        </p>
        <button
          type="button"
          disabled={submitting}
          onClick={submitReview}
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-black disabled:opacity-60 transition"
        >
          {submitting ? "A enviar..." : "Enviar avaliação"}
        </button>
      </div>

      {error && <p className="text-sm font-medium text-rose-700">{error}</p>}
    </div>
  );
}