"use client";

import { useContext, useState } from "react";
import Image from "next/image";

import { BudgeterContext } from "@/context/budgeter";
import { CreditCard, ExternalLink, QrCode } from "lucide-react";

export default function BookingConfirmation() {
  const [state, dispatch] = useContext(BudgeterContext);

  const [paid, setPaid] = useState(false);

  const paymentMethod = state.paymentDetails.method;

  const showConfirmation = paymentMethod === "cash" || paid;

  const customer = state.customerDetails;
  const booking = state.bookingDetails;

  const handleFinish = () => {
    dispatch({
      type: "SET_FINISH",
    });
  };

  const handlePaymentConfirmed = () => {
    // TODO:
    // Call your API
    // await api.post("/booking/payment-confirmed", ...);
    setPaid(true);
  };

  const total = state.basketTotal.basketTotal;

  return (
    <div className="flex max-h-screen min-h-0 flex-col overflow-y-auto px-3">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 pb-2">
        <div>
          <h2 className="text-3xl font-semibold">Booking Confirmation</h2>

          <p className="text-sm text-slate-500 mt-2">
            Your booking request has been received.
          </p>
        </div>

        {showConfirmation && (
          <div className="rounded-2xl border border-green-200 bg-green-50  p-6">
            <h3 className="text-lg font-semibold text-slate-800">
              Booking Request Submitted
            </h3>

            <p className="mt-1 text-slate-700 text-sm">
              Thank you for your booking, <strong>{customer.name}</strong>.
            </p>

            <p className="mt-1 text-slate-700 leading-relaxed">
              Your request has been successfully submitted to our team and is
              now being reviewed.
            </p>

            <p className="mt-1 text-slate-700 text-sm">
              We will arrange for a technician to visit on{" "}
              <strong>
                {new Date(booking.date).toLocaleDateString("en-IE")}
              </strong>{" "}
              at <strong>{booking.time}</strong>.
            </p>

            <p className="mt-1 text-slate-700 text-sm">
              If we need any additional information, we will contact you using
              the details provided in your booking.
            </p>

            <p className="mt-1 text-slate-700 text-sm">
              Thank you for choosing Dubliner Handyman.
            </p>
          </div>
        )}

        {paymentMethod === "cash" && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold text-slate-800">Cash Payment</h3>

            <p className="mt-2 text-sm text-slate-700">
              Your booking has been successfully submitted.
            </p>

            <p className="mt-2 text-sm text-slate-700">
              Payment will be collected after the work has been completed.
            </p>
          </div>
        )}

        {paymentMethod === "revolut" && !paid && (
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 shadow-sm">
            {/* TOTAL */}
            <section className="rounded-2xl border border-slate-200 p-2  pl-5 bg-white mb-2">
              <p className="text-sm text-slate-500">Total amount</p>

              <p className="mt-2 text-3xl font-bold">€{total.toFixed(2)}</p>
            </section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 p-2">
                <CreditCard className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-slate-900">
                  Complete Your Payment
                </h3>

                <p className="text-sm text-slate-600">
                  Choose one of the options below to pay securely with Revolut.
                </p>
              </div>
            </div>

            {/* QR */}
            <div className="mt-4 rounded-2xl border bg-white p-2">
              <div className="flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5 text-slate-600" />
                <span className="font-medium text-slate-700">Scan QR Code</span>
              </div>

              <div className="mx-auto w-full max-w-[180px] sm:max-w-[220px]">
                <Image
                  src="/images/RevoQrCode.jpeg"
                  alt="Revolut QR Code"
                  width={180}
                  height={180}
                  className="w-full max-w-[180px] h-auto rounded-xl"
                />
              </div>
            </div>

            {/* OR */}
            <div className="flex items-center gap-4 my-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm font-medium text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Link */}
            <a
              href="https://revolut.me/alvaro_souza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Open Revolut Payment Link
            </a>

            {/* Button */}
            <button
              onClick={handlePaymentConfirmed}
              className="mt-6 w-full rounded-2xl bg-black py-4 font-medium text-white transition hover:opacity-90"
            >
              I&apos;ve Completed the Payment
            </button>
          </div>
        )}
      </div>
      <button
        onClick={handleFinish}
        className="w-full rounded-xl bg-black py-4 text-white"
      >
        Finish
      </button>
    </div>
  );
}
