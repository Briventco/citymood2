"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Newspaper,
  Landmark,
  MapPin,
  Compass,
  Send,
  Search,
} from "lucide-react";

const navLinks = [
  {
    label: "News Room",
    icon: Newspaper,
    href: "#newsroom",
    sub: ["Breaking News", "Community Reports", "Investigations", "Opinion"],
  },
  {
    label: "Cultural Heritage",
    icon: Landmark,
    href: "#heritage",
    sub: ["Festivals & Events", "History & Artifacts", "Oral Traditions", "Heritage Sites"],
  },
  {
    label: "Local Directory",
    icon: MapPin,
    href: "#directory",
    sub: ["Hotels & Lodging", "Restaurants", "Services", "Markets"],
  },
  {
    label: "Tourism Explorer",
    icon: Compass,
    href: "#tourism",
    sub: ["Landmarks", "Beach Resorts", "Day Trips", "Tour Guides"],
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Editorial Strip */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="text-slate-400 hidden sm:block">
          📍 Badagry Division, Lagos State, Nigeria · Covering the Heritage Coast
        </span>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-amber-400 font-medium">🔴 LIVE</span>
          <span className="text-slate-300">Est. grassroots media for Badagry</span>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-slate-100/80 border-b border-slate-100"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold tracking-[0.25em] text-amber-500 uppercase">
                  CityMood
                </span>
                <span
                  className="text-xl font-black tracking-tight text-slate-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  BADAGRY
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1" />
              <span className="hidden sm:block text-[10px] text-slate-500 leading-tight max-w-[80px]">
                Grassroots Media & Culture
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 group"
                    >
                      <Icon size={14} className="opacity-60 group-hover:opacity-100" />
                      {link.label}
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.label ? "rotate-180 text-amber-500" : ""
                        }`}
                      />
                    </a>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/60 py-2 z-50"
                        >
                          {link.sub.map((item) => (
                            <a
                              key={item}
                              href="#"
                              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-150"
                            >
                              <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                              {item}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* CTA Button */}
              <a
                href="#contact"
                className="hidden sm:flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 active:scale-95"
              >
                <Send size={14} />
                Submit / Advertise
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="py-3">
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search Badagry news, heritage sites, businesses..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden bg-white border-t border-slate-100"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium"
                    >
                      <Icon size={16} className="text-amber-500" />
                      {link.label}
                    </a>
                  );
                })}
                <div className="pt-2 border-t border-slate-100">
                  <a
                    href="#contact"
                    className="flex items-center justify-center gap-2 bg-orange-600 text-white font-semibold px-4 py-3 rounded-lg w-full transition-all hover:bg-orange-700"
                  >
                    <Send size={15} />
                    Submit News / Advertise
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Breaking News Ticker */}
      <div className="bg-slate-900 border-b border-slate-800 overflow-hidden">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-amber-500 text-slate-900 text-xs font-black px-4 py-2 uppercase tracking-widest z-10">
            Flash
          </div>
          <div className="overflow-hidden flex-1">
            <div className="ticker-content inline-flex gap-16 py-2 text-xs text-slate-300">
              {[
                "🏛 Heritage commission announces restoration of Badagry slave museum",
                "⚡ Lagos-Badagry Express Road expansion: Phase 3 construction begins Q1 2027",
                "🎭 Badagry Centenary Festival 2026 tickets now on sale — limited early-bird offer",
                "🏖 Suntan Beach Resort opens new eco-lodge with 48 premium suites",
                "🗳 Local government election results: Independent candidates sweep 4 wards",
                "📚 First Storey Building museum receives UNESCO recognition for preservation",
                "🐠 Fishing community raises alarm over industrial trawling in Badagry Creek",
                "🏛 Heritage commission announces restoration of Badagry slave museum",
                "⚡ Lagos-Badagry Express Road expansion: Phase 3 construction begins Q1 2027",
                "🎭 Badagry Centenary Festival 2026 tickets now on sale — limited early-bird offer",
              ]
                .map((item, i) => (
                  <span key={i} className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                    {item}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
