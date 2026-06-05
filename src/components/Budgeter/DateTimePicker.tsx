"use client";

import { useContext, useState } from "react";

import { BudgeterContext } from "@/context/budgeter";
import DateTimeAvailabilityField from "../booking/DateTimeAvailabilityField";
import { Messages } from "@/lib/getMessages";

type Props = {
  m: Messages["bookingPage"];
};

export default function DateTimePicker({ m }: Props) {
  const [state, dispatch] = useContext(BudgeterContext);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.bookingDetails.date ? new Date(state.bookingDetails.date) : undefined,
  );

  const [time, setTime] = useState(state.bookingDetails.time);

  const handleContinue = () => {
    dispatch({
      type: "SET_BOOKING_DETAILS",
      payload: {
        date: selectedDate ? selectedDate.toLocaleDateString("en-GB").slice(0, 10) : "",
        time,
      },
    });

    dispatch({
      type: "CONFIRM_BOOKING",
    });
  };

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
        <div className="rounded-2xl border border-slate-200 p-4">
          <DateTimeAvailabilityField
            m={m}
            selected={selectedDate}
            onDateChange={setSelectedDate}
            time={time}
            onTimeChange={setTime}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t pt-4">
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !time}
          className="w-full rounded-xl bg-black py-4 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
