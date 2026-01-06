"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/common/page-header";
import { useTasks } from "@/features/tasks/hooks";
import { useProjects } from "@/features/projects/hooks";
import { Loader } from "@/components/common/loader";
import { ErrorState } from "@/components/common/error-state";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { cn, formatDate } from "@/lib/utils";
import { ClipboardList, CheckCircle2, Clock3, Flag } from "lucide-react";

function dueLabel(dueDate: string) {
  const d = new Date(dueDate);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDue = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (startOfDue.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return formatDate(dueDate);
}

function StatRow({
  label,
  value,
  changeText,
  icon,
  iconBgClass,
}: {
  label: string;
  value: number;
  changeText: string;
  icon: React.ReactNode;
  iconBgClass: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
          <div className="mt-1 text-xs text-emerald-600">{changeText}</div>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const tasksQ = useTasks();
  const projectsQ = useProjects();

  const stats = useMemo(() => {
    const tasks = tasksQ.data ?? [];

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;

    // ✅ Capture "now" once (no Date.now() during render)
    const now = new Date();

    const overdue = tasks.filter((t) => {
      const due = new Date(t.dueDate);
      return due < now && t.status !== "done";
    }).length;

    return { total, completed, inProgress, overdue };
  }, [tasksQ.data]);

  if (tasksQ.isLoading || projectsQ.isLoading) {
    return <Loader label="Loading dashboard..." />;
  }

  if (tasksQ.isError || projectsQ.isError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="Make sure json-server is running on http://localhost:3001"
        onRetry={() => {
          tasksQ.refetch();
          projectsQ.refetch();
        }}
      />
    );
  }

  const tasks = tasksQ.data ?? [];
  const projects = projectsQ.data ?? [];
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  const recent = tasks.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, John"
        right={
          <Button asChild>
            <Link href="/tasks/new">+ New Task</Link>
          </Button>
        }
      />

      <div className="space-y-3">
        <StatRow
          label="Total Tasks"
          value={stats.total}
          changeText="+12% from last week"
          icon={<ClipboardList className="h-4 w-4 text-blue-600" />}
          iconBgClass="bg-blue-50"
        />
        <StatRow
          label="Completed"
          value={stats.completed}
          changeText="+8% from last week"
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          iconBgClass="bg-emerald-50"
        />
        <StatRow
          label="In Progress"
          value={stats.inProgress}
          changeText="+5% from last week"
          icon={<Clock3 className="h-4 w-4 text-orange-600" />}
          iconBgClass="bg-orange-50"
        />
        <StatRow
          label="Overdue"
          value={stats.overdue}
          changeText="-2% from last week"
          icon={<Flag className="h-4 w-4 text-red-600" />}
          iconBgClass="bg-red-50"
        />
      </div>

      <Card className="rounded-2xl">
        <div className="border-b px-4 py-4 text-center">
          <div className="font-semibold">Recent Tasks</div>
          <Link
            href="/tasks"
            className="mt-1 inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y">
          {recent.map((t) => (
            <Link
              key={t.id}
              href={`/tasks/${t.id}`}
              className="flex items-center gap-3 px-4 py-4 hover:bg-muted/30"
            >
              <Checkbox checked={t.status === "done"} aria-label="done" />

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "truncate text-sm font-medium",
                    t.status === "done" && "line-through text-muted-foreground"
                  )}
                >
                  {t.title}
                </div>

                <div className="truncate text-xs text-muted-foreground">
                  {projectMap.get(t.projectId) ?? "—"}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TaskStatusBadge status={t.status} />
                <div className="text-xs text-muted-foreground">
                  {dueLabel(t.dueDate)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
