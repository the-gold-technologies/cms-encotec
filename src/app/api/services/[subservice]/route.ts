import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
  { params }: { params: Promise<{ subservice: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subservice } = await params;
    const pageSlug = slugMap[subservice];

    if (!pageSlug) {
      return NextResponse.json({ error: "Subservice not found" }, { status: 404 });
    }

    const page = await prisma.page.findUnique({
      where: { slug: pageSlug },
      include: {
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ success: true, data: {} });
    }

    const sectionsMap: Record<string, unknown> = {};
    for (const section of page.sections) {
      sectionsMap[section.type] = section.content;
    }

    return NextResponse.json({ success: true, data: sectionsMap });
  } catch (error) {
    console.error("Error fetching subservice page content:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ subservice: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { subservice } = await params;
    const pageSlug = slugMap[subservice];

    if (!pageSlug) {
      return NextResponse.json({ error: "Subservice not found" }, { status: 404 });
    }

    const body = await request.json();
    const { section, content } = body;

    if (!section || typeof section !== "string") {
      return NextResponse.json(
        { success: false, error: "'section' (string) is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { success: false, error: "'content' (object) is required" },
        { status: 400 }
      );
    }

    // Capitalize display name for database creation
    const pageTitle = subservice
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const page = await prisma.page.upsert({
      where: { slug: pageSlug },
      create: {
        title: pageTitle,
        slug: pageSlug,
        type: "static",
        visibility: "published",
      },
      update: {},
    });

    const existingSection = await prisma.section.findFirst({
      where: { pageId: page.id, type: section },
    });

    let savedSection;
    if (existingSection) {
      savedSection = await prisma.section.update({
        where: { id: existingSection.id },
        data: { content },
      });
    } else {
      const sectionCount = await prisma.section.count({
        where: { pageId: page.id },
      });
      savedSection = await prisma.section.create({
        data: {
          pageId: page.id,
          type: section,
          content,
          order: sectionCount,
        },
      });
    }

    return NextResponse.json({ success: true, data: savedSection });
  } catch (error) {
    console.error("Error saving subservice page section:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
