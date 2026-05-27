import { useContext } from "react";

import Start from "./Start";
import Brands from "./Brands";
import Items from "./Items";
import Basket from "./Basket";
import CommandButtons from "./CommandButtons";

import { BudgeterContext, STAGES } from "@/context/budgeter";

export default function TheBudgeter() {
  const [state] = useContext(BudgeterContext);

  const isOverlay = state.quoteStage !== STAGES.START;

  return (
    <div>
      {!isOverlay && <Start />}

      {isOverlay && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative h-full bg-white flex flex-col">
            <CommandButtons />

            <div className="flex-1 overflow-y-auto p-4">
              {state.quoteStage === STAGES.BRANDS && <Brands />}

              {state.quoteStage === STAGES.SUPPLIED_FITTED && <Items />}

              {state.quoteStage === STAGES.BASKET && <Basket />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
