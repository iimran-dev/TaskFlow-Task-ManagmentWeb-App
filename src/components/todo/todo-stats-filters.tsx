"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Layers, Keyboard, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterType } from "@/types/todo";
import { Button } from "@/components/ui/button";

interface TodoStatsFiltersProps {
  totalTodos: number;
  completedCount: number;
  activeCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onOpenShortcuts?: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export function TodoStatsFilters({
  totalTodos,
  completedCount,
  activeCount,
  filter,
  setFilter,
  onOpenShortcuts,
  isFocusMode,
  onToggleFocusMode,
}: TodoStatsFiltersProps) {
  const filterOptions: { type: FilterType; label: string; mobileLabel: string; count: number }[] = [
    { type: "all", label: "All Tasks", mobileLabel: "All", count: totalTodos },
    { type: "active", label: "Active", mobileLabel: "Active", count: activeCount },
    { type: "completed", label: "Completed", mobileLabel: "Done", count: completedCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-2.5 sm:space-y-3"
    >
      {/* High Impact Stat Cards (Hidden in Focus Mode for maximum conciseness) */}
      {!isFocusMode && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* Total */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 sm:p-3.5 text-left shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[18px] sm:text-[24px] leading-[22px] sm:leading-[28px] font-bold text-black dark:text-white tracking-[-0.03em]">
                {totalTodos}
              </div>
              <div className="text-[10px] sm:text-[11px] leading-[14px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.04em] truncate">
                Total
              </div>
            </div>
          </div>

          {/* Done */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 sm:p-3.5 text-left shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-[#3bda71]/15 flex items-center justify-center text-[#3bda71] shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[18px] sm:text-[24px] leading-[22px] sm:leading-[28px] font-bold text-[#3bda71] tracking-[-0.03em]">
                {completedCount}
              </div>
              <div className="text-[10px] sm:text-[11px] leading-[14px] font-semibold text-[#3bda71]/80 uppercase tracking-[0.04em] truncate">
                Done
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2 sm:p-3.5 text-left shadow-sm flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-black dark:text-white shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <div className="text-[18px] sm:text-[24px] leading-[22px] sm:leading-[28px] font-bold text-black dark:text-white tracking-[-0.03em]">
                {activeCount}
              </div>
              <div className="text-[10px] sm:text-[11px] leading-[14px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.04em] truncate">
                Active
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Filter Pill Bar & Focus Mode Controls */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2">
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl gap-1 border border-neutral-200 dark:border-neutral-800 flex-1">
          {filterOptions.map((option) => {
            const isActive = filter === option.type;
            return (
              <button
                key={option.type}
                onClick={() => setFilter(option.type)}
                className={cn(
                  "relative flex-1 py-1.5 sm:py-2 px-1 text-center rounded-lg text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] transition-colors duration-200 z-10 truncate cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5",
                  isActive
                    ? "text-black font-semibold"
                    : "text-neutral-500 dark:text-neutral-400 font-medium hover:text-black dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-[#3bda71] rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="sm:hidden">{option.mobileLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-mono px-1 sm:px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-black/15 text-black font-bold"
                      : "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Focus Mode & Hotkeys triggers */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {onToggleFocusMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFocusMode}
              className={cn(
                "h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] gap-1.5 border transition-all cursor-pointer shadow-sm",
                isFocusMode
                  ? "bg-[#3bda71] dark:bg-[#3bda71] text-black dark:text-black border-[#3bda71] dark:border-[#3bda71] font-semibold hover:bg-[#34c666] dark:hover:bg-[#34c666]"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium hover:text-black dark:hover:text-white hover:border-[#3bda71]"
              )}
              title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {isFocusMode ? (
                <Minimize2 className="w-3.5 h-3.5 text-black dark:text-black stroke-[2.5]" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span className={cn("hidden sm:inline", isFocusMode ? "font-semibold text-black dark:text-black" : "font-medium")}>
                {isFocusMode ? "Exit Focus" : "Focus Mode"}
              </span>
            </Button>
          )}

          {onOpenShortcuts && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenShortcuts}
              className="hidden sm:inline-flex h-9 px-2.5 rounded-xl text-[13px] leading-[18px] font-medium bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
