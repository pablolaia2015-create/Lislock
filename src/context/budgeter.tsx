"use client";

import { createContext, Dispatch, ReactNode, useReducer } from "react";

export type Stage =
  | "Start"
  | "Brands"
  | "InpLinks"
  | "Basket"
  | "UserDetails"
  | "DateTimeAva";

export type BrandName = "ikea" | "jysk" | "wayfair";

export type ProductLink = {
  brand: BrandName;
  url: string;
  quantity: number;
};

export type ScrapedItem = {
  url: string;

  brand: BrandName;

  name: string;
  model: string;

  price: number;
  assemblyPrice: number;
  callOutFee: number;

  assemblyAvailable: boolean;

  quantity: number;
};

export type CustomerDetails = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  address: string;
  eircode: string;
};

interface BudgetState {
  quoteStage: Stage;

  selectedBrand: BrandName | null;

  isLoading: boolean;

  links: ProductLink[];

  basket: ScrapedItem[];

  customerDetails: CustomerDetails;
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
    }
  | {
      type: "CUSTOMER_DETAILS";
    }
  | {
      type: "SET_CUSTOMER_DETAILS";
      payload: CustomerDetails;
    }
  | {
      type: "DATE_TIME_AVA";
    };

export const STAGES = {
  START: "Start",
  BRANDS: "Brands",
  INP_LINKS: "InpLinks",
  BASKET: "Basket",
  USER_DETAILS: "UserDetails",
  DATE_TIME_AVA: "DateTimeAva",
} as const;

const initialState: BudgetState = {
  quoteStage: STAGES.START,

  selectedBrand: null,

  isLoading: false,

  links: [],

  basket: [],

  customerDetails: {
    name: "",
    email: "",
    countryCode: "353",
    phone: "",
    address: "",
    eircode: "",
  },
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

    case "CUSTOMER_DETAILS":
      return {
        ...state,
        quoteStage: STAGES.USER_DETAILS,
      };

    case "SET_CUSTOMER_DETAILS":
      return {
        ...state,
        customerDetails: action.payload,
      };

    case "CLOSE_TAB":
      return {
        ...state,
        quoteStage: STAGES.START,
      };

    case "DATE_TIME_AVA":
      return {
        ...state,
        quoteStage: STAGES.DATE_TIME_AVA,
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
