"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "full" | "lite";

export interface AdaptivePerformanceResult {
    tier: PerformanceTier;
    score: number;
    hardwareScore: number;
    networkScore: number;
    isReducedMotion: boolean;
    isSaveData: boolean;
    isLowBattery: boolean;
    override: "none" | "url" | "localStorage" | "forced";
}

const STORAGE_KEY = "electromax_perf_tier";

export function useAdaptivePerformance(): AdaptivePerformanceResult {
    const [result, setResult] = useState<AdaptivePerformanceResult>({
        tier: "full",
        score: 100,
        hardwareScore: 100,
        networkScore: 100,
        isReducedMotion: false,
        isSaveData: false,
        isLowBattery: false,
        override: "none",
    });

    useEffect(() => {
        // 1. Check Overrides
        const urlParams = new URLSearchParams(window.location.search);
        const urlOverride = urlParams.get("perf") as PerformanceTier | null;
        const storageOverride = localStorage.getItem(STORAGE_KEY) as PerformanceTier | null;

        // 2. Preference Signals
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // @ts-expect-error - Network Information API
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSaveData = conn?.saveData || false;

        // 3. Hardware Score (0-100)
        const cores = navigator.hardwareConcurrency || 4;
        // @ts-expect-error
        const ram = navigator.deviceMemory || 4;

        let hardwareScore = 50;
        if (cores <= 2) hardwareScore -= 20;
        if (cores >= 8) hardwareScore += 30;
        if (ram <= 2) hardwareScore -= 20;
        if (ram >= 8) hardwareScore += 20;
        hardwareScore = Math.max(0, Math.min(100, hardwareScore));

        // 4. Network Score (0-100)
        let networkScore = 100;
        if (conn) {
            const type = conn.effectiveType; // 'slow-2g', '2g', '3g', '4g'
            if (type === "slow-2g" || type === "2g") networkScore = 10;
            else if (type === "3g") networkScore = 40;

            const downlink = conn.downlink || 10;
            if (downlink < 1) networkScore = Math.min(networkScore, 20);
            else if (downlink < 5) networkScore = Math.min(networkScore, 50);
        }

        // 5. Composite Score
        const compositeScore = hardwareScore * 0.6 + networkScore * 0.4;

        // Choose Tier
        let tier: PerformanceTier = compositeScore >= 60 ? "full" : "lite";
        let override: AdaptivePerformanceResult["override"] = "none";

        // Application of overrides and absolute flags
        if (prefersReducedMotion || isSaveData) {
            tier = "lite";
            override = "forced";
        }

        if (storageOverride && (storageOverride === "lite" || storageOverride === "full")) {
            tier = storageOverride;
            override = "localStorage";
        }

        if (urlOverride && (urlOverride === "lite" || urlOverride === "full")) {
            tier = urlOverride;
            override = "url";
            localStorage.setItem(STORAGE_KEY, urlOverride);
        }

        // Dev-only logging (removed in production)
        if (process.env.NODE_ENV === "development") {
            console.log('[AdaptivePerf] Final Decision:', { tier, compositeScore, hardwareScore, networkScore, override });
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResult({
            tier,
            score: compositeScore,
            hardwareScore,
            networkScore,
            isReducedMotion: prefersReducedMotion,
            isSaveData,
            isLowBattery: false,
            override,
        });

        // Apply class to HTML for CSS overrides
        if (tier === "lite") {
            document.documentElement.classList.add("perf-lite");
        } else {
            document.documentElement.classList.remove("perf-lite");
        }
    }, []);

    return result;
}

export function setManualPerformanceTier(tier: PerformanceTier) {
    localStorage.setItem(STORAGE_KEY, tier);
    window.location.reload();
}
