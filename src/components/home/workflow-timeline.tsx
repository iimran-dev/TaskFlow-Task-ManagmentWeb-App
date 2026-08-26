"use client";

import { motion } from "framer-motion";
import { PlusCircle, Sliders, CheckCircle, ArrowRight } from "lucide-react";

export function WorkflowTimeline() {
  const steps = [
    {
      num: "01",
      title: "Capture Ideas Instantaneously",
      desc: "Hit ⌘N or start typing. Store thought snippets, work tasks, or daily goals without breaking focus.",
      icon: PlusCircle,
      tag: "Capture",
    },
    {
      num: "02",
      title: "Organize & Set Priorities",
      desc: "Assign High, Medium, or Low priority badges and categorize into Work, Personal, or Urgent tags.",
      icon: Sliders,
      tag: "Prioritize",
    },
    {
      num: "03",
      title: "Execute & Achieve Flow",
      desc: "Check off items with satisfying optimistic feedback and maintain your daily productivity momentum.",
      icon: CheckCircle,
      tag: "Complete",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12 sm:space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/10 border border-[#3bda71]/25 text-[11px] font-semibold tracking-wider text-[#3bda71] uppercase">
          <span>Seamless Routine</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
          How <span className="text-[#3bda71]">TaskFlow</span> Works
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          A frictionless 3-step cycle designed to keep your mind clear and your goals on track.
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-3xl bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#3bda71]/60 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {/* Step Badge & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#3bda71]/15 text-[#3bda71] flex items-center justify-center font-bold">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black text-neutral-300 dark:text-neutral-700 group-hover:text-[#3bda71] transition-colors font-mono">
                  {step.num}
                </span>
              </div>

              {/* Step Content */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#3bda71] px-2.5 py-0.5 rounded-md bg-[#3bda71]/10 border border-[#3bda71]/20">
                  {step.tag}
                </span>
                <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Sub-indicator */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center text-xs font-semibold text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                <span>Step {idx + 1} of 3</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform text-[#3bda71]" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
