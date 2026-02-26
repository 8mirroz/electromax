"use client";

import Image, { ImageProps } from "next/image";
import { usePerformanceTier } from "@/components/AdaptiveProvider";

interface AdaptiveImageProps extends ImageProps {
    liteQuality?: number;
    fullQuality?: number;
}

export function AdaptiveImage({
    liteQuality = 60,
    fullQuality = 85,
    ...props
}: AdaptiveImageProps) {
    const { isLite } = usePerformanceTier();

    return (
        <Image
            {...props}
            quality={isLite ? liteQuality : fullQuality}
            // Disable blur placeholder in lite mode to save on decoding/blurring effort
            placeholder={isLite ? undefined : props.placeholder}
        />
    );
}
