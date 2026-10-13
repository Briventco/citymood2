"use client";

import { motion, type Variants } from "framer-motion";
import { Clock, User, ArrowRight, TrendingUp, AlertCircle, Building2, Newspaper } from "lucide-react";

const trendingItems = [
  {
    category: "Security Raids",
    categoryColor: "bg-red-100 text-red-700 border border-red-200",
    dot: "bg-red-500",
    title: "Police anti-cultism unit conducts dawn raids across 6 Badagry communities — 23 suspects in custody",
    time: "14 mins ago",
    image: "https://images.unsplash.com/photo-1617802690658-1173a812650d?w=120&q=80&auto=format",
    hot: true,
  },
  {
    category: "Infrastructure",
    categoryColor: "bg-blue-100 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    title: "State govt. releases ₦2.4B for Badagry-Seme border road reconstruction as trade tensions ease",
    time: "1 hr ago",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80&auto=format",
    hot: false,
  },
  {
    category: "Local Politics",
    categoryColor: "bg-purple-100 text-purple-700 border border-purple-200",
    dot: "bg-purple-500",
    title: "LGA Chairman defends controversial market allocation policy amid traders' protest at council secretariat",
    time: "2 hrs ago",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=120&q=80&auto=format",
    hot: false,
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function HeroSection() {
  return (
    <section id="newsroom" className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-5 w-1 bg-amber-500 rounded-full" />
          <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
            Featured Report
          </span>
          <div className="flex-1 h-px bg-slate-100" />
          <a
            href="#"
            className="text-xs font-semibold text-amber-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
          >
            Full News Room <ArrowRight size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6 lg:gap-8">
          {/* ── LEFT: HERO FEATURE ── */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="group"
          >
            <a href="#" className="block">
              {/* Hero Image */}
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-slate-100 mb-5">
                <img
                  src="https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=1200&q=85&auto=format"
                  alt="Badagry Heritage Festival"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      <TrendingUp size={10} /> Cover Story
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                      Cultural Heritage
                    </span>
                  </div>

                  {/* Headline */}
                  <h1
                    className="text-white text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-3 group-hover:text-amber-100 transition-colors duration-300"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    The Revival of Badagry Heritage: Historic Festivals Set to Reclaim the Spotlight
                    This Season
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-white/80 text-xs">
                    <span className="flex items-center gap-1.5">
                      <User size={12} className="text-amber-400" />
                      <span className="font-semibold text-white">Adaeze Okonkwo</span>
                      <span className="text-white/60">· Senior Cultural Editor</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-amber-400" />
                      8 min read
                    </span>
                    <span className="hidden sm:block text-white/40">|</span>
                    <span className="hidden sm:block">Sep 29, 2026</span>
                  </div>
                </div>
              </div>

              {/* Excerpt below image */}
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-4">
                After nearly a decade of diminished public engagement, Badagry's most iconic annual
                festivals are staging a dramatic comeback — backed by a coalition of diaspora
                organisations, state cultural bodies, and local heritage advocates who say the revival
                is critical to the community's economic and spiritual identity.
              </p>

              {/* Read More Link */}
              <span className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 group-hover:gap-3 transition-all duration-200">
                Read Full Report <ArrowRight size={15} />
              </span>
            </a>

            {/* Author Card */}
            <div className="mt-5 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80&auto=format"
                alt="Adaeze Okonkwo"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-300"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Adaeze Okonkwo</p>
                <p className="text-xs text-slate-500">
                  Senior Cultural Editor · 847 articles · Badagry Division specialist
                </p>
              </div>
              <div className="ml-auto">
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                  ● Verified
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: TRENDING FLASH ── */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeInUp}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <AlertCircle size={15} className="text-orange-600" />
              <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Trending Flash Updates
              </span>
            </div>

            {/* Trending Items */}
            <div className="flex flex-col gap-4 flex-1">
              {trendingItems.map((item, i) => (
                <motion.a
                  key={i}
                  href="#"
                  custom={i + 2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="group flex gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-amber-200 hover:shadow-md hover:shadow-amber-50 transition-all duration-250"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.category}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${item.categoryColor}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        {item.category}
                      </span>
                      {item.hot && (
                        <span className="text-[10px] font-bold text-red-600 animate-pulse">
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-3 group-hover:text-amber-700 transition-colors">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock size={9} /> {item.time}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* More Stories Link */}
            <a
              href="#"
              className="mt-5 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/50 transition-all duration-200"
            >
              View All Trending Stories <ArrowRight size={14} />
            </a>

            {/* Mini Stat Bar */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { label: "Reports", value: "1,240+", icon: Newspaper },
                { label: "Authors", value: "38", icon: User },
                { label: "Partners", value: "120+", icon: Building2 },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center py-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <Icon size={14} className="text-amber-500 mb-1" />
                  <span className="text-base font-black text-slate-900">{value}</span>
                  <span className="text-[10px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── AD BANNER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col items-center">
          <p className="text-[10px] text-slate-400 tracking-widest uppercase mb-2">
            Advertisement
          </p>
          <div className="w-full max-w-3xl h-[90px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-gradient-to-r from-slate-50 to-white hover:border-amber-200 transition-colors group">
            <div className="text-center">
              <p className="text-slate-400 text-xs font-bold tracking-widest group-hover:text-amber-500 transition-colors">
                728 × 90 · HEADER PREMIUM PLACEMENT
              </p>
              <p className="text-slate-300 text-[10px] mt-0.5">
                Contact sales@citymoodbadagry.ng to book this slot
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
