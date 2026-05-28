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

  const callOutFee = items.length > 0 ? items[0].callOutFee : 0;

  const total =
    items.reduce((acc, item) => {
      return acc + Math.ceil(item.assemblyPrice) * item.quantity;
    }, 0) + callOutFee;

  const handleRemoveItem = (itemToRemove: ScrapedItem) => {
    const updatedBasket = items.filter(
      (item) =>
        !(
          item.model === itemToRemove.model && item.brand === itemToRemove.brand
        ),
    );

    dispatch({
      type: "SET_BASKET",
      payload: updatedBasket,
    });
  };

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
    <div className="flex flex-col gap-8 px-3 py-6">
      <div className="flex items-center justify-between">
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
          className="border border-slate-300 rounded-lg px-4 py-2 hover:bg-slate-100"
        >
          Add more items
        </button>
      </div>

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

                <h3 className="text-2xl font-semibold">{brand}</h3>
              </div>

              <div className="flex flex-col gap-4">
                {brandItems.map((item) => {
                  const assembly = Math.ceil(item.assemblyPrice);

                  const itemTotal = assembly * item.quantity;

                  return (
                    <div
                      key={`${item.brand}-${item.model}`}
                      className="border border-slate-200 rounded-2xl p-5 flex flex-col gap-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <h4 className="text-lg font-semibold">{item.name}</h4>

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

                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <p>Assembly</p>

                          <p>€{assembly}</p>
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

                          <p className="font-semibold text-base">
                            €{itemTotal.toFixed(2)}
                          </p>
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

      <div className="border-t pt-6 flex flex-col gap-5">
        <div className="flex items-center justify-between text-sm">
          <p className="text-slate-500">Call-out fee</p>

          <p>€{callOutFee.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Basket total</p>

            <p className="text-4xl font-bold">€{total.toFixed(2)}</p>
          </div>

          <button className="bg-black text-white rounded-xl px-8 py-4 hover:opacity-90 transition">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
