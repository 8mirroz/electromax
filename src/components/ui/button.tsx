import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "border border-transparent",
    "text-sm font-semibold tracking-tight",
    "transition-all",
    "duration-[var(--duration-normal)]",
    "ease-[var(--ease-enter)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "relative rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold uppercase tracking-wider text-[13px]",
          "shadow-[0_4px_20px_-4px_rgba(59,130,246,0.4),0_8px_40px_-8px_rgba(79,70,229,0.3)]",
          "hover:shadow-[0_8px_30px_-4px_rgba(59,130,246,0.5),0_12px_50px_-8px_rgba(79,70,229,0.35)]",
          "hover:-translate-y-0.5 transition-all duration-300",
          "overflow-hidden group",
        ].join(" "),
        destructive: "rounded-full bg-red-500 text-destructive-foreground hover:bg-red-500/90",
        outline:
          "rounded-2xl border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40",
        secondary:
          "rounded-2xl border border-white/20 bg-white/10 text-foreground hover:bg-white/15",
        ghost: "rounded-2xl hover:bg-accent/20 focus:bg-accent/20",
        link: "rounded-2xl text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-4",
        sm: "h-9 px-4 text-xs",
        lg: "h-16 px-10 py-5 text-base",
        icon: "h-11 w-11 p-0 flex items-center justify-center rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (asChild) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
      );
    }

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {props.children}
        {variant === "default" && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
