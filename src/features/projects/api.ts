import { apiClient } from "@/lib/api-client";
import type { Project } from "./types";

export async function getProjects() {
  return apiClient.get<Project[]>(`/projects`);
}

export async function getProject(id: string) {
  return apiClient.get<Project>(`/projects/${id}`);
}
