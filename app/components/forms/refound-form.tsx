// app/components/forms/refound-create-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategoryReq,
  RefoundReqCreate,
  RefoundReqCreateSchema,
} from "@/lib/validators/refoundreq";
import { getCategories } from "@/lib/axios/refounds";

type Props = {
  onSubmit: (data: RefoundReqCreate) => Promise<void>;
  onCancel: () => void;
};

export default function RefoundCreateForm({ onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefoundReqCreate>({
    resolver: zodResolver(RefoundReqCreateSchema) as Resolver<RefoundReqCreate>,
  });

  const [categories, setCategories] = useState<CategoryReq[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        reset();
      })}
      className="flex flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <input
          {...register("expenseDate")}
          type="date"
          className={`input input-bordered input-sm ${errors.expenseDate ? "input-error" : ""}`}
        />
        {errors.expenseDate && (
          <span className="text-error text-xs">
            {errors.expenseDate.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <select
          {...register("category")}
          className={`select select-bordered select-sm ${errors.category ? "select-error" : ""}`}
        >
          <option value="">Seleziona categoria</option>
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

      <div className="flex flex-col gap-1">
        <input
          {...register("import", { valueAsNumber: true })}
          type="number"
          step="0.01"
          placeholder="Importo (€)"
          className={`input input-bordered input-sm ${errors.import ? "input-error" : ""}`}
        />
        {errors.import && (
          <span className="text-error text-xs">{errors.import.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("description")}
          type="text"
          placeholder="Descrizione"
          className={`input input-bordered input-sm ${errors.description ? "input-error" : ""}`}
        />
        {errors.description && (
          <span className="text-error text-xs">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("refDocument")}
          type="text"
          placeholder="Link documento (opzionale)"
          className={`input input-bordered input-sm ${errors.refDocument ? "input-error" : ""}`}
        />
        {errors.refDocument && (
          <span className="text-error text-xs">
            {errors.refDocument.message}
          </span>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          Annulla
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          Invia richiesta
        </button>
      </div>
    </form>
  );
}
