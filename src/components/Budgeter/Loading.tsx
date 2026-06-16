"use client";

import React, { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

type LoadingSpinnerProps = {
  size?: number;
  className?: string;
};

const loadingMessages = [
  "We are finding the best price for you...",
  "Checking product details...",
  "Calculating assembly costs...",
  "Comparing installation requirements...",
  "Preparing your quote...",
  "Analysing the products...",
  "Checking measurements and specifications...",
  "Almost done...",
];

export default function LoadingSpinner({
  size = 92,
  className = "",
}: LoadingSpinnerProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev === loadingMessages.length - 1 ? 0 : prev + 1,
      );
    }, 950);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <LoaderCircle size={size} className="animate-spin text-blue-500" />

      <p className="text-sm text-gray-500 animate-pulse text-center max-w-[250px]">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
}
