import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Honeypot
    const honey = form.get("company");
    if (typeof honey === "string" && honey.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const date = String(form.get("date") ?? "");
    const service = String(form.get("service") ?? "");
    const message = String(form.get("message") ?? "");

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = await getDb();

    await db.collection("contacts").insertOne({
      name,
      email,
      phone,
      date,
      service,
      message,
      createdAt: new Date(),
    });

    if (process.env.NODE_ENV === "development") {
      console.log("CONTACT SAVED");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
