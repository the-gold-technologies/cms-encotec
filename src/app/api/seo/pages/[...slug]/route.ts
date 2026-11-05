import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seoSlugToPageSlug } from "@/lib/seoSlug";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string | string[] }> },
) {
  try {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug.join("/") : rawSlug;

    const pageSlug = seoSlugToPageSlug(slug);
    if (!pageSlug) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    const page = await prisma.page.findUnique({
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

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 },
      );
    }

    // Keep the requested slug so the CMS editor URL stays stable
    return NextResponse.json({ success: true, data: { ...page, slug } });
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

    const pageSlug = seoSlugToPageSlug(slug);
    if (!pageSlug) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
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
        title:
          seo.metaTitle || pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
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
      data: { ...updatedPage, slug },
    });
  } catch (error) {
    console.error("Error updating page SEO data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
