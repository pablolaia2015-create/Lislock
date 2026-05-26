import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function TypeOfService() {
  const [, dispatch] = useContext(BudgeterContext);

  const brands = [
    { name: "IKEA" },
    { name: "JYSK" },
    { name: "Wayfair" },
    { name: "Amazon" },
    { name: "Others" },
  ];

  //   const typeOfService = () => {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-2 text-center">
      <div className="w-full max-w-md space-y-2">
        {/* Title */}
        <p className="text-xl font-semibold text-slate-900">
          What brand is the furniture you would like assembled?
        </p>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {brands.map((b) => (
            <button
              key={b.name}
              onClick={() => dispatch({ type: "LINK_INP" })}
              className="flex items-center justify-center gap-3 w-full py-4 px-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
            >
              <span className="font-medium text-slate-800">{b.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
