// app/(protected)/layout.tsx
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SessionInitializer from "@/app/components/session-initializer";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, firstName: true, lastName: true, email: true, roleName: true },
  });

  if (!user) redirect("/login");

  return (
    <>
      <SessionInitializer user={{
        userId: user.id,
        role: user.roleName,
        firstName: user.firstName,
        lastName: user.lastName,
      }} />
      {children}
    </>
  );
}