"use client";

import { useContext, useState } from "react";
import { BudgeterContext } from "@/context/budgeter";
import { CountryCodePicker } from "../CountryCode";

export default function UserDetails() {
  const [state, dispatch] = useContext(BudgeterContext);

  const [form, setForm] = useState(state.customerDetails);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    dispatch({
      type: "SET_CUSTOMER_DETAILS",
      payload: form,
    });

    dispatch({
      type: "DATE_TIME_AVA",
    });
  };
  return (
    <div className="flex h-full min-h-0 flex-col gap-2 px-1 py-3">
      {/* HEADER */}
      <div className="shrink-0">
        <h2 className="text-2xl font-semibold">Your details</h2>

        <p className="text-sm text-slate-500 mt-1">
          Fill in your contact and address information
        </p>
      </div>

      {/* FORM CARD */}
      <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl p-3 flex flex-col gap-2 min-h-0">
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">Full name</label>

          <input
            name="name"
            placeholder="John Doe"
            onChange={handleChange}
            value={form.name}
            required
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-black transition"
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">Email</label>

          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={form.email}
            placeholder="john@example.com"
            required
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-black transition"
          />
        </div>

        {/* PHONE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">Phone number</label>

          <div className="flex flex-col gap-3">
            <div className="w-40 shrink-0">
              <CountryCodePicker />
            </div>

            <input
              name="phone"
              placeholder="85 123 4567"
              onChange={handleChange}
              value={form.phone}
              required
              className="flex-1 min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-black transition"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="grid gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-500">Address</label>

            <input
              name="address"
              placeholder="Full address"
              onChange={handleChange}
              value={form.address}
              required
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-black transition"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-500">Eircode</label>

            <input
              name="eircode"
              placeholder="D00 XXXX"
              onChange={handleChange}
              value={form.eircode}
              required
              className="rounded-xl border border-slate-300 px-4 py-3 uppercase outline-none focus:border-black transition"
            />
          </div>
        </div>
      </div>

      {/* CONTINUE */}
      <div className="shrink-0 border-t pt-4 mt-auto">
        <button
          onClick={handleContinue}
          className="w-full bg-black text-white rounded-xl py-4 hover:opacity-90 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
