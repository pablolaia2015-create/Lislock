"use client";

import { useContext, useState } from "react";

import { BudgeterContext, ProductLink, ScrapedItem } from "@/context/budgeter";

import LoadingSpinner from "./Loading";

import { Trash } from "lucide-react";

export default function Items() {
  const [state, dispatch] = useContext(BudgeterContext);
  const [error, setError] = useState("");

  if (!state.selectedBrand) {
    return null;
  }

  const currentBrandLinks = state.links.filter(
    (item) => item.brand === state.selectedBrand,
  );

  const links =
    currentBrandLinks.length > 0
      ? currentBrandLinks
      : [
          {
            brand: state.selectedBrand!,
            url: "",
            quantity: 1,
          },
        ];

  const loading = state.isLoading;

  const updateLinks = (updatedLinks: ProductLink[]) => {
    dispatch({
      type: "SET_LINKS",
      payload: updatedLinks,
    });
  };

  const handleAddLink = () => {
    updateLinks([
      ...links,
      {
        brand: state.selectedBrand!,
        url: "",
        quantity: 1,
      },
    ]);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);

    updateLinks(
      updatedLinks.length > 0
        ? updatedLinks
        : [
            {
              brand: state.selectedBrand!,
              url: "",
              quantity: 1,
            },
          ],
    );
  };

  const handleChangeLink = (index: number, value: string) => {
    updateLinks(
      links.map((item, i) =>
        i === index
          ? {
              ...item,
              url: value,
            }
          : item,
      ),
    );
  };

  const handleQuantity = (index: number, type: "increase" | "decrease") => {
    updateLinks(
      links.map((item, i) => {
        if (i !== index) return item;

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
      }),
    );
  };

  const handleSendLinks = async () => {
    try {
      dispatch({
        type: "SET_LOADING",
        payload: true,
      });

      setError("");

      const filteredLinks = links.filter((item) => item.url.trim() !== "");

      if (filteredLinks.length === 0) {
        setError("Please insert at least one link");

        return;
      }

      const response = await fetch(`/api/admin/scrape/${state.selectedBrand}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: filteredLinks.map((item) => item.url),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid scraper response");
      }

      const mergedData: ScrapedItem[] = data.map(
        (item: Omit<ScrapedItem, "quantity" | "brand">, index: number) => ({
          ...item,

          brand: state.selectedBrand!,

          quantity: filteredLinks[index].quantity,
        }),
      );

      dispatch({
        type: "SET_BASKET",
        payload: mergedData,
      });
      dispatch({
        type: "GO_TO_BASKET",
      });
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong while preparing your quote. Please try again.",
      );
    } finally {
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[500px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col px-3 py-6 gap-6">
      <div className="text-center">
        <p className="text-2xl font-semibold text-slate-900">
          Insert your links
        </p>

        <p className="text-sm text-slate-500">Add one or more product links</p>
      </div>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <div
            key={index}
            className="border border-slate-200 rounded-xl p-3 flex flex-col gap-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://www.example.com/..."
                value={link.url}
                onChange={(e) => handleChangeLink(index, e.target.value)}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:border-black"
              />

              {links.length > 1 && (
                <button
                  onClick={() => handleRemoveLink(index)}
                  className="px-4 rounded-lg border border-red-300 text-red-500"
                >
                  <Trash />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">Quantity</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantity(index, "decrease")}
                  className="w-8 h-8 border rounded-lg"
                >
                  -
                </button>

                <span className="w-6 text-center">{link.quantity}</span>

                <button
                  onClick={() => handleQuantity(index, "increase")}
                  className="w-8 h-8 border rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAddLink}
          className="border border-slate-300 rounded-lg py-2 px-4 hover:bg-slate-100"
        >
          Add product
        </button>

        <button
          onClick={handleSendLinks}
          className="bg-black text-white rounded-lg py-2 px-4"
        >
          Continue
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}
    </div>
  );
}
