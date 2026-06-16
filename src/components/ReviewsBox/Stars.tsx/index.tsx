"use client";

type Props = {
  avg: number;
  count: number;
};

export default function Stars({ avg, count }: Props) {
  const fullStars = Math.floor(avg);
  const hasHalfStar = avg % 1 >= 0.5;

  return (
    <div className="my-3">
      <button
        onClick={() => {
          document
            .getElementById("reviews")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
      >
        {/* Stars */}
        <div className="flex">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <span key={i} className="text-amber-500">
                  ★
                </span>
              );
            }

            if (i === fullStars && hasHalfStar) {
              return (
                <span key={i} className="text-amber-400">
                  ★
                </span>
              );
            }

            return (
              <span key={i} className="text-slate-300">
                ★
              </span>
            );
          })}
        </div>

        {/* Text Traduzido com Lógica de Plural PT */}
        <span>
          {avg || "—"} · {count} {count === 1 ? "avaliação" : "avaliações"}
        </span>
      </button>
    </div>
  );
}