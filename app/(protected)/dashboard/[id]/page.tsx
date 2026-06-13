"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RefoundReqResponse } from "@/lib/validators/refoundreq";
import { getRefoundById } from "@/lib/axios/refounds";
import { STATE_CONFIG, StateId } from "@/lib/config/states";

export default function RefoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [refound, setRefound] = useState<RefoundReqResponse | null>(null);

  useEffect(() => {
    getRefoundById(Number(id)).then(setRefound);
  }, [id]);

  if (!refound) return null;

  const stateConfig = STATE_CONFIG[refound.state as StateId];
  const StateIcon = stateConfig?.icon;

  return (
    <div className="flex justify-center p-6">
      <div className="card card-side bg-base-100 shadow-sm w-2xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            alt="Rimborso"
            className="h-full w-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <div className="flex items-center gap-2">
            {StateIcon && <StateIcon className={stateConfig.className} size={20} />}
            <h2 className="card-title">Rimborso #{refound.id}</h2>
            <span className="ml-auto text-2xl font-bold">{refound.import} €</span>
          </div>

          <div className="divider my-1" />

          <ul className="flex flex-col gap-2 text-sm">
            <Row label="Dipendente" value={`${refound.user.firstName} ${refound.user.lastName}`} />
            <Row label="Categoria" value={refound.category} />
            <Row label="Descrizione" value={refound.description ?? "-"} />
            <Row label="Documento" value={refound.refDocument ?? "-"} />
            <Row label="Data spesa" value={fmt(refound.expenseDate)} />
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
    <li className="flex justify-between">
      <span className="text-base-content/60">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}

function fmt(date: Date | string) {
  return new Date(date).toLocaleDateString("it-IT");
}