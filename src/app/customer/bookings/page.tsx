import { getDb } from "@/lib/mongodb";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 💡 Funções de formatação adicionadas à lista!
function formatServiceName(slug: string) {
  if (!slug) return "Serviço Geral";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "A definir";
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

export default async function CustomerBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const resolvedParams = await searchParams;
  const phoneInput = resolvedParams.phone;

  if (!phoneInput) {
    return (
      <div className="max-w-md mx-auto p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Encontrar as minhas reservas</h1>
        <p className="text-slate-600 text-sm">
          Introduza o número de telemóvel que usou ao fazer a marcação.
        </p>
        <form method="GET" action="/customer/bookings" className="space-y-4">
          <input
            name="phone"
            type="tel"
            placeholder="Ex: +351 912 345 678"
            required
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-700 py-3 text-white font-bold hover:bg-cyan-800 transition"
          >
            Procurar reservas
          </button>
        </form>
      </div>
    );
  }

  const cleanPhone = phoneInput.replace(/\s+/g, "");
  const baseNumber = cleanPhone.replace(/^(\+351|00351)/, "");
  const safeRegex = cleanPhone.replace(/\+/g, "\\+");

  if (baseNumber.length < 9) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Número inválido</h1>
        <p className="text-slate-500">Por favor, introduza um número válido (mínimo 9 dígitos).</p>
        <Link href="/customer/bookings" className="inline-block text-cyan-700 font-semibold hover:underline">
          Tentar novamente
        </Link>
      </div>
    );
  }

  const db = await getDb();
  const bookings = await db
    .collection("bookings")
    .find({
      $or: [
        { phone: { $regex: new RegExp(safeRegex, "i") } },
        { phoneE164: { $regex: new RegExp(safeRegex, "i") } },
        { phone: { $regex: new RegExp(baseNumber, "i") } },
        { phoneE164: { $regex: new RegExp(baseNumber, "i") } }
      ]
    })
    .sort({ createdAt: -1 })
    .toArray();

  if (bookings.length === 0) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Nenhuma reserva encontrada</h1>
        <p className="text-slate-500">Não conseguimos encontrar nenhuma reserva associada a este número.</p>
        <Link href="/customer/bookings" className="inline-block text-cyan-700 font-semibold hover:underline">
          Tentar outro número
        </Link>
      </div>
    );
  }

  const statusTranslations: Record<string, string> = {
    new: "Novo",
    pending: "Pendente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    canceled: "Cancelado",
    done: "Concluído",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">As Minhas Reservas</h1>
      <div className="space-y-4">
        {bookings.map((b) => {
          const rawStat = String(b.status || "").toLowerCase();
          const displayStatus = statusTranslations[rawStat] || rawStat;

          return (
            <Link
              key={b._id.toString()}
              href={`/customer/bookings/${b._id}`}
              className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  {/* 💡 Texto formatado: "Serviços Portas" em vez de "servicos-portas" */}
                  <div className="font-semibold text-slate-900">{formatServiceName(b.service)}</div>
                  <div className="text-sm text-slate-500">{formatDate(b.date)}</div>
                </div>

                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${rawStat.includes('cancel') ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-cyan-50 text-cyan-700 border-cyan-100'}`}>
                  {displayStatus}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}