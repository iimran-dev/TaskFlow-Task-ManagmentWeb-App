"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { TodoItem } from "@/components/todo/todo-item";
import { Todo, PriorityType, PriorityFilterType, PRIORITY_CONFIGS } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  priorityFilter?: PriorityFilterType;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdateDueDate: (id: string, dueDate: Date | undefined) => void;
  onUpdatePriority?: (id: string, priority: PriorityType) => void;
  openDatePopoverId: string | null;
  setOpenDatePopoverId: (id: string | null) => void;
}

export function TodoList({
  todos,
  loading,
  priorityFilter = "all",
  onToggle,
  onDelete,
  onUpdateDueDate,
  onUpdatePriority,
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

  const filterLabel =
    priorityFilter !== "all"
      ? PRIORITY_CONFIGS[priorityFilter]?.label
      : null;

  return (
    <div className="space-y-3 min-h-[80px]">
      <AnimatePresence mode="popLayout" initial={false}>
        {todos.length === 0 ? (
          <motion.div
            key={`empty-${priorityFilter}`}
            layout
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 p-8 sm:p-10 text-center shadow-sm"
          >
            <h3 className="text-[18px] sm:text-[20px] leading-[26px] sm:leading-[28px] font-semibold text-black dark:text-white mb-2">
              {filterLabel
                ? `No ${filterLabel} tasks found`
                : "No tasks on your radar"}
            </h3>
            <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto font-normal">
              {filterLabel
                ? `You don't have any tasks marked as ${filterLabel.toLowerCase()}.`
                : "Add your first task above to start building momentum!"}
            </p>
          </motion.div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdateDueDate={onUpdateDueDate}
              onUpdatePriority={onUpdatePriority}
              isOpenDatePopover={openDatePopoverId === todo.id}
              setOpenDatePopover={(open) =>
                setOpenDatePopoverId(open ? todo.id : null)
              }
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
