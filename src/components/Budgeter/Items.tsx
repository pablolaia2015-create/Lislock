"use client";

import { useState } from "react";

type ScrapedItem = {
  name: string;
  model: string;
  price: number;
  assemblyPrice: number;
  callOutFee: number;
  assemblyAvailable: boolean;
};

export default function Items() {
  const [links, setLinks] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapedItem[] | null>(null);
  const [error, setError] = useState("");

  const handleAddLink = () => {
    setLinks((prev) => [...prev, ""]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeLink = (index: number, value: string) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  };

  const handleSendLinks = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const filteredLinks = links.filter((link) => link.trim() !== "");
      console.log(filteredLinks);

      if (filteredLinks.length === 0) {
        setError("Please insert at least one link");
        return;
      }

      const response = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: filteredLinks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape");
      }

      const data: ScrapedItem[] = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while scraping");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-3 py-6 gap-6">
      {/* Title */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-slate-900">
          Insert your links
        </p>

        <p className="text-sm text-slate-500">
          Add one or more IKEA product links
        </p>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="https://www.ikea.com/..."
              value={link}
              onChange={(e) => handleChangeLink(index, e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 outline-none focus:border-black"
            />

            {links.length > 1 && (
              <button
                onClick={() => handleRemoveLink(index)}
                className="px-4 rounded-lg border border-red-300 text-red-500"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleAddLink}
          className="border border-slate-300 rounded-lg py-2 px-4 hover:bg-slate-100"
        >
          Add link
        </button>

        <button
          onClick={handleSendLinks}
          disabled={loading}
          className="bg-black text-white rounded-lg py-2 px-4 disabled:opacity-50"
        >
          {loading ? "Scraping..." : "Send links"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          {result.map((item) => (
            <div
              key={item.model}
              className="border border-slate-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">{item.name}</h2>

                <p className="text-sm text-slate-500">Model: {item.model}</p>

                <div className="mt-2 flex flex-col gap-1 text-sm">
                  <p>
                    Product price:{" "}
                    <span className="font-medium">€{item.price}</span>
                  </p>

                  <p>
                    Assembly price:{" "}
                    <span className="font-medium">€{item.assemblyPrice}</span>
                  </p>

                  <p>
                    Call out fee:{" "}
                    <span className="font-medium">€{item.callOutFee}</span>
                  </p>

                  <p>
                    Assembly available:{" "}
                    <span className="font-medium">
                      {item.assemblyAvailable ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
