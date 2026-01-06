"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Task } from "@/features/tasks/types";

function statusLabel(status: Task["status"]) {
  if (status === "todo") return "To Do";
  if (status === "in-progress") return "In Progress";
  return "Done";
}

function priorityLabel(priority: Task["priority"]) {
  if (priority === "low") return "Low";
  if (priority === "medium") return "Medium";
  return "High";
}

export function TaskDetailCard({ task }: { task: Task }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-muted-foreground">
              Due {formatDate(task.dueDate)}
            </p>
          </div>

          <Badge variant="secondary" className="rounded-full">
            {statusLabel(task.status)}
          </Badge>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Description
          </div>
          <p className="text-sm leading-relaxed">{task.description}</p>
        </div>

        {/* Meta */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border p-3">
            <div className="text-[11px] font-medium uppercase text-muted-foreground">
              Project ID
            </div>
            <div className="text-sm font-medium">{task.projectId}</div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="text-[11px] font-medium uppercase text-muted-foreground">
              Priority
            </div>
            <div className="text-sm font-medium">
              {priorityLabel(task.priority)}
            </div>
          </div>

          <div className="rounded-2xl border p-3">
            <div className="text-[11px] font-medium uppercase text-muted-foreground">
              Status
            </div>
            <div className="text-sm font-medium">
              {statusLabel(task.status)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
