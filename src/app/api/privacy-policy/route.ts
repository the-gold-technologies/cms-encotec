import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const PAGE_SLUG = "privacy-policy";

export async function GET() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
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
    console.error("Error fetching privacy policy content:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, content } = body;

    if (!section || typeof section !== "string") {
      return NextResponse.json(
        { success: false, error: "'section' (string) is required" },
        { status: 400 },
      );
    }

    if (!content || typeof content !== "object") {
      return NextResponse.json(
        { success: false, error: "'content' (object) is required" },
        { status: 400 },
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug: PAGE_SLUG },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Privacy Policy page not found" },
        { status: 404 },
      );
    }

    const existingSection = await prisma.section.findFirst({
      where: {
        pageId: page.id,
        type: section,
      },
    });

    let updatedSection;
    if (existingSection) {
      updatedSection = await prisma.section.update({
        where: { id: existingSection.id },
        data: { content },
      });
    } else {
      updatedSection = await prisma.section.create({
        data: {
          pageId: page.id,
          type: section,
          content,
        },
      });
    }

    return NextResponse.json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error updating privacy policy section:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
