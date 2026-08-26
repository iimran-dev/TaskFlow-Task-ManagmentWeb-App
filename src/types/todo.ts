export type PriorityType = "high" | "medium" | "low";
export type CategoryType = "all" | "work" | "personal" | "urgent";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  priority?: PriorityType;
  category?: CategoryType;
}

export type FilterType = "all" | "active" | "completed";
