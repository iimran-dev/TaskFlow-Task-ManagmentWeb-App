"use client";

import { motion } from "framer-motion";
import { Keyboard, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityFilterType } from "@/types/todo";
import { Button } from "@/components/ui/button";

interface TodoStatsFiltersProps {
  totalTodos: number;
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
    pillBg: string;
    textColor: string;
  }[] = [
    {
      type: "all",
      label: "All",
      shortLabel: "All",
      count: totalTodos,
      pillBg: "bg-[#3bda71]",
      textColor: "text-black",
    },
    {
      type: "high",
      label: "High",
      shortLabel: "High",
      count: highCount,
      pillBg: "bg-amber-500",
      textColor: "text-black",
    },
    {
      type: "medium",
      label: "Medium",
      shortLabel: "Medium",
      count: mediumCount,
      pillBg: "bg-blue-500",
      textColor: "text-white",
    },
    {
      type: "low",
      label: "Low",
      shortLabel: "Low",
      count: lowCount,
      pillBg: "bg-emerald-500",
      textColor: "text-black",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-2 sm:space-y-3"
    >

      {/* Color-Themed Priority Bar */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2">
        <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl gap-1 border border-neutral-200 dark:border-neutral-800 flex-1 overflow-x-auto scrollbar-none touch-pan-x [-webkit-overflow-scrolling:touch]">
          {priorityItems.map((option) => {
            const isActive = priorityFilter === option.type;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => setPriorityFilter(option.type)}
                className={cn(
                  "relative flex-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 text-center rounded-lg text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] transition-colors duration-200 shrink-0 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap min-h-[32px] sm:min-h-[36px]",
                  isActive
                    ? cn(option.textColor, "font-semibold")
                    : "text-neutral-600 dark:text-neutral-400 font-medium hover:text-black dark:hover:text-white"
                )}
                title={`Filter: ${option.label}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className={cn(
                      "absolute inset-0 rounded-lg shadow-sm z-0",
                      option.pillBg
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 34,
                    }}
                  />
                )}
                <span className="relative z-10 sm:hidden">{option.shortLabel}</span>
                <span className="relative z-10 hidden sm:inline">{option.label}</span>
                <span
                  className={cn(
                    "relative z-10 text-[9.5px] sm:text-[10px] font-mono px-1 sm:px-1.5 py-0.2 rounded-full transition-colors duration-200",
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
