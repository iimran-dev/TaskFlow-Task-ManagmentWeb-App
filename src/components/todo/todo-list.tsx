"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoItem } from "@/components/todo/todo-item";
import { Todo, FilterType } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  filter: FilterType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: Date | undefined) => void;
  openDatePopoverId: string | null;
  setOpenDatePopoverId: (id: string | null) => void;
}

export function TodoList({
  todos,
  loading,
  filter,
  onToggle,
  onDelete,
  onUpdateDueDate,
  openDatePopoverId,
  setOpenDatePopoverId,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4"
          >
            <Skeleton className="w-6 h-6 rounded-md" />
            <Skeleton className="h-5 flex-1 rounded-md" />
            <Skeleton className="w-24 h-7 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-10 text-center shadow-sm"
      >
        <h3 className="text-[20px] leading-[28px] font-semibold text-black dark:text-white mb-2">
          {filter === "all"
            ? "No tasks on your radar"
            : filter === "active"
              ? "All active tasks completed"
              : "No completed tasks yet"}
        </h3>
        <p className="text-[14px] leading-[20px] text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto font-normal">
          {filter === "all"
            ? "Add your first task above to start building momentum!"
            : filter === "active"
              ? "Awesome job! You've checked off everything on your active list."
              : "Finish some tasks and watch your completed history grow."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdateDueDate={onUpdateDueDate}
            isOpenDatePopover={openDatePopoverId === todo.id}
            setOpenDatePopover={(open) =>
              setOpenDatePopoverId(open ? todo.id : null)
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
