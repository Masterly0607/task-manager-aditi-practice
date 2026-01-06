"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Bell,
  CalendarIcon,
  ChevronDown,
  Flag,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Loader } from "@/components/common/loader";
import { ErrorState } from "@/components/common/error-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import { useDeleteTask, useTask } from "@/features/tasks/hooks";
import { useProjects } from "@/features/projects/hooks";

import { TaskDetailCard } from "@/components/tasks/task-detail-card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type Status = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong";
}

function priorityLabel(p: Priority) {
  if (p === "low") return "Low Priority";
  if (p === "medium") return "Medium Priority";
  return "High Priority";
}

function statusLabel(s: Status) {
  if (s === "todo") return "To Do";
  if (s === "in-progress") return "In Progress";
  return "Done";
}

function InteractiveDetails({
  task,
  projects,
}: {
  task: {
    status: Status;
    priority: Priority;
    dueDate?: string;
    projectId?: string;
  };
  projects: { id: string; name: string }[];
}) {
  const [status, setStatus] = React.useState<Status>(task.status);
  const [priority, setPriority] = React.useState<Priority>(task.priority);
  const [projectId, setProjectId] = React.useState<string>(
    task.projectId ?? ""
  );
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [attachments, setAttachments] = React.useState<string[]>([]);

  const project = projects.find((p) => p.id === projectId);

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Status
          </div>

          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Select status">
                {statusLabel(status)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Priority
          </div>

          <div className="rounded-2xl border bg-destructive/5 px-3 py-2">
            <div className="flex items-center gap-3">
              <Flag className="h-4 w-4 text-destructive" />
              <div className="text-sm font-medium">
                {priorityLabel(priority)}
              </div>

              <div className="ml-auto">
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                >
                  <SelectTrigger className="h-8 w-[120px] rounded-full bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Due Date
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "h-11 w-full rounded-2xl border bg-background px-3 text-left text-sm",
                  "flex items-center gap-2"
                )}
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>
                  {dueDate ? formatDate(dueDate.toISOString()) : "Pick a date"}
                </span>
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Project
          </div>

          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Select project">
                {project ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    {project.name}
                  </span>
                ) : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Attachments
          </div>

          {attachments.length === 0 ? (
            <div className="text-sm text-muted-foreground">No attachments</div>
          ) : (
            <div className="space-y-2">
              {attachments.map((a) => (
                <div
                  key={a}
                  className="rounded-2xl border bg-background px-3 py-2 text-sm"
                >
                  {a}
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-center gap-2 rounded-2xl"
            onClick={() =>
              setAttachments((prev) => [...prev, `file-${prev.length + 1}.png`])
            }
          >
            <Plus className="h-4 w-4" />
            Add attachment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const taskQ = useTask(id);
  const projectsQ = useProjects();
  const del = useDeleteTask();

  if (taskQ.isLoading || projectsQ.isLoading) {
    return <Loader label="Loading task..." />;
  }

  if (taskQ.isError) {
    return (
      <ErrorState
        title="Failed to load task"
        message="Task not found or server error"
        onRetry={() => taskQ.refetch()}
      />
    );
  }

  const task = taskQ.data!;
  const projects = projectsQ.data ?? [];
  const crumb = `Task #${id}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/tasks" className="hover:text-foreground">
            Tasks
          </Link>
          <span>›</span>
          <span className="text-foreground">{crumb}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Bell className="h-4 w-4" />
          </Button>

          <Button asChild variant="outline" className="rounded-2xl gap-2">
            <Link href={`/tasks/${id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>

          <ConfirmDialog
            loading={del.isPending}
            title="Delete this task?"
            description="Are you sure? This will permanently remove the task."
            confirmText="Delete"
            trigger={
              <Button
                className="rounded-2xl gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={del.isPending}
              >
                <Trash2 className="h-4 w-4" />
                {del.isPending ? "Deleting..." : "Delete"}
              </Button>
            }
            onConfirm={async () => {
              await del.mutateAsync(id);
              router.push("/tasks");
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <TaskDetailCard task={task} />

        <InteractiveDetails
          task={{
            status: task.status as Status,
            priority: task.priority as Priority,
            dueDate: task.dueDate,
            projectId: task.projectId,
          }}
          projects={projects}
        />
      </div>

      {del.isError && (
        <p className="text-sm text-red-600">
          {getErrorMessage(del.error) ?? "Failed to delete"}
        </p>
      )}
    </div>
  );
}
