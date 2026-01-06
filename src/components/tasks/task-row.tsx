"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Flag, MessageSquare, Paperclip } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";

type Task = {
  id: string | number;
  title: string;
  description?: string | null;
  status: "todo" | "in-progress" | "done";
  dueDate?: string | null;

  projectName?: string | null;

  // right meta (use what you have; fallbacks included)
  commentsCount?: number | null; // reference: first icon number
  attachmentsCount?: number | null; // reference: paperclip number
  assigneeInitials?: string | null; // avatar text
};

function getFlagClasses(status: Task["status"]) {
  // reference-style: done=blue, todo=orange, in-progress=red
  if (status === "in-progress") return "text-red-500";
  if (status === "todo") return "text-amber-500";
  return "text-blue-500";
}

export function TaskRow({ task }: { task: Task }) {
  const isDone = task.status === "done";

  const projectName = task.projectName ?? "Engineering";
  const comments = task.commentsCount ?? 0;
  const attachments = task.attachmentsCount ?? 0;
  const initials = task.assigneeInitials ?? "JD";
  const dueLabel = task.dueDate ? formatDate(task.dueDate) : "";

  const flagClass = getFlagClasses(task.status);

  return (
    <Link
      href={`/tasks/${task.id}`}
      className={cn(
        "group flex items-center justify-between gap-6 px-4 py-4",
        "border-b last:border-b-0",
        "hover:bg-muted/20"
      )}
    >
      {/* LEFT */}
      <div className="flex min-w-0 items-start gap-3">
        <Checkbox checked={isDone} disabled className="mt-1" />

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "truncate text-sm font-semibold",
                isDone && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </div>

            <TaskStatusBadge status={task.status} />
          </div>

          {task.description ? (
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {task.description}
            </div>
          ) : null}
        </div>
      </div>

      {/* RIGHT META (match reference icons + order) */}
      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        {/* project pill */}
        <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-foreground/80">
          {projectName}
        </span>

        {/* comments */}
        <span className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="min-w-[10px]">{comments}</span>
        </span>

        {/* attachments */}
        <span className="flex items-center gap-1">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="min-w-[10px]">{attachments}</span>
        </span>

        {/* colored flag (filled like reference) */}
        <Flag className={cn("h-4 w-4", flagClass)} fill="currentColor" />

        {/* date */}
        {dueLabel ? (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{dueLabel}</span>
          </span>
        ) : null}

        {/* avatar */}
        <span className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-muted text-[11px] font-medium text-foreground/80">
          {initials}
        </span>
      </div>
    </Link>
  );
}
