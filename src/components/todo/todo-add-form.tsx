"use client";

import { motion } from "framer-motion";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TaskPresets } from "@/components/todo/task-presets";

interface TodoAddFormProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDate: Date | undefined;
  setNewDate: (date: Date | undefined) => void;
  onAddTodo: () => void;
  addingTodo: boolean;
  titleInputRef?: React.RefObject<HTMLInputElement | null>;
  isFocusMode?: boolean;
}

export function TodoAddForm({
  newTitle,
  setNewTitle,
  newDate,
  setNewDate,
  onAddTodo,
  addingTodo,
  titleInputRef,
  isFocusMode,
}: TodoAddFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onAddTodo();
  };

  const handleSelectPreset = (title: string) => {
    setNewTitle(title);
    if (titleInputRef?.current) {
      titleInputRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative group space-y-2.5"
    >
      <div className={`bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all group-hover:border-[#3bda71] ${isFocusMode ? "p-3 sm:p-4 space-y-2.5" : "p-4 sm:p-5 space-y-3.5"}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              ref={titleInputRef}
              placeholder="What needs to be accomplished? (⌘N)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12 pl-4 pr-12 rounded-xl border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white text-base font-normal focus-visible:ring-2 focus-visible:ring-[#3bda71] transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              disabled={addingTodo}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] font-medium text-neutral-400 dark:text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-2 py-0.5 rounded-md pointer-events-none">
              ↵ Enter
            </div>
          </div>
          <Button
            onClick={onAddTodo}
            disabled={!newTitle.trim() || addingTodo}
            className="h-12 px-6 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black shadow-sm text-sm font-semibold gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 shrink-0 border-0 cursor-pointer"
          >
            {addingTodo ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              />
            ) : (
              <>
                <Plus className="w-5 h-5 stroke-[2.5]" />
                <span>Add Task</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-[#3bda71] hover:text-[#3bda71] dark:hover:text-[#3bda71] bg-neutral-50 dark:bg-neutral-950 transition-colors cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-[#3bda71]" />
                  {newDate ? format(newDate, "MMM d, yyyy") : "Set Due Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 rounded-xl border-neutral-200 dark:border-neutral-800 shadow-xl" align="start">
                <div className="flex items-center justify-between pb-2 mb-1 border-b border-neutral-100 dark:border-neutral-800 px-1 text-xs">
                  <span className="font-medium text-neutral-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3bda71] animate-pulse" />
                    Today: <strong className="text-black dark:text-white font-bold">{format(new Date(), "MMM d")}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[11px] font-semibold text-[#3bda71] hover:bg-[#3bda71]/15 rounded-md cursor-pointer"
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
                className="h-8 text-xs text-neutral-400 hover:text-red-500 font-normal cursor-pointer"
                onClick={() => setNewDate(undefined)}
              >
                Clear date
              </Button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-normal">
            <span className="w-2 h-2 rounded-full bg-[#3bda71]" />
            <span>Optimistic Sync</span>
          </div>
        </div>

        {/* Task Presets Chips (Hidden in Focus Mode for maximum conciseness) */}
        {!isFocusMode && <TaskPresets onSelectPreset={handleSelectPreset} />}
      </div>
    </motion.div>
  );
}
