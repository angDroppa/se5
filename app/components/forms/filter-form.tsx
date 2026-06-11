// app/components/forms/refound-filters-form.tsx
"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RefoundReqFilters,
  RefoundReqFiltersSchema,
} from "@/lib/validators/refoundreq";

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

  return (
    <div className="flex flex-col gap-3 items-start h-10 p-5 w-[15vw] border h-[80vh]">
        <h1>Filtri</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          {...register("category")}
          type="text"
          placeholder="Categoria"
          className="input input-bordered input-sm"
        />
        <input
          {...register("state")}
          type="text"
          placeholder="Stato"
          className="input input-bordered input-sm"
        />

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
            className={`input input-bordered input-sm ${errors.dateFrom ? "input-error" : ""}`}
          />
          {errors.dateTo && (
            <span className="text-error text-xs">
              {errors.dateTo.message}
            </span>
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
