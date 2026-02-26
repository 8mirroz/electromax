import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        "rounded-full border border-transparent",
        "text-sm font-semibold tracking-tight",
        "transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.98]",
    ].join(" "),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:opacity-90",
                destructive:
                    "bg-red-500 text-destructive-foreground hover:bg-red-500/90",
                outline:
                    "border border-input bg-background hover:bg-accent focus:bg-accent",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost:
                    "hover:bg-accent/20 focus:bg-accent/20",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-full px-4 text-xs",
                lg: "h-12 rounded-full px-8 text-base",
                icon: "h-11 w-11 rounded-full p-0 flex items-center justify-center",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }
