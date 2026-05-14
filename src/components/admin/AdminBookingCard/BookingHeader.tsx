"use client";
import Link from "next/link";
import { AdminBooking } from "./types";
import StatusBadge from "./StatusBadge";
import { formatWhenDate } from "./utils";
import BookingBasicsPanel from "./BookingBasicsPanel";
import { Image as ImageIcon, Phone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBookingAction } from "@/lib/actions/updateBooking";
import ActionButtons from "@/components/Buttons/ActionButtons";
import DeleteBooking from "./DeleteBooking";

type EditorValues = {
  service: string;
  name: string;
  phoneRaw: string;
  phoneE164: string;
  address: string;
  eircode: string;
  description: string;
  createdAt: string;
};

export default function BookingHeader({ booking }: { booking: AdminBooking }) {
  const photosCount = booking.photos?.length ?? 0;

  const initialValues: EditorValues = {
    service: booking.service ?? "",
    name: booking.name ?? "",
    phoneRaw: booking.phoneRaw ?? "",
    phoneE164: booking.phoneE164 ?? "",
    address: booking.address ?? "",
    eircode: booking.eircode ?? "",
    description: booking.description ?? "",
    createdAt: booking.createdAt ?? "",
  };
  const [values, setValues] = useState<EditorValues>(initialValues);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [showActions, setShowActions] = useState(false);

  const handleSubmit = async () => {
    await updateBookingAction({
      id: booking._id,
      updates: {
        service: values.service,
        name: values.name,
        phoneRaw: values.phoneRaw,
        phoneE164: values.phoneE164,
        address: values.address,
        eircode: values.eircode,
        description: values.description,
        createdAt: values.createdAt,
      },
      setLoading,
    });
    router.refresh();
    setEditing(false);
  };

  const handleCancel = () => {
    setValues(initialValues);
    setEditing(false);
  };

  return (
    <div className="px-2 py-4">
      <div className="flex items-start justify-between gap-3 ">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <input
              disabled={!editing}
              value={values.name}
              onChange={(e) =>
                setValues((p) => ({ ...p, name: e.target.value }))
              }
              className={`truncate text-lg font-semibold text-slate-900 ${
                editing ? "border border-slate-300 rounded px-2" : "border-none"
              }`}
            />
            <StatusBadge s={booking.status} />
          </div>

          <div className="mt-1 space-y-1 text-sm text-slate-800">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Created at:</span>

                <input
                  type="datetime-local"
                  readOnly={!editing}
                  value={new Date(values.createdAt).toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setValues((p) => ({
                      ...p,
                      createdAt: e.target.value,
                    }))
                  }
                  className={`text-slate-900 ${
                    editing
                      ? "border border-slate-300 rounded px-2"
                      : "border-none"
                  }`}
                />
              </div>
              <div className="flex gap-2">
                <span className="font-semibold">Service:</span>
                {/* Need to import the services to implement the edit */}
                <span className="truncate">{booking.service}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold">Service date:</span>
              <span>
                {booking.serviceDate
                  ? `${formatWhenDate(booking.serviceDate)} at ${booking.startTime}`
                  : "—"}{" "}
              </span>
            </div>

            {/* Important info in minimized view */}
            <div className="flex flex-col gap-1 pt-1 text-slate-900">
              <div className="flex gap-2 my-2 items-center">
                <span className="font-semibold">Phone:</span>

                <input
                  readOnly={!editing}
                  value={values.phoneRaw}
                  onClick={() => {
                    if (!editing) {
                      setShowActions(true);
                    }
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;

                    // remove non-numeric characters
                    const cleaned = raw.replace(/\D/g, "");

                    // extract country code from current E164
                    // example: +353857123456
                    const match = values.phoneE164.match(/^(\+\d{1,3})/);

                    const countryCode = match?.[1];

                    setValues((p) => ({
                      ...p,
                      phoneRaw: raw,
                      phoneE164: `${countryCode}${cleaned}`,
                    }));
                  }}
                  className={`underline ${
                    editing
                      ? "border border-slate-300 rounded px-2"
                      : "border-none cursor-pointer"
                  }`}
                />
              </div>

              {booking.distanceCost != null && (
                <div className="mt-1 text-sm text-slate-700">
                  <span className="font-semibold">Estimated travel cost:</span>{" "}
                  €{booking.distanceCost.toFixed(2)}
                  {booking.distanceKm && (
                    <span className="text-slate-500">
                      {" "}
                      ({booking.distanceKm})
                    </span>
                  )}
                </div>
              )}
              <div>
                {editing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={values.address}
                      onChange={(e) =>
                        setValues((p) => ({
                          ...p,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Address"
                      className="border border-slate-300 rounded px-2 py-1"
                    />

                    <input
                      value={values.eircode}
                      onChange={(e) =>
                        setValues((p) => ({
                          ...p,
                          eircode: e.target.value,
                        }))
                      }
                      placeholder="Eircode"
                      className="border border-slate-300 rounded px-2 py-1"
                    />
                  </div>
                ) : (
                  <Link
                    href={`http://maps.google.co.uk/maps?q=${booking.eircode}`}
                    target="_blank"
                    className="font-semibold"
                  >
                    Address: {values.address} · {values.eircode}
                  </Link>
                )}
              </div>
            </div>

            {/* Short description visible even minimized */}

            <div className="my-6">
              <div className="flex gap-2">
                <span className="font-semibold">When (preferred):</span>
                <span>{formatWhenDate(booking.date)}</span>
                <span>{booking.time}</span>
              </div>
              <p className="font-bold text-md">Customer description: </p>
              <textarea
                readOnly={!editing}
                value={values.description}
                onChange={(e) =>
                  setValues((p) => ({ ...p, description: e.target.value }))
                }
                className={`text-slate-900 w-full ${
                  editing
                    ? "border border-slate-300 rounded px-2 resize-y"
                    : "border-none cursor-pointer resize-none"
                }`}
              />
            </div>
          </div>
          {photosCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600 my-2">
              <ImageIcon className="h-6 w-6" />
              <span>
                {photosCount} photo{photosCount > 1 ? "s" : ""} attached
              </span>
            </div>
          )}

          {/* ----------------------- Edit and delete booking ------------------------------- */}
          <div className="flex flex-row h-9 gap-6 justify-center">
            <ActionButtons
              editing={editing}
              loading={loading}
              onEdit={() => setEditing(true)}
              onSave={handleSubmit}
              onCancel={handleCancel}
            />
            <DeleteBooking
              bookingId={booking._id}
              onToggleEditing={() => setEditing((v) => !v)}
            />
          </div>
        </div>
      </div>

      {/* Basic panel stays visible in minimized */}
      <div className="mt-3">
        <BookingBasicsPanel booking={booking} />
      </div>
      {showActions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowActions(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 w-[300px] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <Link
                className="flex items-center justify-center rounded-2xl gap-4 p-3 bg-blue-300 hover:bg-blue-500 transition-colors"
                href={`tel:${booking.phoneRaw}`}
              >
                <Phone />
                Call
              </Link>

              <Link
                href={`https://wa.me/${booking.phoneE164}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-2xl gap-4 p-3 bg-green-400 hover:bg-green-500 transition-colors"
              >
                <Image
                  src="/whatsapp.svg"
                  alt="WhatsApp logo"
                  width={22}
                  height={22}
                  className="shrink-0"
                />
                Send message
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
