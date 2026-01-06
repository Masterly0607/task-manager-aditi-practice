import type { Task } from "@/features/tasks/types";
import type { Project } from "@/features/projects/types";
import { TaskRow } from "@/components/tasks/task-row";

export function TaskList({
  tasks,
  projects,
}: {
  tasks: Task[];
  projects: Project[];
}) {
  const projectMap = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-2">
      {tasks.map((t) => (
        <div key={t.id}>
          <TaskRow task={t} />

          <div className="px-4 text-xs text-muted-foreground">
            {projectMap.get(t.projectId) ?? "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
