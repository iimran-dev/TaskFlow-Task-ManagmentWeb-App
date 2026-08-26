"use client";

import { motion } from "framer-motion";
import { Gauge, ShieldCheck, Zap, Flame } from "lucide-react";

export function StatsCounter() {
  const stats = [
    {
      value: "100%",
      label: "Local & Private",
      subtext: "Data remains on your device",
      icon: ShieldCheck,
    },
    {
      value: "< 10ms",
      label: "UI Latency",
      subtext: "Optimistic instantaneous sync",
      icon: Gauge,
    },
    {
      value: "0",
      label: "Distractions",
      subtext: "Clutter-free minimalist layout",
      icon: Zap,
    },
    {
      value: "∞",
      label: "Tasks & Projects",
      subtext: "Unlimited local task storage",
      icon: Flame,
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-white dark:bg-neutral-900 text-black dark:text-white p-8 sm:p-12 relative overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl transition-colors duration-300"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,218,113,0.12),transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="space-y-2 text-center flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center mb-1">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#3bda71] font-mono">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal max-w-[160px]">
                  {stat.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
