import { Badge } from "@/components/ui/badge";

type UiStatus = "to-do" | "in-progress" | "done";

function normalizeStatus(raw: string): UiStatus {
  const s = raw.toLowerCase().trim();

  if (s === "done" || s === "completed") return "done";
  if (s === "in-progress" || s === "in progress") return "in-progress";

  if (s === "to-do" || s === "todo" || s === "to do" || s === "pending")
    return "to-do";

  return "to-do";
}

export function TaskStatusBadge({ status }: { status: string }) {
  const st = normalizeStatus(status);

  const styles: Record<UiStatus, string> = {
    "to-do": "bg-muted text-muted-foreground",
    "in-progress": "bg-orange-100 text-orange-700",
    done: "bg-emerald-100 text-emerald-700",
  };

  const label: Record<UiStatus, string> = {
    "to-do": "To Do",
    "in-progress": "In Progress",
    done: "Done",
  };

  return (
    <Badge className={`rounded-md px-2 py-0.5 text-xs ${styles[st]}`}>
      {label[st]}
    </Badge>
  );
}
