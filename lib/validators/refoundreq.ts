import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { UserResponseSchema } from "./user";

extendZodWithOpenApi(z);

// ---------------------------------------------------------------------------
// Lookup schemas (usati come parametri di route/query)
// ---------------------------------------------------------------------------

export const StateReqSchema = z.object({
    id: z
        .string({ error: "Lo stato è obbligatorio" })
        .min(1, { message: "Lo stato non può essere vuoto" })
        .openapi({ example: "ATTESA" }),
});

export const CategoryReqSchema = z.object({
    id: z
        .string({ error: "La categoria è obbligatoria" })
        .min(1, { message: "La categoria non può essere vuota" })
        .openapi({ example: "cena" }),
});

// ---------------------------------------------------------------------------
// Schema per la CREAZIONE di una richiesta di rimborso (input dal client)
// Non include id e createdAt (generati dal DB)
// ---------------------------------------------------------------------------

export const RefoundReqCreateSchema = z.object({
    expenseDate: z.coerce
        .date({ error: "La data della spesa è obbligatoria" }),

    category: z
        .string({ error: "La categoria è obbligatoria" })
        .min(1, { message: "La categoria non può essere vuota" })
        .trim(),

    import: z
        .number({ error: "L'importo deve essere un numero positivo" })
        .positive({ message: "L'importo deve essere maggiore di zero" }),

    description: z
        .string({ error: "La descrizione è obbligatoria" })
        .min(1, { message: "La descrizione non può essere vuota" })
        .trim(),

    refDocument: z
        .string({ error: "Il documento di riferimento deve essere una stringa" })
        // .trim()
        // .min(1, { message: "Il documento non può essere composto solo da spazi" })
        .nullable()
        .optional(),
});


// ---------------------------------------------------------------------------
// Schema per la RISPOSTA (include id, createdAt e oggetti User annidati)
// ---------------------------------------------------------------------------

export const RefoundReqResponseSchema = z.object({
    id: z
        .number({ error: "L'ID è obbligatorio" })
        .int()
        .openapi({ example: 1 }),

    createdAt: z
        .coerce.date({ error: "La data di creazione non è valida" })
        .openapi({ example: "2026-05-01" }),

    expenseDate: z
        .coerce.date({ error: "La data di creazione non è valida" })
        .openapi({ example: "2026-05-01" }),

    category: z
        .string({ error: "La categoria è obbligatoria" })
        .openapi({ example: "cena" }),

    import: z
        .number({ error: "L'importo deve essere un numero" })
        .openapi({ example: 42.50 }),

    description: z
        .string({ error: "La descrizione deve essere una stringa" })
        .optional()
        .nullable()
        .openapi({ example: "Cena con cliente" }),

    refDocument: z
        .string({ error: "Il documento di riferimento deve essere una stringa" })
        .nullable()
        .openapi({ example: "scontrino_123.jpg" }),

    state: z
        .string({ error: "Lo stato è obbligatorio" })
        .openapi({ example: "ATTESA" }),

    user: UserResponseSchema,

    evaluator: UserResponseSchema
        .nullable(),

    evaluationDate: z
        .coerce.date({ error: "La data di valutazione non è valida" })
        .nullable()
        .openapi({ example: "2026-05-01" }),

    denyDescription: z
        .string({ error: "La motivazione del rifiuto deve essere una stringa" })
        .nullable()
        .openapi({ example: "Troppe spese" }),

    payDate: z
        .coerce.date({ error: "La data di pagamento non è valida" })
        .nullable()
        .openapi({ example: "2026-05-01" }),
});

export const RefoundReqFiltersSchema = z.object({
    state: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
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

export const RefoundReqUpdateStateSchema = z.object({
    state: z.string({ error: "Lo stato è obbligatorio" })
        .min(1, { message: "Lo stato non può essere vuoto" }),
    denyDescription: z.string({ error: "La motivazione del rifiuto deve essere una stringa" })
        .min(1)
        .nullable()
        .optional(),
    payDate: z.coerce.date({ error: "La data di pagamento non è valida" })
        .nullable()
        .optional(),
}).superRefine((data, ctx) => {
    if (data.state !== "PAGATO" && data.payDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La data di pagamento può essere impostata solo per stato PAGATO",
            path: ["payDate"],
        });
    }
});

export type RefoundReqUpdateState = z.infer<typeof RefoundReqUpdateStateSchema>;

export type RefoundReqFilters = z.infer<typeof RefoundReqFiltersSchema>;
export type RefoundReqFiltersForm = z.input<typeof RefoundReqFiltersSchema>;

export type RefoundReqCreate = z.infer<typeof RefoundReqCreateSchema>;
export type RefoundReqResponse = z.infer<typeof RefoundReqResponseSchema>;

export type StateReq = z.infer<typeof StateReqSchema>;
export type CategoryReq = z.infer<typeof CategoryReqSchema>;