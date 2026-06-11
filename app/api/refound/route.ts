import prisma from "@/lib/prisma";
import { RefoundReqCreateSchema, RefoundReqResponse, RefoundReqResponseSchema } from "@/lib/validators/refoundreq";
import { NextRequest, NextResponse } from "next/server";

import { RefoundReqFiltersSchema } from "@/lib/validators/refoundreq";
import { requireSession } from "@/lib/auth/session";

export async function GET(req: NextRequest): Promise<NextResponse<{ refounds: RefoundReqResponse[] }>> {
    const session = await requireSession();
    const { searchParams } = new URL(req.url);
    const filters = RefoundReqFiltersSchema.parse(Object.fromEntries(searchParams));

    const userId = session.role === "USER" ? session.userId : filters.userId;

    const refounds = await prisma.refoundReq.findMany({
        where: {
            ...(filters.state && { state: filters.state }),
            ...(filters.category && { category: filters.category }),
            ...(userId && { userId }),
            ...((filters.dateFrom || filters.dateTo) && {
                createdAt: {
                    ...(filters.dateFrom && { gte: filters.dateFrom }),
                    ...(filters.dateTo && { lte: filters.dateTo }),
                },
            }),
        },
        orderBy: { id: "asc" },
        include: { user: true, evaluator: true },
    });

    return NextResponse.json({
        refounds: refounds.map((r) =>
            RefoundReqResponseSchema.parse({
                ...r,
                import: r.import.toNumber(),
            })
        ),
    });
}

// POST
export async function POST(req: NextRequest): Promise<NextResponse<RefoundReqResponse>> {
    const session = await requireSession();

    const body = await req.json();
    const parsed = RefoundReqCreateSchema.parse(body);

    const created = await prisma.refoundReq.create({
        data: {
            ...parsed,
            userId: session.userId, // prendi l'userId dalla sessione, non dal body
        },
        include: { user: true, evaluator: true },
    });

    return NextResponse.json(RefoundReqResponseSchema.parse(created));
}