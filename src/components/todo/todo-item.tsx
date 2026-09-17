"use client";

import { motion } from "framer-motion";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getDueDateLabel } from "@/lib/todo-utils";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: Date | undefined) => void;
  isOpenDatePopover: boolean;
  setOpenDatePopover: (open: boolean) => void;
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdateDueDate,
  isOpenDatePopover,
  setOpenDatePopover,
}: TodoItemProps) {
  const { label, variant } = getDueDateLabel(todo.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -60, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className={cn(
        "group relative bg-white dark:bg-neutral-900 rounded-xl border p-4 flex items-center gap-3.5 transition-all duration-200 shadow-sm",
        todo.completed
          ? "border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/40 opacity-70"
          : "border-neutral-200 dark:border-neutral-800 hover:border-[#3bda71]"
      )}
    >
      {/* Checkbox */}
      <div className="shrink-0">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id, todo.completed)}
          className={cn(
            "w-5 h-5 rounded-md transition-all duration-200 flex items-center justify-center border-2",
            todo.completed
              ? "data-[state=checked]:bg-[#3bda71] data-[state=checked]:text-black data-[state=checked]:border-[#3bda71]"
              : "border-neutral-300 dark:border-neutral-700 hover:border-[#3bda71]"
          )}
        />
      </div>

      {/* Title & Tags */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <span
          className={cn(
            "text-[16px] leading-[24px] font-medium transition-all duration-200 block truncate",
            todo.completed
              ? "text-neutral-400 dark:text-neutral-500 line-through decoration-neutral-400 decoration-1"
              : "text-black dark:text-white"
          )}
        >
          {todo.title}
        </span>

        {(todo.priority || todo.category) && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {todo.priority && (
              <span
                className={cn(
                  "text-[11px] leading-[14px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-[0.04em]",
                  todo.priority === "high"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    : todo.priority === "medium"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                )}
              >
                {todo.priority}
              </span>
            )}
            {todo.category && (
              <span className="text-[12px] leading-[16px] text-neutral-400 font-normal">
                #{todo.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-2 shrink-0">
        <Popover open={isOpenDatePopover} onOpenChange={setOpenDatePopover}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2.5 text-[13px] leading-[18px] font-medium rounded-lg gap-1.5 transition-colors border cursor-pointer",
                variant === "destructive"
                  ? "text-red-500 bg-red-500/10 border-red-500/20"
                  : variant === "default"
                    ? "text-[#3bda71] bg-[#3bda71]/10 border-[#3bda71]/30"
                    : "text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-[#3bda71]"
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 rounded-xl border-neutral-200 dark:border-neutral-800 shadow-xl" align="end">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-neutral-100 dark:border-neutral-800 px-1 text-[12px] leading-[16px]">
              <span className="font-normal text-neutral-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3bda71] animate-pulse" />
                Today: <strong className="text-black dark:text-white font-semibold">{format(new Date(), "MMM d")}</strong>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[12px] leading-[16px] font-medium text-[#3bda71] hover:bg-[#3bda71]/15 rounded-md cursor-pointer"
                onClick={() => {
                  onUpdateDueDate(todo.id, new Date());
                  setOpenDatePopover(false);
                }}
              >
                Set Today
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={todo.dueDate ? new Date(todo.dueDate) : undefined}
              onSelect={(date) => {
                onUpdateDueDate(todo.id, date);
                setOpenDatePopover(false);
              }}
              className="rounded-xl"
            />
            {todo.dueDate && (
              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-[12px] leading-[16px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium cursor-pointer"
                  onClick={() => {
                    onUpdateDueDate(todo.id, undefined);
                    setOpenDatePopover(false);
                  }}
                >
                  Clear date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="h-8 w-8 p-0 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
