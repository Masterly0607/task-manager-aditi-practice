import { apiClient } from "@/lib/api-client";
import type { Task } from "./types";
import type { TaskFormValues } from "./schema";

export async function getTasks(params?: { projectId?: string }) {
  const q = params?.projectId
    ? `?projectId=${encodeURIComponent(params.projectId)}`
    : "";
  return apiClient.get<Task[]>(`/tasks${q}`);
}

export async function getTask(id: string) {
  return apiClient.get<Task>(`/tasks/${id}`);
}

export async function createTask(values: TaskFormValues) {
  const payload: Omit<Task, "id"> = {
    ...values,
  };

  return apiClient.post<Task>(`/tasks`, payload);
}

export async function updateTask(id: string, values: TaskFormValues) {
  const existing = await getTask(id);

  const payload: Task = {
    ...existing,
    ...values,
    id: existing.id,
  };

  return apiClient.put<Task>(`/tasks/${id}`, payload);
}

export async function deleteTask(id: string) {
  return apiClient.delete<void>(`/tasks/${id}`);
}
