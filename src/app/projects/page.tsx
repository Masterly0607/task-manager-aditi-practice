"use client";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/features/projects/hooks";
import { Loader } from "@/components/common/loader";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { ProjectCard } from "@/components/projects/project-card";

export default function ProjectsPage() {
  const q = useProjects();

  if (q.isLoading) return <Loader label="Loading projects..." />;
  if (q.isError)
    return (
      <ErrorState
        title="Failed to load projects"
        message="Check json-server on :3001"
        onRetry={() => q.refetch()}
      />
    );

  const projects = q.data ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} active projects`}
        right={
          <Button disabled className="rounded-xl">
            + New Project
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState title="No projects" message="Add projects in db.json" />
      ) : (
        <div className="space-y-4">
          {projects.map((p, idx) => (
            <ProjectCard key={p.id} project={p} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
