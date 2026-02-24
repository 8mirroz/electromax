import { cn } from "@/lib/utils";
import { DotPattern } from "../ui/DottedSurface";

export function HeroBanner({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[60vh] overflow-hidden bg-background text-foreground py-24">
      {/* Background Dots */}
      <DotPattern
        width={32}
        height={32}
        className={cn(
          "fill-neutral-900/10 dark:fill-neutral-100/10",
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />

      <div className="relative z-10 flex flex-col items-center text-center container mx-auto px-6 max-w-4xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-xl md:text-2xl text-muted-foreground w-4/5 leading-relaxed">
          {subtitle}
        </p>

        {children && <div className="mt-8 flex gap-4">{children}</div>}
      </div>
    </section>
  );
}
