"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      data-active={active ? "true" : "false"}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {icon ? (
        <span
          className={cn(
            "text-muted-foreground transition",
            active && "text-foreground"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className={cn("font-medium", !active && "font-normal")}>
        {label}
      </span>
    </Link>
  );
}
