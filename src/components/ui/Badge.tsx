import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export function Badge({ children, icon: Icon, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 px-3 py-1 text-[11px] font-semibold tracking-wider text-blue-700/80 backdrop-blur-sm",
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
      <span className="lowercase first-letter:uppercase">{children}</span>
    </div>
  );
}
