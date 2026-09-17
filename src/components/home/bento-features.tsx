"use client";

import { motion } from "framer-motion";
import { Zap, Command, Shield, SlidersHorizontal, Sparkles, CheckCircle2 } from "lucide-react";

export function BentoFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10 sm:space-y-14">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
          Engineered for <span className="text-[#3bda71]">Deep Work</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal">
          Every detail fine-tuned to eliminate friction, boost output, and keep you in state of flow.
        </p>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6"
      >
        {/* Card 1: Large Featured - Keyboard First (md:col-span-7) */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-7 group relative rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Command className="w-32 h-32 text-black dark:text-white" />
          </div>

          <div className="space-y-3 z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center font-bold">
              <Command className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Keyboard-First Workflow
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
              Create, categorize, and complete tasks without ever touching your mouse. Speed up your daily routine with intuitive hotkeys.
            </p>
          </div>

          {/* Interactive Keyboard Shortcuts Graphic */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 z-10">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[10px] font-mono font-bold text-black dark:text-white border border-neutral-200 dark:border-neutral-700">⌘ N</kbd>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">New Task</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[10px] font-mono font-bold text-black dark:text-white border border-neutral-200 dark:border-neutral-700">⌘ K</kbd>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">Quick Search</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50 col-span-2 sm:col-span-1">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[10px] font-mono font-bold text-black dark:text-white border border-neutral-200 dark:border-neutral-700">Space</kbd>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">Toggle Status</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Medium - Offline First (md:col-span-5) */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-5 group relative rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="space-y-3 z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>100% Offline</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">
              Instant Local Storage
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Your tasks are stored locally with zero network delay. Reload anytime without losing a single item.
            </p>
          </div>

          <div className="mt-6 p-3 rounded-2xl bg-[#3bda71]/10 border border-[#3bda71]/20 flex items-center justify-between text-xs font-semibold text-black dark:text-white">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3bda71]" />
              Persistent Browser DB
            </span>
            <span className="text-[#3bda71] font-mono">0ms Sync</span>
          </div>
        </motion.div>

        {/* Card 3: Medium - Priority & Categories (md:col-span-5) */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-5 group relative rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="space-y-3 z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">
              Smart Priority Matrix
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Color-coded high, medium, and low priority tagging keeps your eyes on what truly matters right now.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">High</span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">Medium</span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Low</span>
          </div>
        </motion.div>

        {/* Card 4: Large Featured - Focus & Velocity (md:col-span-7) */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-7 group relative rounded-3xl bg-white dark:bg-black text-black dark:text-white p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl border border-neutral-200 dark:border-neutral-800 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,218,113,0.15),transparent_70%)] pointer-events-none" />

          <div className="space-y-3 z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-[#3bda71] text-black flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 fill-black" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#3bda71] px-2.5 py-1 rounded-full bg-[#3bda71]/15 border border-[#3bda71]/30">
                Zero Friction
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white tracking-tight">
              Optimistic Execution Engine
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg">
              UI states change instantly before background processing even finishes. Enjoy fluid 60fps animations and micro-interactions.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs z-10">
            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Response Latency</span>
            <span className="text-[#3bda71] font-mono font-bold">&lt; 16ms Frame Time</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
