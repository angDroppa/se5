// app/(protected)/stats/page.tsx
"use client";

import { useEffect, useState } from "react";
import { StatByCategoryMonth, StatFilters } from "@/lib/validators/statistiche";
import { getCategories } from "@/lib/axios/refounds";
import { CategoryReq } from "@/lib/validators/refoundreq";
import StatsCharts from "@/app/components/stats-charts";
import StatFiltersFormComponent from "@/app/components/forms/stat-fomr";
import StatsTable from "@/app/components/stat-table";
import { getStats } from "@/lib/axios/stats";

export default function StatistichePage() {
  const [filters, setFilters] = useState<StatFilters>({});
  const [stats, setStats] = useState<StatByCategoryMonth[]>([]);
  const [categories, setCategories] = useState<CategoryReq[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    getStats(filters).then(setStats).catch(console.error);
  }, [filters]);

  return (
    <div className="ml-5 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-5">
        <h1>Statistiche</h1>
      </div>

      <div className="flex flex-col gap-4">
        <StatFiltersFormComponent
          onSubmit={setFilters}
          onReset={() => setFilters({})}
          categories={categories}
        />
        <div className="flex flex-col gap-6 w-full">
          <StatsTable data={stats} />

          <StatsCharts data={stats} />
        </div>
      </div>
    </div>
  );
}
