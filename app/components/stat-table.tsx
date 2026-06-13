// app/components/stats-table.tsx
"use client";

import Table from "@/app/components/table";
import { StatByCategoryMonth } from "@/lib/validators/statistiche";

type Props = {
  data: StatByCategoryMonth[];
};

function formatMonth(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("it-IT", {
    style: "currency",
    currency: "EUR",
  });
}

export default function StatsTable({ data }: Props) {
  return (
    <Table<StatByCategoryMonth>
      data={data}
      keyExtractor={(row) => `${formatMonth(row.month)}-${row.category}`}
      columns={[
        {
          header: "Mese",
          render: (row) => formatMonth(row.month),
        },
        {
          header: "Categoria",
          render: (row) => row.category,
        },
        {
          header: "N. richieste",
          render: (row) => row.numeroRichieste,
        },
        {
          header: "Totale richiesto",
          render: (row) => formatCurrency(row.totaleRichiesto),
        },
        {
          header: "Totale approvato",
          render: (row) => formatCurrency(row.totaleApprovato),
        },
        {
          header: "Totale liquidato",
          render: (row) => formatCurrency(row.totaleLiquidato),
        },
      ]}
    />
  );
}