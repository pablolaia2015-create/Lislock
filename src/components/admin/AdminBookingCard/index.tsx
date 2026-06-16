"use client";

import type { AdminBooking } from "./types";
import BookingHeader from "./BookingHeader";
import BookingBody from "./BookingBody/BookingBody";

export default function AdminBookingCard({
  booking,
}: {
  booking: AdminBooking;
}) {
  return (
    <article className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <BookingHeader booking={booking} />

      <BookingBody booking={booking} />
    </article>
  );
}
