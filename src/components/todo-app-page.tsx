"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Trash2, ArrowLeft, Flame, Minimize2, Sparkles, Mail } from "lucide-react";
import { GitHub, LinkedIn } from "@/components/icons";
import { address } from "@/components/welcome-page";
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
import { UserProfileButton } from "@/components/auth/user-profile-button";
import { useAuth } from "@/components/auth/auth-provider";
import { Todo, PriorityType, PriorityFilterType } from "@/types/todo";

interface TodoAppPageProps {
  onBack?: () => void;
}

export function TodoAppPage({ onBack }: TodoAppPageProps) {
  const { user, loading: authLoading, openAuthModal, signOut } = useAuth();
  const storageKey = user ? `taskflow_todos_${user.id}` : "taskflow_todos_guest";

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [selectedPriority, setSelectedPriority] = useState<PriorityType>("urgent");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingTodo, setAddingTodo] = useState(false);
  const [openDatePopoverId, setOpenDatePopoverId] = useState<string | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // LocalStorage Helpers scoped per user
  const getLocalStorageTodos = useCallback((): Todo[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  const saveLocalStorageTodos = useCallback(
    (data: Todo[]) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    },
    [storageKey]
  );

  const fetchTodos = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    const localTodos = getLocalStorageTodos();

    try {
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTodos(data);
          saveLocalStorageTodos(data);
          return;
        }
      } else if (res.status === 401) {
        setTodos([]);
        saveLocalStorageTodos([]);
        await signOut();
        openAuthModal("signin");
        return;
      }
    } catch (error) {
      console.warn("API fetch failed, falling back to localStorage:", error);
    } finally {
      setLoading(false);
    }

    // Fallback to user-scoped local storage
    setTodos(localTodos);
  }, [user, authLoading, getLocalStorageTodos, saveLocalStorageTodos, signOut, openAuthModal]);

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
        setIsFocusMode(false);
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

    if (!user) {
      openAuthModal("signin");
      return;
    }

    setAddingTodo(true);

    const tempId = `task-${Date.now()}`;
    const newTodoItem: Todo = {
      id: tempId,
      title: titleText,
      completed: false,
      dueDate: newDate ? newDate.toISOString() : null,
      priority: selectedPriority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Optimistic Instant State & LocalStorage Update
    setTodos((prev) => {
      const next = [newTodoItem, ...prev];
      saveLocalStorageTodos(next);
      return next;
    });

    // Reset inputs and clear search to ensure immediate visibility
    setNewTitle("");
    setNewDate(undefined);
    if (searchQuery) setSearchQuery("");

    // 2. Background API Sync (if database is available)
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: titleText,
          dueDate: newDate?.toISOString(),
          priority: selectedPriority,
        }),
      });

      if (res.ok) {
        const serverTodo = await res.json();
        setTodos((prev) => {
          const updated = prev.map((t) => (t.id === tempId ? serverTodo : t));
          saveLocalStorageTodos(updated);
          return updated;
        });
      } else if (res.status === 401) {
        setTodos([]);
        saveLocalStorageTodos([]);
        await signOut();
        openAuthModal("signin");
        return;
      }
    } catch (error) {
      console.warn("DB sync unavailable, task preserved locally:", error);
    } finally {
      setAddingTodo(false);
    }
  };

  const updatePriority = async (id: string, priority: PriorityType) => {
    const optimisticTodos = todos.map((t) =>
      t.id === id ? { ...t, priority } : t
    );
    setTodos(optimisticTodos);
    saveLocalStorageTodos(optimisticTodos);

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
    } catch {
      // Local state is preserved
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

  // Filtered Todos by Priority and Search Query
  const filteredTodos = todos.filter((todo) => {
    if (priorityFilter !== "all" && (todo.priority || "medium") !== priorityFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!todo.title.toLowerCase().includes(q)) return false;
    }

    return true;
  });

  const totalTodos = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalTodos - completedCount;
  const urgentCount = todos.filter((t) => !t.completed && t.priority === "urgent").length;
  const highCount = todos.filter((t) => !t.completed && t.priority === "high").length;
  const mediumCount = todos.filter((t) => !t.completed && (t.priority === "medium" || !t.priority)).length;
  const lowCount = todos.filter((t) => !t.completed && t.priority === "low").length;

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

      {/* Floating Exit Focus Button (Visible when Focus Mode is active) */}
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex items-center gap-2"
        >
          <Button
            onClick={() => setIsFocusMode(false)}
            className="h-9 px-3.5 rounded-full bg-[#3bda71] dark:bg-[#3bda71] text-black dark:text-black border border-[#3bda71] dark:border-[#3bda71] text-[13px] leading-[18px] font-semibold shadow-xl hover:bg-[#34c666] dark:hover:bg-[#34c666] hover:scale-105 active:scale-95 transition-all gap-2 cursor-pointer"
            title="Exit Focus Mode (ESC)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-black dark:text-black stroke-[2.5]" />
            <span className="font-semibold text-black dark:text-black">Exit Focus</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[11px] leading-[14px] font-mono font-medium rounded bg-black/15 text-black dark:bg-black/20 dark:text-black">ESC</kbd>
          </Button>
        </motion.div>
      )}

      {/* Top Navigation Bar (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <header className="py-2.5 sm:py-4 px-3.5 sm:px-8 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2.5 sm:gap-3"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-[#3bda71] shrink-0">
                <img src="/logo.png" alt="TaskFlow Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[16px] sm:text-[20px] leading-[22px] sm:leading-[24px] font-semibold tracking-[-0.02em] text-black dark:text-white">
                    taskflow.
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] text-neutral-500 dark:text-neutral-400 font-normal">
                  {format(new Date(), "EEEE, MMM d")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-10 px-3 sm:px-3.5 rounded-xl text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Home</span>
                </Button>
              )}
              <UserProfileButton />
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center p-0 shrink-0">
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        </header>
      )}

      {/* Main App Workspace */}
      <main className={`flex-1 px-3 sm:px-6 ${isFocusMode ? "py-3 sm:py-6" : "py-3 sm:py-6"}`}>
        <div className={`mx-auto transition-all duration-300 ${isFocusMode ? "max-w-xl space-y-2.5 sm:space-y-3.5" : "max-w-2xl space-y-3 sm:space-y-4.5"}`}>

          {/* Header Section (Condensed 1-line bar in Focus Mode vs Full Hero in Normal Mode) */}
          {isFocusMode ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between py-1 border-b border-neutral-200/80 dark:border-neutral-800/80 pb-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3bda71] animate-pulse" />
                <h2 className="text-[16px] sm:text-[18px] leading-[22px] sm:leading-[24px] font-semibold text-black dark:text-white tracking-[-0.02em]">
                  Focus Workspace
                </h2>
              </div>
              <span className="text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-medium text-neutral-500 dark:text-neutral-400">
                {activeCount} active task{activeCount === 1 ? "" : "s"}
              </span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between pt-0.5"
            >
              <div className="space-y-0.5 sm:space-y-1 text-left">
                <h1 className="text-[22px] sm:text-[30px] leading-[28px] sm:leading-[38px] font-bold text-black dark:text-white tracking-[-0.02em] flex items-center gap-2">
                  <span>{getGreeting()}</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#3bda71] align-baseline" />
                </h1>
                <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-neutral-500 dark:text-neutral-400 font-normal">
                  Clean overview of your daily focus and targets.
                </p>
              </div>

              {completedCount > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#3bda71]/15 border border-[#3bda71]/30 text-[12px] sm:text-[13px] leading-[16px] sm:leading-[18px] font-medium text-black dark:text-[#3bda71] shrink-0">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3bda71] fill-[#3bda71]" />
                  <span>{completedCount} Done</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Unauthenticated Cloud Workspace Banner */}
          {!user && !authLoading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 sm:p-4 rounded-2xl bg-[#3bda71]/10 border border-[#3bda71]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#3bda71] text-black flex items-center justify-center shrink-0 shadow-sm font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] font-semibold text-black dark:text-white">
                    Private Cloud Workspace
                  </p>
                  <p className="text-[11px] sm:text-[12px] leading-[14px] sm:leading-[16px] text-neutral-600 dark:text-neutral-400">
                    Sign in to sync your tasks across your devices and keep them strictly private.
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => openAuthModal("signin")}
                className="h-8 px-3.5 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black text-[12px] leading-[16px] font-semibold shadow-sm shrink-0 cursor-pointer self-start sm:self-auto"
              >
                Sign In / Register
              </Button>
            </motion.div>
          )}

          {/* Add Todo Section */}
          <TodoAddForm
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newDate={newDate}
            setNewDate={setNewDate}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            onAddTodo={addTodo}
            addingTodo={addingTodo}
            titleInputRef={titleInputRef}
            isFocusMode={isFocusMode}
          />

          {/* Live Search Bar */}
          <TodoSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchInputRef={searchInputRef}
          />

          {/* Color-Themed Priority Stats & Selector */}
          <TodoStatsFilters
            totalTodos={totalTodos}
            completedCount={completedCount}
            urgentCount={urgentCount}
            highCount={highCount}
            mediumCount={mediumCount}
            lowCount={lowCount}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
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
            priorityFilter={priorityFilter}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdateDueDate={updateDueDate}
            onUpdatePriority={updatePriority}
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
                className="h-8 px-4 rounded-lg text-[13px] leading-[18px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#3bda71]/15 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all shadow-sm"
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
        <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black py-4 sm:py-5">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-[12px] leading-[16px] font-normal text-neutral-400 dark:text-neutral-500">
              <span className="hidden sm:inline">
                TaskFlow &bull; Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border text-[11px] font-mono font-medium">?</kbd> for Keyboard Shortcuts
              </span>
              <span className="sm:hidden">
                TaskFlow &bull; Tap task to toggle status
              </span>
            </p>
            <div className="flex items-center gap-2">
              <a
                href={address.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                title="GitHub"
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <GitHub className="w-3.5 h-3.5" />
              </a>
              <a
                href={address.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <LinkedIn className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${address.email}`}
                aria-label="Send Email"
                title="Email"
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#3bda71] bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-[#3bda71]/50 hover:bg-[#3bda71]/10 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
