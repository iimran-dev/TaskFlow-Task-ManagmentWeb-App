"use client";

import { PriorityType, PRIORITY_CONFIGS } from "@/types/todo";
import { cn } from "@/lib/utils";

interface TaskPresetsProps {
  onSelectPreset: (title: string, priority?: PriorityType) => void;
}

export function TaskPresets({ onSelectPreset }: TaskPresetsProps) {
  const presets: { label: string; title: string; priority: PriorityType }[] = [
    { label: "🔴 Immediate Fix", title: "Resolve critical blocker immediately", priority: "urgent" },
    { label: "🟠 Deep Work 45m", title: "45-min Deep Focus Session", priority: "high" },
    { label: "🟠 Code Review", title: "Review pending PRs & code changes", priority: "high" },
    { label: "🔵 Team Standup", title: "Daily async status & blockers sync", priority: "medium" },
    { label: "🟢 Daily Habit", title: "Daily health & focus routine", priority: "low" },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none -mx-1 px-1 touch-pan-x scroll-smooth [-webkit-overflow-scrolling:touch] [mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-24px),transparent_100%)]">
      <span className="text-neutral-400 dark:text-neutral-500 text-[11px] sm:text-[12px] font-medium shrink-0 pr-0.5">
        Quick:
      </span>
      {presets.map((p, idx) => {
        const conf = PRIORITY_CONFIGS[p.priority];
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(p.title, p.priority)}
            className={cn(
              "px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 text-neutral-600 dark:text-neutral-300 text-[11px] sm:text-[12px] font-medium transition-all shrink-0 cursor-pointer active:scale-95 flex items-center gap-1",
              conf.chipClass
            )}
          >
            <span>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
