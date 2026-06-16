"use client";

import { useContext } from "react";

import { BrandName, BudgeterContext, STAGES } from "@/context/budgeter";

type Brand = {
  label: string;
  value: BrandName;
};

export default function Brands() {
  const [, dispatch] = useContext(BudgeterContext);

  const brands: Brand[] = [
    {
      label: "IKEA",
      value: "ikea",
    },
    {
      label: "JYSK",
      value: "jysk",
    },
    {
      label: "Wayfair",
      value: "wayfair",
    },
  ];

  const handleSelectBrand = (brand: BrandName) => {
    /**
     * Save selected brand
     */
    dispatch({
      type: "SET_BRAND",
      payload: brand,
    });

    /**
     * Navigate to links page
     */
    dispatch({
      type: "SET_STAGE",
      payload: STAGES.INP_LINKS,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-md space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">
            Choose your furniture brand
          </h2>

          <p className="text-sm text-slate-500">
            Select the store where your furniture was purchased
          </p>
        </div>

        {/* Brand buttons */}
        <div className="flex flex-col gap-4">
          {brands.map((brand) => (
            <button
              key={brand.value}
              onClick={() => handleSelectBrand(brand.value)}
              className="flex items-center justify-center gap-3 w-full py-4 px-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              <span className="font-medium text-slate-800">{brand.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
