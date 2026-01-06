import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="-mx-6 border-b bg-background px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold leading-none">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>

          {right}
        </div>
      </div>
    </div>
  );
}
