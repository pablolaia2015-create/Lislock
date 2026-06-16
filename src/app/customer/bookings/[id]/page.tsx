import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import BookingStatusPage from "@/components/booking/BookingStatusPage";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!id || !ObjectId.isValid(id)) {
    return <div className="p-10 text-center text-slate-600">ID de reserva inválido</div>;
  }

  const db = await getDb();
  const booking = await db.collection("bookings").findOne({
    _id: new ObjectId(id),
  });

  if (!booking) {
    return <div className="p-10 text-center text-slate-600">Reserva não encontrada</div>;
  }

  // 💡 TRADUTOR BLINDADO (À prova de erros de digitação na base de dados)
  const rawStatus = String(booking.status || "").toLowerCase();
  let finalStatus = "received";

  if (rawStatus === "confirmed") finalStatus = "confirmed";
  if (rawStatus === "done" || rawStatus === "completed") finalStatus = "completed";
  if (rawStatus === "reviewing" || rawStatus === "pending") finalStatus = "reviewing";
  if (rawStatus.includes("cancel")) finalStatus = "cancelled"; // Apanha "cancelled", "Canceled", "CANCELADO", etc.

  return (
    <BookingStatusPage
      booking={{
        id: booking._id.toString(),
        serviceName: booking.service || "Serviço",
        date: booking.date || "A definir",
        address: booking.address || "Sem morada",
        status: finalStatus as any,
        phoneE164: booking.phoneE164 || "", 
      }}
    />
  );
}