"use client";

import { useContext, useMemo } from "react";

import { Trash } from "lucide-react";

import {
  BrandName,
  BudgeterContext,
  ScrapedItem,
  STAGES,
} from "@/context/budgeter";

export default function Basket() {
  const [state, dispatch] = useContext(BudgeterContext);

  const items = state.basket;

  const groupedItems = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc[item.brand].push(item);

        return acc;
      },
      {
        ikea: [],
        jysk: [],
        wayfair: [],
      } as Record<BrandName, ScrapedItem[]>,
    );
  }, [items]);

  const callOutFee = state.callOutFee;

  const assemblyTotal = items.reduce((acc, item) => {
    return acc + item.assemblyPrice * item.quantity;
  }, 0);

  const basketTotal = assemblyTotal + callOutFee;

  const handleRemoveItem = (itemToRemove: ScrapedItem) => {
    console.log(items);
    console.log(itemToRemove);
    const updatedBasket = items.filter((item) => item.url !== itemToRemove.url);

    dispatch({
      type: "SET_BASKET",
      payload: updatedBasket,
    });
  };

  const hasItemsNeedingReview = items.some((item) => item.assemblyPrice === 0);

  const handleQuantity = (
    itemToUpdate: ScrapedItem,
    type: "increase" | "decrease",
  ) => {
    const updatedBasket = items.map((item) => {
      const isSameItem =
        item.model === itemToUpdate.model && item.brand === itemToUpdate.brand;

      if (!isSameItem) {
        return item;
      }

      if (type === "increase") {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return {
        ...item,
        quantity: item.quantity > 1 ? item.quantity - 1 : 1,
      };
    });

    dispatch({
      type: "SET_BASKET",
      payload: updatedBasket,
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-6">
      <div className="flex gap-3 items-center justify-between mb-3">
        <div>
          <h2 className="text-3xl font-semibold">Your basket</h2>

          <p className="text-sm text-slate-500 mt-1">
            Review your selected products
          </p>
        </div>

        <button
          onClick={() => {
            dispatch({
              type: "SET_STAGE",
              payload: STAGES.BRANDS,
            });
          }}
          className="border border-slate-300 rounded-lg p-3 hover:bg-slate-100"
        >
          Add more items
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col gap-8">
          {Object.entries(groupedItems).map(([brand, brandItems]) => {
            if (brandItems.length === 0) {
              return null;
            }

            return (
              <div key={brand} className="flex flex-col gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">
                    {brand}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {brandItems.map((item) => {
                    const assembly = item.assemblyPrice;

                    const itemTotal = assembly * item.quantity;

                    return (
                      <div
                        key={`${item.brand}-${item.model}`}
                        className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <h4 className="text-lg font-semibold">
                              {item.name}
                            </h4>

                            <p className="text-sm text-slate-500">
                              Model: {item.model}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item)}
                            className="border border-red-200 text-red-500 rounded-lg p-2 hover:bg-red-50"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                        {assembly === 0 && (
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <p className="font-medium text-amber-800">
                              Manual quote required
                            </p>

                            <p className="text-sm text-amber-700">
                              We couldn&apos;t automatically calculate the
                              assembly price for this item.
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex items-center justify-between">
                            <p>Assembly</p>
                            {Number(item.assemblyPrice) === 0 ? (
                              <span className="text-sm font-medium text-amber-600">
                                Requires review
                              </span>
                            ) : (
                              <p>
                                €
                                {(
                                  Number(item.assemblyPrice) * item.quantity
                                ).toFixed(2)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <p>Quantity</p>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantity(item, "decrease")}
                                className="w-8 h-8 border rounded-lg"
                              >
                                -
                              </button>

                              <span className="w-6 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => handleQuantity(item, "increase")}
                                className="w-8 h-8 border rounded-lg"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="border-t pt-3 mt-2 flex items-center justify-between">
                            <p className="font-medium">Total</p>

                            {Number(itemTotal) === 0 ? (
                              <span className="text-sm font-medium text-amber-600">
                                Requires review
                              </span>
                            ) : (
                              <p>€ €{itemTotal.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t p-2 mt-6 flex flex-col gap-5">
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Call-out fee</p>

          <p>€{callOutFee}</p>
        </div>
        {/*  */}
        {hasItemsNeedingReview && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <p className="font-medium text-amber-800">Manual review required</p>

            <p className="text-sm text-amber-700 mt-1">
              One or more items require a manual quote. You can proceed with
              your booking request, and we&apos;ll review the details and get in
              touch with a confirmed price as soon as possible.
            </p>
          </div>
        )}
        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Basket total</p>

            <p className="text-4xl font-bold">€{basketTotal.toFixed(2)}</p>
          </div>

          <button
            onClick={() => {
              dispatch({
                type: "SET_BASKET_TOTAL",
                payload: {
                  assemblyTotal: assemblyTotal,
                  basketTotal: basketTotal,
                },
              });

              dispatch({
                type: "CUSTOMER_DETAILS",
              });
            }}
            className="bg-black text-white rounded-xl px-8 py-4 hover:opacity-90 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
