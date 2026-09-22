"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is my task data safe and private?",
      a: "100% private. Your data is never shared with third-party servers. All task records remain strictly under your control.",
    },
    {
      q: "Is taskflow free to use?",
      a: "Yes! taskflow is completely free and open-access for personal and professional productivity.",
    },
    {
      q: "Can I access my tasks across multiple devices?",
      a: "Yes! Once you sign in, all your tasks, priorities, and deadlines sync instantly in real time across your desktop, laptop, and mobile browsers.",
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/10 border border-[#3bda71]/25 text-[11px] leading-[14px] font-semibold tracking-[0.04em] text-[#3bda71]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently asked questions</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-black dark:text-white tracking-[-0.02em]">
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
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-[15px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-black dark:text-white hover:text-[#3bda71] transition-colors cursor-pointer"
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
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-[14px] leading-[20px] text-neutral-500 dark:text-neutral-400 font-normal pt-0 border-t border-neutral-100 dark:border-neutral-800/60 mt-1">
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
