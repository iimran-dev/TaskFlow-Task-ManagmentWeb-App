"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, Flame, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TodoAddForm } from "@/components/todo/todo-add-form";
import { TodoStatsFilters } from "@/components/todo/todo-stats-filters";
import { TodoProgress } from "@/components/todo/todo-progress";
import { TodoList } from "@/components/todo/todo-list";
import { TodoSearchBar } from "@/components/todo/todo-search-bar";
import { KeyboardShortcutsModal } from "@/components/todo/keyboard-shortcuts-modal";
import { Todo, FilterType, CategoryType } from "@/types/todo";

interface TodoAppPageProps {
  onBack?: () => void;
}

const STORAGE_KEY = "taskflow_todos_local_v2";

export function TodoAppPage({ onBack }: TodoAppPageProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [loading, setLoading] = useState(true);
  const [addingTodo, setAddingTodo] = useState(false);
  const [openDatePopoverId, setOpenDatePopoverId] = useState<string | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Helpers
  const getLocalStorageTodos = (): Todo[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveLocalStorageTodos = (data: Todo[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  };

  const fetchTodos = useCallback(async () => {
    const localTodos = getLocalStorageTodos();

    try {
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTodos(data);
          saveLocalStorageTodos(data);
          return;
        }
      }
    } catch (error) {
      console.warn("API fetch failed, falling back to localStorage:", error);
    } finally {
      setLoading(false);
    }

    // Fallback to local storage
    setTodos(localTodos);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        titleInputRef.current?.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "?" && !isInput) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsShortcutsOpen(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerConfetti = (fullCelebration = false) => {
    if (fullCelebration) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3bda71", "#ffffff", "#000000"],
      });
    } else {
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.7 },
        colors: ["#3bda71", "#000000"],
      });
    }
  };

  const addTodo = async () => {
    const titleText = newTitle.trim();
    if (!titleText) return;

    setAddingTodo(true);

    const tempId = `task-${Date.now()}`;
    const newTodoItem: Todo = {
      id: tempId,
      title: titleText,
      completed: false,
      dueDate: newDate ? newDate.toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Optimistic Instant State & LocalStorage Update
    setTodos((prev) => {
      const next = [newTodoItem, ...prev];
      saveLocalStorageTodos(next);
      return next;
    });

    // Reset inputs and clear filter to ensure immediate visibility
    setNewTitle("");
    setNewDate(undefined);
    if (filter === "completed") setFilter("all");
    if (searchQuery) setSearchQuery("");

    // 2. Background API Sync (if database is available)
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleText, dueDate: newDate?.toISOString() }),
      });

      if (res.ok) {
        const serverTodo = await res.json();
        setTodos((prev) => {
          const updated = prev.map((t) => (t.id === tempId ? serverTodo : t));
          saveLocalStorageTodos(updated);
          return updated;
        });
      }
    } catch (error) {
      console.warn("DB sync unavailable, task preserved locally:", error);
    } finally {
      setAddingTodo(false);
    }
  };

  const toggleTodo = async (id: string, currentCompletedStatus: boolean) => {
    const nextCompletedStatus = !currentCompletedStatus;

    // Optimistic UI & LocalStorage update
    const optimisticTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: nextCompletedStatus } : t
    );
    setTodos(optimisticTodos);
    saveLocalStorageTodos(optimisticTodos);

    if (nextCompletedStatus) {
      const remainingActive = optimisticTodos.filter((t) => !t.completed).length;
      triggerConfetti(remainingActive === 0);
    }

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompletedStatus }),
      });
    } catch {
      // Local state is preserved
    }
  };

  const deleteTodo = async (id: string) => {
    const optimisticTodos = todos.filter((t) => t.id !== id);
    setTodos(optimisticTodos);
    saveLocalStorageTodos(optimisticTodos);

    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch {
      // Local state is preserved
    }
  };

  const updateDueDate = async (id: string, dueDate: Date | undefined) => {
    const optimisticTodos = todos.map((t) =>
      t.id === id
        ? { ...t, dueDate: dueDate ? dueDate.toISOString() : null }
        : t
    );
    setTodos(optimisticTodos);
    saveLocalStorageTodos(optimisticTodos);

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: dueDate ? dueDate.toISOString() : null }),
      });
    } catch {
      // Local state is preserved
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed);
    const activeTodos = todos.filter((t) => !t.completed);

    setTodos(activeTodos);
    saveLocalStorageTodos(activeTodos);

    await Promise.all(
      completedTodos.map((t) =>
        fetch(`/api/todos/${t.id}`, { method: "DELETE" }).catch(() => {})
      )
    );
  };

  // Filtered Todos by Status, Search Query, and Category
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!todo.title.toLowerCase().includes(q)) return false;
    }

    if (selectedCategory !== "all") {
      if (todo.category !== selectedCategory) return false;
    }

    return true;
  });

  const totalTodos = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalTodos - completedCount;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black selection:bg-[#3bda71] selection:text-black font-sans transition-colors duration-300">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Top Navigation Bar (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <header className="py-4 px-6 sm:px-8 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-[#3bda71]">
                <img src="/logo.png" alt="TaskFlow Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white">
                    TaskFlow
                  </h1>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-normal">
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-11 px-3 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Button>
              )}
              <div className="p-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        </header>
      )}

      {/* Main App Workspace */}
      <main className={`flex-1 px-4 sm:px-6 ${isFocusMode ? "py-10" : "py-6 sm:py-8"}`}>
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">

          {/* Greeting Hero & Daily Streak Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between pt-1"
          >
            <div className="space-y-1 text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
                <span>{getGreeting()}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#3bda71] align-baseline" />
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                {isFocusMode ? "Focus Mode Active • Distractions minimized" : "Clean overview of your daily focus and targets."}
              </p>
            </div>

            {completedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3bda71]/15 border border-[#3bda71]/30 text-xs font-bold text-black dark:text-[#3bda71] shrink-0">
                <Flame className="w-4 h-4 text-[#3bda71] fill-[#3bda71]" />
                <span>{completedCount} Done</span>
              </div>
            )}
          </motion.div>

          {/* Add Todo Section */}
          <TodoAddForm
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newDate={newDate}
            setNewDate={setNewDate}
            onAddTodo={addTodo}
            addingTodo={addingTodo}
            titleInputRef={titleInputRef}
          />

          {/* Live Search Bar */}
          <TodoSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchInputRef={searchInputRef}
          />

          {/* Stats & Filters */}
          <TodoStatsFilters
            totalTodos={totalTodos}
            completedCount={completedCount}
            activeCount={activeCount}
            filter={filter}
            setFilter={setFilter}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            isFocusMode={isFocusMode}
            onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
          />

          {/* Progress Bar */}
          <TodoProgress totalTodos={totalTodos} completedCount={completedCount} />

          {/* Todo List */}
          <TodoList
            todos={filteredTodos}
            loading={loading}
            filter={filter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdateDueDate={updateDueDate}
            openDatePopoverId={openDatePopoverId}
            setOpenDatePopoverId={setOpenDatePopoverId}
          />

          {/* Bulk Clear Action */}
          {completedCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center pt-2"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-4 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#3bda71]/15 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all shadow-sm"
                onClick={clearCompleted}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                Clear {completedCount} completed {completedCount === 1 ? "task" : "tasks"}
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      {!isFocusMode && (
        <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black py-5 text-center">
          <p className="text-xs font-normal text-neutral-400 dark:text-neutral-500 tracking-wide">
            TaskFlow &bull; Press <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border font-mono">?</kbd> for Keyboard Shortcuts
          </p>
        </footer>
      )}
    </div>
  );
}
