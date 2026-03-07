"use client";

import Image, { ImageProps } from "next/image";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface AdaptiveImageProps extends Omit<ImageProps, 'alt'> {
  liteQuality?: number;
  fullQuality?: number;
  alt: string; // Required for accessibility
}

export function AdaptiveImage({
  liteQuality = 60,
  fullQuality = 85,
  alt,
  ...props
}: AdaptiveImageProps) {
  const { isLite } = usePerformanceTier();

  return (
    <Image
      {...props}
      alt={alt}
      quality={isLite ? liteQuality : fullQuality}
      // Disable blur placeholder in lite mode to save on decoding/blurring effort
      placeholder={isLite ? undefined : props.placeholder}
    />
  );
}
