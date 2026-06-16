"use client";

import React from "react";
import { Clock, Calendar, MapPin, Wrench, ChevronRight, CheckCircle2, XCircle } from "lucide-react"; // 💡 XCircle adicionado
import Link from "next/link";

export type BookingStatus =
  | "received"
  | "reviewing"
  | "confirmed"
  | "completed"
  | "cancelled"; // 💡 Adicionado estado cancelado

export interface BookingDetails {
  id: string;
  serviceName: string;
  date: string;
  address: string;
  status: BookingStatus;
  phoneE164: string;
}

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

export default function BookingStatusPage({
  booking,
}: {
  booking: BookingDetails | null;
}) {
  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-700 mx-auto" />
        <p className="text-slate-500 font-medium">
          A carregar os detalhes da sua reserva...
        </p>
      </div>
    );
  }

  const statusSteps: BookingStatus[] = [
    "received",
    "reviewing",
    "confirmed",
    "completed",
  ];

  const statusLabels: Record<string, string> = {
    received: "Recebido",
    reviewing: "Em Análise",
    confirmed: "Confirmado",
    completed: "Concluído",
  };

  const statusMessages: Record<BookingStatus, { title: string; desc: string; icon: React.ReactNode }> = {
    received: {
      title: "Pedido Recebido",
      desc: "Recebemos o seu pedido. Iremos analisá-lo em breve.",
      icon: <Clock className="h-5 w-5 text-cyan-600 animate-pulse" />,
    },
    reviewing: {
      title: "Em Análise",
      desc: "A nossa equipa está a avaliar a disponibilidade e os detalhes.",
      icon: <Clock className="h-5 w-5 text-amber-500 animate-pulse" />,
    },
    confirmed: {
      title: "Reserva Confirmada",
      desc: "Tudo certo! O técnico está agendado para a data escolhida.",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    },
    completed: {
      title: "Serviço Concluído",
      desc: "O serviço foi realizado. Obrigado por confiar na LisLock!",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    },
    cancelled: { // 💡 Mensagem de Cancelado
      title: "Reserva Cancelada",
      desc: "Este pedido foi cancelado. Se acha que se trata de um erro, por favor contacte-nos.",
      icon: <XCircle className="h-5 w-5 text-rose-600" />,
    },
  };

  const isCancelled = booking.status === "cancelled";
  const currentStepIndex = statusSteps.indexOf(booking.status);
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;
  const currentMessage = statusMessages[booking.status] || statusMessages.received;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Estado da Reserva
          </h1>
          <p className="text-xs font-mono text-slate-500">
            ID: {booking.id.toUpperCase()}
          </p>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCancelled ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {!isCancelled && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
          {isCancelled ? "Cancelado" : "Atualização Direta"}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        
        {/* 💡 A barra de progresso só aparece se NÃO estiver cancelado */}
        {!isCancelled && (
          <div className="relative h-2.5 w-full bg-slate-100 rounded-full mb-10">
            <div
              className="absolute h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="absolute top-6 w-full flex justify-between px-1">
              {statusSteps.map((step, idx) => (
                <span
                  key={step}
                  className={`text-[10px] font-bold uppercase ${
                    currentStepIndex >= idx
                      ? "text-emerald-600"
                      : "text-slate-300"
                  }`}
                >
                  {statusLabels[step]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 💡 A caixa de mensagem muda para vermelho se cancelado */}
        <div className={`flex items-start gap-4 p-4 border rounded-xl ${isCancelled ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="bg-white p-2.5 rounded-lg shadow-sm border">
            {currentMessage.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {currentMessage.title}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentMessage.desc}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="px-5 py-3 border-b bg-slate-50">
          <h3 className="text-xs font-bold uppercase text-slate-400">
            Detalhes do Serviço
          </h3>
        </div>
        <div className="p-5 space-y-4">
          <DetailRow
            icon={<Wrench className="h-4 w-4" />}
            label="Serviço"
            value={formatServiceName(booking.serviceName)}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Data"
            value={formatDate(booking.date)}
          />
          <DetailRow
            icon={<MapPin className="h-4 w-4" />}
            label="Morada"
            value={booking.address}
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button 
          disabled
          className="w-full flex justify-between p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-not-allowed opacity-80"
        >
          <span className="text-sm font-semibold text-slate-500">
            Adicionar fotografias <span className="text-xs text-cyan-600 font-bold ml-1">(Em breve)</span>
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </button>

        <Link
          href={`/customer/bookings?phone=${encodeURIComponent(
            booking.phoneE164
          )}`}
          className="block text-center py-3 text-sm font-bold text-cyan-700 hover:underline"
        >
          Ver Todas as Minhas Reservas
        </Link>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase text-slate-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}