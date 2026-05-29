import DateTimeAvailabilityField from "../booking/DateTimeAvailabilityField";
import { Messages } from "@/lib/getMessages";

type Props = {
  m: Messages["bookingPage"];
};

export default function DateTimePicker({ m }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-3">
      {/* HEADER */}
      <div className="shrink-0">
        <h2 className="text-3xl font-semibold">Preferred date & time</h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose the day and time that works best for you
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <div className="border border-slate-200 rounded-2xl p-4">
          <DateTimeAvailabilityField m={m} />
        </div>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t pt-4">
        <button
          type="submit"
          className="w-full bg-black text-white rounded-xl py-4 hover:opacity-90 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
