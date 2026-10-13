"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin, Clock, Star, Camera } from "lucide-react";

const landmarks = [
  {
    id: 1,
    title: "The Point of No Return Slave Route",
    subtitle: "UNESCO World Heritage Site",
    description:
      "Walk the solemn 400-metre ceremonial path along the Atlantic shore where enslaved Africans took their last steps on their homeland. The route ends at the iconic Door of No Return monument — a pilgrimage of memory, reckoning, and resilience.",
    category: "Historical Landmark",
    categoryColor: "bg-amber-100 text-amber-800",
    duration: "2–3 hrs",
    rating: 4.9,
    reviews: 1284,
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=85&auto=format",
    accentColor: "from-amber-500 to-orange-600",
    tag: "🏛 Must Visit",
    tagBg: "bg-amber-500 text-slate-900",
  },
  {
    id: 2,
    title: "The First Storey Building in Nigeria",
    subtitle: "Built 1845 · Badagry Town",
    description:
      "Step inside the oldest European-style structure in Nigeria — a two-storey colonial building that once served as a Brazilian merchant house, a church, and today stands as a living testament to Badagry's 19th-century cosmopolitan history.",
    category: "Cultural Museum",
    categoryColor: "bg-blue-100 text-blue-800",
    duration: "1–2 hrs",
    rating: 4.7,
    reviews: 876,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85&auto=format",
    accentColor: "from-blue-500 to-indigo-600",
    tag: "🏺 Heritage Site",
    tagBg: "bg-blue-600 text-white",
  },
  {
    id: 3,
    title: "Suntan Beach & Local Resorts",
    subtitle: "Atlantic Coastline · Badagry",
    description:
      "One of Lagos State's most pristine beaches, Suntan Beach offers 12 km of virgin Atlantic coastline lined with coconut palms, boutique beach lodges, and a vibrant weekend seafood market drawing visitors from across West Africa.",
    category: "Beach & Resort",
    categoryColor: "bg-teal-100 text-teal-800",
    duration: "Full Day",
    rating: 4.6,
    reviews: 2103,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85&auto=format",
    accentColor: "from-teal-400 to-cyan-600",
    tag: "🏖 Top Rated",
    tagBg: "bg-teal-500 text-white",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

export default function TourismSection() {
  return (
    <section id="tourism" className="py-14 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            <MapPin size={11} />
            Tourism & Ancestral Heritage Hub
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Discover Badagry's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Iconic Landmark Paths
            </span>
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
            From the haunting shores of the transatlantic slave trade to pristine Atlantic beaches,
            Badagry holds West Africa's most compelling heritage destinations. An immersive guide for
            every visitor.
          </p>
        </motion.div>

        {/* Landmark Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landmarks.map((landmark, i) => (
            <motion.div
              key={landmark.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-350"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-52">
                <img
                  src={landmark.image}
                  alt={landmark.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${landmark.accentColor} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                {/* Category tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${landmark.categoryColor}`}
                  >
                    {landmark.category}
                  </span>
                </div>

                {/* Top rated tag */}
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${landmark.tagBg}`}>
                    {landmark.tag}
                  </span>
                </div>

                {/* Photo overlay icon */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-1.5">
                    <Camera size={14} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Subtitle */}
                <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">
                  {landmark.subtitle}
                </p>

                {/* Title */}
                <h3
                  className="text-lg font-black text-slate-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors duration-200"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {landmark.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                  {landmark.description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-800">{landmark.rating}</span>
                    <span className="text-xs text-slate-400">({landmark.reviews.toLocaleString()})</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={11} className="text-slate-400" />
                    {landmark.duration}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#"
                  className="flex items-center justify-between px-4 py-2.5 bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500 rounded-xl text-white text-xs font-bold transition-all duration-300"
                >
                  <span>Explore Landmark</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </a>
              </div>

              {/* Bottom accent strip */}
              <div
                className={`h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${landmark.accentColor} transition-all duration-500`}
              />
            </motion.div>
          ))}
        </div>

        {/* Full Tourism Guide CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-lg text-sm"
          >
            Full Tourism Explorer Guide <ArrowRight size={15} />
          </a>
          <a
            href="#"
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
          >
            <MapPin size={15} /> Download Badagry Map (PDF)
          </a>
        </motion.div>
      </div>
    </section>
  );
}
