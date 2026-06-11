"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RefoundReqResponse } from "@/lib/validators/refoundreq";
import { getRefoundById } from "@/lib/axios/refounds";

export default function RefoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [refound, setRefound] = useState<RefoundReqResponse | null>(null);

  useEffect(() => {
    getRefoundById(Number(id)).then(setRefound);
  }, [id]);

  if (!refound) return null;

  return (
    <div className="flex justify-center p-6">
      <div className="card w-96 bg-base-100 shadow-sm">
        <div className="card-body">
          <span className={`badge badge-xs ${stateBadge(refound.state)}`}>{refound.state}</span>
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">Rimborso #{refound.id}</h2>
            <span className="text-xl">{refound.import} €</span>
          </div>
          <ul className="mt-6 flex flex-col gap-2 text-xs">
            <Row label="Dipendente" value={`${refound.user.firstName} ${refound.user.lastName}`} />
            <Row label="Categoria" value={refound.category} />
            <Row label="Descrizione" value={refound.description ?? "-"} />
            <Row label="Documento" value={refound.refDocument ?? "-"} />
            <Row label="Data creazione" value={fmt(refound.createdAt)} />
            <Row label="Valutatore" value={refound.evaluator ? `${refound.evaluator.firstName} ${refound.evaluator.lastName}` : "-"} />
            <Row label="Data valutazione" value={refound.evaluationDate ? fmt(refound.evaluationDate) : "-"} />
            <Row label="Data pagamento" value={refound.payDate ? fmt(refound.payDate) : "-"} />
            {refound.denyDescription && (
              <Row label="Motivazione rifiuto" value={refound.denyDescription} />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </li>
  );
}

function fmt(date: Date | string) {
  return new Date(date).toLocaleDateString("it-IT");
}

function stateBadge(state: string) {
  switch (state.toUpperCase()) {
    case "ATTESA":    return "badge-warning";
    case "APPROVATO": return "badge-success";
    case "RIFIUTATO": return "badge-error";
    case "PAGATO":    return "badge-info";
    default:          return "badge-neutral";
  }
}