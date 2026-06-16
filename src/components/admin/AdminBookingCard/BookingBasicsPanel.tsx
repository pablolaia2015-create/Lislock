import { AdminBooking } from "./types";

export default function BookingBasicsPanel({
  booking,
}: {
  booking: AdminBooking;
}) {
  const hasBasics =
    booking.budget != null ||
    booking.startTime ||
    booking.durationMinutes != null;

  if (!hasBasics) return null;

  const duration = Number(booking.finishTime) - Number(booking.startTime);

  return (
    <div className=" rounded-lg border bg-slate-50 p-3 ">
      <h3>Planned:</h3>
      <div className="grid grid-cols-3 gap-2 text-sm sm:grid-cols-3">
        <div className="w-full align-middle flex flex-col justify-center">
          <div className="text-slate-500 text-center">Budget</div>
          <div className="font-medium text-slate-900 text-center">
            {typeof booking.budget === "number" ? `€${booking.budget}` : "—"}
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <div className="w-full align-middle flex flex-col justify-center">
            <div className="text-slate-500 text-center ">Start</div>
            <div className="font-medium text-slate-900 text-center">
              {booking.startTime || "—"}
            </div>
          </div>
          <div className="w-full align-middle flex flex-col justify-center">
            <div className="text-slate-500 text-center">Finish</div>
            <div className="font-medium text-slate-900 text-center">
              {/* ✅ Replace the duplicated startTime with our new calculation */}
              {booking.finishTime}
            </div>
          </div>
        </div>

        <div className="w-full align-middle flex flex-col justify-center">
          <div className="text-slate-500 text-center">Duration</div>
          <div className="font-medium text-slate-900 text-center">
            {duration}
          </div>
        </div>
      </div>
    </div>
  );
}
