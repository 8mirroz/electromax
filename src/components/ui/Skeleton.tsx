import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Governance: Performance Layer — Skeleton Loading
 * Prevents layout shift, improves perceived performance
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-full bg-muted",
        className
      )}
    />
  );
}

/**
 * Card skeleton for competency cards
 */
export function SkeletonCard() {
  return (
    <div className="rounded-[20px] border border-black/[0.04] bg-surface-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-5 w-3/4" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

/**
 * KPI card skeleton
 */
export function SkeletonKPI() {
  return (
    <div className="rounded-3xl border border-border bg-surface-primary p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-32" />
    </div>
  );
}

/**
 * Hero section skeleton
 */
export function SkeletonHero() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-2/3" />
      </div>
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-5/6" />
      <div className="flex gap-4">
        <Skeleton className="h-14 w-48 rounded-full" />
        <Skeleton className="h-14 w-40 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Text skeleton for paragraphs
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 w-full",
            i === lines - 1 && "w-2/3"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Full page skeleton for services
 */
export function SkeletonServicePage() {
  return (
    <div className="space-y-20 animate-pulse">
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-80 rounded-lg" />
        </div>
        <div className="h-[200px] w-full border border-border/50 rounded-[2.5rem] bg-muted/20" />
      </div>
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-80 rounded-lg" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-[3rem] bg-muted/20" />
          <Skeleton className="h-[400px] w-full rounded-[3rem] bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
