// Maps between the SEO slugs used in the CMS / website and the Page.slug stored in the DB.
//
// SEO slug (URL of /seo/pages/<slug> and /api/seo/pages/<slug>):
//   "service/<id>"   -> service sub-pages   (website: /services/<id>)
//   "insights/<id>"  -> insights sub-pages  (website: /insights/<id>)
//   anything else    -> same as Page.slug   (e.g. "services", "insights", "about")
//
// The website reads SEO from Page rows (via /api/pages/<pageSlug> and /api/seo/pages/<seoSlug>),
// so every SEO slug must resolve to the same Page row.

export const SERVICE_SUBPAGES = [
  "project-management",
  "power-generation",
  "construction-commissioning",
  "technical-advisory",
  "due-diligence",
  "value-added",
] as const;

export const INSIGHTS_SUBPAGES = [
  "case-studies",
  "news-updates",
  "blogs-articles",
] as const;

/** SEO slug -> Page.slug in the DB. Returns null for an unknown sub-page. */
export function seoSlugToPageSlug(seoSlug: string): string | null {
  const slug = seoSlug.replace(/^\/+|\/+$/g, "");

  const serviceMatch = slug.match(/^services?\/(.+)$/);
  if (serviceMatch) {
    const id = serviceMatch[1];
    return (SERVICE_SUBPAGES as readonly string[]).includes(id) ? id : null;
  }

  const insightsMatch = slug.match(/^insights\/(.+)$/);
  if (insightsMatch) {
    const id = insightsMatch[1];
    return (INSIGHTS_SUBPAGES as readonly string[]).includes(id) ? id : null;
  }

  return slug || "home";
}

/** Navigation URL (e.g. "/services/value-added") -> canonical SEO slug (e.g. "service/value-added"). */
export function navUrlToSeoSlug(url: string): string {
  const clean = (url || "").split(/[?#]/)[0].replace(/\/+$/, "");
  if (clean === "" || clean === "/") return "home";

  const serviceMatch = clean.match(/^\/services?\/(.+)$/);
  if (serviceMatch) return `service/${serviceMatch[1]}`;

  return clean.replace(/^\/+/, "");
}
