"use client";

import { useContext } from "react";

import { BudgeterContext, STAGES } from "@/context/budgeter";

import { ArrowBigLeft, ShoppingBasket, X } from "lucide-react";

export default function CommandButtons() {
  const [state, dispatch] = useContext(BudgeterContext);

  const handlePrevious = () => {
    switch (state.quoteStage) {
      case STAGES.BRANDS:
        dispatch({
          type: "SET_STAGE",
          payload: STAGES.START,
        });
        break;

      case STAGES.INP_LINKS:
        dispatch({
          type: "SET_STAGE",
          payload: STAGES.BRANDS,
        });
        break;

      case STAGES.BASKET:
        dispatch({
          type: "SET_STAGE",
          payload: STAGES.INP_LINKS,
        });
        break;

      case STAGES.USER_DETAILS:
        dispatch({
          type: "SET_STAGE",
          payload: STAGES.BASKET,
        });
        break;

      case STAGES.DATE_TIME_AVA:
        dispatch({
          type: "SET_STAGE",
          payload: STAGES.USER_DETAILS,
        });
        break;

      default:
        break;
    }
  };

  const handleBasket = () => {
    dispatch({
      type: "GO_TO_BASKET",
    });
  };

  const handleClose = () => {
    dispatch({
      type: "CLOSE_TAB",
    });
  };

  return (
    <div className="flex p-4 items-center justify-between border-b border-slate-200">
      {/* Previous */}
      <button
        onClick={handlePrevious}
        className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition"
      >
        <ArrowBigLeft size={22} />
      </button>

      {/* Basket */}
      <button
        onClick={handleBasket}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 transition"
      >
        <ShoppingBasket size={22} />

        {state.basket.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {state.basket.length}
          </span>
        )}
      </button>

      {/* Close */}
      <button
        onClick={handleClose}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-400 hover:bg-red-500 text-white transition"
      >
        <X size={18} />
      </button>
    </div>
  );
}
