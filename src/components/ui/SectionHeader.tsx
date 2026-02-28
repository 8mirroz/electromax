import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: ReactNode;
  icon?: LucideIcon;
  className?: string;
  titleClassName?: string;
  labelClassName?: string;
}

export function SectionHeader({
  label,
  title,
  icon: Icon,
  className,
  titleClassName,
  labelClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700/70",
          labelClassName,
        )}
      >
        {Icon ? <Icon className="h-[14px] w-[14px]" aria-hidden /> : null}
        <span>{label}</span>
      </div>
      <h2
        className={cn(
          "text-[clamp(1.6rem,2.6vw,2.4rem)] font-display font-black uppercase tracking-tight",
          titleClassName,
        )}
      >
        {title}
      </h2>
    </div>
  );
}
