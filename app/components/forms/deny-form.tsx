// app/components/forms/refound-update-state-form.tsx
"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RefoundReqUpdateState,
  RefoundReqUpdateStateSchema,
} from "@/lib/validators/refoundreq";

type Props = {
  onSubmit: (data: RefoundReqUpdateState) => void;
  onCancel: () => void;
};

export default function RefoundUpdateStateForm({ onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RefoundReqUpdateState>({
    resolver: zodResolver(
      RefoundReqUpdateStateSchema,
    ) as Resolver<RefoundReqUpdateState>,
    defaultValues: {
      state: "RIFIUTATO",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <textarea
          {...register("denyDescription")}
          placeholder="Motivazione (opzionale)"
          className={`textarea textarea-bordered textarea-sm ${errors.denyDescription ? "textarea-error" : ""}`}
        />
        {errors.denyDescription && (
          <span className="text-error text-xs">
            {errors.denyDescription.message}
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
        <button type="submit" className="btn btn-error btn-sm">
          Conferma rifiuto
        </button>
      </div>
    </form>
  );
}