"use client";
import { useSessionStore } from "@/lib/store/session-store";
import { logout } from "@/lib/axios/auth";

export default function NavUser() {
  const user = useSessionStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        {user.firstName} {user.lastName}
        <span className="badge badge-sm badge-primary ml-1">{user.role}</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow">
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </div>
  );
}