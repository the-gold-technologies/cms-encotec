import { PrismaClient } from "@prisma/client";

// In-memory mock database state
const mockPages: any[] = [
  {
    id: "page-home",
    title: "Home",
    slug: "home",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "Welcome to Encotec",
    metaTitle: "Encotec Energy - Power Plant O&M and Engineering Services",
    metaDescription: "Providing engineering services since 2011",
    targetKeywords: "engineering, power generation, transmission",
    canonicalUrl: "",
    noIndex: false,
    featuredImage: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-h1",
        pageId: "page-home",
        type: "HeroSection",
        content: {
          tagline: "End-to-End Solutions for Critical Assets",
          headlineLine1: "Engineering",
          headlineHighlight: "Expertise.",
          headlineLine2: "Operational Reliability.",
          description:
            "Encotec delivers specialised engineering, operations and maintenance services across power generation and critical infrastructure. From keeping complex power plants running reliably to supporting construction, commissioning, airport utilities and critical equipment sourcing, we combine technical expertise with hands-on execution.",
          primaryBtnLabel: "Explore Our Services",
          primaryBtnUrl: "/services",
          secondaryBtnLabel: "Talk to Our Experts",
          secondaryBtnUrl: "/contact",
          serviceTags: [
            { label: "STEWARDSHIP", url: "/services/power-generation" },
            { label: "COMMISSIONING", url: "/services/engineering" },
            { label: "ADVISORY", url: "/services/project-management" },
            { label: "GLOBAL SOURCING", url: "/services/value-added" },
          ],
          projectsBadgeNumber: "",
          projectsBadgeLabel: "",
          stats: [
            { value: "2009", label: "FOUNDING YEAR" },
            { value: "2011", label: "STARTED OPERATIONS" },
            { value: "13+", label: "KEY LOCATIONS" },
            { value: "300+", label: "Engineers" },
            { value: "1800+", label: "MANPOWER" },
            { value: "10+ GW", label: "POWER CAPACITY O&M EXECUTED" },
          ],
          images: [
            "https://res.cloudinary.com/dpa93copz/image/upload/v1790592912/encotec-Assets/hero/supercritical_thermal_plant.jpg",
            "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
          ],
        },
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h2",
        pageId: "page-home",
        type: "AboutUs",
        content: {
          upperTag: "Positioning & Leadership",
          headingLabel: "Keeping Critical Infrastructure",
          headingItalicHighlight: "Performing",
          paragraphs: [
            "Critical infrastructure demands more than technical capability. It requires experience, disciplined execution and a clear understanding of what keeps an asset safe, reliable and productive.",
            "Encotec partners with asset owners, operators, EPC companies and infrastructure organisations to manage complex technical challenges across the asset lifecycle.",
            "Our teams bring together engineering expertise, field experience and operational discipline to deliver solutions that work in the real world - from construction and commissioning through long-term operations and maintenance.",
            "The result: dependable performance, informed decision-making and greater confidence in critical assets.",
          ],
          ctaLabel: "Explore Our Story",
          ctaUrl: "/about",
          image:
            "https://res.cloudinary.com/dpa93copz/image/upload/v1790586089/encotec-Assets/about/human_centric_engineer.jpg",
          imageAlt:
            "Encotec Indian power plant engineer in thermal generation facility",
          badgeValue: "Est. 2011",
          badgeLabel: "Pioneering Energy",
          badgeIcon: "Zap",
          stats: [
            { value: "2011", label: "FOUNDED YEAR", icon: "Calendar" },
            { value: "13+", label: "KEY LOCATIONS", icon: "Globe" },
            { value: "100+", label: "INDUSTRY SPECIALISTS", icon: "Award" },
            { value: "1800+", label: "MANPOWER", icon: "Users" },
            {
              value: "20+ GW",
              label: "POWER CAPACITY O&M EXECUTED",
              icon: "Zap",
            },
          ],
          bannerHeading: "Beyond Maintenance. Responsible Asset Stewardship.",
          bannerDescription:
            "We believe critical infrastructure deserves more than a service provider. It deserves a partner who understands the responsibility that comes with operating, maintaining and improving assets that people and businesses depend on. That is how we turn technical expertise into lasting value.",
          bannerButtonLabel: "Talk to Our Experts",
          bannerButtonUrl: "/contact",
        },
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h3",
        pageId: "page-home",
        type: "ServicesSection",
        content: {
          tagline: "What We Do",
          heading: "Specialised Services for Critical Assets",
          description:
            "From power generation to aviation infrastructure, Encotec provides specialised services designed around the technical and operational needs of critical assets.",
          services: [
            {
              title: "Power Plant O&M",
              subtitle:
                "Reliable operations. Disciplined maintenance. Better asset performance.",
              description:
                "We operate and maintain power-generation assets with a focus on availability, safety, preventive maintenance and operational efficiency across large thermal plants and substations.",
              icon: "Flame",
              image:
                "https://res.cloudinary.com/dpa93copz/image/upload/v1790592912/encotec-Assets/hero/supercritical_thermal_plant.jpg",
              ctaLabel: "Explore Power Plant O&M",
              ctaUrl: "/services/power-generation",
            },
            {
              title: "Construction & Commissioning",
              subtitle: "From installation to successful commissioning.",
              description:
                "Encotec supports complex energy projects through erection, installation, testing and commissioning - helping clients move from construction to reliable operation with greater control over quality, safety and timelines.",
              icon: "ClipboardCheck",
              image:
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
              ctaLabel: "Explore Construction & Commissioning",
              ctaUrl: "/services/engineering",
            },
            {
              title: "Airport Utility Management",
              subtitle: "Keeping essential airport infrastructure running.",
              description:
                "Airports depend on reliable utility systems and uninterrupted operations. Encotec brings deep O&M experience to critical airport infrastructure with a focus on reliability, safety and continuity.",
              icon: "Network",
              image:
                "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
              ctaLabel: "Explore Airport Utility Management",
              ctaUrl: "/services/airport-services",
            },
            {
              title: "Technical Advisory",
              subtitle: "Technical insight for better asset decisions.",
              description:
                "When critical assets face performance, reliability or maintenance challenges, Encotec provides diagnostics, condition assessments, audits, and modernisation support to improve efficiency.",
              icon: "Search",
              image:
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
              ctaLabel: "Explore Technical Advisory",
              ctaUrl: "/services/project-management",
            },
            {
              title: "Critical Spare Parts Sourcing",
              subtitle:
                "The right part. The right specification. When it matters.",
              description:
                "Equipment downtime can quickly become expensive. Encotec helps clients source critical power-plant spare parts, particularly for Chinese-origin equipment, to exact client specifications.",
              icon: "Wrench",
              image:
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
              ctaLabel: "Explore Spare Parts Solutions",
              ctaUrl: "/services/value-added",
            },
          ],
        },
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h4",
        pageId: "page-home",
        type: "ProcessSection",
        content: {
          tagline: "Our Workflow",
          heading: "Workflow Followed for Each Project",
          steps: [
            {
              id: 1,
              title: "Logical Foundation",
              description:
                "We start by conceptualizing the project through rigorous feasibility studies and Detailed Project Reports (DPRs).",
              icon: "Search",
            },
            {
              id: 2,
              title: "Strategic Alignment",
              description:
                "Our team develops technical specifications and assists in the selection of the right partners to ensure a solid start.",
              icon: "PenTool",
            },
            {
              id: 3,
              title: "Technical Realization",
              description:
                "We manage the precision erection and commissioning of assets, whether they are new builds or relocated plants.",
              icon: "HardHat",
            },
            {
              id: 4,
              title: "Operations / Optimization",
              description:
                "We transition into long-term stewardship, providing operation and maintenance with the same care as the asset owner.",
              icon: "CheckCircle2",
            },
            {
              id: 5,
              title: "Continuous Improvement",
              description:
                "Through regular performance diagnostics and energy audits, we ensure your asset remains efficient and reliable for its entire lifecycle.",
              icon: "Activity",
            },
          ],
        },
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h5",
        pageId: "page-home",
        type: "ProjectShowcaseSection",
        content: {
          tagline: "Case Studies",
          heading: "Stewardship in Action",
          description:
            "Delivering critical energy infrastructure with precision engineering and an owner's mindset.",
          viewAllLabel: "View All Case Studies",
          viewAllUrl: "/insights",
          projects: [
            {
              title: "Supercritical Mastery at Rajpura",
              location: "Rajpura, Punjab",
              category: "Asset Stewardship",
              description:
                "Providing O&M services for a 2x700 MW Supercritical plant, ensuring long-term reliability for Punjab's energy heart.",
              image:
                "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2000",
              ctaUrl: "/insights/ensuring-reliability-rajpura",
            },
            {
              title: "Powering India's Gateway (DIAL)",
              location: "New Delhi",
              category: "Airport Utility Management",
              description:
                "Five years of continuous, high-reliability utility management at Delhi International Airport, recently renewed for another five years due to exceptional performance.",
              image:
                "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=2000",
              ctaUrl: "/insights/powering-gateway-india-airport",
            },
          ],
        },
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h6",
        pageId: "page-home",
        type: "GlobalFootprintSection",
        content: {
          tagline: "Global Presence",
          heading: "Connected Intelligence",
          description:
            "A live network of energy systems operating in synchronization across continents.",
          stats: [
            { value: "10+", label: "GLOBAL LOCATIONS" },
            { value: "10+ GW", label: "CAPACITY" },
            { value: "1,800+", label: "MANPOWER" },
            { value: "300+", label: "ENGINEERS" },
            { value: "100+", label: "INDUSTRY SPECIALISTS" },
          ],
          locations: [
            {
              name: "India (HQ)",
              coordinates: [77.39, 28.58],
              region: "India",
              address: "Corporate Headquarters",
              suite: "Noida, Uttar Pradesh",
              phone: "+91 120 555 0100",
            },
            {
              name: "Turkey",
              coordinates: [32.86, 39.93],
              region: "International",
              address: "Celikler Energy Project",
              suite: "Ankara, Turkey",
              phone: "+90 312 555 0100",
            },
            {
              name: "Bahrain",
              coordinates: [50.58, 26.07],
              region: "International",
              address: "Energy Infrastructure",
              suite: "Manama, Bahrain",
              phone: "+973 1755 0200",
            },
            {
              name: "UAE",
              coordinates: [55.27, 25.2],
              region: "International",
              address: "Regional Infrastructure Project",
              suite: "Dubai, UAE",
              phone: "+971 4 555 0199",
            },
            {
              name: "Indonesia",
              coordinates: [106.84, -6.21],
              region: "International",
              address: "Power Plant Operations",
              suite: "Jakarta, Indonesia",
              phone: "+62 21 555 0188",
            },
            {
              name: "Vietnam",
              coordinates: [105.83, 21.03],
              region: "International",
              address: "Renewable Project Site",
              suite: "Hanoi, Vietnam",
              phone: "+84 24 555 0177",
            },
            {
              name: "Germany",
              coordinates: [13.4, 52.52],
              region: "International",
              address: "Dornier Group Hub",
              suite: "Berlin, Germany",
              phone: "+49 30 555 0166",
            },
            {
              name: "Tanzania",
              coordinates: [39.2, -6.79],
              region: "International",
              address: "Grid Commissioning Project",
              suite: "Dar es Salaam, Tanzania",
              phone: "+255 22 555 0155",
            },
            {
              name: "China",
              coordinates: [116.4, 39.9],
              region: "International",
              address: "Sourcing & Procurement Hub",
              suite: "Beijing, China",
              phone: "+86 10 555 0144",
            },
            {
              name: "Croatia",
              coordinates: [15.98, 45.81],
              region: "International",
              address: "Engineering Services",
              suite: "Zagreb, Croatia",
              phone: "+385 1 555 0133",
            },
          ],
        },
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h7",
        pageId: "page-home",
        type: "WhyEncotecSection",
        content: {
          revealWord1: "Engineering Expertise.",
          revealWord2: "Operational Reliability.",
          revealWord3: "Why Clients Choose Encotec.",
          ctaBlocks: [
            {
              headline: "Technical Depth",
              text: "Experienced engineers, technicians and operational teams with hands-on knowledge of complex energy assets.",
            },
            {
              headline: "Execution Experience",
              text: "Experience spanning operations, maintenance, construction, erection, testing, commissioning and specialised technical services.",
            },
            {
              headline: "Operational Focus",
              text: "We look beyond completing a scope of work to understand how our work affects availability, performance, safety and continuity.",
            },
            {
              headline: "Integrated Expertise",
              text: "Engineering, field execution, maintenance and sourcing capabilities brought together under one partner.",
            },
            {
              headline: "Global Know-How. Local Execution.",
              text: "Encotec combines international infrastructure expertise with strong, dependable on-ground execution capabilities across India and global energy markets.",
            },
          ],
        },
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h8",
        pageId: "page-home",
        type: "Testimonials",
        content: {
          tagline: "Testimonials",
          heading: "Trusted by Industry Leaders",
          testimonials: [
            {
              quote:
                "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own - uptime improved by 12% in the first year alone.",
              name: "Rajesh Mehta",
              title: "Senior Vice President, Operations",
              company: "National Thermal Power Corp.",
              initials: "RM",
            },
            {
              quote:
                "From feasibility to commissioning, Encotec delivered our 200 MW solar project on schedule and under budget. Their engineering precision and attention to detail set a new benchmark for our portfolio.",
              name: "Sarah Al-Rashid",
              title: "Project Director, Renewable Energy",
              company: "Gulf Energy Solutions",
              initials: "SA",
            },
          ],
        },
        order: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h9",
        pageId: "page-home",
        type: "LogoStripSection",
        content: {
          tagline: "Trusted by Industry Leaders",
          logos: [
            "Siemens Energy",
            "General Electric",
            "Vestas",
            "NextEra",
            "Orsted",
            "Enel",
            "Iberdrola",
          ],
        },
        order: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-h10",
        pageId: "page-home",
        type: "CTASection",
        content: {
          tagline: "Partner With Us",
          heading: "Experience Global Engineering Excellence.",
          description:
            "From India to Global, see how we are setting new standards in power infrastructure. Join the 13+ locations that rely on Encotec for their critical needs.",
          primaryBtnLabel: "Start Your Project",
          primaryBtnUrl: "/contact",
          secondaryBtnLabel: "Talk to an Expert",
          secondaryBtnUrl: "/contact",
          footerNote:
            "Looking for precision and reliability? Get in touch to learn more about our certified quality and safety-first approach.",
          copyright: "© 2026 Encotec Engineering.",
        },
        order: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "page-about",
    title: "About Us",
    slug: "about",
    parent: "-",
    order: 1,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "About Encotec",
    metaTitle: "About Us - Encotec",
    metaDescription: "Providing engineering services since 2011",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-a1",
        pageId: "page-about",
        type: "AboutHeroCMS",
        content: { title: "Our Heritage & Expertise", tag: "SINCE 2011" },
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-a2",
        pageId: "page-about",
        type: "AboutPhilosophyCMS",
        content: {
          title: "Our Corporate Philosophy",
          description:
            "Delivering excellence with high safety standards and integrity.",
        },
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "sec-a3",
        pageId: "page-about",
        type: "ScaleImpact",
        content: {
          heading: "Encotec by the Numbers",
          description:
            "Our growth is a testament to the trust our partners place in us. As of 2025–26, our impact is felt across the industry.",
          stats: [
            {
              value: "1,800+",
              label: "Manpower",
              description: "Working across global sites",
              icon: "Users",
            },
            {
              value: "300+",
              label: "Engineers",
              description: "Multidisciplinary engineering team",
              icon: "Users",
            },
            {
              value: "100+",
              label: "Industry specialist",
              description:
                "Providing high-level expert advisory and diagnostics",
              icon: "Briefcase",
            },
            {
              value: "10+ GW",
              label: "capacity under stewardship",
              description: "Total power capacity under our stewardship",
              icon: "Zap",
            },
            {
              value: "20+ GW",
              label: "Managed capacity under stewardship",
              description: "Total power capacity under our stewardship",
              icon: "Zap",
            },
            {
              value: "Triple ISO",
              label: "Certified",
              description:
                "Quality (9001), Environment (14001), Safety (45001)",
              icon: "ShieldCheck",
            },
            {
              value: "10+",
              label: "presence in Asia, Europe & Africa",
              description:
                "Across India, Vietnam, Tanzania, Indonesia, UAE, Germany, Kenya, Oman, and Turkey.",
              icon: "Globe",
            },
          ],
        },
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  },
  {
    id: "page-services",
    title: "Services",
    slug: "services",
    parent: "-",
    order: 2,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "encotec Services",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "page-insights",
    title: "Insights",
    slug: "insights",
    parent: "-",
    order: 3,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "encotec Insights",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "page-careers",
    title: "Careers",
    slug: "careers",
    parent: "-",
    order: 4,
    type: "static",
    visibility: "draft",
    isStatic: true,
    description: "Join our team",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "page-certifications",
    title: "Certifications",
    slug: "certifications",
    parent: "-",
    order: 5,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "Our Certifications",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "page-leadership",
    title: "Leadership",
    slug: "leadership",
    parent: "-",
    order: 6,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "Our Leadership Team",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
  {
    id: "page-contact",
    title: "Contact",
    slug: "contact",
    parent: "-",
    order: 7,
    type: "static",
    visibility: "public",
    isStatic: true,
    description: "Contact us",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [],
  },
];

const mockNavLinks: any[] = [
  {
    id: "nav-1",
    label: "About",
    url: "/about",
    type: "Main Link",
    parent: "-",
    order: 1,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-2",
    label: "Services",
    url: "/services",
    type: "Main Link",
    parent: "-",
    order: 2,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-3",
    label: "Insights",
    url: "/insights",
    type: "Main Link",
    parent: "-",
    order: 3,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-4",
    label: "Careers",
    url: "/careers",
    type: "Main Link",
    parent: "-",
    order: 4,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-5",
    label: "Certifications",
    url: "/certifications",
    type: "Main Link",
    parent: "-",
    order: 5,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-6",
    label: "Leadership",
    url: "/leadership",
    type: "Main Link",
    parent: "-",
    order: 6,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "nav-7",
    label: "Contact Us",
    url: "/contact",
    type: "Main Link",
    parent: "-",
    order: 7,
    isStatic: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockJobApplications: any[] = [];

const mockEnquiries: any[] = [
  {
    id: "enq-1",
    name: "John Doe",
    email: "john@example.com",
    interestedIn: "Engineering Services",
    budget: "$10k - $50k",
    projectGoals: "Consultation request for renewable energy integration",
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(),
  },
  {
    id: "enq-2",
    name: "Sarah Smith",
    email: "sarah.s@example.co.uk",
    interestedIn: "Project Management",
    budget: "$50k - $100k",
    projectGoals: "Project manager sourcing support",
    createdAt: new Date(Date.now() - 3600000 * 24),
    updatedAt: new Date(),
  },
  {
    id: "enq-3",
    name: "Michael Chang",
    email: "m.chang@infrastructure.sg",
    interestedIn: "Power Generation",
    budget: "$100k+",
    projectGoals: "Turbine maintenance partnership",
    createdAt: new Date(Date.now() - 3600000 * 48),
    updatedAt: new Date(),
  },
];

let mockGlobalConfig: any = {
  id: "global",
  siteTitle: "Encotec Energy - Power Plant O&M and Engineering Services",
  siteDescription: "Engineering & Project Management Services",
  favicon: "",
  googleAnalyticsId: "G-XXXXXXXXXX",
  gtmId: "GTM-XXXXXXX",
  searchConsoleId: "",
  customHeaderScripts: "",
  customFooterScripts: "",
  socialLinks: {
    twitter: "https://twitter.com/encotec",
    linkedin: "https://linkedin.com/company/encotec",
  },
  canonicalOrdering: "default",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Generic helper to implement mock endpoints
export const createMockPrisma = () => {
  const handler = {
    get(target: any, prop: string): any {
      if (prop === "$queryRaw") {
        return async () => [1];
      }

      if (prop === "page") {
        return {
          count: async () => mockPages.length,
          findMany: async (args: any) => {
            return mockPages.map((page) => ({
              ...page,
              _count: { sections: page.sections.length },
            }));
          },
          findUnique: async (args: any) => {
            const slug = args?.where?.slug;
            const id = args?.where?.id;
            return (
              mockPages.find((p) => p.slug === slug || p.id === id) || null
            );
          },
          findFirst: async (args: any) => {
            const slug = args?.where?.slug;
            return mockPages.find((p) => p.slug === slug) || null;
          },
          create: async (args: any) => {
            const newPage = {
              id: `page-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              sections: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockPages.push(newPage);
            return newPage;
          },
          update: async (args: any) => {
            const id = args?.where?.id;
            const index = mockPages.findIndex((p) => p.id === id);
            if (index !== -1) {
              mockPages[index] = {
                ...mockPages[index],
                ...args.data,
                updatedAt: new Date(),
              };
              return mockPages[index];
            }
            return null;
          },
          upsert: async (args: any) => {
            const slug = args?.where?.slug;
            let page = mockPages.find((p) => p.slug === slug);
            if (!page) {
              page = {
                id: `page-${Math.random().toString(36).substring(7)}`,
                ...args.create,
                sections: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              mockPages.push(page);
            } else {
              const index = mockPages.findIndex((p) => p.slug === slug);
              mockPages[index] = {
                ...mockPages[index],
                ...args.update,
                updatedAt: new Date(),
              };
              page = mockPages[index];
            }
            return page;
          },
          delete: async (args: any) => {
            const id = args?.where?.id;
            const index = mockPages.findIndex((p) => p.id === id);
            if (index !== -1) {
              const deleted = mockPages.splice(index, 1);
              return deleted[0];
            }
            return null;
          },
        };
      }

      if (prop === "section") {
        return {
          count: async (args: any) => {
            const pageId = args?.where?.pageId;
            if (pageId) {
              const page = mockPages.find((p) => p.id === pageId);
              return page ? page.sections.length : 0;
            }
            return mockPages.reduce((acc, p) => acc + p.sections.length, 0);
          },
          findMany: async (args: any) => {
            const pageId = args?.where?.pageId;
            if (pageId) {
              const page = mockPages.find((p) => p.id === pageId);
              return page ? page.sections : [];
            }
            return mockPages.flatMap((p) => p.sections);
          },
          findFirst: async (args: any) => {
            const pageId = args?.where?.pageId;
            const type = args?.where?.type;
            const page = mockPages.find((p) => p.id === pageId);
            if (page) {
              return page.sections.find((s: any) => s.type === type) || null;
            }
            return null;
          },
          create: async (args: any) => {
            const pageId = args.data.pageId;
            const page = mockPages.find((p) => p.id === pageId);
            const newSection = {
              id: `sec-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            if (page) {
              page.sections.push(newSection);
            }
            return newSection;
          },
          update: async (args: any) => {
            const id = args?.where?.id;
            for (const page of mockPages) {
              const index = page.sections.findIndex((s: any) => s.id === id);
              if (index !== -1) {
                page.sections[index] = {
                  ...page.sections[index],
                  ...args.data,
                  updatedAt: new Date(),
                };
                return page.sections[index];
              }
            }
            return null;
          },
        };
      }

      if (prop === "navLink") {
        return {
          count: async () => mockNavLinks.length,
          findMany: async () => mockNavLinks,
          create: async (args: any) => {
            const newLink = {
              id: `nav-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockNavLinks.push(newLink);
            return newLink;
          },
          update: async (args: any) => {
            const id = args?.where?.id;
            const index = mockNavLinks.findIndex((l) => l.id === id);
            if (index !== -1) {
              mockNavLinks[index] = {
                ...mockNavLinks[index],
                ...args.data,
                updatedAt: new Date(),
              };
              return mockNavLinks[index];
            }
            return null;
          },
          deleteMany: async (args: any) => {
            const url = args?.where?.url;
            if (url) {
              const index = mockNavLinks.findIndex((l) => l.url === url);
              if (index !== -1) {
                mockNavLinks.splice(index, 1);
              }
            }
            return { count: 1 };
          },
          delete: async (args: any) => {
            const id = args?.where?.id;
            const index = mockNavLinks.findIndex((l) => l.id === id);
            if (index !== -1) {
              const deleted = mockNavLinks.splice(index, 1);
              return deleted[0];
            }
            return null;
          },
        };
      }

      if (prop === "enquiry") {
        return {
          count: async () => mockEnquiries.length,
          findMany: async (args: any) => {
            const limit = args?.take || mockEnquiries.length;
            return mockEnquiries.slice(0, limit);
          },
          create: async (args: any) => {
            const newEnquiry = {
              id: `enq-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockEnquiries.push(newEnquiry);
            return newEnquiry;
          },
        };
      }

      if (prop === "jobApplication") {
        return {
          findMany: async (args?: any) => {
            let res = [...mockJobApplications];
            if (args?.where?.OR) {
              const q = (args.where.OR[0]?.name?.contains || "").toLowerCase();
              if (q) {
                res = res.filter(
                  (a) =>
                    a.name?.toLowerCase().includes(q) ||
                    a.email?.toLowerCase().includes(q) ||
                    a.jobTitle?.toLowerCase().includes(q),
                );
              }
            }
            if (args?.where?.status) {
              res = res.filter((a) => a.status === args.where.status);
            }
            return res.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
          },
          count: async (args?: any) => mockJobApplications.length,
          create: async (args: any) => {
            const newApp = {
              id: `app-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockJobApplications.push(newApp);
            return newApp;
          },
          update: async (args: any) => {
            const idx = mockJobApplications.findIndex(
              (a) => a.id === args.where?.id,
            );
            if (idx !== -1) {
              mockJobApplications[idx] = {
                ...mockJobApplications[idx],
                ...args.data,
                updatedAt: new Date(),
              };
              return mockJobApplications[idx];
            }
            return args.data;
          },
          delete: async (args: any) => {
            const idx = mockJobApplications.findIndex(
              (a) => a.id === args.where?.id,
            );
            if (idx !== -1) mockJobApplications.splice(idx, 1);
            return {};
          },
        };
      }

      if (prop === "globalConfig") {
        return {
          findUnique: async () => mockGlobalConfig,
          upsert: async (args: any) => {
            mockGlobalConfig = {
              ...mockGlobalConfig,
              ...args.update,
              updatedAt: new Date(),
            };
            return mockGlobalConfig;
          },
        };
      }

      return undefined;
    },
  };

  return new Proxy({}, handler) as PrismaClient;
};
