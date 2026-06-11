import prisma from "@/lib/prisma";
import { CategoryReq, CategoryReqSchema,  } from "@/lib/validators/refoundreq";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<{ categories: CategoryReq[] }>> {
  const categories = await prisma.categoryReq.findMany({ orderBy: { id: "asc" } });

  return NextResponse.json({
    categories: categories.map((s) => CategoryReqSchema.parse(s)),
  });
}