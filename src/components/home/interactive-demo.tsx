"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Filter, MousePointerClick, RefreshCw, Tag, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoTask {
  id: string;
  title: string;
  category: "Work" | "Personal" | "Urgent";
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

export function InteractiveDemo({ onGetStarted }: { onGetStarted: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [inputVal, setInputVal] = useState("");
  const [tasks, setTasks] = useState<DemoTask[]>([
    { id: "1", title: "Review Q3 product roadmap & milestones", category: "Work", completed: false, priority: "High" },
    { id: "2", title: "Refactor task state manager for 60fps rendering", category: "Work", completed: true, priority: "High" },
    { id: "3", title: "Daily 15-min mindfulness session", category: "Personal", completed: false, priority: "Low" },
    { id: "4", title: "Fix production memory leak on edge route", category: "Urgent", completed: false, priority: "High" },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const newTask: DemoTask = {
      id: Date.now().toString(),
      title: inputVal.trim(),
      category: "Work",
      completed: false,
      priority: "Medium",
    };
    setTasks([newTask, ...tasks]);
    setInputVal("");
  };

  const resetDemo = () => {
    setTasks([
      { id: "1", title: "Review Q3 product roadmap & milestones", category: "Work", completed: false, priority: "High" },
      { id: "2", title: "Refactor task state manager for 60fps rendering", category: "Work", completed: true, priority: "High" },
      { id: "3", title: "Daily 15-min mindfulness session", category: "Personal", completed: false, priority: "Low" },
      { id: "4", title: "Fix production memory leak on edge route", category: "Urgent", completed: false, priority: "High" },
    ]);
  };

  const filteredTasks = tasks.filter((t) =>
    activeCategory === "All" ? true : t.category === activeCategory
  );

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3bda71]/10 border border-[#3bda71]/25 text-[11px] font-semibold tracking-wider text-[#3bda71] uppercase">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>Interactive Sandbox</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
          Experience <span className="text-[#3bda71]">The Flow</span> Live
        </h2>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          Try out the interactive workspace right here. Click to check off tasks, filter categories, or add new items.
        </p>
      </div>

      {/* Interactive Window Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-2xl overflow-hidden max-w-3xl mx-auto"
      >
        {/* Mock Window Topbar */}
        <div className="px-5 py-3.5 bg-slate-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 ml-2">taskflow-demo.app</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {completedCount} / {tasks.length} Done
            </span>
            <button
              onClick={resetDemo}
              title="Reset Sandbox"
              className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Demo App Body */}
        <div className="p-5 sm:p-7 space-y-6">

          {/* Add Task Input Form */}
          <form onSubmit={handleAddTask} className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Add a new task (e.g. Design sleek landing hero...)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#3bda71]"
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 px-4 rounded-xl bg-[#3bda71] hover:bg-[#34c666] text-black font-bold gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-neutral-400 mr-1 flex-shrink-0" />
            {["All", "Work", "Personal", "Urgent"].map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                    active
                      ? "bg-[#3bda71] text-black shadow-sm"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Task List */}
          <div className="space-y-2.5 min-h-[220px]">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96, height: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => toggleTask(task.id)}
                  className={`group p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    task.completed
                      ? "bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200/60 dark:border-neutral-800/50 opacity-60"
                      : "bg-white dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700/70 hover:border-[#3bda71]/50 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        task.completed
                          ? "bg-[#3bda71] border-[#3bda71] text-black"
                          : "border-neutral-300 dark:border-neutral-600 group-hover:border-[#3bda71]"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium truncate ${
                        task.completed
                          ? "line-through text-neutral-400 dark:text-neutral-500"
                          : "text-black dark:text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        task.priority === "High"
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                          : task.priority === "Medium"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline-block">
                      #{task.category.toLowerCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <div className="py-10 text-center text-xs text-neutral-400 font-normal">
                No tasks found in this category.
              </div>
            )}
          </div>

          {/* Sandbox Footer CTA */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Ready for the full experience with full offline persistence?
            </span>
            <Button
              onClick={onGetStarted}
              size="sm"
              className="px-5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              Open Full App
            </Button>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
