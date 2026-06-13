import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const StatFiltersSchema = z.object({
    search: z.string().optional(),
    category: z.string().optional(),
    userId: z.preprocess(
        (val) => (val === "" || val === null || (typeof val === "number" && Number.isNaN(val)) ? undefined : val),
        z.coerce.number().int().positive().optional()
    ),
    dateFrom: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.date().optional()
    ),
    dateTo: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.date().optional()
    ),
}).refine(
    (data) => {
        if (!data.dateFrom || !data.dateTo) return true;
        return data.dateFrom <= data.dateTo;
    },
    { message: "La data di fine non può essere precedente alla data di inizio", path: ["dateTo"] }
);

export type StatFilters = z.infer<typeof StatFiltersSchema>;
export type StatFiltersForm = z.input<typeof StatFiltersSchema>;

export const StatByCategoryMonthSchema = z.object({
    category: z.string(),
    month: z.coerce.date(),
    numeroRichieste: z.coerce.number(),
    totaleRichiesto: z.coerce.number(),
    totaleApprovato: z.coerce.number(),
    totaleLiquidato: z.coerce.number(),
});
export type StatByCategoryMonth = z.infer<typeof StatByCategoryMonthSchema>;