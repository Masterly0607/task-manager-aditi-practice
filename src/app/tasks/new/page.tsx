"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { TaskForm } from "@/components/tasks/task-form";
import { useCreateTask } from "@/features/tasks/hooks";
import { Button } from "@/components/ui/button";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }

  return "Failed to create task";
}

export default function CreateTaskPage() {
  const router = useRouter();
  const createTask = useCreateTask();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create Task</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details and create a new task.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/tasks">Back</Link>
        </Button>
      </div>

      <TaskForm
        submitText="Create"
        loading={createTask.isPending}
        onSubmit={async (values) => {
          await createTask.mutateAsync(values);
          router.push("/tasks");
        }}
      />

      {createTask.isError && (
        <p className="text-sm text-red-600">
          {getErrorMessage(createTask.error)}
        </p>
      )}
    </div>
  );
}
