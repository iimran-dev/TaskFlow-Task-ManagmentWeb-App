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
  const filterOptions: { type: FilterType; label: string }[] = [
    { type: "all", label: "All Tasks" },
    { type: "active", label: "Active" },
    { type: "completed", label: "Completed" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="space-y-4"
    >
      {/* High Impact Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 sm:p-4 text-left shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
            <Layers className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-base sm:text-2xl font-bold text-black dark:text-white leading-none sm:leading-tight font-mono">
              {totalTodos}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5 sm:mt-0">
              Total
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 sm:p-4 text-left shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-[#3bda71]/15 flex items-center justify-center text-[#3bda71] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-base sm:text-2xl font-bold text-[#3bda71] leading-none sm:leading-tight font-mono">
              {completedCount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#3bda71]/80 uppercase tracking-wider mt-0.5 sm:mt-0">
              Done
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 sm:p-4 text-left shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-black dark:text-white shrink-0">
            <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2]" />
          </div>
          <div>
            <div className="text-base sm:text-2xl font-bold text-black dark:text-white leading-none sm:leading-tight font-mono">
              {activeCount}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mt-0.5 sm:mt-0">
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Pill Bar & Workspace Controls */}
      <div className="w-full flex flex-col sm:flex-row items-center gap-2">
        <div className="w-full flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl gap-1 border border-neutral-200 dark:border-neutral-800 flex-1">
          {filterOptions.map((option) => {
            const isActive = filter === option.type;
            return (
              <button
                key={option.type}
                onClick={() => setFilter(option.type)}
                className={cn(
                  "relative flex-1 py-1.5 sm:py-2 text-center rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 z-10 truncate",
                  isActive
                    ? "text-black font-semibold"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-[#3bda71] rounded-lg shadow-sm -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="sm:hidden">
                  {option.type === "all" ? "All" : option.type === "active" ? "Active" : "Completed"}
                </span>
                <span className="hidden sm:inline">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Focus Mode & Hotkeys trigger */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          {onToggleFocusMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFocusMode}
              className={cn(
                "h-9 px-3 rounded-xl text-xs font-semibold gap-1.5 border transition-all",
                isFocusMode
                  ? "bg-[#3bda71] text-black border-[#3bda71] shadow-sm"
                  : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              )}
            >
              {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFocusMode ? "Exit Focus" : "Focus Mode"}</span>
            </Button>
          )}

          {onOpenShortcuts && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenShortcuts}
              className="h-9 px-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
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
