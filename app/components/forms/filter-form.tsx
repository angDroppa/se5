// app/components/forms/refound-filters-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryReq,
  RefoundReqFilters,
  RefoundReqFiltersSchema,
  StateReq,
} from "@/lib/validators/refoundreq";
import { useSessionStore } from "@/lib/store/session-store";
import { getCategories, getStates } from "@/lib/axios/refounds";

type Props = {
  onSubmit: (filters: RefoundReqFilters) => void;
  onReset: () => void;
};

export default function RefoundFiltersForm({ onSubmit, onReset }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefoundReqFilters>({
    resolver: zodResolver(
      RefoundReqFiltersSchema,
    ) as Resolver<RefoundReqFilters>,
  });

  const role = useSessionStore((s) => s.user?.role);

  const [states, setStates] = useState<StateReq[]>([]);
  const [categories, setCategories] = useState<CategoryReq[]>([]);

  useEffect(() => {
    getStates().then(setStates).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col gap-3 items-start p-5 w-[15vw] border h-[80vh]">
      <h1>Filtri</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        <select
          {...register("category")}
          className="select select-bordered select-sm"
        >
          <option value="">Tutte le categorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>

        <select
          {...register("state")}
          className="select select-bordered select-sm"
        >
          <option value="">Tutti gli stati</option>
          {states.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id}
            </option>
          ))}
        </select>

        {role !== "USER" && (
          <input
            {...register("search")}
            type="text"
            placeholder="Cerca per nome e cognome"
            className="input input-bordered input-sm"
          />
        )}

        <div className="flex flex-col gap-1">
          <input
            {...register("dateFrom")}
            type="date"
            className={`input input-bordered input-sm ${errors.dateFrom ? "input-error" : ""}`}
          />
          {errors.dateFrom && (
            <span className="text-error text-xs">
              {errors.dateFrom.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            {...register("dateTo")}
            type="date"
            className={`input input-bordered input-sm ${errors.dateTo ? "input-error" : ""}`}
          />
          {errors.dateTo && (
            <span className="text-error text-xs">{errors.dateTo.message}</span>
          )}
        </div>

        <button type="submit" className="btn btn-primary btn-sm">
          Cerca
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            reset();
            onReset();
          }}
        >
          Reset
        </button>
      </form>
    </div>
  );
}