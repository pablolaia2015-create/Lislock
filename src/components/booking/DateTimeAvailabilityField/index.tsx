"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Messages } from "@/lib/getMessages";
import { pt, enIE } from "react-day-picker/locale";

type Props = {
  durationMinutes?: number;
  m: Messages["bookingPage"];

  selected?: Date;
  time?: string;

  onDateChange?: (date?: Date) => void;
  onTimeChange?: (time: string) => void;
};

export default function DateTimeAvailabilityField({
  durationMinutes = 60,
  m,

  selected: controlledSelected,
  time: controlledTime,

  onDateChange,
  onTimeChange,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<Date | undefined>();
  const [internalTime, setInternalTime] = useState("");

  const [available, setAvailable] = useState<Date[]>([]);
  const [blocked, setBlocked] = useState<Date[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const selected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  const time = controlledTime !== undefined ? controlledTime : internalTime;

  const handleDateChange = (date?: Date) => {
    if (onDateChange) {
      onDateChange(date);
    } else {
      setInternalSelected(date);
    }
  };

  const handleTimeChange = (value: string) => {
    if (onTimeChange) {
      onTimeChange(value);
    } else {
      setInternalTime(value);
    }
  };

  useEffect(() => {
    fetch(`/api/calendar-availability?duration=${durationMinutes}`)
      .then((r) => r.json())
      .then((d) => {
        setAvailable(d.availableDays.map((x: string) => new Date(x)));
        setBlocked(d.blockedDays.map((x: string) => new Date(x)));
      })
      .catch((e) => {
        console.error("Failed to fetch calendar availability:", e);
        setAvailable([]);
        setBlocked([]);
      });
  }, [durationMinutes]);

  useEffect(() => {
    if (!selected) {
      setSlots([]);

      if (controlledTime === undefined) {
        setInternalTime("");
      }

      return;
    }

    const date = selected.toISOString().slice(0, 10);

    fetch(`/api/availability?date=${date}&duration=${durationMinutes}`)
      .then((r) => r.json())
      .then(setSlots)
      .catch((e) => {
        console.error("Failed to fetch time slots:", e);
        setSlots([]);
      });
  }, [selected, durationMinutes, controlledTime]);

  const isoDate = selected ? selected.toISOString().slice(0, 10) : "";
  const locale = m.dayPicker.locale === "en" ? enIE : pt;
  const hasDate = !!selected;

  // 💡 AUDITORIA: Capturar a data de hoje apenas no cliente para evitar hydration mismatch
  const [today, setToday] = useState<Date | undefined>();
  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <div className="space-y-4">
      {/* DATE */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">
          {m.dayPicker.preferedDate}
        </label>

        <DayPicker
          mode="single"
          selected={selected}
          onSelect={handleDateChange}
          // 💡 AUDITORIA: Bloqueia dias anteriores a hoje JUNTO com os dias bloqueados pela API
          disabled={today ? [{ before: today }, ...blocked] : blocked}
          modifiers={{
            available,
            blocked,
          }}
          modifiersClassNames={{
            available: "bg-emerald-100 text-emerald-800",
            blocked: "bg-rose-100 text-rose-600 line-through opacity-50", // 💡 Deixei o visual do dia bloqueado um pouco mais bonito
          }}
          locale={locale}
        />

        <input type="hidden" name="date" value={isoDate} />
      </div>

      {/* TIME */}
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">
          {m.dayPicker.preferedTime}
        </label>

        <select
          name="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          required={hasDate && slots.length > 0}
          disabled={!hasDate || slots.length === 0}
          className="w-full rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-400 focus:ring-2 focus:ring-cyan-600 outline-none"
        >
          {!hasDate && <option value="">{m.dayPicker.selectedDate}</option>}

          {hasDate && slots.length === 0 && (
            <option value="">{m.dayPicker.noAvailable}</option>
          )}

          {hasDate && slots.length > 0 && (
            <>
              <option value="">{m.dayPicker.selectTime}</option>

              {slots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </>
          )}
        </select>
      </div>
    </div>
  );
}