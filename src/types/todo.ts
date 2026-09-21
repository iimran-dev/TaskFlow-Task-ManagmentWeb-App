export type PriorityType = "urgent" | "high" | "medium" | "low";
export type PriorityFilterType = "all" | PriorityType;

export interface PriorityConfig {
  value: PriorityType;
  label: string;
  shortLabel: string;
  dotColor: string;
  badgeClass: string;
  cardBorderClass: string;
  chipClass: string;
}

export const PRIORITY_CONFIGS: Record<PriorityType, PriorityConfig> = {
  urgent: {
    value: "urgent",
    label: "Immediate Action",
    shortLabel: "Immediate",
    dotColor: "bg-red-500",
    badgeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    cardBorderClass: "border-l-4 border-l-red-500",
    chipClass: "hover:bg-red-500/15 hover:text-red-600 hover:border-red-500/30",
  },
  high: {
    value: "high",
    label: "High Priority",
    shortLabel: "High",
    dotColor: "bg-amber-500",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    cardBorderClass: "border-l-4 border-l-amber-500",
    chipClass: "hover:bg-amber-500/15 hover:text-amber-600 hover:border-amber-500/30",
  },
  medium: {
    value: "medium",
    label: "Medium Priority",
    shortLabel: "Medium",
    dotColor: "bg-blue-500",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    cardBorderClass: "border-l-4 border-l-blue-500",
    chipClass: "hover:bg-blue-500/15 hover:text-blue-600 hover:border-blue-500/30",
  },
  low: {
    value: "low",
    label: "Low Priority",
    shortLabel: "Low",
    dotColor: "bg-emerald-500",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    cardBorderClass: "border-l-4 border-l-emerald-500",
    chipClass: "hover:bg-emerald-500/15 hover:text-emerald-600 hover:border-emerald-500/30",
  },
};

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  priority?: PriorityType;
}
