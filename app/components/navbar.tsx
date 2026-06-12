// app/components/navbar.tsx
"use client";
import Link from "next/link";
import NavUser from "./navuser";
import { useSessionStore } from "@/lib/store/session-store";

export default function Navbar() {
  const user = useSessionStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 w-full z-50 bg-base-200">
        <div className="h-16 flex items-center justify-between px-4">
          <div className="flex-1">
            <Link href="/" className="text-xl font-bold">MyApp</Link>
          </div>
          <div className="ml-auto">
            <NavUser />
          </div>
        </div>
      </div>
      <div className="h-20"></div>
    </div>
  );
}