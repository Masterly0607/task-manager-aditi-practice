"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { TaskForm } from "@/components/tasks/task-form";
import { useTask, useUpdateTask } from "@/features/tasks/hooks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  return "Something went wrong";
}

export default function EditTaskPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const router = useRouter();

  const taskQuery = useTask(id);
  const updateTask = useUpdateTask(id);

  if (taskQuery.isLoading) {
    return (
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fetching task data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (taskQuery.isError) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-red-600">
          {getErrorMessage(taskQuery.error) ?? "Failed to load task"}
        </p>
        <Button asChild variant="outline">
          <Link href="/tasks">Back to tasks</Link>
        </Button>
      </div>
    );
  }

  if (!taskQuery.data) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm">Task not found.</p>
        <Button asChild variant="outline">
          <Link href="/tasks">Back to tasks</Link>
        </Button>
      </div>
    );
  }

  const task = taskQuery.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit Task</h1>
          <p className="text-sm text-muted-foreground">
            Update fields and save changes.
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/tasks/${id}`}>Back</Link>
          </Button>
        </div>
      </div>

      <TaskForm
        submitText="Update"
        loading={updateTask.isPending}
        defaultValues={{
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
        }}
        onSubmit={async (values) => {
          await updateTask.mutateAsync(values);
          router.push(`/tasks/${id}`);
        }}
      />

      {updateTask.isError && (
        <p className="text-sm text-red-600">
          {getErrorMessage(updateTask.error) ?? "Failed to update task"}
        </p>
      )}
    </div>
  );
}
