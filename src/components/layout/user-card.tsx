"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-background px-3 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
        JD
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">John Doe</div>
        <div className="truncate text-xs text-muted-foreground">
          john@example.com
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}
