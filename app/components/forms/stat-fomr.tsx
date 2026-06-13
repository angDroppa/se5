"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StatFilters,
  StatFiltersForm,
  StatFiltersSchema,
} from "@/lib/validators/statistiche";
import { CategoryReq } from "@/lib/validators/refoundreq";

type Props = {
  onSubmit: (data: StatFilters) => void;
  onReset: () => void;
  categories: CategoryReq[];
};

export default function StatFiltersFormComponent({
  onSubmit,
  onReset,
  categories,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StatFiltersForm>({
    resolver: zodResolver(StatFiltersSchema) as Resolver<StatFiltersForm>,
    defaultValues: {
      search: "",
      category: "",
      userId: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(StatFiltersSchema.parse(data)))}
      className="flex flex-wrap gap-3 items-end"
    >
      <div className="flex flex-col gap-1">
        <input
          {...register("search")}
          type="text"
          placeholder="Cerca dipendente"
          className={`input input-bordered input-sm ${errors.search ? "input-error" : ""}`}
        />
        {errors.search && (
          <span className="text-error text-xs">{errors.search.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <select
          {...register("category")}
          className={`select select-bordered select-sm ${errors.category ? "select-error" : ""}`}
        >
          <option value="">Tutte le categorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
        {errors.category && (
          <span className="text-error text-xs">{errors.category.message}</span>
        )}
      </div>

      {/* <div className="flex flex-col gap-1">
        <input
          {...register("userId", { valueAsNumber: true })}
          type="number"
          placeholder="ID dipendente"
          className={`input input-bordered input-sm ${errors.userId ? "input-error" : ""}`}
        />
        {errors.userId && (
          <span className="text-error text-xs">{errors.userId.message}</span>
        )}
      </div> */}

      <div className="flex flex-col gap-1">
        <input
          {...register("dateFrom")}
          type="date"
          className={`input input-bordered input-sm ${errors.dateFrom ? "input-error" : ""}`}
        />
        {errors.dateFrom && (
          <span className="text-error text-xs">{errors.dateFrom.message}</span>
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

      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary btn-sm">
          Filtra
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
      </div>
    </form>
  );
}
