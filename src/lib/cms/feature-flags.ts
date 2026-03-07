export function isCmsEnabled() {
  return process.env.CMS_ENABLED === "true";
}

export function getCmsBaseUrl() {
  return process.env.CMS_BASE_URL?.replace(/\/+$/, "") || "";
}
