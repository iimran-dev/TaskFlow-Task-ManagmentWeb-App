"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PriorityType, CategoryType } from "@/types/todo";

interface TaskPresetsProps {
  onSelectPreset: (title: string, priority?: PriorityType, category?: CategoryType) => void;
}

export function TaskPresets({ onSelectPreset }: TaskPresetsProps) {
  const presets: { label: string; title: string; priority: PriorityType; category: CategoryType }[] = [
    { label: "+ Deep Work 45m", title: "45-min Deep Focus Session", priority: "high", category: "work" },
    { label: "+ Code Review", title: "Review pending PRs & code changes", priority: "high", category: "work" },
    { label: "+ Team Standup", title: "Daily async status & blockers sync", priority: "medium", category: "work" },
    { label: "+ Personal Goal", title: "Daily mindfulness & health goal", priority: "low", category: "personal" },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
      <span className="text-neutral-400 font-medium shrink-0 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-[#3bda71]" />
        Presets:
      </span>
      {presets.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPreset(p.title, p.priority, p.category)}
          className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 text-neutral-700 dark:text-neutral-300 font-medium hover:border-[#3bda71] hover:text-[#3bda71] dark:hover:text-[#3bda71] transition-all shrink-0"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
