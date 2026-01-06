import { Inbox } from "lucide-react";

export function EmptyState({
  title = "No data",
  message = "Nothing to show here yet.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-5 w-5" />
      </div>
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{message}</div>
    </div>
  );
}
