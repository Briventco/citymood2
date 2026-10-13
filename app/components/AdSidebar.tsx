"use client";

import { motion } from "framer-motion";
import { TrendingUp, ExternalLink, Info } from "lucide-react";

const sidebarAds = [
  {
    id: 1,
    sponsor: "Badagry Tourism Board",
    label: "Official Tourism Partner",
    headline: "Explore Badagry This Holiday Season",
    sub: "Book guided tours, beach resorts & heritage trails. Official state tourism packages available now.",
    cta: "Book a Tour →",
    bg: "from-amber-600 to-orange-700",
    tag: "SPONSOR",
  },
  {
    id: 2,
    sponsor: "First Bank Nigeria",
    label: "Financial Services",
    headline: "Empower Your Business With First Bank SME Loans",
    sub: "Special rates for Badagry micro-enterprises. No collateral for loans up to ₦5M.",
    cta: "Apply Now →",
    bg: "from-slate-800 to-slate-900",
    tag: "AD",
  },
  {
    id: 3,
    sponsor: "MTN Business",
    label: "Telecom Solutions",
    headline: "Fast Business Internet for Badagry Enterprises",
    sub: "Fibre + 5G business bundles. Priority customer support. 30-day free trial.",
    cta: "Get Connected →",
    bg: "from-yellow-500 to-amber-600",
    tag: "AD",
    dark: false,
  },
];

export default function AdSidebar() {
  return (
    <aside className="sticky top-24 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={13} className="text-slate-400" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Brand Partners
        </span>
        <div className="flex-1 h-px bg-slate-100" />
        <Info size={11} className="text-slate-300" />
      </div>

      {/* 300×250 Ad Units */}
      {sidebarAds.map((ad, i) => (
        <motion.div
          key={ad.id}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="group relative w-full overflow-hidden rounded-xl border border-slate-200 cursor-pointer hover:shadow-lg transition-all duration-300"
          style={{ aspectRatio: "300/250" }}
        >
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${ad.bg}`} />

          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
            }}
          />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-5">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black tracking-[0.2em] text-white/50 uppercase">
                  {ad.tag}
                </span>
                <p className="text-white/70 text-[10px] font-medium">{ad.sponsor}</p>
              </div>
              <span className="bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {ad.label}
              </span>
            </div>

            {/* Main Content */}
            <div>
              <h4
                className="text-white font-black text-base leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {ad.headline}
              </h4>
              <p className="text-white/70 text-xs leading-relaxed mb-4">{ad.sub}</p>

              {/* CTA */}
              <a
                href="#"
                className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 group-hover:bg-white/25"
              >
                {ad.cta}
                <ExternalLink size={10} />
              </a>
            </div>

            {/* Ad Dimensions Watermark */}
            <div className="text-right">
              <span className="text-[9px] text-white/30 font-mono">300×250</span>
            </div>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 ring-2 ring-amber-400/0 group-hover:ring-amber-400/40 rounded-xl transition-all duration-300" />
        </motion.div>
      ))}

      {/* Advertise Placeholder */}
      <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center text-center hover:border-amber-300 hover:bg-amber-50/30 transition-colors group cursor-pointer"
        style={{ aspectRatio: "300/250" }}
      >
        <div className="text-2xl mb-2">📣</div>
        <p className="text-slate-600 text-xs font-bold mb-1">Your Brand Here</p>
        <p className="text-slate-400 text-[10px] leading-relaxed mb-3">
          300×250 · Premium Sidebar Slot
          <br />
          4,800+ weekly impressions
        </p>
        <a
          href="#"
          className="text-[11px] font-black text-orange-600 group-hover:text-orange-700 underline underline-offset-2"
        >
          Book This Slot →
        </a>
      </div>
    </aside>
  );
}
