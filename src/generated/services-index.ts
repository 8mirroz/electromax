// AUTO-GENERATED FILE. DO NOT EDIT.
// Generated at: 2026-02-24T21:22:14.746Z

export const SERVICE_SLUGS = [
  "aps",
  "asuz",
  "eo",
  "eom",
  "os",
  "sks",
  "skud",
  "sot",
  "soue",
  "to",
  "ov",
  "p",
  "pnr",
] as const;

// Alias for backward compatibility
export const GENERATED_SERVICE_SLUGS = SERVICE_SLUGS;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
export type GeneratedServiceSlug = ServiceSlug;

export const SERVICE_TITLES: Record<ServiceSlug, string> = {
  aps: "Автоматическая пожарная сигнализация",
  asuz: "Автоматизация",
  eo: "Освещение",
  eom: "Электроснабжение",
  os: "Охранная сигнализация",
  sks: "Структурированные кабельные системы",
  skud: "Системы контроля доступа",
  sot: "Видеонаблюдение",
  soue: "Система оповещения",
  to: "Техническое обслуживание",
  ov: "Вентиляция",
  p: "Проектирование",
  pnr: "Пусконаладка",
};

export const SERVICE_SHORT_NAMES: Record<ServiceSlug, string> = {
  aps: "APS",
  asuz: "ASUZ",
  eo: "EO",
  eom: "EOM",
  os: "OS",
  sks: "SKS",
  skud: "SKUD",
  sot: "SOT",
  soue: "SOUE",
  to: "TO",
  ov: "OV",
  p: "P",
  pnr: "PNR",
};

export function getServiceBySlug(slug: string): ServiceSlug | undefined {
  return SERVICE_SLUGS.find((s) => s === slug);
}

export function isValidServiceSlug(slug: string): slug is ServiceSlug {
  return SERVICE_SLUGS.includes(slug as ServiceSlug);
}
