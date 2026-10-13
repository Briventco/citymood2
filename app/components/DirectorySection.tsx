"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Shield,
  Wifi,
  Car,
  Utensils,
  Waves,
} from "lucide-react";

const categories = ["All", "Hotels & Lodging", "Logistics", "Beachfront", "Restaurants", "Services"];

const businesses = [
  {
    id: 1,
    name: "Badagry Heritage Suites",
    type: "Hotels & Lodging",
    tagline: "Where History Meets Luxury",
    description:
      "A boutique 5-star property nestled on the edge of Badagry Creek, offering 32 elegantly appointed suites with panoramic waterway views, spa services, and a rooftop terrace overlooking the Atlantic.",
    address: "14 Marina Road, Badagry Town",
    phone: "+234 803 456 7890",
    website: "heritagebadagry.ng",
    rating: 4.9,
    reviews: 412,
    price: "₦45,000/night",
    priceLabel: "From",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=85&auto=format",
    verified: true,
    featured: true,
    amenities: [Wifi, Car, Utensils, Waves],
    amenityLabels: ["Free WiFi", "Parking", "Restaurant", "Pool"],
    badge: "Premium Partner",
    badgeColor: "bg-amber-100 text-amber-800 border border-amber-200",
    accentGradient: "from-amber-400 to-orange-500",
  },
  {
    id: 2,
    name: "CreekLine Logistics Ltd.",
    type: "Logistics",
    tagline: "Cross-Border Freight & Courier Experts",
    description:
      "The leading freight forwarding and last-mile delivery firm covering the entire Badagry-Seme corridor. Specialising in Lagos–Benin Republic cross-border commerce, bonded warehousing, and same-day local courier.",
    address: "Km 8, Badagry Expressway, Ojo",
    phone: "+234 901 234 5678",
    website: "creeklinelogistics.ng",
    rating: 4.7,
    reviews: 238,
    price: "Get Quote",
    priceLabel: "",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=85&auto=format",
    verified: true,
    featured: false,
    amenities: [Globe, Car, Shield, CheckCircle2],
    amenityLabels: ["Tracking", "Fleet", "Bonded", "Certified"],
    badge: "Verified Partner",
    badgeColor: "bg-blue-100 text-blue-800 border border-blue-200",
    accentGradient: "from-blue-400 to-indigo-500",
  },
  {
    id: 3,
    name: "Atlantis Beachfront Lounge",
    type: "Beachfront",
    tagline: "Suntan Beach's Premier Hospitality Experience",
    description:
      "Badagry's most celebrated beach club — 3,000 sqm of premium beachfront deck, infinity pools, live Afrobeats weekends, a full cocktail bar, fresh-catch kitchen, and private cabana rentals on Suntan Beach.",
    address: "Suntan Beach Road, Badagry",
    phone: "+234 812 789 0123",
    website: "atlantisbadagry.com",
    rating: 4.8,
    reviews: 1847,
    price: "₦3,500 cover",
    priceLabel: "Weekend",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=85&auto=format",
    verified: true,
    featured: true,
    amenities: [Waves, Utensils, Wifi, Car],
    amenityLabels: ["Beach Access", "Kitchen", "WiFi", "Valet"],
    badge: "Editor's Pick",
    badgeColor: "bg-teal-100 text-teal-800 border border-teal-200",
    accentGradient: "from-teal-400 to-cyan-500",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={11}
            className={
              star <= Math.floor(rating)
                ? "text-amber-400 fill-amber-400"
                : star - 0.5 <= rating
                ? "text-amber-400 fill-amber-200"
                : "text-slate-200 fill-slate-200"
            }
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-800">{rating}</span>
      <span className="text-xs text-slate-400">({reviews.toLocaleString()} reviews)</span>
    </div>
  );
}

export default function DirectorySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = businesses.filter((b) => {
    const matchesCat = activeCategory === "All" || b.type === activeCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="directory" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-3">
                <Shield size={11} />
                Hyperlocal Business Directory
              </div>
              <h2
                className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Premium Partner
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  Business Listings
                </span>
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl">
                Discover and connect with Badagry's finest hotels, logistics firms, beachfront venues,
                and local enterprises — all independently verified by our editorial team.
              </p>
            </div>

            {/* Add Listing CTA */}
            <a
              href="#"
              className="flex-shrink-0 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-orange-200 self-start"
            >
              + List Your Business <ArrowRight size={14} />
            </a>
          </div>

          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search businesses, hotels, services..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-50 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-all">
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((biz, i) => {
            return (
              <motion.div
                key={biz.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeInUp}
                className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Featured ribbon */}
                {biz.featured && (
                  <div className="absolute top-0 right-0 z-10">
                    <div
                      className={`bg-gradient-to-r ${biz.accentGradient} text-white text-[10px] font-black px-3 py-1 rounded-bl-lg rounded-tr-2xl uppercase tracking-widest`}
                    >
                      Featured
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <img
                    src={biz.image}
                    alt={biz.name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />

                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-white/60 rounded-lg px-2.5 py-1.5">
                    {biz.priceLabel && (
                      <span className="text-[9px] text-slate-500 block leading-none mb-0.5 uppercase tracking-wide">
                        {biz.priceLabel}
                      </span>
                    )}
                    <span className="text-xs font-black text-slate-900">{biz.price}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {biz.verified && (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full verified-pulse">
                        <CheckCircle2 size={9} className="fill-green-500 text-white" />
                        Verified Partner
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${biz.badgeColor}`}>
                      {biz.badge}
                    </span>
                  </div>

                  {/* Name & tagline */}
                  <h3
                    className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight mb-0.5"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {biz.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-600 mb-2">{biz.tagline}</p>

                  {/* Rating */}
                  <StarRating rating={biz.rating} reviews={biz.reviews} />

                  {/* Description */}
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mt-2 mb-4">
                    {biz.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex gap-2 mb-4">
                    {biz.amenities.map((Icon, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-0.5 group/amenity"
                        title={biz.amenityLabels[idx]}
                      >
                        <div className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center group-hover/amenity:bg-amber-50 group-hover/amenity:border-amber-200 transition-colors">
                          <Icon size={12} className="text-slate-500 group-hover/amenity:text-amber-600 transition-colors" />
                        </div>
                        <span className="text-[8px] text-slate-400">{biz.amenityLabels[idx]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin size={11} className="text-orange-400 flex-shrink-0" />
                      <span className="truncate">{biz.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone size={11} className="text-orange-400 flex-shrink-0" />
                      {biz.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-600">
                      <Globe size={11} className="text-orange-400 flex-shrink-0" />
                      {biz.website}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-300"
                    >
                      View Profile <ArrowRight size={12} />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-xl text-slate-400 hover:text-amber-600 transition-all"
                      title="Visit website"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${biz.accentGradient} transition-all duration-500`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Search size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No businesses match your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-3 text-sm text-amber-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Directory CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white text-xl font-black mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Own a Business in Badagry?
            </h3>
            <p className="text-slate-400 text-sm">
              Join 120+ verified partners on CityMood Badagry's premium directory and reach thousands
              of weekly visitors, tourists, and investors.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href="#"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
            >
              List Free <ArrowRight size={14} />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 border border-slate-600 hover:border-amber-500 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
            >
              Premium Plans
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
