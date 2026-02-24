import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...rest }: { src: string; alt: string }) => {
    const resolvedSrc = typeof src === "string" ? src : (src as { src: string }).src;
    return React.createElement("img", { src: resolvedSrc, alt, ...rest });
  },
}));
