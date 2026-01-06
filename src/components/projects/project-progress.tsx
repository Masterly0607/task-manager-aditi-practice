"use client";

import { percent } from "@/lib/utils";

export function ProjectProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const value = percent(completed, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span className="tabular-nums">
          {completed}/{total} tasks
        </span>
      </div>

      {/* Track */}
      <div className="h-2 w-full rounded-full bg-muted">
        {/* Fill */}
        <div
          className="h-2 rounded-full bg-foreground"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
