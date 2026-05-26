import { useContext } from "react";
import { BudgeterContext } from "@/context/budgeter";

export default function Start() {
  const [, dispatch] = useContext(BudgeterContext);

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <span className="text-xl text-center font-semibold text-slate-900 p-4">
        Send the item link to get a quick quote
      </span>
      <button
        className="flex items-center justify-center gap-3 w-full py-4 px-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition"
        onClick={() => dispatch({ type: "TYPE_OF_SERVICES" })}
      >
        <span className="font-medium text-slate-800">Start </span>
      </button>
    </div>
  );
}
