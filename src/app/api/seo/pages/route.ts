import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { navUrlToSeoSlug, seoSlugToPageSlug, SERVICE_SUBPAGES } from "@/lib/seoSlug";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        type: true,
        visibility: true,
      },
    });

    const links = await prisma.navLink.findMany({
      orderBy: { order: "asc" },
    });

    const findPage = (seoSlug: string) => {
      const pageSlug = seoSlugToPageSlug(seoSlug);
      return pageSlug ? pages.find((p: any) => p.slug === pageSlug) : undefined;
    };

    const mergedData = links.map((link: any) => {
      // Every nav link (including Dropdown parents like Services / Insights, which
      // are real pages on the website) resolves to one canonical SEO slug.
      const slug = navUrlToSeoSlug(link.url);
      const matchedPage = findPage(slug);

      return {
        id: link.id,
        pageId: matchedPage?.id ?? null,
        title: link.label,
        slug,
        metaTitle: matchedPage?.metaTitle ?? null,
        metaDescription: matchedPage?.metaDescription ?? null,
        type: link.type || matchedPage?.type || "static",
        visibility: matchedPage?.visibility ?? "published",
        parent: link.parent,
        order: link.order,
        description: link.description,
        navTitle: link.title,
        isStatic: link.isStatic,
      };
    });

    // Add any service sub-page that exists on the website but is missing from navigation.
    const servicesLink = links.find((l: any) => l.url === "/services");
    const listedSlugs = new Set(mergedData.map((d: any) => d.slug));
    const missingServicePages = SERVICE_SUBPAGES.filter(
      (id) => !listedSlugs.has(`service/${id}`),
    ).map((id, i) => {
      const subpage = pages.find((p: any) => p.slug === id);
      return {
        id: `sub-${id}`,
        pageId: subpage?.id ?? null,
        title:
          subpage?.title ??
          id.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
        slug: `service/${id}`,
        metaTitle: subpage?.metaTitle ?? null,
        metaDescription: subpage?.metaDescription ?? null,
        type: "Sub-link",
        visibility: subpage?.visibility ?? "published",
        parent: servicesLink ? servicesLink.id : "-",
        order: 100 + i,
        isStatic: false,
      };
    });

    return NextResponse.json({
      success: true,
      data: mergedData.concat(missingServicePages),
    });
  } catch (error) {
    console.error("Error fetching pages for SEO:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
