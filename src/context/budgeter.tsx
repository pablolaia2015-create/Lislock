"use client";

import { createContext, Dispatch, ReactNode, useReducer } from "react";

export type Stage = "Start" | "Brands" | "SuppliedFitted" | "Basket";

export type BrandName = "ikea" | "jysk" | "wayfair";

export type ProductLink = {
  brand: BrandName;
  url: string;
  quantity: number;
};

export type ScrapedItem = {
  brand: BrandName;

  name: string;
  model: string;

  price: number;
  assemblyPrice: number;
  callOutFee: number;

  assemblyAvailable: boolean;

  quantity: number;
};

interface BudgetState {
  quoteStage: Stage;

  selectedBrand: BrandName | null;

  isLoading: boolean;

  links: ProductLink[];

  basket: ScrapedItem[];
}

type Action =
  | {
      type: "SET_STAGE";
      payload: Stage;
    }
  | {
      type: "SET_BRAND";
      payload: BrandName;
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    }
  | {
      type: "SET_LINKS";
      payload: ProductLink[];
    }
  | {
      type: "SET_BASKET";
      payload: ScrapedItem[];
    }
  | {
      type: "GO_TO_BASKET";
    }
  | {
      type: "CLOSE_TAB";
    };

export const STAGES = {
  START: "Start",
  BRANDS: "Brands",
  SUPPLIED_FITTED: "SuppliedFitted",
  BASKET: "Basket",
} as const;

const initialState: BudgetState = {
  quoteStage: STAGES.START,

  selectedBrand: null,

  isLoading: false,

  links: [],

  basket: [],
};

const budgeterReducer = (state: BudgetState, action: Action): BudgetState => {
  switch (action.type) {
    case "SET_STAGE":
      return {
        ...state,
        quoteStage: action.payload,
      };

    case "SET_BRAND":
      return {
        ...state,
        selectedBrand: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_LINKS": {
      const otherBrandsLinks = state.links.filter(
        (item) => item.brand !== state.selectedBrand,
      );

      return {
        ...state,
        links: [...otherBrandsLinks, ...action.payload],
      };
    }

    case "SET_BASKET": {
      const otherBrandsBasket = state.basket.filter(
        (item) => item.brand !== state.selectedBrand,
      );

      return {
        ...state,
        basket: [...otherBrandsBasket, ...action.payload],
      };
    }

    case "GO_TO_BASKET":
      return {
        ...state,
        quoteStage: STAGES.BASKET,
      };

    case "CLOSE_TAB":
      return {
        ...state,
        quoteStage: STAGES.START,
      };

    default:
      return state;
  }
};

export const BudgeterContext = createContext<[BudgetState, Dispatch<Action>]>([
  initialState,
  () => null,
]);

export const BudgeterProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(budgeterReducer, initialState);

  return (
    <BudgeterContext.Provider value={[state, dispatch]}>
      {children}
    </BudgeterContext.Provider>
  );
};
