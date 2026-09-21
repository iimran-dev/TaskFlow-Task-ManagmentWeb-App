"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Layers, Keyboard, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityFilterType, PRIORITY_CONFIGS } from "@/types/todo";
import { Button } from "@/components/ui/button";

interface TodoStatsFiltersProps {
  totalTodos: number;
  completedCount: number;
  urgentCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  priorityFilter: PriorityFilterType;
  setPriorityFilter: (filter: PriorityFilterType) => void;
  onOpenShortcuts?: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export function TodoStatsFilters({
  totalTodos,
  completedCount,
  urgentCount,
  highCount,
  mediumCount,
  lowCount,
  priorityFilter,
  setPriorityFilter,
  onOpenShortcuts,
  isFocusMode,
  onToggleFocusMode,
}: TodoStatsFiltersProps) {
  const priorityItems: {
    type: PriorityFilterType;
    label: string;
    shortLabel: string;
    count: number;
    dotColor?: string;
    activeClass?: string;
  }[] = [
    {
      type: "all",
      label: "All",
      shortLabel: "All",
      count: totalTodos,
    },
    {
      type: "urgent",
      label: "Immediate Action",
      shortLabel: "Immediate",
      count: urgentCount,
      dotColor: PRIORITY_CONFIGS.urgent.dotColor,
      activeClass: "bg-red-500 text-white font-semibold",
    },
    {
      type: "high",
      label: "High",
      shortLabel: "High",
      count: highCount,
      dotColor: PRIORITY_CONFIGS.high.dotColor,
      activeClass: "bg-amber-500 text-black font-semibold",
    },
    {
      type: "medium",
      label: "Medium",
      shortLabel: "Medium",
      count: mediumCount,
      dotColor: PRIORITY_CONFIGS.medium.dotColor,
      activeClass: "bg-blue-500 text-white font-semibold",
    },
    {
      type: "low",
      label: "Low",
      shortLabel: "Low",
      count: lowCount,
      dotColor: PRIORITY_CONFIGS.low.dotColor,
      activeClass: "bg-emerald-500 text-black font-semibold",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-2 sm:space-y-3"
    >
      {/* High Impact Stat Cards (Interactive on Mobile & Desktop) */}
      {!isFocusMode && (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
          {/* Total */}
          <button
            type="button"
            onClick={() => setPriorityFilter("all")}
            className={cn(
              "bg-white dark:bg-neutral-900 border rounded-xl p-1.5 sm:p-3.5 text-left shadow-sm flex items-center gap-1.5 sm:gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
              priorityFilter === "all"
                ? "border-neutral-400 dark:border-neutral-600 ring-1 ring-neutral-400/30"
                : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400/50"
            )}
            title="Filter: All tasks"
          >
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
              <Layers className="w-3 sm:w-4 h-3 sm:h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] sm:text-[24px] leading-tight font-bold text-black dark:text-white tracking-[-0.03em]">
                {totalTodos}
              </div>
              <div className="text-[9px] sm:text-[11px] leading-tight font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.03em] truncate">
                Total
              </div>
            </div>
          </button>

          {/* Immediate Action (Red Priority Card) */}
          <button
            type="button"
            onClick={() => setPriorityFilter(priorityFilter === "urgent" ? "all" : "urgent")}
            className={cn(
              "bg-white dark:bg-neutral-900 border rounded-xl p-1.5 sm:p-3.5 text-left shadow-sm flex items-center gap-1.5 sm:gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]",
              priorityFilter === "urgent"
                ? "border-red-500 bg-red-500/10 dark:bg-red-500/15 ring-1 ring-red-500/50"
                : "border-neutral-200 dark:border-neutral-800 hover:border-red-500/50"
            )}
            title="Click to view Immediate Action tasks"
          >
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-red-500/15 flex items-center justify-center text-red-500 shrink-0">
              <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 stroke-[2.2] animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] sm:text-[24px] leading-tight font-bold text-red-600 dark:text-red-400 tracking-[-0.03em]">
                {urgentCount}
              </div>
              <div className="text-[9px] sm:text-[11px] leading-tight font-semibold text-red-500/90 uppercase tracking-[0.03em] truncate">
                Immediate
              </div>
            </div>
          </button>

          {/* Completed */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 sm:p-3.5 text-left shadow-sm flex items-center gap-1.5 sm:gap-3">
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg bg-[#3bda71]/15 flex items-center justify-center text-[#3bda71] shrink-0">
              <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] sm:text-[24px] leading-tight font-bold text-[#3bda71] tracking-[-0.03em]">
                {completedCount}
              </div>
              <div className="text-[9px] sm:text-[11px] leading-tight font-semibold text-[#3bda71]/80 uppercase tracking-[0.03em] truncate">
                Done
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Color-Themed Priority Bar */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2">
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl gap-1 border border-neutral-200 dark:border-neutral-800 flex-1 overflow-x-auto scrollbar-none touch-pan-x [-webkit-overflow-scrolling:touch]">
          {priorityItems.map((option) => {
            const isActive = priorityFilter === option.type;
            return (
              <button
                key={option.type}
                onClick={() => setPriorityFilter(option.type)}
                className={cn(
                  "relative flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-center rounded-lg text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] transition-all duration-200 z-10 shrink-0 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-h-[32px] sm:min-h-[36px]",
                  isActive
                    ? option.activeClass || "bg-[#3bda71] text-black font-semibold shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 font-medium hover:text-black dark:hover:text-white"
                )}
              >
                {option.dotColor && (
                  <span
                    className={cn(
                      "w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full shrink-0",
                      option.dotColor,
                      option.type === "urgent" && "animate-pulse"
                    )}
                  />
                )}
                <span className="sm:hidden">{option.shortLabel}</span>
                <span className="hidden sm:inline">{option.label}</span>
                <span
                  className={cn(
                    "text-[9.5px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-black/20 text-current font-bold"
                      : "bg-neutral-200/80 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Focus Mode & Shortcuts */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {onToggleFocusMode && (
            <Button
              variant={isFocusMode ? "default" : "outline"}
              size="sm"
              onClick={onToggleFocusMode}
              className={cn(
                "h-8 sm:h-9 w-8 sm:w-auto p-0 sm:px-3 rounded-xl text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] gap-1.5 border transition-all cursor-pointer shadow-sm font-semibold shrink-0 flex items-center justify-center",
                isFocusMode
                  ? "bg-[#3bda71] dark:bg-[#3bda71] text-black dark:text-black border-[#3bda71] dark:border-[#3bda71] hover:bg-[#34c666] dark:hover:bg-[#34c666]"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium hover:text-black dark:hover:text-white hover:border-[#3bda71]"
              )}
              title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
              aria-label={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
            >
              {isFocusMode ? (
                <Minimize2 className="w-3.5 h-3.5 stroke-[2.5] text-black dark:text-black" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span className={cn("hidden sm:inline", isFocusMode ? "text-black dark:text-black font-semibold" : "")}>
                {isFocusMode ? "Exit Focus" : "Focus"}
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
