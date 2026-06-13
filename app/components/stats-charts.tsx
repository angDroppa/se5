"use client";

import ReactECharts from "echarts-for-react";
import { StatByCategoryMonth } from "@/lib/validators/statistiche";

type Props = { data: StatByCategoryMonth[] };

function formatMonth(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  alloggio: "#378ADD",
  altro: "#639922",
  cena: "#888780",
  formazione: "#EF9F27",
  trasporto: "#1D9E75",
};

export default function StatsCharts({ data }: Props) {
  const months = [...new Set(data.map((d) => formatMonth(d.month)))].sort();
  const categories = [...new Set(data.map((d) => d.category))].sort();

  // Grafico 1: barre grouped per categoria
  const barOption = {
    tooltip: { trigger: "axis" },
    legend: {
      data: categories,
      bottom: 0,
      icon: "rect",
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: { left: 40, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: "category",
      data: months,
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { opacity: 0.2 } },
      axisLine: { show: false },
    },
    color: categories.map((c) => CATEGORY_COLORS[c] ?? "#aaa"),
    series: categories.map((cat) => ({
      name: cat,
      type: "bar" as const,
      barMaxWidth: 40,
      itemStyle: { borderRadius: [3, 3, 0, 0] },
      data: months.map((m) => {
        const row = data.find(
          (d) => formatMonth(d.month) === m && d.category === cat,
        );
        return row?.totaleRichiesto ?? 0;
      }),
    })),
  };

  // Grafico 2: barre grouped richiesto/approvato/liquidato
  const totalsByMonth = months.map((m) => {
    const rows = data.filter((d) => formatMonth(d.month) === m);
    return {
      richiesto: rows.reduce((s, r) => s + r.totaleRichiesto, 0),
      approvato: rows.reduce((s, r) => s + r.totaleApprovato, 0),
      liquidato: rows.reduce((s, r) => s + r.totaleLiquidato, 0),
    };
  });

  const lineOption = {
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Richiesto", "Approvato", "Liquidato"],
      bottom: 0,
      icon: "rect",
      itemWidth: 10,
      itemHeight: 10,
    },
    grid: { left: 40, right: 20, top: 20, bottom: 50 },
    xAxis: {
      type: "category",
      data: months,
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { opacity: 0.2 } },
      axisLine: { show: false },
    },
    color: ["#378ADD", "#639922", "#888780"],
    series: [
      {
        name: "Richiesto",
        type: "bar" as const,
        barMaxWidth: 40,
        itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: totalsByMonth.map((t) => t.richiesto),
      },
      {
        name: "Approvato",
        type: "bar" as const,
        barMaxWidth: 40,
        itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: totalsByMonth.map((t) => t.approvato),
      },
      {
        name: "Liquidato",
        type: "bar" as const,
        barMaxWidth: 40,
        itemStyle: { borderRadius: [3, 3, 0, 0] },
        data: totalsByMonth.map((t) => t.liquidato),
      },
    ],
  };

  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Totale richiesto per categoria
        </p>
        <ReactECharts option={barOption} style={{ height: 300 }} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Importi richiesti / approvati / liquidati
        </p>
        <ReactECharts option={lineOption} style={{ height: 300 }} />
      </div>
    </div>
  );
}
