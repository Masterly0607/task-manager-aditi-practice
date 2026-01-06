"use client";

import { useMemo, useState } from "react";
import type { Task } from "@/features/tasks/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";

const TABS = ["All", "Active", "Completed"] as const;
type Tab = (typeof TABS)[number];

function AssigneeBubble({ initials }: { initials: string }) {
  return (
    <div className="grid h-7 w-7 place-items-center rounded-full bg-purple-600 text-[10px] font-semibold text-white">
      {initials}
    </div>
  );
}

export function ProjectTasksTable({ tasks }: { tasks: Task[] }) {
  const [tab, setTab] = useState<Tab>("All");

  const filtered = useMemo(() => {
    if (tab === "All") return tasks;
    if (tab === "Completed") return tasks.filter((t) => t.status === "done");
    // Active
    return tasks.filter((t) => t.status !== "done");
  }, [tasks, tab]);

  return (
    <div className="rounded-2xl border bg-card">
      {/* header */}
      <div className="border-b px-4 py-4 text-center">
        <div className="text-sm font-semibold">Tasks</div>

        <div className="mt-3 flex items-center justify-center gap-6 text-xs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-3 py-1 transition",
                tab === t
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* rows */}
      <div className="p-4">
        <div className="overflow-hidden rounded-xl border">
          <div className="divide-y">
            {filtered.map((t) => {
              const isDone = t.status === "done";
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Checkbox checked={isDone} aria-label="done" />
                    <div
                      className={cn(
                        "truncate text-sm",
                        isDone && "text-muted-foreground line-through"
                      )}
                    >
                      {t.title}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TaskStatusBadge status={t.status} />
                    {/* fake assignee like your UI */}
                    <AssigneeBubble initials="JD" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
