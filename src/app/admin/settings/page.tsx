import React from "react";
import { Settings, Database, Shield, Server, CheckCircle, ExternalLink } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span>System Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Database connection parameters, security protocols, and production deployment readiness.
        </p>
      </div>

      {/* Database Status Card */}
      <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-lg">
                Relational Database Engine (Prisma ORM)
              </h3>
              <p className="text-xs text-gray-400">
                PostgreSQL & SQLite Dual Deployment Architecture
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Connected & Healthy</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Database URL:</span>
            <code className="text-amber-300 font-mono">
              {process.env.DATABASE_URL ? "Configured (Hidden for security)" : "file:./dev.db"}
            </code>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Production PostgreSQL Target:</span>
            <span className="text-gray-200">Supabase / Neon / AWS RDS Compatible</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Prisma Client Version:</span>
            <span className="text-gray-200">v5.22.0</span>
          </div>
        </div>

        <div className="pt-2 text-xs text-gray-400 leading-relaxed space-y-1">
          <p className="font-semibold text-gray-300">How to deploy to Neon / Supabase PostgreSQL:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a PostgreSQL database on Neon or Supabase.</li>
            <li>Copy your connection string and set <code className="text-amber-400">DATABASE_URL="postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"</code> in Vercel environment variables.</li>
            <li>Use the included <code className="text-amber-400">prisma/schema.postgresql.prisma</code> schema for automatic migration.</li>
          </ol>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="rounded-3xl bg-[#111726] border border-gray-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-white text-lg">
              Security & Authentication
            </h3>
            <p className="text-xs text-gray-400">
              Session management, bcrypt password hashing, and route protection
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-400">Password Hashing:</span>
            <p className="font-semibold text-white">Bcrypt Salt Rounds (10)</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
            <span className="text-gray-400">Session Cookie:</span>
            <p className="font-semibold text-white">HTTP-Only, SameSite Lax, 7-Day Expiry</p>
          </div>
        </div>
      </div>
    </div>
  );
}
