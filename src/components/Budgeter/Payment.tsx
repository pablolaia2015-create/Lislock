"use client";

import { BudgeterContext } from "@/context/budgeter";
import { useContext } from "react";
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

          {/* REVOLUT */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold">Pay with Revolut</h3>

            <p className="mt-1 text-sm text-slate-500">
              Scan the QR code or use the payment link below.
            </p>

            {/* QR CODE */}
            <div className="mt-5 flex justify-center">
              <div className="relative h-64 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-2">
                <Image
                  src="/images/RevoQrCode.jpeg"
                  alt="Revolut QR Code"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* REVOLUT LINK */}
            <a
              href="https://revolut.me/alvaro_souza"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex h-12 items-center justify-center rounded-xl bg-black text-white transition hover:opacity-90"
            >
              Open Revolut Payment Link
            </a>
          </section>

          {/* CASH OPTION */}
          <section className="rounded-2xl border border-slate-200 p-5">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                className="mt-2"
              />

              <div className="flex gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Banknote className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold">Pay in cash at home</p>

                  <p className="text-sm text-slate-500">
                    Pay the technician directly after the service is completed.
                  </p>
                </div>
              </div>
            </label>
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
