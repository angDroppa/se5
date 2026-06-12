import { requireAdmin, requireSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import {
    RefoundReqResponse,
    RefoundReqResponseSchema,
    RefoundReqUpdateStateSchema,
} from "@/lib/validators/refoundreq";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

type RouteParams = { params: Promise<{ id: string }> };

const idSchema = z.coerce.number().int().positive();
export async function PUT(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<RefoundReqResponse | { error: string }>> {
    const session = await requireAdmin();

    const { id } = await params;
    const parseResult = idSchema.safeParse(id);
    if (!parseResult.success) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const numericId = parseResult.data;

    const body = await req.json();
    const parsed = RefoundReqUpdateStateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 422 });
    }

    const current = await prisma.refoundReq.findUnique({
        where: { id: numericId },
    });
    if (!current) {
        return NextResponse.json({ error: "Richiesta non trovata" }, { status: 404 });
    }

    const validTransitions: Record<string, string[]> = {
        ATTESA:    ["ACCETTATO", "RIFIUTATO"],
        ACCETTATO: ["PAGATO"],
        RIFIUTATO: [],
        PAGATO:    [],
    };
    if (!validTransitions[current.state]?.includes(parsed.data.state)) {
        return NextResponse.json(
            { error: `Transizione da ${current.state} a ${parsed.data.state} non consentita` },
            { status: 422 }
        );
    }

    const isEvaluation = parsed.data.state === "ACCETTATO" || parsed.data.state === "RIFIUTATO";
    const isPagato = parsed.data.state === "PAGATO";

    const updated = await prisma.refoundReq.update({
        where: { id: numericId },
        data: {
            state: parsed.data.state,
            denyDescription: parsed.data.denyDescription,
            evaluatorId: session.userId,
            evaluationDate: isEvaluation ? new Date() : undefined,
            payDate: isPagato ? (parsed.data.payDate ?? new Date()) : undefined,
        },
        include: { user: true, evaluator: true },
    });

    return NextResponse.json(RefoundReqResponseSchema.parse({
        ...updated,
        import: Number(updated.import),
    }));
}

export async function GET(
    req: NextRequest,
    { params }: RouteParams
): Promise<NextResponse<RefoundReqResponse | { error: string }>> {
    const session = await requireSession();
    console.log("session role:", session.role); // ← cosa stampa?
    // console.log("numericId:", numericId);

    const { id } = await params;
    const parseResult = idSchema.safeParse(id);
    if (!parseResult.success) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const numericId = parseResult.data;

    const refoundReq = await prisma.refoundReq.findUnique({
        where: {
            id: numericId,
            ...(session.role !== "ADMIN" && { userId: session.userId }),
        },
        include: { user: true, evaluator: true },
    });

    if (!refoundReq) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(RefoundReqResponseSchema.parse({
        ...refoundReq,
        import: Number(refoundReq.import),
    }));
}


