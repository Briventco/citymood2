"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TourismSection from "./components/TourismSection";
import DirectorySection from "./components/DirectorySection";
import AdSidebar from "./components/AdSidebar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import {
  BookOpen,
  Flame,
  Globe,
  Users,
  ArrowRight,
  PlayCircle,
  Bookmark,
  Share2,
} from "lucide-react";

// ─────────────────────────────────────────────
// SECONDARY EDITORIAL SECTION (Cultural Pulse)
// ─────────────────────────────────────────────
const culturalStories = [
  {
    tag: "Festival",
    tagColor: "bg-amber-100 text-amber-800",
    headline: "Badagry Centenary Festival Returns After 8-Year Hiatus With Record Diaspora Funding",
    excerpt:
      "Organisers confirm three-day programme spanning slave route walk, traditional masquerade processions, and a headline concert featuring Fela's Orchestra Africa.",
    image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=500&q=80&auto=format",
    author: "Chidi Mensah",
    time: "3 hrs ago",
    read: "5 min",
  },
  {
    tag: "Language & Culture",
    tagColor: "bg-purple-100 text-purple-800",
    headline: "Endangered Ogu Language Gets New Digital Archive — Could This Save Badagry's Mother Tongue?",
    excerpt:
      "A team of linguists and tech volunteers from UNILAG have completed an AI-assisted dictionary of 12,000 Ogu (Badagry) words in the most comprehensive archiving effort to date.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80&auto=format",
    author: "Dr. Funmi Adeleke",
    time: "Yesterday",
    read: "7 min",
  },
  {
    tag: "Community",
    tagColor: "bg-green-100 text-green-800",
    headline: "Fish Market Women of Badagry Creek Form Historic Cooperative, Access ₦80M Development Fund",
    excerpt:
      "Over 240 female fish traders have banded together in Nigeria's largest artisanal fishing cooperative, unlocking state microfinance to modernise their smoking and cold-storage facilities.",
    image: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=500&q=80&auto=format",
    author: "Blessing Oguntimehin",
    time: "2 days ago",
    read: "4 min",
  },
];

function CulturalPulseSection() {
  return (
    <section className="py-12 lg:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">
              Cultural Pulse
            </h2>
          </div>
          <div className="flex-1 h-px bg-slate-100" />
          <a href="#" className="text-xs font-bold text-amber-600 hover:text-orange-600 flex items-center gap-1">
            See All Stories <ArrowRight size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {culturalStories.map((story, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group block"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-slate-100 mb-3">
                <img
                  src={story.image}
                  alt={story.headline}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Action buttons on hover */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white/90 hover:bg-white rounded-lg p-1.5 shadow-sm">
                    <Bookmark size={11} className="text-slate-700" />
                  </button>
                  <button className="bg-white/90 hover:bg-white rounded-lg p-1.5 shadow-sm">
                    <Share2 size={11} className="text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${story.tagColor}`}>
                {story.tag}
              </span>
              <h3
                className="mt-2 text-sm font-black text-slate-900 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {story.headline}
              </h3>
              <p className="mt-1.5 text-slate-500 text-xs leading-relaxed line-clamp-2">
                {story.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="font-semibold text-slate-600">{story.author}</span>
                <span>·</span>
                <span>{story.time}</span>
                <span>·</span>
                <BookOpen size={9} />
                <span>{story.read} read</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// VIDEO SHOWCASE SECTION
// ─────────────────────────────────────────────
function VideoShowcaseSection() {
  return (
    <section className="py-12 lg:py-16 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Video Thumbnail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="group relative flex-1 rounded-2xl overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-video bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=85&auto=format"
                alt="Badagry documentary"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-slate-900/50 group-hover:bg-slate-900/30 transition-colors duration-400" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-16 h-16 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/40 transition-colors"
                >
                  <PlayCircle size={28} className="text-slate-900 fill-slate-900 ml-1" />
                </motion.div>
              </div>

              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs font-mono px-2 py-0.5 rounded">
                18:42
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex-1 text-white"
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <PlayCircle size={11} />
              CityMood Docs
            </div>
            <h2
              className="text-3xl font-black leading-tight mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Watch: "Badagry — Where the Atlantic Met Africa"
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our 18-minute documentary explores Badagry's contested history as West Africa's largest
              trans-Atlantic slave trading port, and how its descendants are now reclaiming that
              narrative through culture, arts, and economic development.
            </p>
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">84K</p>
                <p className="text-slate-500 text-xs">Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">2.1K</p>
                <p className="text-slate-500 text-xs">Shares</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-amber-400">4.9★</p>
                <p className="text-slate-500 text-xs">Rating</p>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Watch Full Documentary <ArrowRight size={15} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// STATS / IMPACT BANNER
// ─────────────────────────────────────────────
const stats = [
  { value: "1.2M+", label: "Monthly Readers", icon: Globe },
  { value: "8 Years", label: "Editorial Excellence", icon: BookOpen },
  { value: "38", label: "Staff Reporters", icon: Users },
  { value: "120+", label: "Business Partners", icon: Flame },
];

function StatsBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-600 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center text-white"
            >
              <Icon size={22} className="mx-auto mb-1.5 text-amber-100/80" />
              <p className="text-3xl font-black">{value}</p>
              <p className="text-amber-100 text-xs font-medium mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Global Navigation */}
      <Navbar />

      {/* Breaking Hero + Ad Banner */}
      <HeroSection />

      {/* Stats Impact Banner */}
      <StatsBanner />

      {/* Cultural Pulse + Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col xl:flex-row gap-10">
          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            <CulturalPulseSection />
          </div>

          {/* Premium Ad Sidebar */}
          <div className="w-full xl:w-[300px] flex-shrink-0">
            <AdSidebar />
          </div>
        </div>
      </div>

      {/* Tourism & Heritage Hub */}
      <TourismSection />

      {/* Video Showcase */}
      <VideoShowcaseSection />

      {/* Business Directory */}
      <DirectorySection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
