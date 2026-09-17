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
        <h2 className="text-3xl sm:text-5xl font-extrabold text-black dark:text-white tracking-[-0.02em]">
          Engineered for <span className="text-[#3bda71]">Deep Work</span>
        </h2>
        <p className="text-[14px] sm:text-[15px] leading-[20px] sm:leading-[22px] text-neutral-600 dark:text-neutral-400 font-normal">
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
            <h3 className="text-[20px] sm:text-[24px] leading-[28px] sm:leading-[32px] font-bold text-black dark:text-white tracking-[-0.02em]">
              Keyboard-First Workflow
            </h3>
            <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-neutral-500 dark:text-neutral-400 max-w-md font-normal">
              Create, categorize, and complete tasks without ever touching your mouse. Speed up your daily routine with intuitive hotkeys.
            </p>
          </div>

          {/* Interactive Keyboard Shortcuts Graphic */}
          <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2.5 z-10">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[11px] leading-[14px] font-mono font-medium text-black dark:text-white border border-neutral-200 dark:border-neutral-700">⌘ N</kbd>
              <span className="text-[12px] leading-[16px] text-neutral-600 dark:text-neutral-400 font-medium">New Task</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[11px] leading-[14px] font-mono font-medium text-black dark:text-white border border-neutral-200 dark:border-neutral-700">⌘ K</kbd>
              <span className="text-[12px] leading-[16px] text-neutral-600 dark:text-neutral-400 font-medium">Quick Search</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/50 col-span-2 sm:col-span-1">
              <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-900 shadow text-[11px] leading-[14px] font-mono font-medium text-black dark:text-white border border-neutral-200 dark:border-neutral-700">Space</kbd>
              <span className="text-[12px] leading-[16px] text-neutral-600 dark:text-neutral-400 font-medium">Toggle Status</span>
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
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] leading-[14px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>100% Offline</span>
              </div>
            </div>
            <h3 className="text-[20px] leading-[28px] font-bold text-black dark:text-white tracking-[-0.02em]">
              Instant Local Storage
            </h3>
            <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-neutral-500 dark:text-neutral-400 font-normal">
              Your tasks are stored locally with zero network delay. Reload anytime without losing a single item.
            </p>
          </div>

          <div className="mt-6 p-3 rounded-2xl bg-[#3bda71]/10 border border-[#3bda71]/20 flex items-center justify-between text-[13px] leading-[18px] font-medium text-black dark:text-white">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3bda71]" />
              Persistent Browser DB
            </span>
            <span className="text-[#3bda71] font-mono font-medium">0ms Sync</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
