"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getAnalyticsConsentState,
  isConsentFirstMode,
  setAnalyticsConsent,
} from "@/lib/analytics/consent";

export function AnalyticsConsentBanner() {
  const [state, setState] = useState<"granted" | "denied" | null>(() => {
    const consent = getAnalyticsConsentState();
    return consent === "granted" || consent === "denied" ? consent : null;
  });

  if (!isConsentFirstMode()) return null;
  if (state === "granted" || state === "denied") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[180] px-4 pb-4 md:px-6 md:pb-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur md:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Согласие на аналитику</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Мы используем PostHog и Яндекс.Метрику для улучшения сервиса и качества контента.
              Аналитика включится только после вашего согласия.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-11 min-w-36"
              onClick={() => {
                setAnalyticsConsent("denied");
                setState("denied");
              }}
            >
              Отклонить
            </Button>
            <Button
              type="button"
              className="h-11 min-w-36"
              onClick={() => {
                setAnalyticsConsent("granted");
                setState("granted");
              }}
            >
              Принять
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
