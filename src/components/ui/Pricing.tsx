import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPackage } from "@/types";

interface PricingProps {
  packages: PricingPackage[];
  className?: string;
}

export function Pricing({ packages, className }: PricingProps) {
  return (
    <div
      className={cn("grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full", className)}
    >
      {packages.map((pkg, idx) => {
        const isFeatured = idx === Math.floor(packages.length / 2) && packages.length > 1;

        return (
          <div
            key={pkg.title}
            className={cn(
              "flex flex-col p-6 rounded-2xl border transition-all duration-300",
              isFeatured
                ? "bg-primary text-primary-foreground shadow-lg scale-105 border-primary"
                : "bg-background text-foreground hover:shadow-md border-neutral-200 dark:border-neutral-800",
            )}
          >
            <h3 className="text-xl font-bold tracking-tight mb-2">{pkg.title}</h3>

            <div className="flex items-baseline gap-1 my-4">
              <span className="text-4xl font-extrabold tracking-tight">
                {pkg.oneTimePrice ? `${pkg.oneTimePrice.toLocaleString("ru-RU")} ₽` : "По запросу"}
              </span>
              {pkg.monthlyPrice && (
                <span className="text-sm font-medium opacity-80">
                  / {pkg.monthlyPrice} руб. мес
                </span>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {pkg.features.map((feat, i) => (
                <li key={i} className="flex gap-3 items-center text-sm">
                  <Check
                    className={cn(
                      "h-5 w-5",
                      isFeatured ? "text-primary-foreground" : "text-primary",
                    )}
                  />
                  <span
                    className={isFeatured ? "opacity-90" : "text-neutral-600 dark:text-neutral-400"}
                  >
                    {feat}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={cn(
                "w-full py-2.5 px-4 rounded-xl font-semibold transition-colors mt-auto",
                isFeatured
                  ? "bg-white text-primary hover:bg-neutral-50"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              Выбрать тариф
            </button>
          </div>
        );
      })}
    </div>
  );
}
