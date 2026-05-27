"use client";

import { useContext } from "react";

import { BudgeterContext, STAGES } from "@/context/budgeter";

export default function Start() {
  const [, dispatch] = useContext(BudgeterContext);

  const handleStart = () => {
    dispatch({
      type: "SET_STAGE",
      payload: STAGES.BRANDS,
    });
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-5">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          Get your assembly quote
        </h1>

        <p className="text-sm text-slate-500 leading-relaxed">
          Send your product links and receive a quick installation quote in just
          a few steps.
        </p>
      </div>

      <button
        onClick={handleStart}
        className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-xl bg-black text-white hover:opacity-90 transition"
      >
        Start quote
      </button>
    </div>
  );
}
