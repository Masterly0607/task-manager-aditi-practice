"use client";

import Link from "next/link";
import type { Project } from "@/features/projects/types";
import { Card } from "@/components/ui/card";
import { ProjectProgress } from "@/components/projects/project-progress";
import { cn, formatDate } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "J";
  const b = parts[1]?.[0] ?? "D";
  return (a + b).toUpperCase();
}

// Fake members to match UI (until you have real assignees)
function fakeMembers(seed: number) {
  const pool = ["John Doe", "Alice Kim", "Sara Lee", "Mark Ray", "Nora Stone"];
  const a = pool[seed % pool.length];
  const b = pool[(seed + 1) % pool.length];
  const c = pool[(seed + 2) % pool.length];
  return [a, b, c];
}

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const members = fakeMembers(index);

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="rounded-2xl border bg-card transition hover:bg-muted/20">
        <div className="p-5">
          {/* Top: dot + title + subtitle */}
          <div className="flex items-start gap-3">
            <div
              className={cn("mt-1.5 h-2.5 w-2.5 rounded-full", project.color)}
            />

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">
                {project.name}
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {project.description}
              </div>
            </div>
          </div>

          {/* Progress (label + counts + bar) */}
          <div className="mt-5">
            <ProjectProgress
              completed={project.tasksCompleted}
              total={project.tasksTotal}
            />
          </div>

          {/* Bottom: avatars left + date right */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {members.map((m) => (
                <div
                  key={m}
                  title={m}
                  className="flex h-7 w-7 items-center justify-center rounded-full border bg-purple-600 text-[10px] font-semibold text-white"
                >
                  {initials(m)}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{formatDate(project.dueDate)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
