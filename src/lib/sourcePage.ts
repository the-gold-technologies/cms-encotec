/**
 * Helpers for the page an enquiry was submitted from.
 * The website sends `sourcePage` as the URL pathname (e.g. "/services/power-generation"),
 * and the label is derived from the path so new pages work without code changes.
 */

// Optional nicer names for specific paths. Anything not listed is auto-labelled.
const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/contact": "Contact Us",
  "/services/power-generation": "Power Generation (O&M)",
  "/services/construction-commissioning": "Construction & Commissioning",
  "/services/value-added": "Value-Added Services",
};

/** Normalise any path or full URL to a clean lowercase pathname ("/", "/contact", ...). */
export function normalizeSourcePath(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  let path = raw.trim();
  try {
    if (/^https?:\/\//i.test(path)) path = new URL(path).pathname;
  } catch {
    return null;
  }
  path = path.split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  return path.slice(0, 300) || "/";
}

/** Human-readable label for a stored source path. */
export function getSourcePageLabel(path: string | null | undefined): string {
  if (!path) return "Not recorded";
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  return path
    .split("/")
    .filter(Boolean)
    .map((seg) =>
      decodeURIComponent(seg)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    )
    .join(" / ");
}
