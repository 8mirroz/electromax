import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    priority,
    fill,
    ...rest
  }: {
    src: string;
    alt: string;
    priority?: boolean;
    fill?: boolean;
  }) => {
    const resolvedSrc = typeof src === "string" ? src : (src as { src: string }).src;
    // Strip Next.js-only props that shouldn't hit the DOM.
    void priority;
    void fill;
    return React.createElement("img", { src: resolvedSrc, alt, ...rest });
  },
}));

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
  // @ts-expect-error - test environment mock
  window.IntersectionObserver = MockIntersectionObserver;
}

vi.mock("@marsidev/react-turnstile", () => ({
  Turnstile: ({ onSuccess }: { onSuccess?: (token: string) => void }) =>
    React.createElement(
      "button",
      {
        type: "button",
        onClick: () => onSuccess?.("test-turnstile-token"),
      },
      "Mock Turnstile",
    ),
}));
