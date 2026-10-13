"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Bell,
  ArrowRight,
  Phone,
  MapPin,
  CheckCircle2,
  Heart,
} from "lucide-react";

// ── Inline SVG brand icons (lucide-react removed these) ──
function FacebookIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = {
  "Editorial": [
    "News Room",
    "Cultural Heritage",
    "Investigative Reports",
    "Opinion & Commentary",
    "Press Releases",
  ],
  "Explore Badagry": [
    "Tourism Explorer",
    "Landmark Guide",
    "Badagry Map",
    "Beach & Resorts",
    "Heritage Trails",
  ],
  "Business Directory": [
    "Hotels & Lodging",
    "Restaurants & Food",
    "Logistics & Freight",
    "Professional Services",
    "List Your Business",
  ],
  "Company": [
    "About CityMood",
    "Our Editorial Standards",
    "Advertise With Us",
    "Submit a Story",
    "Contact the Newsroom",
  ],
};

const socialLinks = [
  {
    name: "Facebook",
    handle: "@CityMoodBadagry",
    followers: "28.4K",
    Icon: FacebookIcon,
    color: "hover:bg-blue-600",
    bgLight: "bg-blue-50 text-blue-600",
  },
  {
    name: "Instagram",
    handle: "@citymoodbadagry",
    followers: "41.2K",
    Icon: InstagramIcon,
    color: "hover:bg-pink-600",
    bgLight: "bg-pink-50 text-pink-600",
  },
  {
    name: "X (Twitter)",
    handle: "@CityMoodNG",
    followers: "19.8K",
    Icon: XIcon,
    color: "hover:bg-slate-800",
    bgLight: "bg-slate-100 text-slate-700",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white">
      {/* Newsletter Band */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3">
                <Bell size={11} />
                CityMood Newsletter
              </div>
              <h3
                className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Get Badagry News Flashes First.
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Join 14,000+ readers who receive breaking news, heritage stories, festival
                announcements, and local business spotlight directly to their inbox — every
                Tuesday & Friday.
              </p>
              <div className="flex items-center gap-4 mt-3 justify-center lg:justify-start">
                {["Free to join", "No spam, ever", "Unsubscribe anytime"].map((p) => (
                  <span key={p} className="flex items-center gap-1 text-xs text-slate-500">
                    <CheckCircle2 size={11} className="text-amber-500" /> {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-shrink-0 w-full lg:w-96">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
                >
                  <CheckCircle2 size={36} className="text-green-400" />
                  <h4 className="text-white font-bold text-lg">You're in! 🎉</h4>
                  <p className="text-slate-400 text-sm">
                    Watch your inbox — your first edition arrives this Friday.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm"
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Your email address
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-9 pr-3 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-900 font-bold px-4 py-3 rounded-xl transition-all text-sm whitespace-nowrap"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      ) : (
                        <>
                          Subscribe <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-600 text-[10px] mt-2.5">
                    By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              Follow CityMood Badagry on social media:
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.Icon;
                return (
                  <a
                    key={social.name}
                    href="#"
                    className={`group flex items-center gap-2.5 bg-slate-800 ${social.color} border border-slate-700 hover:border-transparent text-white px-4 py-2 rounded-xl transition-all duration-250`}
                  >
                    <Icon size={15} />
                    <div className="text-left">
                      <p className="text-xs font-bold">{social.handle}</p>
                      <p className="text-[10px] text-slate-400 group-hover:text-white/70 transition-colors">
                        {social.followers} followers
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-[0.25em] text-amber-500 uppercase block mb-0.5">
                CityMood
              </span>
              <span
                className="text-2xl font-black text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                BADAGRY
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              The definitive grassroots media, cultural journalism & tourism guide for Badagry
              Division, Lagos State, Nigeria.
            </p>

            {/* Contact snippets */}
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-slate-500">
                <MapPin size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Badagry Town, Lagos State, Nigeria</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={11} className="text-amber-500 flex-shrink-0" />
                <span>+234 801 234 5678</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail size={11} className="text-amber-500 flex-shrink-0" />
                <span>hello@citymoodbadagry.ng</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h5 className="text-xs font-black text-white uppercase tracking-widest mb-3">
                {category}
              </h5>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-slate-500 hover:text-amber-400 text-xs transition-colors duration-150 flex items-center gap-1 group"
                    >
                      <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-200 text-amber-500">
                        ›
                      </span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            © 2026 CityMood Badagry Media Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Editorial Standards", "Terms of Use", "Cookie Settings", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-600 hover:text-amber-400 text-[10px] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-slate-700 text-[10px] flex items-center gap-1">
            Made with <Heart size={9} className="text-red-600 fill-red-600" /> in Badagry
          </p>
        </div>
      </div>
    </footer>
  );
}
