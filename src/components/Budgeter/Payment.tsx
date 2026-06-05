"use client";

import { BudgeterContext } from "@/context/budgeter";
import { useContext, useState } from "react";
import Image from "next/image";
import { Banknote } from "lucide-react";

type Props = {
  total: number;
};

export default function Payment({ total }: Props) {
  const [, dispatch] = useContext(BudgeterContext);

  const handleContinue = () => {
    dispatch({
      type: "PAYMENT",
    });
  };

  const [paymentMethod, setPaymentMethod] = useState<"revolut" | "cash">(
    "revolut",
  );

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-3">
      {/* HEADER */}
      <div className="shrink-0">
        <h2 className="text-3xl font-semibold">Payment</h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose how you would like to pay for your booking.
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <div className="flex flex-col gap-4">
          {/* TOTAL */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Total amount</p>

            <p className="mt-2 text-4xl font-bold">€{total.toFixed(2)}</p>
          </section>

          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="mb-4 font-semibold">Payment method</h3>

            <div className="space-y-3">
              {/* Revolut */}
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                  paymentMethod === "revolut"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "revolut"}
                  onChange={() => setPaymentMethod("revolut")}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border">
                  <Image
                    src="/images/revolut-icon.png"
                    alt="Revolut"
                    width={28}
                    height={28}
                  />
                </div>

                <div>
                  <p className="font-medium">Pay with Revolut</p>

                  <p className="text-sm text-slate-500">
                    Secure your booking immediately.
                  </p>
                </div>
              </label>

              {/* Cash */}
              <label
                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                  paymentMethod === "cash"
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="hidden"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Banknote className="h-6 w-6 text-green-700" />
                </div>

                <div>
                  <p className="font-medium">Pay in cash</p>

                  <p className="text-sm text-slate-500">
                    Pay the technician after the service is completed.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* NOTICE */}
          <section className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Your booking request will be reviewed after payment confirmation or
            when selecting cash payment.
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t pt-4">
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-black py-4 text-white transition hover:opacity-90"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
