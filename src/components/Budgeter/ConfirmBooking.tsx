"use client";

import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function ConfirmBooking() {
  const [state, dispatch] = useContext(BudgeterContext);

  const callOutFee = 40;

  const assemblyTotal = state.basket.reduce(
    (acc, item) => acc + Number(item.assemblyPrice) * item.quantity,
    0,
  );

  const total = assemblyTotal + callOutFee;

  const handleProceedToPayment = () => {
    dispatch({
      type: "PAYMENT",
    });
  };

  const hasItemsNeedingReview = state.basket.some(
    (item) => Number(item.assemblyPrice) === 0,
  );

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-3">
      {/* HEADER */}
      <div className="shrink-0">
        <h2 className="text-3xl font-semibold">Confirm your booking</h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review all details before proceeding to payment.
        </p>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 overflow-y-auto py-4">
        <div className="flex flex-col gap-4">
          {/* CUSTOMER DETAILS */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 font-semibold">Customer details</h3>

            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {state.customerDetails.name}
              </p>

              <p>
                <span className="font-medium">Email:</span>{" "}
                {state.customerDetails.email}
              </p>

              <p>
                <span className="font-medium">Phone:</span> +
                {state.customerDetails.countryCode}{" "}
                {state.customerDetails.phone}
              </p>
            </div>
          </section>

          {/* ADDRESS */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 font-semibold">Service address</h3>

            <div className="grid gap-2 text-sm">
              <p>{state.customerDetails.address}</p>

              <p>{state.customerDetails.eircode}</p>
            </div>
          </section>

          {/* DATE */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-3 font-semibold">Preferred appointment</h3>

            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {state.bookingDetails.date}
              </p>

              <p>
                <span className="font-medium">Time:</span>{" "}
                {state.bookingDetails.time}
              </p>
            </div>
          </section>

          {/* PRODUCTS */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold">Furniture items</h3>

            <div className="flex flex-col gap-3">
              {state.basket.map((item) => (
                <div
                  key={`${item.brand}-${item.model}`}
                  className="flex items-start justify-between border-b pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>

                    <p className="text-xs text-slate-500">
                      {item.brand.toUpperCase()}
                    </p>

                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    {Number(item.assemblyPrice) === 0 ? (
                      <span className="text-sm font-medium text-amber-600">
                        Requires review
                      </span>
                    ) : (
                      <p>
                        €
                        {(Number(item.assemblyPrice) * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRICE */}
          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="mb-4 font-semibold">Price summary</h3>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span>Assembly</span>

                {Number(assemblyTotal) === 0 ? (
                  <span className="text-sm font-medium text-amber-600">
                    Requires review
                  </span>
                ) : (
                  <span>€{assemblyTotal.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Call-out fee</span>

                <span>€{callOutFee}</span>
              </div>

              <div className="mt-2 flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>

                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {hasItemsNeedingReview && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="font-semibold text-amber-800">
                Manual review required
              </h3>

              <p className="mt-1 text-sm text-amber-700">
                One or more items require a manual quote. You can proceed with
                your booking request, and we&apos;ll review the details and get
                in touch with a confirmed price as soon as possible.
              </p>
            </section>
          )}

          {/* NOTICE */}
          <section className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Payment secures your booking request. Appointment times are subject
            to final confirmation and availability.
          </section>
        </div>
      </div>

      {/* FOOTER */}
      <div className="shrink-0 border-t pt-4">
        <button
          onClick={handleProceedToPayment}
          className="w-full rounded-xl bg-black py-4 text-white transition hover:opacity-90"
        >
          Proceed to payment
        </button>
      </div>
    </div>
  );
}
