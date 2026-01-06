import { Badge } from "@/components/ui/badge";

export function TaskPriorityBadge({
  priority,
}: {
  priority: "low" | "medium" | "high";
}) {
  if (priority === "high")
    return (
      <Badge className="bg-red-100 text-red-900 hover:bg-red-100">
        High Priority
      </Badge>
    );
  if (priority === "medium")
    return (
      <Badge className="bg-yellow-100 text-yellow-900 hover:bg-yellow-100">
        Medium
      </Badge>
    );
  return <Badge variant="secondary">Low</Badge>;
}
