"use client";
import { useSessionStore } from "@/lib/store/session-store";
import Link from "next/link";

export default function NavLnks() {
  const user = useSessionStore((s) => s.user);
  if (!user || user.role !== "ADMIN") return null;

  return (
    <Link href="/stats" className="btn btn-ghost btn-sm">
      Statistiche
    </Link>
  );
}