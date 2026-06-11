// app/(protected)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefoundReqFilters,
  RefoundReqResponse,
} from "@/lib/validators/refoundreq";
import { getRefounds } from "@/lib/axios/refounds";
import Table from "@/app/components/table";
import RefoundFiltersForm from "@/app/components/forms/filter-form";

export default function DashboardPage() {
  const [filters, setFilters] = useState<RefoundReqFilters>({});
  const [refounds, setRefounds] = useState<RefoundReqResponse[]>([]);
  const router = useRouter();

  useEffect(() => {
    getRefounds(filters).then(setRefounds);
  }, [filters]);

  const columns = [
    { header: "#", render: (r: RefoundReqResponse) => r.id },
    {
      header: "Dipendente",
      render: (r: RefoundReqResponse) =>
        `${r.user.firstName} ${r.user.lastName}`,
    },
    { header: "Categoria", render: (r: RefoundReqResponse) => r.category },
    { header: "Importo", render: (r: RefoundReqResponse) => `${r.import} €` },
    {
      header: "Descrizione",
      render: (r: RefoundReqResponse) => r.description ?? "-",
    },
    { header: "Stato", render: (r: RefoundReqResponse) => r.state },
    {
      header: "Data creazione",
      render: (r: RefoundReqResponse) =>
        new Date(r.createdAt).toLocaleDateString("it-IT"),
    },
  ];

  return (
    <div className="ml-5">
      <h1>Rimborso spese</h1>

      <div className="flex flex-row gap-4">
        <RefoundFiltersForm
          onSubmit={setFilters}
          onReset={() => setFilters({})}
        />
        <Table
          data={refounds}
          columns={columns}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => router.push(`/dashboard/${r.id}`)}
        />
      </div>
    </div>
  );
}
