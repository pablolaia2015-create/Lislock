"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteBooking({
  bookingId,
}: {
  bookingId: string;
  onToggleEditing?: () => void;
}) {
  const router = useRouter();

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!confirm("Delete this booking?")) return;

    const fd = new FormData();
    fd.append("id", bookingId);

    const res = await fetch("/api/admin/bookings/delete", {
      method: "POST",
      body: fd,
    });

    const data: { error?: string } = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete booking.");
      return;
    }

    // ✅ refresh page data (App Router)
    router.refresh();
  }

  return (
    <div className="flex justify-center">
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className=" px-1 py-1 text-red-500 hover:bg-red-50"
          title="Delete booking"
        >
          <Trash />
        </button>
      </form>
    </div>
  );
}
