"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

export function TestimonialsMarquee() {
  const reviews = [
    {
      name: "Alex Rivera",
      role: "Lead Frontend Engineer",
      company: "Vercel Ecosystem",
      text: "TaskFlow feels ridiculously fast. The zero-lag optimistic updates make managing daily pull request tasks effortless.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Sophia Chen",
      role: "Product Designer",
      company: "DesignCraft Studios",
      text: "The minimalist UI design and smooth Framer Motion transitions are pure bliss. It's the rare todo app that stays out of your way.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Marcus Vance",
      role: "Founder & CTO",
      company: "HyperScale AI",
      text: "Having 100% offline local data storage means I never lose my focus list even when working on flights without Wi-Fi.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Engineering Manager",
      company: "CloudCore",
      text: "The keyboard shortcuts saved me at least 15 minutes every single day. I can triaging tasks at the speed of thought.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10 sm:space-y-14 overflow-hidden">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/10 border border-[#3bda71]/25 text-[11px] font-semibold tracking-wider text-[#3bda71] uppercase">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Loved by Builders</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
          Trusted by <span className="text-[#3bda71]">Productive Minds</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Here is what engineers, designers, and creators say about their daily workflow with TaskFlow.
        </p>
      </div>

      {/* Grid of Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {reviews.map((rev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal italic">
                "{rev.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white">
                  {rev.name}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {rev.role} &bull; <span className="text-[#3bda71] font-medium">{rev.company}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
