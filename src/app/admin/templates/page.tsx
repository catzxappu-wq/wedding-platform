import React from "react";
import Link from "next/link";
import { TEMPLATES } from "@/data/templates";
import { Palette, Sparkles, PlusCircle, Check } from "lucide-react";

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Design Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          10 Distinct Luxury Wedding Templates
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Reusable, database-driven templates. Wedding content is fully decoupled from template styling so one template powers unlimited weddings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-3xl bg-[#111726] border border-gray-800 overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden relative bg-gray-900">
                <img
                  src={tmpl.previewImage}
                  alt={tmpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-amber-300 uppercase tracking-wider border border-white/10">
                  {tmpl.category}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-serif font-bold text-xl text-white group-hover:text-amber-400 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {tmpl.description}
                </p>

                {/* Theme Specs */}
                <div className="pt-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/80">
                  <span>Fonts: {tmpl.theme.headingFont}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.theme.primaryColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.theme.secondaryColor }}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: tmpl.theme.accentColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/admin/invitations/create?template=${tmpl.id}`}
                className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-amber-500 hover:text-amber-950 text-gray-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create With This Design</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
