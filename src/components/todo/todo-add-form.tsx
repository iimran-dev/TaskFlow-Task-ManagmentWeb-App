"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, CalendarIcon, Minimize2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PriorityType, PRIORITY_CONFIGS } from "@/types/todo";
import { cn } from "@/lib/utils";

interface TodoAddFormProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDate: Date | undefined;
  setNewDate: (date: Date | undefined) => void;
  selectedPriority: PriorityType;
  setSelectedPriority: (p: PriorityType) => void;
  onAddTodo: () => void;
  addingTodo: boolean;
  titleInputRef?: React.RefObject<HTMLInputElement | null>;
  isFocusMode?: boolean;
  onExitFocus?: () => void;
}

export function TodoAddForm({
  newTitle,
  setNewTitle,
  newDate,
  setNewDate,
  selectedPriority,
  setSelectedPriority,
  onAddTodo,
  addingTodo,
  titleInputRef,
  isFocusMode,
  onExitFocus,
}: TodoAddFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onAddTodo();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative group space-y-2.5"
    >
      <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm group-hover:border-[#3bda71] p-3 sm:p-4.5 space-y-2.5 sm:space-y-3 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Input
              ref={titleInputRef}
              placeholder="What needs to be accomplished?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 sm:h-12 pl-3.5 sm:pl-4 pr-3 sm:pr-12 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white text-[16px] sm:text-[15px] leading-[22px] sm:leading-[24px] font-normal focus-visible:ring-2 focus-visible:ring-[#3bda71] transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 placeholder:text-[14px] sm:placeholder:text-[15px] placeholder:font-normal"
              disabled={addingTodo}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] leading-[14px] font-medium tracking-[0.04em] text-neutral-400 dark:text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-2 py-0.5 rounded-md pointer-events-none">
              ↵ Enter
            </div>
          </div>
          <Button
            onClick={onAddTodo}
            disabled={!newTitle.trim() || addingTodo}
            className="h-11 sm:h-12 w-11 sm:w-auto px-0 sm:px-6 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black shadow-sm text-[15px] leading-[22px] font-semibold sm:font-medium gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 shrink-0 border-0 cursor-pointer flex items-center justify-center"
            title="Add Task"
          >
            {addingTodo ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full"
              />
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Task</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-wrap sm:flex-nowrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg text-[11px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-[#3bda71] hover:text-[#3bda71] dark:hover:text-[#3bda71] bg-neutral-50 dark:bg-neutral-950 transition-colors cursor-pointer shrink-0"
                >
                  <CalendarIcon className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-[#3bda71]" />
                  <span className="hidden sm:inline">{newDate ? format(newDate, "MMM d, yyyy") : "Set Due Date"}</span>
                  <span className="sm:hidden">{newDate ? format(newDate, "MMM d") : "Due Date"}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 rounded-xl border-neutral-200 dark:border-neutral-800 shadow-xl" align="start">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-neutral-100 dark:border-neutral-800 px-1 text-[12px] leading-[16px]">
                  <span className="font-normal text-neutral-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3bda71] animate-pulse" />
                    Today: <strong className="text-black dark:text-white font-semibold">{format(new Date(), "MMM d")}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[12px] leading-[16px] font-medium text-[#3bda71] hover:bg-[#3bda71]/15 rounded-md cursor-pointer"
                    onClick={() => setNewDate(new Date())}
                  >
                    Set Today
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
            {newDate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 sm:h-8 text-[11px] sm:text-[12px] leading-[16px] text-neutral-400 hover:text-red-500 font-normal cursor-pointer px-1.5 shrink-0"
                onClick={() => setNewDate(undefined)}
              >
                Clear
              </Button>
            )}

            {/* Priority Selector Pills */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800/80 shrink-0">
              {(["high", "medium", "low"] as PriorityType[]).map((p) => {
                const conf = PRIORITY_CONFIGS[p];
                const isSelected = selectedPriority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPriority(p)}
                    className={cn(
                      "px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-[12px] leading-[14px] font-semibold transition-all cursor-pointer text-center",
                      isSelected
                        ? conf.badgeClass + " shadow-xs border"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 border border-transparent"
                    )}
                    title={conf.label}
                  >
                    <span>{conf.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right slot: on mobile in focus mode, show Exit Focus button directly below Add button */}
          <AnimatePresence>
            {isFocusMode && onExitFocus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 5 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="sm:hidden shrink-0"
              >
                <Button
                  type="button"
                  size="sm"
                  onClick={onExitFocus}
                  className="h-7.5 px-2.5 rounded-lg bg-[#3bda71] hover:bg-[#34c666] text-black font-semibold text-[11px] leading-[14px] flex items-center gap-1.5 border-0 cursor-pointer shadow-xs transition-all active:scale-95"
                  title="Exit Focus Mode"
                >
                  <Minimize2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Exit Focus</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden sm:flex items-center gap-1.5 text-[12px] leading-[16px] text-neutral-400 dark:text-neutral-500 font-normal shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#3bda71]" />
            <span>Optimistic Sync</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
