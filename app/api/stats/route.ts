import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import {
    StatByCategoryMonth,
    StatByCategoryMonthSchema,
    StatFiltersSchema,
} from "@/lib/validators/statistiche";

function buildWhere(filters: ReturnType<typeof StatFiltersSchema.parse>) {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let i = 1;

    if (filters.search) {
        conditions.push(`(
            LOWER(u."firstName") LIKE LOWER($${i}) OR
            LOWER(u."lastName") LIKE LOWER($${i}) OR
            LOWER(u."firstName" || ' ' || u."lastName") LIKE LOWER($${i}) OR
            LOWER(u."lastName" || ' ' || u."firstName") LIKE LOWER($${i})
        )`);
        params.push(`%${filters.search}%`);
        i++;
    }

    if (filters.category) {
        conditions.push(`r.category = $${i++}`);
        params.push(filters.category);
    }

    if (filters.userId) {
        conditions.push(`r."userId" = $${i++}`);
        params.push(filters.userId);
    }

    if (filters.dateFrom) {
        conditions.push(`r."expenseDate" >= $${i++}`);
        params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
        conditions.push(`r."expenseDate" <= $${i++}`);
        params.push(filters.dateTo);
    }

    return {
        where: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
        params,
    };
}

export async function GET(req: NextRequest) {
    const session = await requireSession();
    if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const filters = StatFiltersSchema.parse(Object.fromEntries(searchParams));
    const { where, params } = buildWhere(filters);

    const byCategory = await prisma.$queryRawUnsafe<StatByCategoryMonth[]>(`
        SELECT
            r.category,
            DATE_TRUNC('month', r."expenseDate") AS month,
            COUNT(*) AS "numeroRichieste",
            SUM(r.import) AS "totaleRichiesto",
            SUM(CASE WHEN r.state IN ('ACCETTATO', 'PAGATO') THEN r.import ELSE 0 END) AS "totaleApprovato",
            SUM(CASE WHEN r.state = 'PAGATO' THEN r.import ELSE 0 END) AS "totaleLiquidato"
        FROM s5."RefoundReq" r
        JOIN s5."User" u ON u.id = r."userId"
        ${where}
        GROUP BY r.category, DATE_TRUNC('month', r."expenseDate")
        ORDER BY month, r.category
    `, ...params);

    return NextResponse.json({
        byCategory: byCategory.map((r) => StatByCategoryMonthSchema.parse(r)),
    });
}