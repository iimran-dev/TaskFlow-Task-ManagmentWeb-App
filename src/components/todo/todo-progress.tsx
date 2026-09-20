"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface TodoProgressProps {
  totalTodos: number;
  completedCount: number;
}

export function TodoProgress({ totalTodos, completedCount }: TodoProgressProps) {
  if (totalTodos === 0) return null;

  const percentage = Math.round((completedCount / totalTodos) * 100);

  const getMotivationMessage = (pct: number) => {
    if (pct === 100) return "All tasks completed!";
    if (pct >= 75) return "Almost at the finish line!";
    if (pct >= 50) return "Over halfway there!";
    if (pct > 0) return "Great start, keep moving!";
    return "Ready to make progress today?";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl p-3 sm:p-4.5 shadow-sm space-y-2 sm:space-y-2.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-semibold text-black dark:text-white">
            Daily Goal
          </span>
          <span className="text-[11px] sm:text-[12px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            {completedCount} of {totalTodos}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[20px] sm:text-[28px] leading-[24px] sm:leading-[32px] font-bold text-[#3bda71] tracking-[-0.03em]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-full bg-[#3bda71] rounded-full"
        />
      </div>

      <div className="flex items-center justify-between pt-0.5 text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px]">
        <span className="flex items-center gap-1.5 font-normal text-neutral-500 dark:text-neutral-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3bda71] shrink-0" />
          <span>{percentage === 100 ? "All completed!" : `${totalTodos - completedCount} remaining`}</span>
        </span>
        <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate ml-2">
          {getMotivationMessage(percentage)}
        </span>
      </div>
    </motion.div>
  );
}
