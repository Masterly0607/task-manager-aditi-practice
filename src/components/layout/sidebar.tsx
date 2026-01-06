"use client";

import Link from "next/link";
import {
  Search,
  Zap,
  LayoutDashboard,
  ListTodo,
  FolderKanban,
} from "lucide-react";

import { routes } from "@/constants/routes";
import { NavItem } from "@/components/layout/nav-item";
import { UserCard } from "@/components/layout/user-card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useProjects } from "@/features/projects/hooks";

const PROJECT_DOT_COLORS = [
  "bg-pink-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
];

export function Sidebar() {
  const projectsQ = useProjects();
  const projects = projectsQ.data ?? [];

  return (
    <aside className="hidden h-screen w-72 flex-col border-r bg-background px-4 py-4 md:flex">
      {/* Top logo */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background">
          <Zap className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">TaskFlow</span>
      </div>

      {/* Search */}
      <div className="mt-4 px-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="h-10 rounded-xl pl-9" />
        </div>
      </div>

      {/* Menu */}
      <div className="mt-5 flex-1 px-1">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          MENU
        </div>

        <div className="mt-2 space-y-1">
          <NavItem
            href={routes.dashboard}
            label="Dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
          />
          <NavItem
            href={routes.tasks}
            label="Tasks"
            icon={<ListTodo className="h-4 w-4" />}
          />
          <NavItem
            href={routes.projects}
            label="Projects"
            icon={<FolderKanban className="h-4 w-4" />}
          />
        </div>

        {/* Projects section (like your UI) */}
        <div className="mt-6">
          <div className="text-xs font-semibold tracking-wide text-muted-foreground">
            PROJECTS
          </div>

          <div className="mt-2 space-y-1">
            {projects.slice(0, 10).map((p, idx) => (
              <Link
                key={p.id}
                href={`${routes.projects}/${p.id}`}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    PROJECT_DOT_COLORS[idx % PROJECT_DOT_COLORS.length]
                  )}
                />
                <span className="truncate">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom user */}
      <div className="mt-auto">
        <Separator className="my-4" />
        <UserCard />
      </div>
    </aside>
  );
}
