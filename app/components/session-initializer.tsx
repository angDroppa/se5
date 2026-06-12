// app/components/session-initializer.tsx
"use client";
import { SessionUser, useSessionStore } from "@/lib/store/session-store";
import { useEffect } from "react";

// session-initializer.tsx
type Props = { user: SessionUser };

export default function SessionInitializer({ user }: Props) {
  const setSession = useSessionStore((s) => s.setSession);
  useEffect(() => { setSession(user); }, [user, setSession]);
  return null;
}