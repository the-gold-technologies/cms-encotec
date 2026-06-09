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
    metaTitle: "Encotech - Member of Dornier Group",
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
          tagline: "Global Energy Stewardship",
          headlineLine1: "Your Assets. Our Stewardship. End-to-End Solutions for a Global Future",
          headlineHighlight: "Stewardship.",
          description: 'We are more than consultants; we are your partners in progress. By adopting an "Owner\'s Mindset," we take total responsibility for your infrastructure — from the first feasibility study to long-term operational excellence.',
          primaryBtnLabel: "Our Services",
          primaryBtnUrl: "/services",
          secondaryBtnLabel: "View Case Studies",
          secondaryBtnUrl: "/insights",
          serviceTags: ["STEWARDSHIP", "COMMISSIONING", "ADVISORY", "GLOBAL SOURCING"],
          projectsBadgeNumber: "150+",
          projectsBadgeLabel: "Projects Delivered",
          stat1Value: "2011",
          stat1Label: "FOUNDED YEAR",
          stat2Value: "13+",
          stat2Label: "CITIES IN INDIA",
          stat3Value: "300+",
          stat3Label: "SPECIALIZED ENGINEERS",
          stat4Value: "8000+",
          stat4Label: "MW UNDER STEWARDSHIP",
          backgroundImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200"
        },
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h2",
        pageId: "page-home",
        type: "AboutUs",
        content: {
          upperTag: "About Us",
          headingLabel: "Human-Centric Engineering",
          headingItalicHighlight: "Since 2011",
          paragraphs: [
            "Encotec Energy brings an owner's mindset to every project. Founded in 2011, we have grown into a team of 1800+ industry specialists operating across 13+ key locations.",
            "From thermal power plants to cutting-edge solar installations, our engineering DNA drives precision, reliability, and sustainable outcomes for clients worldwide."
          ],
          ctaLabel: "Learn More",
          ctaUrl: "#",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
          imageAlt: "Engineer working on advanced equipment",
          badgeValue: "Est. 2011",
          badgeLabel: "Pioneering Energy",
          badgeIcon: "Zap",
          stats: [
            { value: "2011", label: "FOUNDED YEAR", icon: "Calendar" },
            { value: "13+", label: "KEY LOCATIONS", icon: "Globe" },
            { value: "1800+", label: "INDUSTRY SPECIALISTS", icon: "Users" },
            { value: "8000+", label: "MW POWER CAPACITY", icon: "Zap" }
          ],
          bannerHeading: "Experience Global Engineering Excellence.",
          bannerDescription: "From India to Turkey, see how we are setting new standards in power infrastructure.",
          bannerButtonLabel: "View Our Global Reach",
          bannerButtonUrl: "/contact"
        },
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h3",
        pageId: "page-home",
        type: "ServicesSection",
        content: {
          tagline: "Our Services",
          heading: "Integrated Solutions Across the Asset Lifecycle",
          description: "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
          services: [
            {
              title: "Project Conceptualisation & Development",
              description: "From pre-feasibility and financial assessments to finalizing EPC contractors and developing technical specifications.",
              icon: "ClipboardCheck",
              image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
            },
            {
              title: "Construction, Commissioning & Relocation",
              description: "Expert installation of complex power and process industries, including specialized asset shifting and relocation services across borders.",
              icon: "Network",
              image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"
            },
            {
              title: "Asset Stewardship (O&M)",
              description: "Specialized management of thermal power plants, international airports, and critical utilities like STPs.",
              icon: "Flame",
              image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800"
            },
            {
              title: "Expert Advisory & Performance Audits",
              description: "High-level problem solving, energy efficiency audits, and specialized testing (NDT) for operational plants.",
              icon: "Search",
              image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800"
            },
            {
              title: "Global Trading & Spare Parts",
              description: "Strategic sourcing of critical equipment and spares from major OEMs in China, Vietnam, Korea, and India.",
              icon: "Wrench",
              image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
            }
          ]
        },
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h4",
        pageId: "page-home",
        type: "ProcessSection",
        content: {
          tagline: "Our Workflow",
          heading: "Workflow Followed for Each Project",
          steps: [
            { id: 1, title: "Logical Foundation", description: "We start by conceptualizing the project through rigorous feasibility studies and Detailed Project Reports (DPR).", icon: "Search" },
            { id: 2, title: "Strategic Alignment", description: "Our team develops technical specifications and assists in the selection of the right partners to ensure a solid start.", icon: "PenTool" },
            { id: 3, title: "Technical Realization", description: "We manage the precision erection and commissioning of assets, whether they are new builds or relocated plants.", icon: "HardHat" },
            { id: 4, title: "Owner's O&M", description: "We transition into long-term stewardship, providing operation and maintenance with the same care as the asset owner.", icon: "CheckCircle2" },
            { id: 5, title: "Continuous Improvement", description: "Through regular performance diagnostics and energy audits, we ensure your asset remains efficient and reliable for its entire lifecycle.", icon: "Activity" }
          ]
        },
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h5",
        pageId: "page-home",
        type: "ProjectShowcaseSection",
        content: {
          tagline: "Case Studies",
          heading: "Stewardship in Action",
          description: "Delivering critical energy infrastructure with precision engineering and an owner's mindset.",
          projects: [
            {
              title: "Supercritical Mastery at Rajpura",
              location: "Rajpura, Punjab",
              category: "Asset Stewardship",
              description: "Providing comprehensive O&M for a 2x700 MW Supercritical plant, ensuring long-term reliability for Punjab's energy heart.",
              image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2000"
            },
            {
              title: "Powering India's Gateway (DIAL)",
              location: "New Delhi",
              category: "Airport Utility Management",
              description: "Five years of flawless utility management at Delhi International Airport, recently renewed for another five years due to exceptional performance.",
              image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&q=80&w=2000"
            }
          ]
        },
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h6",
        pageId: "page-home",
        type: "GlobalFootprintSection",
        content: {
          tagline: "Global Presence",
          heading: "Connected Intelligence",
          description: "A live network of energy systems operating in synchronization across continents.",
          stats: [
            { value: "14+", label: "India Locations" },
            { value: "8000+", label: "MW Capacity" },
            { value: "1,800+", label: "Professionals" }
          ],
          locations: [
            { name: "Noida (HQ)", coordinates: [77.39, 28.58], region: "India", address: "Corporate Headquarters", suite: "Noida, Uttar Pradesh", phone: "+91 120 555 0100" },
            { name: "Rajpura", coordinates: [76.59, 30.48], region: "India", address: "2x700 MW Supercritical Plant", suite: "Rajpura, Punjab", phone: "+91 1762 555 0700" },
            { name: "Bahrain", coordinates: [50.58, 26.07], region: "International", address: "Energy Infrastructure", suite: "Manama, Bahrain", phone: "+973 1755 0200" }
          ]
        },
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h7",
        pageId: "page-home",
        type: "WhyEncotecSection",
        content: {
          revealWord1: "Engineering Precision.",
          revealWord2: "Global Execution.",
          revealWord3: "Reliable Energy Solutions.",
          ctaBlocks: [
            { headline: "Ready to Move from Consultancy to Partnership?", text: "Discover how our \"Owner's Mindset\" can transform your project's performance." },
            { headline: "Let's Build Your Project's Future Together.", text: "Contact us for end-to-end solutions, from conceptualization to commissioning." },
            { headline: "Is Your Asset Reaching Its Full Potential?", text: "Speak with our 300+ engineers about our expert advisory and performance audits." },
            { headline: "Sourcing Critical Spares? We've Got the Global Reach.", text: "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs." },
            { headline: "Join the 13+ Cities That Trust Encotec.", text: "Experience the peace of mind that comes with a top-tier O&M partner." },
            { headline: "Planning an Asset Relocation?", text: "Let our experts manage the complex transition of your plant from one site — or country — to another." }
          ]
        },
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h8",
        pageId: "page-home",
        type: "Testimonials",
        content: {
          tagline: "Testimonials",
          heading: "Trusted by Industry Leaders",
          testimonials: [
            { quote: "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own — uptime improved by 12% in the first year alone.", name: "Rajesh Mehta", title: "Senior Vice President, Operations", company: "National Thermal Power Corp.", initials: "RM" },
            { quote: "From feasibility to commissioning, Encotec delivered our 200 MW solar project on schedule and under budget. Their engineering precision and attention to detail set a new benchmark for our portfolio.", name: "Sarah Al-Rashid", title: "Project Director, Renewable Energy", company: "Gulf Energy Solutions", initials: "SA" }
          ]
        },
        order: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h9",
        pageId: "page-home",
        type: "LogoStripSection",
        content: {
          tagline: "Trusted by Industry Leaders",
          logos: ["Siemens Energy", "General Electric", "Vestas", "NextEra", "Orsted", "Enel", "Iberdrola"]
        },
        order: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "sec-h10",
        pageId: "page-home",
        type: "CTASection",
        content: {
          tagline: "Partner With Us",
          heading: "Experience Global Engineering Excellence.",
          description: "From India to Turkey, see how we are setting new standards in power infrastructure. Join the 13+ cities that rely on Encotec for their critical power needs.",
          primaryBtnLabel: "Start Your Project",
          primaryBtnUrl: "/contact",
          secondaryBtnLabel: "Talk to an Expert",
          secondaryBtnUrl: "/contact",
          footerNote: "Looking for precision and reliability? Get in touch to learn more about our certified quality and safety-first approach.",
          copyright: "© 2026 Encotec Engineering."
        },
        order: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
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
      { id: "sec-a1", pageId: "page-about", type: "AboutHeroCMS", content: { title: "Our Heritage & Expertise", tag: "SINCE 2011" }, order: 0, createdAt: new Date(), updatedAt: new Date() },
      { id: "sec-a2", pageId: "page-about", type: "AboutPhilosophyCMS", content: { title: "Our Corporate Philosophy", description: "Delivering excellence with high safety standards and integrity." }, order: 1, createdAt: new Date(), updatedAt: new Date() }
    ]
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
    description: "Encotech Services",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: []
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
    description: "Encotech Insights",
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: []
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
    sections: []
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
    sections: []
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
    sections: []
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
    sections: []
  }
];

