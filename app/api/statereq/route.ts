import prisma from "@/lib/prisma";
import { StateReq, StateReqSchema } from "@/lib/validators/refoundreq";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<{ states: StateReq[] }>> {
  const states = await prisma.stateReq.findMany({ orderBy: { id: "asc" } });

  return NextResponse.json({
    states: states.map((s) => StateReqSchema.parse(s)),
  });
}