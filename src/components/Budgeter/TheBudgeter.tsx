import { useContext } from "react";

import Start from "./Start";
import Brands from "./Brands";
import Items from "./Items";
import Basket from "./Basket";
import CommandButtons from "./CommandButtons";
import enBookingPage from "@/messages/en/bookingPage.json";

import { BudgeterContext, STAGES } from "@/context/budgeter";
import UserDetails from "./UserDetails";
import DateTimePicker from "./DateTimePicker";
import ConfirmBooking from "./ConfirmBooking";
import Payment from "./Payment";

export default function TheBudgeter() {
  const [state] = useContext(BudgeterContext);
  const m = enBookingPage;

  const isOverlay = state.quoteStage !== STAGES.START;
  const total = state.basket.reduce(
    (acc, item) => acc + Number(item.assemblyPrice) * item.quantity + 40,
    0,
  );

  return (
    <div>
      {!isOverlay && <Start />}

      {isOverlay && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative h-full bg-white flex flex-col">
            <CommandButtons />

            <div className="flex-1 p-2 min-h-0">
              {state.quoteStage === STAGES.BRANDS && <Brands />}

              {state.quoteStage === STAGES.INP_LINKS && <Items />}

              {state.quoteStage === STAGES.BASKET && <Basket />}

              {state.quoteStage === STAGES.USER_DETAILS && <UserDetails />}

              {state.quoteStage === STAGES.DATE_TIME_AVA && (
                <DateTimePicker m={m} />
              )}
              {state.quoteStage === STAGES.CONFIRM_BOOKING && (
                <ConfirmBooking />
              )}
              {state.quoteStage === STAGES.PAYMENT && <Payment total={total} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