const mockNavLinks: any[] = [
  { id: "nav-1", label: "About", url: "/about", type: "Main Link", parent: "-", order: 1, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-2", label: "Services", url: "/services", type: "Main Link", parent: "-", order: 2, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-3", label: "Insights", url: "/insights", type: "Main Link", parent: "-", order: 3, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-4", label: "Careers", url: "/careers", type: "Main Link", parent: "-", order: 4, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-5", label: "Certifications", url: "/certifications", type: "Main Link", parent: "-", order: 5, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-6", label: "Leadership", url: "/leadership", type: "Main Link", parent: "-", order: 6, isStatic: true, createdAt: new Date(), updatedAt: new Date() },
  { id: "nav-7", label: "Contact Us", url: "/contact", type: "Main Link", parent: "-", order: 7, isStatic: true, createdAt: new Date(), updatedAt: new Date() }
];

const mockEnquiries: any[] = [
  { id: "enq-1", name: "John Doe", email: "john@example.com", interestedIn: "Engineering Services", budget: "$10k - $50k", projectGoals: "Consultation request for renewable energy integration", createdAt: new Date(Date.now() - 3600000 * 2), updatedAt: new Date() },
  { id: "enq-2", name: "Sarah Smith", email: "sarah.s@example.co.uk", interestedIn: "Project Management", budget: "$50k - $100k", projectGoals: "Project manager sourcing support", createdAt: new Date(Date.now() - 3600000 * 24), updatedAt: new Date() },
  { id: "enq-3", name: "Michael Chang", email: "m.chang@infrastructure.sg", interestedIn: "Power Generation", budget: "$100k+", projectGoals: "Turbine maintenance partnership", createdAt: new Date(Date.now() - 3600000 * 48), updatedAt: new Date() }
];

let mockGlobalConfig: any = {
  id: "global",
  siteTitle: "Encotech",
  siteDescription: "Engineering & Project Management Services - Member of Dornier Group",
  favicon: "",
  googleAnalyticsId: "G-XXXXXXXXXX",
  gtmId: "GTM-XXXXXXX",
  searchConsoleId: "",
  customHeaderScripts: "",
  customFooterScripts: "",
  socialLinks: { twitter: "https://twitter.com/encotech", linkedin: "https://linkedin.com/company/encotech" },
  canonicalOrdering: "default",
  createdAt: new Date(),
  updatedAt: new Date()
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
            return mockPages.map(page => ({
              ...page,
              _count: { sections: page.sections.length }
            }));
          },
          findUnique: async (args: any) => {
            const slug = args?.where?.slug;
            const id = args?.where?.id;
            return mockPages.find(p => p.slug === slug || p.id === id) || null;
          },
          findFirst: async (args: any) => {
            const slug = args?.where?.slug;
            return mockPages.find(p => p.slug === slug) || null;
          },
          create: async (args: any) => {
            const newPage = {
              id: `page-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              sections: [],
              createdAt: new Date(),
              updatedAt: new Date()
            };
            mockPages.push(newPage);
            return newPage;
          },
          update: async (args: any) => {
            const id = args?.where?.id;
            const index = mockPages.findIndex(p => p.id === id);
            if (index !== -1) {
              mockPages[index] = { ...mockPages[index], ...args.data, updatedAt: new Date() };
              return mockPages[index];
            }
            return null;
          },
          upsert: async (args: any) => {
            const slug = args?.where?.slug;
            let page = mockPages.find(p => p.slug === slug);
            if (!page) {
              page = {
                id: `page-${Math.random().toString(36).substring(7)}`,
                ...args.create,
                sections: [],
                createdAt: new Date(),
                updatedAt: new Date()
              };
              mockPages.push(page);
            } else {
              const index = mockPages.findIndex(p => p.slug === slug);
              mockPages[index] = { ...mockPages[index], ...args.update, updatedAt: new Date() };
              page = mockPages[index];
            }
            return page;
          },
          delete: async (args: any) => {
            const id = args?.where?.id;
            const index = mockPages.findIndex(p => p.id === id);
            if (index !== -1) {
              const deleted = mockPages.splice(index, 1);
              return deleted[0];
            }
            return null;
          }
        };
      }

      if (prop === "section") {
        return {
          count: async (args: any) => {
            const pageId = args?.where?.pageId;
            if (pageId) {
              const page = mockPages.find(p => p.id === pageId);
              return page ? page.sections.length : 0;
            }
            return mockPages.reduce((acc, p) => acc + p.sections.length, 0);
          },
          findMany: async (args: any) => {
            const pageId = args?.where?.pageId;
            if (pageId) {
              const page = mockPages.find(p => p.id === pageId);
              return page ? page.sections : [];
            }
            return mockPages.flatMap(p => p.sections);
          },
          findFirst: async (args: any) => {
            const pageId = args?.where?.pageId;
            const type = args?.where?.type;
            const page = mockPages.find(p => p.id === pageId);
            if (page) {
              return page.sections.find((s: any) => s.type === type) || null;
            }
            return null;
          },
          create: async (args: any) => {
            const pageId = args.data.pageId;
            const page = mockPages.find(p => p.id === pageId);
            const newSection = {
              id: `sec-${Math.random().toString(36).substring(7)}`,
              ...args.data,
              createdAt: new Date(),
              updatedAt: new Date()
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
                page.sections[index] = { ...page.sections[index], ...args.data, updatedAt: new Date() };
                return page.sections[index];
              }
            }
            return null;
          }
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
              updatedAt: new Date()
            };
            mockNavLinks.push(newLink);
            return newLink;
          },
          update: async (args: any) => {
            const id = args?.where?.id;
            const index = mockNavLinks.findIndex(l => l.id === id);
            if (index !== -1) {
              mockNavLinks[index] = { ...mockNavLinks[index], ...args.data, updatedAt: new Date() };
              return mockNavLinks[index];
            }
            return null;
          },
          deleteMany: async (args: any) => {
            const url = args?.where?.url;
            if (url) {
              const index = mockNavLinks.findIndex(l => l.url === url);
              if (index !== -1) {
                mockNavLinks.splice(index, 1);
              }
            }
            return { count: 1 };
          },
          delete: async (args: any) => {
            const id = args?.where?.id;
            const index = mockNavLinks.findIndex(l => l.id === id);
            if (index !== -1) {
              const deleted = mockNavLinks.splice(index, 1);
              return deleted[0];
            }
            return null;
          }
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
              updatedAt: new Date()
            };
            mockEnquiries.push(newEnquiry);
            return newEnquiry;
          }
        };
      }

      if (prop === "globalConfig") {
        return {
          findUnique: async () => mockGlobalConfig,
          upsert: async (args: any) => {
            mockGlobalConfig = {
              ...mockGlobalConfig,
              ...args.update,
              updatedAt: new Date()
            };
            return mockGlobalConfig;
          }
        };
      }

      return undefined;
    }
  };

  return new Proxy({}, handler) as PrismaClient;
};
