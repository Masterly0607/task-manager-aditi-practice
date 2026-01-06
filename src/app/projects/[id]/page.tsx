"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Folder } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useProject } from "@/features/projects/hooks";
import { useTasks } from "@/features/tasks/hooks";
import { Loader } from "@/components/common/loader";
import { ErrorState } from "@/components/common/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProjectTasksTable } from "@/components/projects/project-tasks-table";

function StatCard({
  value,
  label,
  valueClassName,
}: {
  value: number;
  label: string;
  valueClassName?: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className={cn("text-2xl font-semibold", valueClassName)}>
          {value}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // ✅ hooks must be called every render (before any early return)
  const projectQ = useProject(id);
  const tasksQ = useTasks({ projectId: id });

  const computed = useMemo(() => {
    const project = projectQ.data;
    const tasks = tasksQ.data ?? [];

    if (!project) {
      return {
        total: 0,
        done: 0,
        inProgress: 0,
        todo: 0,
      };
    }

    const total = project.tasksTotal;
    const done = project.tasksCompleted;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const todo = tasks.filter((t) => t.status === "todo").length;

    return { total, done, inProgress, todo };
  }, [projectQ.data, tasksQ.data]);

  if (projectQ.isLoading || tasksQ.isLoading)
    return <Loader label="Loading project..." />;

  if (projectQ.isError)
    return (
      <ErrorState
        title="Failed to load project"
        message="Project not found or server error"
        onRetry={() => projectQ.refetch()}
      />
    );

  const project = projectQ.data!;
  const tasks = tasksQ.data ?? [];

  return (
    <div className="space-y-6">
      {/* breadcrumb */}
      <div className="text-xs text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>{" "}
        <span className="mx-1">›</span>
        <span className="text-foreground">{project.name}</span>
      </div>

      {/* header row like your UI */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* icon tile */}
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl text-white",
              project.color || "bg-pink-500"
            )}
          >
            <Folder className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="text-2xl font-semibold">{project.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" disabled className="rounded-xl">
            Settings
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/tasks/new">+ Add Task</Link>
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="grid gap-3 md:grid-cols-4">
        <StatCard
          value={computed.total}
          label="Total Tasks"
          valueClassName=""
        />
        <StatCard
          value={computed.done}
          label="Completed"
          valueClassName="text-emerald-600"
        />
        <StatCard
          value={computed.inProgress}
          label="In Progress"
          valueClassName="text-orange-500"
        />
        <StatCard
          value={computed.todo}
          label="To Do"
          valueClassName="text-muted-foreground"
        />
      </div>

      {/* tasks */}
      <ProjectTasksTable tasks={tasks} />
    </div>
  );
}
