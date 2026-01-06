"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { Loader } from "@/components/common/loader";
import { ErrorState } from "@/components/common/error-state";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/features/tasks/hooks";
import { useProjects } from "@/features/projects/hooks";
import { TaskRow } from "@/components/tasks/task-row";
import { Search } from "lucide-react";

type TabKey = "all" | "todo" | "in-progress" | "done";

const statusByTab: Record<TabKey, string | null> = {
  all: null,
  todo: "todo",
  "in-progress": "in-progress",
  done: "done",
};

export default function TasksPage() {
  const tasksQ = useTasks();
  const projectsQ = useProjects();

  const [tab, setTab] = useState<TabKey>("all");
  const [q, setQ] = useState("");

  const projectNameById = useMemo(() => {
    const projects = projectsQ.data ?? [];
    return new Map(projects.map((p) => [p.id, p.name]));
  }, [projectsQ.data]);

  const filtered = useMemo(() => {
    const tasks = tasksQ.data ?? [];
    const status = statusByTab[tab];

    return tasks
      .filter((t) => (status ? t.status === status : true))
      .filter((t) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return (
          t.title.toLowerCase().includes(s) ||
          (t.description ?? "").toLowerCase().includes(s)
        );
      })
      .sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [tasksQ.data, tab, q]);

  if (tasksQ.isLoading || projectsQ.isLoading) {
    return <Loader label="Loading tasks..." />;
  }

  if (tasksQ.isError || projectsQ.isError) {
    return (
      <ErrorState
        title="Failed to load tasks"
        message="Make sure json-server is running on http://localhost:3001"
        onRetry={() => {
          tasksQ.refetch();
          projectsQ.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        subtitle={`${filtered.length} total tasks`}
        right={
          <Button asChild>
            <Link href="/tasks/new">+ New Task</Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
          <TabsList className="h-9 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">
              All
            </TabsTrigger>
            <TabsTrigger value="todo" className="rounded-md">
              To Do
            </TabsTrigger>
            <TabsTrigger value="in-progress" className="rounded-md">
              In Progress
            </TabsTrigger>
            <TabsTrigger value="done" className="rounded-md">
              Done
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9"
          />
        </div>
      </div>

      <Card className="rounded-2xl">
        {filtered.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-lg font-semibold">No tasks found</div>
            <p className="text-sm text-muted-foreground">
              You don’t have any tasks yet. Create one to get started.
            </p>

            <Button asChild className="rounded-2xl">
              <Link href="/tasks/new">+ New Task</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((t) => (
              <div key={t.id}>
                {/* ✅ TaskRow only gets task (no projectName prop) */}
                <TaskRow task={t} />

                {/* Optional: show project name under the row if you want */}
                <div className="px-4 pb-3 text-xs text-muted-foreground">
                  {projectNameById.get(t.projectId) ?? "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
