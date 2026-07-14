import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const slugMap: Record<string, string> = {
  "engineering": "engineering-services",
  "project-management": "project-management",
  "power-generation": "power-generation",
  "transmission-distribution": "transmission-distribution",
  "renewable-energy": "renewable-energy",
  "airport-services": "airport-services",
  "value-added": "value-added",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    // Handle service sub-pages
    if (slug.startsWith("service/")) {
      const serviceId = slug.split("service/")[1];
      const pageSlug = slugMap[serviceId];
      if (!pageSlug) {
        return NextResponse.json(
          { success: false, error: "Service not found" },
          { status: 404 },
        );
      }

      const subpage = await prisma.page.findUnique({
        where: { slug: pageSlug },
        select: {
          id: true,
          title: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
          targetKeywords: true,
          canonicalUrl: true,
          noIndex: true,
          featuredImage: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
          schema: true,
          headingOptions: true,
        },
      });

      if (!subpage) {
        return NextResponse.json(
          { success: false, error: "Service page not found in DB" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          ...subpage,
          slug: slug, // Keep the requested slug format for CMS compatibility
        },
      });
    }

    const page = await prisma.page.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        metaTitle: true,
        metaDescription: true,
        targetKeywords: true,
        canonicalUrl: true,
        noIndex: true,
        featuredImage: true,
        ogTitle: true,
        ogDescription: true,
        ogImage: true,
        schema: true,
        headingOptions: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching page SEO data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const body = await request.json();
    const { seo } = body;

    if (!seo) {
      return NextResponse.json(
        { success: false, error: "SEO data is required" },
        { status: 400 },
      );
    }

    // Handle service sub-pages
    if (slug.startsWith("service/")) {
      const serviceId = slug.split("service/")[1];
      const pageSlug = slugMap[serviceId];
      if (!pageSlug) {
        return NextResponse.json(
          { success: false, error: "Service not found" },
          { status: 404 },
        );
      }

      const updatedPage = await prisma.page.upsert({
        where: { slug: pageSlug },
        update: {
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
          targetKeywords: seo.targetKeywords,
          canonicalUrl: seo.canonicalUrl,
          noIndex: seo.noIndex,
          featuredImage: seo.featuredImage,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          ogImage: seo.ogImage,
          schema: seo.schema,
          headingOptions: seo.headingOptions,
        },
        create: {
          slug: pageSlug,
          title: seo.metaTitle || serviceId.charAt(0).toUpperCase() + serviceId.slice(1),
          metaTitle: seo.metaTitle,
          metaDescription: seo.metaDescription,
          targetKeywords: seo.targetKeywords,
          canonicalUrl: seo.canonicalUrl,
          noIndex: seo.noIndex || false,
          featuredImage: seo.featuredImage,
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
          ogImage: seo.ogImage,
          schema: seo.schema,
          headingOptions: seo.headingOptions || {},
          visibility: "published",
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          ...updatedPage,
          slug: slug, // Keep requested slug for compatibility
        },
      });
    }

    const updatedPage = await prisma.page.upsert({
      where: { slug },
      update: {
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        targetKeywords: seo.targetKeywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex,
        featuredImage: seo.featuredImage,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImage: seo.ogImage,
        schema: seo.schema,
        headingOptions: seo.headingOptions,
      },
      create: {
        slug,
        title: seo.metaTitle || slug.charAt(0).toUpperCase() + slug.slice(1),
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        targetKeywords: seo.targetKeywords,
        canonicalUrl: seo.canonicalUrl,
        noIndex: seo.noIndex || false,
        featuredImage: seo.featuredImage,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImage: seo.ogImage,
        schema: seo.schema,
        headingOptions: seo.headingOptions || {},
        visibility: "published",
      },
    });

    return NextResponse.json({ success: true, data: updatedPage });
  } catch (error) {
    console.error("Error updating page SEO data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
