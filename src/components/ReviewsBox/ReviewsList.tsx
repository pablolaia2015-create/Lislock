"use client";

import { Review } from "@/types/review";
import PhotoGallery from "../PhotoGallery";
import { Stars } from "./ReviewForm";

// 💡 Auditoria: Função renomeada e convertida para o formato Português (pt-PT)
function formatPTDate(iso: string) {
  return new Intl.DateTimeFormat("pt-PT", {
    year: "numeric",
    month: "long", // "long" escreve o mês por extenso (ex: "junho"). Se preferires curto, usa "short".
    day: "2-digit",
  }).format(new Date(iso));
}

export default function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    // 💡 Auditoria: Traduzido e tornado mais convidativo
    return (
      <p className="text-sm text-slate-500 italic px-2">
        Ainda não há avaliações. Seja o primeiro a partilhar a sua experiência!
      </p>
    );
  }

  return (
    <div className="max-h-[620px] overflow-y-auto space-y-4 pr-2">
      {reviews.map((r) => (
        <article
          key={r._id}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">{r.customerName}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5 capitalize">
                {formatPTDate(r.createdAtISO)}
              </p>
            </div>
            {/* O componente Stars que importámos do ReviewForm */}
            <Stars value={r.rating} />
          </div>

          <p className="mt-3 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {r.opinion}
          </p>

          {r.photoUrls?.length > 0 && (
            <div className="mt-4">
              <PhotoGallery photos={r.photoUrls} />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}