"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-700 bg-slate-800">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2 mb-8">
            <span className="text-2xl">⚙️</span>
            <span className="font-bold text-white text-lg">ToffeeDev Admin</span>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>👥</span>
              <span>Leads</span>
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>📈</span>
              <span>Analytics</span>
            </Link>
            <Link
              href="/admin/exports"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>📥</span>
              <span>Exports</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm"
          >
            <span>←</span>
            <span>Back to Tool</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
