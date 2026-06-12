import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const servicesPage = await prisma.page.findUnique({
      where: { slug: "services" },
      include: {
        sections: true,
      },
    });

    const mergedData = links.map((link: any) => {
      const urlMatchesSlug = (url: string, slug: string) => {
        if (url === "/" && slug === "home") return true;
        return url === `/${slug}`;
      };

      // 1. Try to match with a regular page
      const matchedPage = pages.find((p: any) => urlMatchesSlug(link.url, p.slug));

      if (matchedPage) {
        return {
          id: link.id,
          pageId: matchedPage.id,
          title: link.label,
          slug: matchedPage.slug,
          metaTitle: matchedPage.metaTitle,
          metaDescription: matchedPage.metaDescription,
          type: link.type || matchedPage.type,
          visibility: matchedPage.visibility,
          parent: link.parent,
          order: link.order,
          description: link.description,
          navTitle: link.title,
          isStatic: link.isStatic,
        };
      }

      // 2. Try to match with a service sub-page
      if (link.url.startsWith("/service/") && servicesPage) {
        const serviceId = link.url.split("/service/")[1];
        const section = servicesPage.sections.find((s: any) => s.type === serviceId);
        if (section) {
          const content = section.content as any;
          return {
            id: link.id,
            pageId: `${servicesPage.id}-${serviceId}`,
            title: link.label,
            slug: link.url.replace(/^\//, ""),
            metaTitle: content.seo?.metaTitle || null,
            metaDescription: content.seo?.metaDescription || null,
            type: link.type || "sub-link",
            visibility: "published",
            parent: link.parent,
            order: link.order,
            description: link.description,
            navTitle: link.title,
            isStatic: link.isStatic,
          };
        }
      }

      // 3. Fallback for static/missing links
      return {
        id: link.id,
        pageId: null,
        title: link.label,
        slug: link.url === "/" ? "home" : link.url.replace(/^\//, ""),
        metaTitle: null,
        metaDescription: null,
        type: link.type || "static",
        visibility: "published",
        parent: link.parent,
        order: link.order,
        description: link.description,
        navTitle: link.title,
        isStatic: link.isStatic,
      };
    });

    const slugMap: Record<string, string> = {
      "engineering": "engineering-services",
      "project-management": "project-management",
      "power-generation": "power-generation",
      "transmission-distribution": "transmission-distribution",
      "renewable-energy": "renewable-energy",
      "airport-services": "airport-services",
      "value-added": "value-added",
    };

    const servicesLink = links.find((l: any) => l.url === "/services");
    const serviceSubpages = [];
    if (servicesPage) {
      const subserviceIds = [
        "engineering",
        "project-management",
        "power-generation",
        "transmission-distribution",
        "renewable-energy",
        "airport-services",
        "value-added"
      ];
      
      for (const serviceId of subserviceIds) {
        const pageSlug = slugMap[serviceId];
        const subpage = pages.find((p: any) => p.slug === pageSlug);
        
        serviceSubpages.push({
          id: `sub-${serviceId}`,
          pageId: subpage ? subpage.id : `${servicesPage.id}-${serviceId}`,
          title: subpage ? subpage.title : (serviceId.charAt(0).toUpperCase() + serviceId.slice(1).replace("-", " ")),
          slug: `service/${serviceId}`,
          metaTitle: subpage ? subpage.metaTitle : null,
          metaDescription: subpage ? subpage.metaDescription : null,
          type: "sub-link",
          visibility: subpage ? subpage.visibility : "published",
          parent: servicesLink ? servicesLink.id : "-",
          order: 1,
          isStatic: false
        });
      }
    }

    const finalData = mergedData.concat(serviceSubpages);

    return NextResponse.json({ success: true, data: finalData });
  } catch (error) {
    console.error("Error fetching pages for SEO:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
