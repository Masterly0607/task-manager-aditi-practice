import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-muted p-2">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{message}</div>
          {onRetry ? (
            <Button className="mt-4" variant="secondary" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
