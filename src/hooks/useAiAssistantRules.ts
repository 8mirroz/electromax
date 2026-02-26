"use client";

import type { AiAssistantRecommendation, AiAssistRule, ProjectTrayState, ServicePageModel } from "@/types";

interface EvaluateArgs {
  serviceSlug: string;
  tray: ProjectTrayState;
  rules: AiAssistRule[];
}

function hasCategory(tray: ProjectTrayState, category: string) {
  return tray.items.some((item) => item.category === category);
}

function hasItemCode(tray: ProjectTrayState, itemCode: string) {
  return tray.items.some((item) => item.itemCode === itemCode);
}

export function evaluateAiAssistantRules({ serviceSlug, tray, rules }: EvaluateArgs): AiAssistantRecommendation[] {
  const recommendations: AiAssistantRecommendation[] = [];

  for (const rule of rules) {
    let matched = false;

    if (rule.triggerType === "service_open") {
      matched = tray.serviceSlug === null || tray.serviceSlug === serviceSlug || tray.items.length === 0;
    }
    if (rule.triggerType === "tray_empty") {
      matched = tray.items.length === 0;
    }
    if (rule.triggerType === "has_item" && rule.triggerValue) {
      matched = hasItemCode(tray, rule.triggerValue);
    }
    if (rule.triggerType === "missing_category" && rule.triggerValue) {
      matched = !hasCategory(tray, rule.triggerValue);
    }
    if (rule.triggerType === "selected_kit" && rule.triggerValue) {
      matched = tray.selectedKitIds.includes(rule.triggerValue);
    }

    if (!matched) continue;

    recommendations.push({
      id: rule.id,
      type: rule.recommendServiceSlug ? "add_service" : rule.triggerType === "missing_category" ? "check_dependency" : "next_step",
      message: rule.messageText,
      actionLabel: rule.recommendServiceSlug ? "Открыть связанную услугу" : rule.recommendItemCode ? "Добавить позицию" : "Проверить состав проекта",
      recommendItemCode: rule.recommendItemCode,
      recommendServiceSlug: rule.recommendServiceSlug,
      priority: rule.priority,
    });
  }

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

export function useAiAssistantRules(args: { model: ServicePageModel; tray: ProjectTrayState }) {
  const recommendations = evaluateAiAssistantRules({
    serviceSlug: args.model.slug,
    tray: args.tray,
    rules: args.model.aiRules,
  });

  const warnings = [] as string[];
  if (args.tray.items.length > 0 && !args.tray.items.some((item) => item.category === "Этапы проекта")) {
    warnings.push("В проекте нет базового этапа (аудит/проект/монтаж). Проверьте состав.");
  }

  return { recommendations, warnings };
}
