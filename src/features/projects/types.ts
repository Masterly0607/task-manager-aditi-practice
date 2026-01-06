export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string; // "bg-pink-500" etc
  status: "active" | "archived";
  tasksTotal: number;
  tasksCompleted: number;
  dueDate: string;
};
