"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I need to create an account or sign in?",
      a: "No! TaskFlow 2.0 operates instantly out of the box with zero sign-up friction. Your tasks are stored locally in your browser's persistent database.",
    },
    {
      q: "Is my task data safe and private?",
      a: "100% private. Your data never leaves your device and is not uploaded to third-party servers. All task records remain strictly under your control.",
    },
    {
      q: "What happens if I refresh or close my browser tab?",
      a: "Your tasks are saved instantly using persistent browser storage (LocalStorage). When you return to the page, all your tasks, tags, and progress will be right where you left them.",
    },
    {
      q: "What keyboard shortcuts are available?",
      a: "You can press ⌘N (or Ctrl+N) to quickly focus the task input, ⌘K to open search, and Space or Enter to toggle completion when navigating items.",
    },
    {
      q: "Is TaskFlow free to use?",
      a: "Yes! TaskFlow is completely free and open-access for personal and professional productivity.",
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/10 border border-[#3bda71]/25 text-[11px] font-semibold tracking-wider text-[#3bda71] uppercase">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
          Everything You <span className="text-[#3bda71]">Need to Know</span>
        </h2>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/80 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-black dark:text-white hover:text-[#3bda71] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[#3bda71]" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" as const }}
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed pt-0 border-t border-neutral-100 dark:border-neutral-800/60 mt-1">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
