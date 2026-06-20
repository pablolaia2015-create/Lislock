import { headers } from "next/headers";
import { SERVICES_EN, SERVICE_MAP_EN } from "./services_en";
import { SERVICES_PT, SERVICE_MAP_PT } from "./services_pt";
import { Service } from "@/types/service"; // se você tiver
import { getDb } from "./mongodb";

export async function getServices(): Promise<Service[]> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  if (host.includes("lislock")) {
    return SERVICES_PT;
  }

  return SERVICES_EN;
}

export async function getServiceBySlugHybrid(slug: string, isPT: boolean): Promise<Service | null> {
  try {
    const db = await getDb();
    const doc = await db.collection("services").findOne({ slug, isActive: true });
    if (doc) {
      const sanitizedDoc = { ...doc, _id: doc._id.toString() };
      return sanitizedDoc as unknown as Service;
    }
  } catch (err) {
    console.error("Error fetching service from MongoDB:", err);
  }

  // Fallback to static mapping
  const svc = isPT ? SERVICE_MAP_PT.get(slug) : SERVICE_MAP_EN.get(slug);
  return svc ?? null;
}
