import React from "react";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If on login page, render children directly without dashboard chrome
  // Note: Since this layout wraps /admin, we can check session. If no session, the client pages or routes redirect to /admin/login.
  // But wait! /admin/login is under /admin, so if there is no session and path is /admin/login, we shouldn't redirect loop.
  // In Next.js App Router, we can have a client or server wrapper that renders cleanly.

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-100 flex">
      {/* If logged in, show sidebar */}
      {session && <AdminSidebar session={session} />}

      <div className="flex-1 flex flex-col min-w-0">
        {session && <AdminHeader session={session} />}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
