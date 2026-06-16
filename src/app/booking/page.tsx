import { Suspense } from "react";
import BookingClient from "./BookingClient";
import { getServices } from "@/lib/getServices";
import { getSeo } from "@/lib/getSeo";
import { getLocale } from "@/lib/getLocale";
import { getMessages } from "@/lib/getMessages";

export const generateMetadata = () => getSeo("booking");

export default async function BookingPage() {
  const services = await getServices();
  const dom = await getLocale();
  const m = await getMessages(dom).bookingPage;
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading booking form...</div>}
    >
      <BookingClient services={services} domain={dom} m={m} />
    </Suspense>
  );
}
