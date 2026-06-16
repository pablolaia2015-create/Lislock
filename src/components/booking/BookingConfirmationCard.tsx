import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
// ✅ Mudado para ler o título dos serviços em Português
import { SERVICES_PT } from "@/lib/services_pt"; 

type Props = {
  booking: {
    bookingId: string;
    service: string;
    date: string;
    name: string;
    address: string;
    eircode: string; // Mantemos o nome da variável no código para não quebrar a base de dados
  };
};

export default function BookingConfirmationCard({ booking }: Props) {
  // ✅ Agora procura na lista de serviços em PT
  const service = SERVICES_PT.find((s) => s.slug === booking.service);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-emerald-700">
        <CheckCircle className="h-6 w-6" />
        <h2 className="text-xl font-bold">Pedido Recebido</h2>
      </div>

      {/* Message */}
      <div className="space-y-3">
        <p className="text-slate-700">
          Obrigado, <strong>{booking.name}</strong>! Recebemos o seu pedido
          e estamos a verificar a disponibilidade.
        </p>

        <div className="flex gap-3 bg-emerald-100 border rounded-lg p-3">
          <Clock className="h-5 w-5 text-emerald-600" />
          <p className="text-sm text-emerald-800">
            Aguarde o nosso contacto para a confirmação final do agendamento.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border rounded-lg p-5 space-y-2">
        <Row label="Serviço" value={service?.title ?? booking.service} />
        <Row label="Data" value={booking.date} />
        <Row label="Morada" value={booking.address} />
        {/* ✅ A variável continua 'eircode', mas o cliente lê 'Cód. Postal' */}
        <Row label="Cód. Postal" value={booking.eircode.toUpperCase()} />
      </div>

      {/* Action */}
      <Link
        href={`/`} 
        className="flex justify-center rounded-lg bg-cyan-700 px-6 py-4 text-white font-bold hover:bg-cyan-800"
      >
        Voltar à Página Principal
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-24 text-slate-500 font-medium">{label}:</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}