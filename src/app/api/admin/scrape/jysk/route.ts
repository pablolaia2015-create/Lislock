import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://furniture-quoter-568473948860.europe-west1.run.app/scrape-jysk",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      },
    );

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
