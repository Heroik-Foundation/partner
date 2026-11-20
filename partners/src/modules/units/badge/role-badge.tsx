import { cn } from "@/lib/utils";
import type { RoleTag } from "@/hooks/use-permissions";

interface RoleBadgeProps {
  role?: RoleTag | string;
  className?: string;
  size?: "sm" | "md";
}

export function RoleBadge({ role = "Owner", className, size = "sm" }: RoleBadgeProps) {
  const normalized = String(role).toLowerCase();

  let colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
  let label = role;

  if (normalized === "admin") {
    colorClasses = "bg-purple-100 text-purple-800 border-purple-200";
    label = "Admin";
  } else if (normalized === "view" || normalized === "viewer") {
    colorClasses = "bg-blue-100 text-blue-800 border-blue-200";
    label = "View";
  } else if (normalized === "owner") {
    colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-200";
    label = "Owner";
  } else {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
    label = role;
  }

  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-xs select-none",
        colorClasses,
        sizeClasses,
        className
      )}
    >
      {label}
    </span>
  );
}
