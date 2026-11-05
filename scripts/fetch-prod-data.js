/**
 * Script to fetch all production CMS data from https://cms.encotecenergy.com
 * and update both prisma/production-data.json and prisma/seed.js.
 *
 * Usage:
 *   node scripts/fetch-prod-data.js
 */

const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.PROD_API_URL || "https://cms.encotecenergy.com";

async function main() {
  console.log(`Connecting to production CMS at: ${BASE_URL}...`);

  // 1. Global SEO config
  console.log("Fetching global SEO config...");
  const globalRes = await fetch(`${BASE_URL}/api/seo/global`);
  if (!globalRes.ok) throw new Error(`Failed to fetch global config: ${globalRes.status}`);
  const globalJson = await globalRes.json();
  const rawGlobal = globalJson.data || {};

  const globalConfig = {
    id: rawGlobal.id || "global",
    siteTitle: rawGlobal.siteTitle,
    siteDescription: rawGlobal.siteDescription,
    favicon: rawGlobal.favicon,
    googleAnalyticsId: rawGlobal.googleAnalyticsId || "",
    gtmId: rawGlobal.gtmId || "",
    searchConsoleId: rawGlobal.searchConsoleId || "",
    customHeaderScripts: rawGlobal.customHeaderScripts,
    customFooterScripts: rawGlobal.customFooterScripts,
    socialLinks: rawGlobal.socialLinks || [],
    canonicalOrdering: rawGlobal.canonicalOrdering || "default",
    sitemapEnabled: rawGlobal.sitemapEnabled ?? true,
    sitemapCustomContent: rawGlobal.sitemapCustomContent,
    robotsTxt: rawGlobal.robotsTxt,
    schema: rawGlobal.schema,
    headingOptions: rawGlobal.headingOptions || { heroHeadingTag: "h1" },
  };

  // 2. Navigation links
  console.log("Fetching navigation links...");
  const navRes = await fetch(`${BASE_URL}/api/nav-links`);
  if (!navRes.ok) throw new Error(`Failed to fetch nav links: ${navRes.status}`);
  const navJson = await navRes.json();
  const allNavLinks = (navJson.data || []).map((n) => ({
    id: n.id,
    label: n.label,
    url: n.url,
    type: n.type || "Main Link",
    parent: n.parent || "-",
    order: n.order ?? 0,
    description: n.description ?? null,
    title: n.title ?? null,
    isStatic: n.isStatic ?? false,
  }));

  // Sort root links first (parent: "-"), then child links (parent: "<parentId>")
  const rootNavLinks = allNavLinks.filter((n) => n.parent === "-").sort((a, b) => a.order - b.order);
  const subNavLinks = allNavLinks.filter((n) => n.parent !== "-").sort((a, b) => a.order - b.order);
  const navLinks = [...rootNavLinks, ...subNavLinks];

  // 3. Pages catalog
  console.log("Fetching pages catalog...");
  const statsRes = await fetch(`${BASE_URL}/api/dashboard/stats`);
  if (!statsRes.ok) throw new Error(`Failed to fetch dashboard stats: ${statsRes.status}`);
  const statsJson = await statsRes.json();
  const pagesList = statsJson.data?.pagesList || [];

  console.log(`Found ${pagesList.length} pages. Fetching full content and sections...`);
  const pages = [];
  for (const item of pagesList) {
    const pageRes = await fetch(`${BASE_URL}/api/pages/${encodeURIComponent(item.slug)}`);
    if (!pageRes.ok) {
      console.warn(`Warning: Could not fetch page ${item.slug} (${pageRes.status})`);
      continue;
    }
    const pageJson = await pageRes.json();
    const p = pageJson.data;

    pages.push({
      id: p.id,
      title: p.title,
      slug: p.slug,
      parent: p.parent || "-",
      order: p.order ?? 0,
      type: p.type || "standard",
      visibility: p.visibility || "draft",
      isStatic: p.isStatic ?? false,
      description: p.description ?? null,
      metaTitle: p.seo?.metaTitle ?? p.metaTitle ?? null,
      metaDescription: p.seo?.metaDescription ?? p.metaDescription ?? null,
      targetKeywords: p.seo?.targetKeywords ?? p.targetKeywords ?? null,
      canonicalUrl: p.seo?.canonicalUrl ?? p.canonicalUrl ?? null,
      noIndex: p.seo?.noIndex ?? p.noIndex ?? false,
      featuredImage: p.seo?.featuredImage ?? p.featuredImage ?? null,
      ogTitle: p.seo?.ogTitle ?? p.ogTitle ?? null,
      ogDescription: p.seo?.ogDescription ?? p.ogDescription ?? null,
      ogImage: p.seo?.ogImage ?? p.ogImage ?? null,
      schema: p.seo?.schema ?? p.schema ?? null,
      headingOptions: p.seo?.headingOptions ?? p.headingOptions ?? null,
      sections: (p.sections || []).map((s) => ({
        id: s.id,
        type: s.type,
        order: s.order ?? 0,
        content: s.content || {},
      })),
    });
  }

  // 4. Enquiries
  console.log("Fetching enquiries...");
  let enquiries = [];
  try {
    const enqRes = await fetch(`${BASE_URL}/api/enquiries?limit=100`);
    if (enqRes.ok) {
      const enqJson = await enqRes.json();
      enquiries = (enqJson.data || [])
        .filter((e) => {
          // Filter out obvious bot spam
          const dotCount = ((e.email || "").split("@")[0].match(/\./g) || []).length;
          if (dotCount >= 4) return false;
          const cleanName = (e.name || "").trim().toLowerCase();
          if (cleanName.length >= 4 && cleanName.length <= 10 && !/[aeiouy]/.test(cleanName)) return false;
          return true;
        })
        .map((e) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          interestedIn: e.interestedIn ?? null,
          budget: e.budget ?? null,
          projectGoals: e.projectGoals ?? null,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
        }));
    }
  } catch (err) {
    console.warn("Could not fetch enquiries:", err.message);
  }

  // 5. Job Applications
  console.log("Fetching job applications...");
  let jobApplications = [];
  try {
    const jobRes = await fetch(`${BASE_URL}/api/job-applications?limit=100`);
    if (jobRes.ok) {
      const jobJson = await jobRes.json();
      jobApplications = (jobJson.data || []).map((j) => ({
        id: j.id,
        name: j.name,
        email: j.email,
        phone: j.phone ?? null,
        jobTitle: j.jobTitle ?? null,
        department: j.department ?? null,
        jobLocation: j.jobLocation ?? null,
        experience: j.experience ?? null,
        coverLetter: j.coverLetter ?? null,
        resumeName: j.resumeName ?? null,
        resumeUrl: j.resumeUrl ?? null,
        resumeBase64: null, // Keep file lightweight; cloud resumeUrl is preserved
        status: j.status || "Pending",
        createdAt: j.createdAt,
        updatedAt: j.updatedAt,
      }));
    }
  } catch (err) {
    console.warn("Could not fetch job applications:", err.message);
  }

  // Save production data JSON
  const dataDump = {
    fetchedAt: new Date().toISOString(),
    sourceUrl: BASE_URL,
    globalConfig,
    navLinks,
    pages,
    enquiries,
    jobApplications,
  };
  const jsonPath = path.resolve(__dirname, "../prisma/production-data.json");
  fs.writeFileSync(jsonPath, JSON.stringify(dataDump, null, 2));
  console.log(`Saved production dump to: ${jsonPath}`);

  // Generate prisma/seed.js
  const seedContent = `const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ==========================================
// PRODUCTION DATA DUMP FROM cms.encotecenergy.com
// ==========================================

const globalConfigData = ${JSON.stringify(globalConfig, null, 2)};

const navLinksData = ${JSON.stringify(navLinks, null, 2)};

const pagesData = ${JSON.stringify(pages, null, 2)};

const enquiriesData = ${JSON.stringify(enquiries, null, 2)};

const jobApplicationsData = ${JSON.stringify(jobApplications, null, 2)};

async function main() {
  console.log("Seeding started with production data...");

  // 1. Clean existing database
  console.log("Cleaning existing records...");
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.navLink.deleteMany({});
  await prisma.globalConfig.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.jobApplication.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Default Admin User
  const hashedPassword = await bcrypt.hash("1234asdf@", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@encotec.com",
      password: hashedPassword,
    },
  });
  console.log("Created admin user:", adminUser.email);

  // 3. Create Global Config
  await prisma.globalConfig.create({
    data: globalConfigData,
  });
  console.log("Created global config");

  // 4. Create Pages & Sections
  console.log("Creating pages and sections...");
  for (const page of pagesData) {
    const { sections, ...pageFields } = page;
    await prisma.page.create({
      data: {
        ...pageFields,
        sections: {
          create: sections.map((sec) => ({
            id: sec.id,
            type: sec.type,
            order: sec.order,
            content: sec.content,
          })),
        },
      },
    });
    console.log(\`Created page: "\${page.title}" (\${page.slug}) with \${sections.length} sections\`);
  }

  // 5. Create Navigation Links (Roots first, then Sublinks)
  console.log("Creating navigation links...");
  for (const link of navLinksData) {
    await prisma.navLink.create({
      data: link,
    });
  }
  console.log(\`Created \${navLinksData.length} navigation links\`);

  // 6. Create Enquiries
  if (enquiriesData.length > 0) {
    console.log("Creating enquiries...");
    for (const enq of enquiriesData) {
      await prisma.enquiry.create({
        data: {
          ...enq,
          createdAt: enq.createdAt ? new Date(enq.createdAt) : undefined,
          updatedAt: enq.updatedAt ? new Date(enq.updatedAt) : undefined,
        },
      });
    }
    console.log(\`Created \${enquiriesData.length} enquiries\`);
  }

  // 7. Create Job Applications
  if (jobApplicationsData.length > 0) {
    console.log("Creating job applications...");
    for (const job of jobApplicationsData) {
      await prisma.jobApplication.create({
        data: {
          ...job,
          createdAt: job.createdAt ? new Date(job.createdAt) : undefined,
          updatedAt: job.updatedAt ? new Date(job.updatedAt) : undefined,
        },
      });
    }
    console.log(\`Created \${jobApplicationsData.length} job applications\`);
  }

  console.log("Seeding complete successfully with production data!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;

  const seedPath = path.resolve(__dirname, "../prisma/seed.js");
  fs.writeFileSync(seedPath, seedContent);
  console.log(`Updated seed file at: ${seedPath}`);
  console.log("Done! Production data successfully fetched and seed file updated.");
}

main().catch((err) => {
  console.error("Error fetching production data:", err);
  process.exit(1);
});
