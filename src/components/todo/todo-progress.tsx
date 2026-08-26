"use client";

import { motion } from "framer-motion";
import { Sparkles, Trophy, CheckCircle2 } from "lucide-react";

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
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {percentage === 100 ? (
            <Trophy className="w-5 h-5 text-[#3bda71] stroke-[2.5]" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#3bda71] stroke-[2.5]" />
          )}
          <span className="text-sm font-bold text-black dark:text-white">
            Daily Goal
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-[#3bda71]">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-full bg-[#3bda71] rounded-full"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-normal pt-0.5">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#3bda71]" />
          {completedCount} of {totalTodos} completed
        </span>
        <span className="font-medium text-black dark:text-white">
          {getMotivationMessage(percentage)}
        </span>
      </div>
    </motion.div>
  );
}
