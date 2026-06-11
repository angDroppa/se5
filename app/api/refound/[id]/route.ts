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
    const parsed = RefoundReqUpdateStateSchema.parse(body);

    const updated = await prisma.refoundReq.update({
        where: { id: numericId },
        data: {
            ...parsed,
            evaluatorId: session.userId,
            evaluationDate: new Date(),
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

    const { id } = await params;
    const parseResult = idSchema.safeParse(id);
    if (!parseResult.success) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const numericId = parseResult.data;

    const refoundReq = await prisma.refoundReq.findUnique({
        where: {
            id: numericId,
            ...(session.role !== "admin" && { userId: session.userId }),
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