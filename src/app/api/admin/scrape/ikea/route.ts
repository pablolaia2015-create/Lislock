import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch("http://34.89.51.30:3000/scrape-ikea", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await response.json();

    return Response.json(data);
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Failed to scrape",
      },
      {
        status: 500,
      },
    );
  }
}
