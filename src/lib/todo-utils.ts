import { format, isToday, isTomorrow, isPast } from "date-fns";

export function getDueDateLabel(dateStr: string | null): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (!dateStr) return { label: "No date", variant: "secondary" };

  const date = new Date(dateStr);
  const formatted = format(date, "MMM d, yyyy");

  if (isToday(date)) return { label: `Today`, variant: "default" };
  if (isTomorrow(date)) return { label: `Tomorrow`, variant: "default" };
  if (isPast(date)) return { label: `${formatted} (overdue)`, variant: "destructive" };
  return { label: formatted, variant: "outline" };
}
