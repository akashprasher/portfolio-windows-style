const approvedResumeHosts = new Set([
  "docs.google.com",
  "drive.google.com",
  "1drv.ms",
  "onedrive.live.com",
  "word.office.com",
  "word.cloud.microsoft",
  "onedrive.cloud.microsoft",
]);

export function isAllowedResumeUrl(value: string): boolean {
  if (!value) return true;

  return parseAllowedResumeUrl(value) !== null;
}

export function getAllowedResumeUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  return parseAllowedResumeUrl(value)?.toString() ?? null;
}

function parseAllowedResumeUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  const approvedHost =
    approvedResumeHosts.has(hostname) || hostname.endsWith(".sharepoint.com");

  if (
    url.protocol !== "https:" ||
    url.username !== "" ||
    url.password !== "" ||
    url.port !== "" ||
    !approvedHost
  ) {
    return null;
  }

  return url;
}
