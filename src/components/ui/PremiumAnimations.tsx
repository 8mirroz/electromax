"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform, type Variants } from "motion/react";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

// Premium easing curves
export const easings = {
  smooth: [0.4, 0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bounce: { type: "spring", stiffness: 400, damping: 25 },
  gentle: [0.22, 1, 0.36, 1],
  snappy: [0.16, 1, 0.3, 1],
  luxury: [0.6, 0.05, 0.01, 0.99],
} as const;

// Premium animation durations
export const durations = {
  fast: 0.15,
  normal: 0.22,
  slow: 0.35,
  slower: 0.5,
  luxurious: 0.8,
} as const;

// Fade up animation
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { isLite } = usePerformanceTier();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: durations.slower,
        delay,
        ease: easings.gentle,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger container
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const { isLite } = usePerformanceTier();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: durations.slow,
        ease: easings.gentle,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Scale on hover
export function ScaleOnHover({
  children,
  className = "",
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  const { isLite } = usePerformanceTier();

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: durations.fast, ease: easings.smooth }}
    >
      {children}
    </motion.div>
  );
}

// Glass card with glow
export function GlassCard({
  children,
  className = "",
  glowColor = "rgba(47, 91, 255, 0.15)",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const { isLite } = usePerformanceTier();

  if (isLite) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl shadow-lg ${className}`}
      whileHover={{
        boxShadow: `0 25px 50px -12px ${glowColor}`,
        y: -4,
      }}
      transition={{ duration: durations.slow, ease: easings.gentle }}
    >
      {children}
    </motion.div>
  );
}

// Premium button with shine effect
export function PremiumButton({
  children,
  onClick,
  className = "",
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const { isLite } = usePerformanceTier();
  const baseStyles =
    "relative overflow-hidden rounded-full px-8 py-4 font-semibold transition-all duration-300";
  const variantStyles = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
    secondary: "bg-white text-text-primary border border-border shadow-md hover:shadow-lg",
    ghost: "bg-transparent text-text-primary hover:bg-surface-secondary",
  };

  if (isLite) {
    return (
      <button onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: durations.fast }}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: "-200%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.8, ease: easings.smooth }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Parallax wrapper
export function ParallaxWrapper({
  children,
  className = "",
  speed = 0.5,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const { isLite } = usePerformanceTier();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Text reveal animation
export function TextReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const { isLite } = usePerformanceTier();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (isLite) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-block overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay, duration: 0.1 }}
    >
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: durations.slower,
          delay,
          ease: easings.gentle,
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Magnetic button effect
export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const { isLite } = usePerformanceTier();
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) * strength;
    const y = (clientY - top - height / 2) * strength;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Floating animation
export function FloatingElement({
  children,
  className = "",
  duration = 3,
  distance = 10,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}) {
  const { isLite } = usePerformanceTier();

  if (isLite) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Smooth scroll progress indicator
export function ScrollProgress() {
  const { isLite } = usePerformanceTier();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (isLite) {
    return null;
  }

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-primary via-blue-400 to-cyan-400"
      style={{ scaleX }}
    />
  );
}
