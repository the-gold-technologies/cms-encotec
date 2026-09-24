const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Clean existing database
  await prisma.section.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.navLink.deleteMany({});
  await prisma.globalConfig.deleteMany({});
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
    data: {
      id: "global",
      siteTitle: "encotec",
      siteDescription:
        "Engineering & Project Management Services - Member of Dornier Group",
      favicon: null,
      googleAnalyticsId: "G-CT894VPLS1",
      gtmId: "GTM-59DCSVDV",
      searchConsoleId: "4kD9H2fqRgqKEk",
      customHeaderScripts: null,
      customFooterScripts: null,
      socialLinks: [],
      canonicalOrdering: "default",
    },
  });
  console.log("Created global config");

  // 4. Create Static Pages
  const pages = [
    {
      title: "Home",
      slug: "home",
      description: "Welcome to Encotec",
      metaTitle: "encotec - Member of Dornier Group",
      metaDescription: "Providing engineering services since 2011",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "About Us",
      slug: "about",
      description: "About Encotec",
      metaTitle: "About Us - Encotec",
      metaDescription: "Providing engineering services since 2011",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Services",
      slug: "services",
      description: "encotec Services",
      metaTitle: "Our Services - Encotec",
      metaDescription: "Explore our range of engineering and advisory services",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Insights",
      slug: "insights",
      description: "encotec Insights",
      metaTitle: "Insights & Case Studies - Encotec",
      metaDescription: "Read about our projects and industry insights",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Careers",
      slug: "careers",
      description: "Join our team",
      metaTitle: "Careers - Encotec",
      metaDescription: "Build your engineering career with us",
      isStatic: true,
      visibility: "public",
    },
    // {
    //   title: "Certifications",
    //   slug: "certifications",
    //   description: "Our Certifications",
    //   metaTitle: "Certifications - Encotec",
    //   metaDescription: "Our quality standards and ISO certifications",
    //   isStatic: true,
    //   visibility: "public",
    // },
    {
      title: "Leadership",
      slug: "leadership",
      description: "Our Leadership Team",
      metaTitle: "Leadership - Encotec",
      metaDescription: "Meet our leadership team",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Contact",
      slug: "contact",
      description: "Contact us",
      metaTitle: "Contact Us - Encotec",
      metaDescription: "Get in touch with Encotec",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Engineering Services",
      slug: "engineering-services",
      description:
        "Comprehensive engineering solutions for reliable energy infrastructure.",
      metaTitle: "Engineering Services - Encotec",
      metaDescription:
        "Comprehensive engineering solutions for reliable energy infrastructure.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Project Management",
      slug: "project-management",
      description:
        "Structured project conceptualisation and development services.",
      metaTitle: "Project Management - Encotec",
      metaDescription:
        "Structured project conceptualisation and development services.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Power Generation",
      slug: "power-generation",
      description: "Asset stewardship and operations & maintenance services.",
      metaTitle: "Power Generation (O&M) - Encotec",
      metaDescription:
        "Asset stewardship and operations & maintenance services.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Transmission & Distribution",
      slug: "transmission-distribution",
      description: "Construction, commissioning, and relocation services.",
      metaTitle: "Transmission & Distribution - Encotec",
      metaDescription: "Construction, commissioning, and relocation services.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Renewable Energy",
      slug: "renewable-energy",
      description: "Expert advisory and performance diagnostic audits.",
      metaTitle: "Renewable Energy - Encotec",
      metaDescription: "Expert advisory and performance diagnostic audits.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Airport Services",
      slug: "airport-services",
      description: "Due diligence and asset health evaluation services.",
      metaTitle: "Airport Services - Encotec",
      metaDescription: "Due diligence and asset health evaluation services.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Value-Added Services",
      slug: "value-added",
      description: "Strategic global sourcing and spare parts supply.",
      metaTitle: "Value-Added Services - Encotec",
      metaDescription: "Strategic global sourcing and spare parts supply.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      description:
        "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd.",
      metaTitle: "Privacy Policy - Encotec Energy (India)",
      metaDescription:
        "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd. Learn about our personal data processing, data subject rights, cookies, and regulatory compliance.",
      canonicalUrl: "https://www.encotecenergy.com/en/privacy-policy/",
      targetKeywords:
        "privacy policy, data protection, encotec energy, GDPR, personal data, whistleblower directive",
      ogTitle: "Privacy Policy - Encotec Energy (India)",
      ogDescription:
        "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd. Learn how we protect and manage personal data.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Cookie Policy",
      slug: "cookie-policy",
      description:
        "Cookie Policy and Privacy Preferences for Encotec Energy website.",
      metaTitle: "Cookie Policy - Encotec Energy (India)",
      metaDescription:
        "Overview of cookies, statistical tracking, and privacy preference settings on Encotec Energy website.",
      canonicalUrl: "https://www.encotecenergy.com/en/cookie-policy/",
      targetKeywords:
        "cookie policy, cookies, privacy preference, essential cookies, statistics cookies, borlabs cookie",
      ogTitle: "Cookie Policy - Encotec Energy (India)",
      ogDescription:
        "Information about cookies and managing privacy preferences on Encotec Energy.",
      isStatic: true,
      visibility: "public",
    },
  ];

  for (const pageData of pages) {
    const createdPage = await prisma.page.create({
      data: pageData,
    });
    console.log(`Created page: ${createdPage.title}`);

    // Seed sections for Home page
    if (createdPage.slug === "home") {
      // 1. HeroSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "HeroSection",
          order: 0,
          content: {
            tagline: "Global Energy Stewardship",
            headlineLine1: "Your Assets. Our",
            headlineHighlight: "Stewardship.",
            headlineLine2: "End-to-End Solutions for a Global Future",
            description:
              'We are more than service provider; we are your partners in progress. By adopting an "Owner\'s Mindset," we take total responsibility for your infrastructure — from the first feasibility study to long-term operational excellence.',
            primaryBtnLabel: "Our Services",
            primaryBtnUrl: "/services",
            secondaryBtnLabel: "View Case Studies",
            secondaryBtnUrl: "/insights",
            serviceTags: [
              "STEWARDSHIP",
              "COMMISSIONING",
              "ADVISORY",
              "GLOBAL SOURCING",
            ],
            projectsBadgeNumber: "",
            projectsBadgeLabel: "",
            stats: [
              { value: "2009", label: "FOUNDING YEAR" },
              { value: "2011", label: "STARTED OPERATIONS" },
              { value: "13+", label: "KEY LOCATIONS" },
              { value: "300+", label: "Engineers" },
              { value: "1800+", label: "MANPOWER" },
              { value: "10+", label: "GW Under Stewardship" },
            ],
            backgroundImage:
              "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
          },
        },
      });

      // 2. AboutUs
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AboutUs",
          order: 1,
          content: {
            upperTag: "About Us",
            headingLabel: "Human-Centric Engineering",
            headingItalicHighlight: "Since 2011",
            paragraphs: [
              "Encotec Energy brings an owner's mindset to every project. Founded in 2011, we have grown into a 600+ industry specialist operating across 13+ key locations.",
              "From thermal power plants to cutting-edge solar installations, our engineering DNA drives precision, reliability, and sustainable outcomes for clients worldwide.",
            ],
            ctaLabel: "Learn More",
            ctaUrl: "#",
            image:
              "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000",
            imageAlt: "Engineer working on advanced equipment",
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
            bannerHeading: "Experience Global Engineering Excellence.",
            bannerDescription:
              "From India to Global, see how we are setting new standards in power infrastructure.",
            bannerButtonLabel: "View Our Global Reach",
            bannerButtonUrl: "/contact",
          },
        },
      });

      // 3. ServicesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ServicesSection",
          order: 2,
          content: {
            tagline: "Our Services",
            heading: "Integrated Solutions Across the Asset Lifecycle",
            description:
              "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
            services: [
              {
                title: "Project Conceptualization & Development",
                description:
                  "From pre-feasibility and financial assessments to front-end EPC coordination and developing technical specifications.",
                icon: "ClipboardCheck",
                image:
                  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
                ctaLabel: "Learn More",
                ctaUrl: "/services/engineering-services",
              },
              {
                title: "Construction, Commissioning & Relocation",
                description:
                  "Expert installation of complex power and process industries, including specialized asset shifting and relocation services across borders.",
                icon: "Network",
                image:
                  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
                ctaLabel: "Learn More",
                ctaUrl: "/services/project-management",
              },
              {
                title: "Asset Stewardship (O&M)",
                description:
                  "Owner's mindset applied to utility management for international airports, and critical facilities like STPs.",
                icon: "Flame",
                image:
                  "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=800",
                ctaLabel: "Learn More",
                ctaUrl: "/services/airport-services",
              },
              {
                title: "Expert Advisory & Performance Audits",
                description:
                  "High-level problem solving, energy efficiency audits, and operational advisory for operational plants.",
                icon: "Search",
                image:
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
                ctaLabel: "Learn More",
                ctaUrl: "/services/power-generation",
              },
              {
                title: "Global Trading & Spare Parts",
                description:
                  "Strategic sourcing of critical and spare parts from global OEMs and distributors, ensuring continuity and cost savings.",
                icon: "Wrench",
                image:
                  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
                ctaLabel: "Learn More",
                ctaUrl: "/services/value-added-services",
              },
            ],
          },
        },
      });

      // 4. ProcessSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessSection",
          order: 3,
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
        },
      });

      // 5. ProjectShowcaseSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProjectShowcaseSection",
          order: 4,
          content: {
            tagline: "Case Studies",
            heading: "Stewardship in Action",
            description:
              "Delivering critical energy infrastructure with precision engineering and an owner's mindset.",
            projects: [
              {
                title: "Supercritical Mastery at Rajpura",
                location: "Rajpura, Punjab",
                category: "Asset Stewardship",
                description:
                  "Providing O&M services for a 2x700 MW Supercritical plant, ensuring long-term reliability for Punjab's energy heart.",
                image:
                  "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2000",
              },
              {
                title: "Powering India's Gateway (DIAL)",
                location: "New Delhi",
                category: "Airport Utility Management",
                description:
                  "Five years of flawless utility management at Delhi International Airport, recently renewed for another five years due to exceptional performance.",
                image:
                  "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=2000",
              },
            ],
          },
        },
      });

      // 6. GlobalFootprintSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "GlobalFootprintSection",
          order: 5,
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
                phone: "+91 120 4155612",
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
        },
      });

      // 7. WhyEncotecSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "WhyEncotecSection",
          order: 6,
          content: {
            revealWord1: "Engineering Precision.",
            revealWord2: "Global Execution.",
            revealWord3: "Reliable Energy Solutions.",
            ctaBlocks: [
              {
                headline: "Ready to Move from Consultancy to Partnership?",
                text: "Discover how our \"Owner's Mindset\" can transform your project's performance.",
              },
              {
                headline: "Let's Build Your Project's Future Together.",
                text: "Contact us for end-to-end solutions, from conceptualization to commissioning.",
              },
              {
                headline: "Is Your Asset Reaching Its Full Potential?",
                text: "Improve your 24x7 alignment about asset advisory and performance audits.",
              },
              {
                headline:
                  "Sourcing Critical Spares? We've Got the Global Reach.",
                text: "Access our network of major OEMs in China, Vietnam, and beyond for your spare parts need.",
              },
              {
                headline: "Join the 13+ Projects That Trust Encotec.",
                text: "Experience the power of the full owner mindset — from concept to operation.",
              },
              {
                headline: "Planning an Asset Relocation?",
                text: "Let our expert management team do the due-diligence study, prepare feasibility report, help you in asset valuation and finally transition your critical assets to a new site with  optimum timeline.",
              },
            ],
          },
        },
      });

      // 8. Testimonials
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "Testimonials",
          order: 7,
          content: {
            tagline: "Testimonials",
            heading: "Trusted by Industry Leaders",
            testimonials: [
              {
                quote:
                  "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own — uptime improved by 12% in the first year alone.",
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
              {
                quote:
                  "Working with Encotec on our 765 kV substation was exceptional. Their deep expertise in transmission infrastructure and commitment to safety standards gave us complete confidence throughout the project.",
                name: "Dr. Klaus Werner",
                title: "Chief Engineer, Grid Infrastructure",
                company: "European Power Networks",
                initials: "KW",
              },
              {
                quote:
                  "Encotec's project management capabilities are world-class. They coordinated complex multi-disciplinary teams across three countries, delivering our airport MEP systems with zero safety incidents.",
                name: "Priya Sharma",
                title: "Managing Director",
                company: "Apex Infrastructure Group",
                initials: "PS",
              },
            ],
          },
        },
      });

      // 9. LogoStripSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "LogoStripSection",
          order: 8,
          content: {
            tagline: "Trusted by Industry Leaders",
            logos: [
              {
                name: "Moser Baer",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125550/encotec-Assets/logos/moserbaer.png",
              },
              {
                name: "Reliance Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128795/encotec-Assets/logos/reliance_power.png",
              },
              {
                name: "Cairn India",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787126021/encotec-Assets/logos/cairn.png",
              },
              {
                name: "Electrical Inspectorate",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128682/encotec-Assets/logos/electrical_inspectorate.png",
              },
              {
                name: "Coastal Gujarat Power Limited (CGPL)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127628/encotec-Assets/logos/cgpl.png",
              },
              {
                name: "Thermax",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125771/encotec-Assets/logos/thermax.png",
              },
              {
                name: "Tata Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127626/encotec-Assets/logos/tata_power.png",
              },
              {
                name: "Adani Group",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125541/encotec-Assets/logos/adani.png",
              },
              {
                name: "Invensys Controls",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128796/encotec-Assets/logos/invensys.png",
              },
              {
                name: "Sterlite Energy",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128683/encotec-Assets/logos/sterlite_energy.png",
              },
              {
                name: "Action Ispat & Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128564/encotec-Assets/logos/action_ispat.png",
              },
              {
                name: "GMR Group",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125548/encotec-Assets/logos/gmr.png",
              },
              {
                name: "Adhunik Group",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128797/encotec-Assets/logos/adhunik.png",
              },
              {
                name: "Jaypee Group",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787126335/encotec-Assets/logos/jaypee.png",
              },
              {
                name: "Odisha Power Generation Corporation",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127782/encotec-Assets/logos/opgc.png",
              },
              {
                name: "Jindal Steel & Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125913/encotec-Assets/logos/jindal.png",
              },
              {
                name: "Alstom",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125544/encotec-Assets/logos/alstom.png",
              },
              {
                name: "Bharat Oman Refineries Limited",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125769/encotec-Assets/logos/borl.png",
              },
              {
                name: "Indiabulls Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125917/encotec-Assets/logos/indiabulls.png",
              },
              {
                name: "AREVA",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125916/encotec-Assets/logos/areva.png",
              },
              {
                name: "ABB",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125539/encotec-Assets/logos/abb.png",
              },
              {
                name: "JSW Energy",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125911/encotec-Assets/logos/jsw.png",
              },
              {
                name: "KSK Energy",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127977/encotec-Assets/logos/ksk.png",
              },
              {
                name: "Noida International Airport",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127898/encotec-Assets/logos/noida_airport.png",
              },
              {
                name: "Sterling and Wilson",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128011/encotec-Assets/logos/sterling_wilson.png",
              },
              {
                name: "CLP India",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787126336/encotec-Assets/logos/clp_india.png",
              },
              {
                name: "IL&FS",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125932/encotec-Assets/logos/il_fs.png",
              },
              {
                name: "Ideal Energy Projects (IEPL)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128798/encotec-Assets/logos/iepl.png",
              },
              {
                name: "GE Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125546/encotec-Assets/logos/ge.png",
              },
              {
                name: "Hiranmaye Energy",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128327/encotec-Assets/logos/hiranmaye.png",
              },
              {
                name: "MP Power",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128709/encotec-Assets/logos/mp_wz.png",
              },
              {
                name: "Coastal Energen",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128799/encotec-Assets/logos/coastal_energen.png",
              },
              {
                name: "Sterlite",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787127718/encotec-Assets/logos/sterlite.png",
              },
              {
                name: "Nabha Power Limited (NPL)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128800/encotec-Assets/logos/nabha_power.png",
              },
              {
                name: "Sea Eagles",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787128802/encotec-Assets/logos/sea_eagles.png",
              },
              {
                name: "WBPDCL",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787126338/encotec-Assets/logos/wbpdcl.png",
              },
              {
                name: "UPRVUNL",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787125921/encotec-Assets/logos/uprvunl.png",
              },
            ],
          },
        },
      });

      // 10. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 9,
          content: {
            tagline: "Partner With Us",
            headingPart1: "Experience Global",
            headingHighlight: "Engineering Excellence.",
            description:
              "From India to Global, see how we are setting new standards in power infrastructure. Join the 13+ Projects that rely on Encotec for their critical needs.",
            primaryBtnLabel: "Start Your Project",
            primaryBtnUrl: "#",
            secondaryBtnLabel: "Talk to an Expert",
            secondaryBtnUrl: "+91 120 4155612",
            footerNote:
              "Looking for precision and reliability? Get in touch to learn more about our certified quality and safety-first approach.",
            copyright: "© 2026 Encotec Engineering.",
          },
        },
      });

      // 11. FooterCMS certificates
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "FooterCMS",
          order: 10,
          content: {
            certificates: [
              {
                alt: "ISO 9001:2015",
                src: "https://res.cloudinary.com/dpa93copz/image/upload/v1789386694/encotec-Assets/u2hnzxahnlqpe1rsgh2h.png",
                description: "QUALITY MANAGEMENT SYSTEM",
              },
              {
                alt: "ISO 14001:2015",
                src: "https://res.cloudinary.com/dpa93copz/image/upload/v1789386695/encotec-Assets/gke8cxzlk56pimretbul.png",
                description: "ENVIRONMENTAL MANAGEMENT SYSTEM",
              },
              {
                alt: "ISO 45001:2018",
                src: "https://res.cloudinary.com/dpa93copz/image/upload/v1789386697/encotec-Assets/g2miviz99upogv9ys9ws.png",
                description: "OCCUPATIONAL HEALTH & SAFETY MANAGEMENT SYSTEM",
              },
            ],
          },
        },
      });
      console.log(
        "Created Home sections (CTA and footer certificates included)",
      );
    }

    if (createdPage.slug === "about") {
      // 1. AboutHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AboutHero",
          order: 0,
          content: {
            tagline: "About Encotec Energy",
            headingPart1: "Engineering Excellence,",
            headingItalicHighlight: "Delivered with Ownership",
            description:
              "A full-spectrum engineering and services company operating across power generation, transmission & distribution, and renewable energy sectors.",
            backgroundImage:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
          },
        },
      });
      // 2. WhoWeAre
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "WhoWeAre",
          order: 1,
          content: {
            tagline: "Who We Are",
            headingPart1: "Energy is More Than ",
            headingHighlight: "Just Infrastructure",
            paragraphs: [
              "At Encotec, we believe that energy infrastructure is about more than just steel and circuits — it is about the responsibility of keeping the world moving. We have evolved from a traditional O&M service provider into a Global Service Provider that offers end-to-end solutions for the entire life of your project.",
              "We approach every plant, every substation, and every utility we manage with what we call an \"Owner's Mindset\". This means we don't just provide a service; we take total responsibility for your assets, treating them with the same care, accountability, and long-term vision as if they were our own.",
            ],
            heritageTagline: "Our Heritage. Our Future.",
            heritageDescription:
              "Founded in 2009, Encotec spent its formative years as a proud member of the German Dornier/VPC Group, inheriting a legacy of rigorous European engineering, precision, and quality. In January 2026, Encotec achieved a historic milestone, transitioning into a 100% independent, Indian-owned enterprise. Today, we offer the global market a rare and powerful combination: the meticulous technical discipline of our European roots, supercharged by the agility, scale, and ingenuity of Indian enterprise. Whether optimizing mega-power plants or managing the critical utilities of international airports, we are proudly Indian, globally benchmarked, and ready to engineer the future of energy and infrastructure.",
          },
        },
      });
      // 3. MissionVisionValues
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "MissionVisionValues",
          order: 2,
          content: {
            tagline: "Our Heart and Soul",
            description:
              "Our purpose is to bridge the gap between technical complexity and business success.",
            missionTitle: "Mission",
            missionDesc:
              "To empower the global energy and infrastructure sectors by delivering comprehensive, lifecycle-optimized O&M and EPC solutions. We operate every asset with an 'Owner's Mindset,' ensuring maximum reliability, uncompromising safety, and sustainable value creation for our clients.",
            visionTitle: "Vision",
            visionDesc:
              "To be the globally preferred engineering and O&M partner, driving the future of sustainable energy and critical infrastructure through Indian ingenuity and world-class execution.",
            valuesTitle: "Core Values",
            valuesDesc:
              "We are defined by Accountability, Innovation, and Total Care. By adopting the owner's perspective, we ensure that safety and efficiency are never compromised.",
            valuesList: [
              {
                title: "Safety First (Zero Harm)",
                description:
                  "Safety is not just a policy; it is our culture. We believe in zero fatalities, zero injuries, and zero excuses. We protect our people, our partners, and the communities we operate in.",
                icon: "ShieldCheck",
              },
              {
                title: "The Owner's Mindset",
                description:
                  "We do not just maintain assets; we optimize them. We make proactive, cost-effective decisions as if the facility's balance sheet were our own.",
                icon: "BrainCircuit",
              },
              {
                title: "Engineering Excellence",
                description:
                  "Born from European precision and powered by Indian innovation, we deliver technically robust, predictable, and world-class solutions to the most complex energy and infrastructure challenges.",
                icon: "Cog",
              },
              {
                title: "Unshakable Integrity",
                description:
                  "We build trust through transparency. We honor our commitments, maintain strict ethical standards, and operate with absolute honesty in every global market.",
                icon: "HandshakeIcon",
              },
              {
                title: "Sustainable Agility",
                description:
                  "We are adaptable and forward-looking. From supercritical thermal overhauls and greenfield solar EPC, to managing the utilities of world-class international airports, we continuously evolve our skills to meet the demands of a changing world.",
                icon: "Leaf",
              },
            ],
          },
        },
      });
      // 4. ScaleImpact
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ScaleImpact",
          order: 3,
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
            footerNote:
              "Our scale is not just a measure of size, but a reflection of our ability to consistently deliver high-performance outcomes across complex engineering environments.",
          },
        },
      });
      // 5. Timeline
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "Timeline",
          order: 4,
          content: {
            tagline: "Our Journey",
            heading: "A Timeline of Growth",
            description:
              "We have spent over a decade building a legacy of excellence, one project at a time.",
            phases: [
              {
                title: "2011–2012: Construction Beginnings",
                description:
                  "We began our major journey into the green frontier, successfully contributed 35+ MW Solar PV projects in Gujarat and 125 MW Solar Thermal projects in Rajasthan.",
              },
              {
                title: "2013 & Beyond: O&M Leadership",
                description:
                  "Solidified our reputation as top-tier stewards with the long-term O&M management contracts, Annual Maintenance contracts, Overhauling jobs. etc.",
              },
              {
                title: "2018-2026: Supercritical Excellence",
                description:
                  "Embarked on our flagship O&M partnership for the 2x700 MW supercritical power plant at Nabha Power / Rajpura and 2x660 MW supercritical power plant at Jhajjar.",
              },
              {
                title: "2018 & Beyond: Environmental",
                description:
                  "Delivering a Sustainable, Cleaner Industrial Future Helping industries meet stringent environmental standards through specialized FGD O&M excellence.",
              },
              {
                title: "2021: Going Global",
                description:
                  "Took our expertise global, managing critical commissioning projects internationally.",
              },
              {
                title: "2021 & Beyond: New Chapters",
                description:
                  "We are currently providing specialized utility management for international airports like Indira Gandhi International Airport, Delhi (DIAL) and Noida International Airport (NIA), newly inaugurated.",
              },
            ],
          },
        },
      });
      // 6. Sustainability
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "Sustainability",
          order: 5,
          content: {
            tagline: "ESG Commitment",
            heading: "Committed to a Greener Tomorrow",
            paragraphs: [
              "Sustainability is not a policy at Encotec; it is our promise. We are committed to sustainable development by integrating high standards of environmental management into everything we do.",
              "Our in-house Encotec team conducts  energy audits to identify savings and reduce the carbon footprints of operational plants. Through our expert advisory and Residual Life Assessments (RLA), we help owners revitalize old plants, making them more efficient and environmentally compliant.",
            ],
            focuses: [
              "Specialized energy audits by our in-house Encotec team to identify savings and reduce carbon footprints",
              "Residual Life Assessments (RLA) to help owners revitalize older plants for improved efficiency and environmental compliance",
              "ISO 14001 environmental management integrated into daily operations across all sites",
              "Supporting the transition from traditional power to a sustainable, renewable future",
            ],
            footerNote:
              "Our approach ensures that sustainability is not an afterthought, but an integral part of how we design, execute, and operate energy systems.",
          },
        },
      });
      // 7. GlobalPresence
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "GlobalPresence",
          order: 6,
          content: {
            tagline: "Our Reach",
            headingPart1: "A Global Presence",
            headingHighlight: "with a Local Touch",
            description:
              "While our headquarters is in Noida, our footprint spans the world. In India, we are present in 13+ locations pan India. Internationally, we have established strong roots in Turkey, UAE, Indonesia, Vietnam, Germany, ensuring that wherever infrastructure needs stewardship, Encotec is there.",
            areas: [
              {
                title: "International Operations",
                desc: "Turkey, UAE, Indonesia, Vietnam, Germany",
              },
              { title: "Headquarters", desc: "Noida, India" },
            ],
            calloutTitle: "Wherever Energy is Needed",
            calloutDesc:
              'We combine local execution strength with global engineering expertise, ensuring that we bring the same "Owner\'s Mindset" to every project, no matter the geography.',
          },
        },
      });
      // 8. Leadership
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "Leadership",
          order: 7,
          content: {
            heading: "Leadership Team",
            description:
              "Experienced leaders driving operational excellence and strategic growth",
            leaders: [
              {
                role: "Managing Director",
                name: "Arun Kumar Sarna",
                bio: 'Arun Kumar Sarna is the Founder and CEO of Encotec Energy India, driving the company\'s vision to deliver comprehensive "shovel-to-socket" energy solutions globally. Under his leadership, Encotec has expanded across Thermal Power, Solar PV, and EHV Transmission & Distribution, embedding a signature "Owner’s Mindset" into the company\'s DNA.\n\nA pioneer in third-party O&M contracts in India, Mr. Sarna brings 40+ years of experience managing World Bank, KfW, and Japanese agency mega-projects. Globally, he has advised ESKOM (South Africa) and directed operations across Vietnam, Indonesia, and the Middle East.\n\nHe holds a Mechanical Engineering degree, a Master’s in Metallurgy from IIT Roorkee, and a PGDM from MDI Gurgaon, with executive certifications from Harvard Business School and IIT Mumbai.',
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787296801/encotech/leadership/arun_kumar_sarna_white_bg.jpg",
              },
              {
                role: "Director",
                name: "Rajan Saxena",
                bio: "Rajan Saxena is a senior energy-sector leader with 47 years of experience across thermal power, T&D, O&M services, plant overhauling, and Solar PV EPC. As Director at Encotec, he oversees operations, spare parts supply, modernization, and substation erection.\n\nPrior to Encotec, Mr. Saxena held senior leadership roles at global energy majors including GE T&D India, AREVA / Alstom, Skoda Power, DLF Power, and BHEL.\n\nHis expertise spans managing large service portfolios, full P&L accountability, EPC project execution, global procurement, logistics, and specialized repair facilities.",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787296802/encotech/leadership/rajan_saxena_white_bg.jpg",
              },
              {
                role: "Director",
                name: "Rajeev Ahuja",
                bio: "Rajeev Ahuja brings 38+ years of engineering and business management experience in the power and industrial sectors. As Director at Encotec, he leads corporate strategy, high-value contract bidding, proposals, commercial management, HR, Finance & Accounts, and P&L accountability.\n\nHe previously served in senior leadership roles at STEAG Energy Services India and Nicco Engineering, managing complete business cycles from opportunity identification to contract closeout.\n\nMr. Ahuja holds a Mechanical Engineering degree with international technical and business training in the UK and Thailand, having built and led BD teams of 25+ professionals.",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787114348/encotech/leadership/rajeev_ahuja_white_bg.jpg",
              },
            ],
          },
        },
      });
      // 9. ClosingStatement
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ClosingStatement",
          order: 8,
          content: {
            headingPart1: "Encotec integrates ",
            headingHighlight:
              "engineering expertise, execution capability, and operational excellence",
            headingPart2: " to deliver solutions that perform",
            description:
              "— not just at commissioning, but throughout the lifecycle of every asset.",
            ctaLabel: "Partner With Us",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created About sections (all 9 Encotec sections)");
    }

    if (createdPage.slug === "services") {
      // 1. ServicesHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ServicesHero",
          order: 0,
          content: {
            tagline: "Our Services",
            headingPart1: "Integrated Solutions Across the",
            headingItalicHighlight: "Asset Lifecycle",
            description:
              "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
          },
        },
      });

      // 2. IntroSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "IntroSection",
          order: 1,
          content: {
            paragraph1:
              "At Encotec, we don't just provide engineering services; we provide peace of mind. We approach every facility we manage with an \"Owner's Mindset\", meaning we treat your infrastructure with the same care, precision, and long-term vision as if it were our own.",
            paragraph2:
              "With a family of over 1,800 staff members and 300+ specialized engineers, we bridge the gap between technical complexity and commercial success. Below is an overview of how we provide end-to-end expertise across the asset lifecycle.",
          },
        },
      });

      // 3. CoreServices
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CoreServices",
          order: 2,
          content: {
            heading: "Core Services",
            keyCapabilitiesLabel: "Key Capabilities",
            valueDeliveredLabel: "Value Delivered",
            showLessLabel: "Show Less",
            viewDetailsLabel: "View Details",
            exploreServiceLabel: "Explore Service",
            services: [
              {
                title: "Project Conceptualisation & Development",
                icon: "Target",
                link: "/services/project-management",
                overview:
                  "We help you build on a solid foundation, from pre-feasibility studies to the final selection of your EPC partners.",
                capabilities: [
                  "Feasibility & Pre-Feasibility Studies",
                  "Detailed Project Reports (DPR)",
                  "Strategic Sourcing & Technical Specifications",
                  "EPC Contractor Selection",
                  "Financial Assessments",
                ],
                value: [
                  "Technically sound planning",
                  "Financially viable projects",
                  "Stakeholder confidence",
                ],
              },
              {
                title: "Construction, Commissioning & Relocation",
                icon: "HardHat",
                link: "/services/transmission-distribution",
                overview:
                  "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
                capabilities: [
                  "Multi-Sector Construction Expertise",
                  "International Commissioning",
                  "Grid Synchronization & Performance Tests",
                  "Asset Dismantling & Relocation",
                  "Complex IBR Piping Erection",
                ],
                value: [
                  "Speed and safety",
                  "Seamless cross-border transitions",
                  "Physical realization of complex assets",
                ],
              },
              {
                title: "Asset Stewardship (O&M)",
                icon: "Settings",
                link: "/services/power-generation",
                overview:
                  "As one of India's top five O&M specialists, we provide continuous care for thermal plants, international airports, and critical utilities.",
                capabilities: [
                  "Thermal & Supercritical Mastery",
                  "Airport Utility Management",
                  "Integrated ERP Support",
                  "Zero-Error Operations",
                  "Risk Management & Reliability Focus",
                ],
                value: [
                  "Optimized megawatt production",
                  "Long-term asset health",
                  "Owner-perspective care",
                ],
              },
              {
                title: "Expert Advisory & Performance Audits",
                icon: "ClipboardCheck",
                link: "/services/renewable-energy",
                overview:
                  "When problems arise or efficiency drops, our specialists provide on-site diagnostics and high-level technical solutions.",
                capabilities: [
                  "Specialised Testing (NDT)",
                  "Energy Efficiency Audits",
                  "Steam Path Audits",
                  "5S & Process Improvement",
                  "High-Level Problem Solving",
                ],
                value: [
                  "Reduced megawatt production costs",
                  "Improved workplace safety",
                  "Restored operational efficiency",
                ],
              },
              {
                title: "Due Diligence & Asset Health",
                icon: "ShieldCheck",
                link: "/services/airport-services",
                overview:
                  'We evaluate the "residual life" of older plants to help owners make informed decisions about acquisitions or relocations.',
                capabilities: [
                  "Residual Life Assessment (RLA)",
                  "Technical Due Diligence",
                  "Independent Technical Audits",
                  "Revamping & Restoration Strategy",
                  "Environmental Compliance Planning",
                ],
                value: [
                  "Informed investment decisions",
                  "Understanding true asset value",
                  "Future-proofed infrastructure",
                ],
              },
              {
                title: "Strategic Global Sourcing (Spare Parts)",
                icon: "Package",
                link: "/services/value-added",
                overview:
                  "Access our trusted network of major OEMs in China, Vietnam, and India to keep your facility running without interruption.",
                capabilities: [
                  "Global OEM Network (65+ tie-ups)",
                  "Comprehensive Inventory Supply",
                  "High-Pressure Boiler Spares",
                  "Electrical Actuators & Mill Rollers",
                  "Engineering Integration Support",
                ],
                value: [
                  "Reduced downtime",
                  "Strategic sourcing partnerships",
                  "Guaranteed specification performance",
                ],
              },
            ],
          },
        },
      });

      // 4. IndustriesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "IndustriesSection",
          order: 3,
          content: {
            heading: "Industries We Serve",
            description: "We deliver solutions across a wide range of sectors",
            industries: [
              {
                name: "Power Generation",
                subtitle: "Thermal & Renewable",
                icon: "Flame",
              },
              {
                name: "Transmission & Distribution",
                subtitle: "Grid Infrastructure",
                icon: "Network",
              },
              {
                name: "Infrastructure & Industrial",
                subtitle: "Facilities",
                icon: "Building",
              },
              {
                name: "Airports & Utility Systems",
                subtitle: "Critical Infrastructure",
                icon: "Plane",
              },
              {
                name: "Energy & Climate Projects",
                subtitle: "Sustainable Solutions",
                icon: "Zap",
              },
            ],
          },
        },
      });

      // 5. ProcessSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessSection",
          order: 4,
          content: {
            heading: "How We Deliver",
            description:
              "Our structured approach ensures precision and reliability at every stage",
            steps: [
              {
                title: "Assess",
                description: "Technical and commercial evaluation",
                number: "01",
              },
              {
                title: "Design",
                description: "Engineering and system planning",
                number: "02",
              },
              {
                title: "Execute",
                description: "Construction and commissioning",
                number: "03",
              },
              {
                title: "Operate",
                description: "Maintenance and optimization",
                number: "04",
              },
            ],
          },
        },
      });

      // 6. ClosingSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ClosingSection",
          order: 5,
          content: {
            headingPart1:
              "Our integrated approach ensures that every project — ",
            headingHighlight: "from concept to operation",
            headingPart2:
              " — is delivered with precision, reliability, and long-term performance in mind.",
            ctaLabel: "Start Your Project",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Services sections (all 6 Encotec sections)");
    }

    if (createdPage.slug === "engineering-services") {
      // 1. EngineeringHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "EngineeringHero",
          order: 0,
          content: {
            label: "Service 01",
            headline: "ENGINEERING SERVICES",
            description:
              "Comprehensive engineering solutions forming the foundation of reliable and efficient energy infrastructure across power generation, transmission, and renewable energy projects.",
            floatingStats: [
              "500+ Projects Engineered",
              "8000+ MW Designed",
              "99.2% Design Accuracy",
            ],
            backgroundImage:
              "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2400",
          },
        },
      });
      // 2. OverviewSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "OverviewSection",
          order: 1,
          content: {
            tagline: "Overview",
            heading:
              "Building the Foundation of Reliable Energy Infrastructure",
            paragraphs: [
              "Our engineering services deliver comprehensive solutions that form the foundation of reliable and efficient energy infrastructure. We bring deep technical expertise across feasibility analysis, system design, and detailed engineering for power generation, transmission, and renewable energy projects.",
              "From initial site assessment to final design validation, our engineering team ensures every project is built on a strong technical foundation that optimizes performance, minimizes risk, and delivers long-term value.",
            ],
            quote:
              "Engineering excellence is not just about technical precision — it's about understanding the entire lifecycle and designing for reliability, efficiency, and sustainable performance.",
            image:
              "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
            badgeTitle: "Engineering Excellence",
            badgeValue: "Since 2009",
          },
        },
      });
      // 3. CapabilitiesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CapabilitiesSection",
          order: 2,
          content: {
            tagline: "Capabilities",
            heading: "Key Capabilities",
            description:
              "Our engineering services span the complete project lifecycle, from initial assessment to detailed design and technical validation.",
            capabilities: [
              {
                title: "Site Assessment & Evaluation",
                description:
                  "Comprehensive technical evaluation of site conditions, resource availability, and project feasibility",
                icon: "Target",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Energy Yield Analysis",
                description:
                  "Detailed resource assessment and energy generation forecasting for optimal project planning",
                icon: "TrendingUp",
                image:
                  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Feasibility Studies",
                description:
                  "Pre-feasibility and detailed feasibility studies with technical and commercial evaluation",
                icon: "FileText",
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Design & Engineering",
                description:
                  "Design review, detailed engineering, and preparation of comprehensive project reports (DPR)",
                icon: "Layout",
                image:
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "System Integration",
                description:
                  "Power evacuation planning and system integration for seamless grid connectivity",
                icon: "Zap",
                image:
                  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Transmission & Substation Design",
                description:
                  "Transmission line design (33kV to 765kV) and substation design (AIS/GIS systems)",
                icon: "Network",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
              },
            ],
          },
        },
      });
      // 4. ProcessSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessSection",
          order: 3,
          content: {
            tagline: "Our Approach",
            heading: "Engineering Methodology",
            description:
              "A systematic approach to engineering excellence, ensuring every project is built on a foundation of technical rigor and precision.",
            steps: [
              {
                title: "Assessment",
                description:
                  "Comprehensive site evaluation, resource analysis, and technical feasibility assessment",
                icon: "Search",
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Analysis",
                description:
                  "Energy yield forecasting, system modeling, and detailed technical evaluation",
                icon: "TrendingUp",
                image:
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Design",
                description:
                  "Detailed engineering, system design, and comprehensive project documentation",
                icon: "PencilRuler",
                image:
                  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Integration",
                description:
                  "Power evacuation planning, grid connectivity design, and system integration",
                icon: "Settings",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "Validation",
                description:
                  "Design review, technical validation, and regulatory compliance verification",
                icon: "ShieldCheck",
                image:
                  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
              },
            ],
          },
        },
      });
      // 5. StatsSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StatsSection",
          order: 4,
          content: {
            heading: "Engineering Impact",
            description:
              "Delivering measurable results through technical excellence and precision engineering",
            stats: [
              { value: 500, suffix: "+", label: "Projects Engineered" },
              { value: 8000, suffix: "+ MW", label: "Capacity Designed" },
              { value: 23, suffix: "+", label: "Countries Served" },
              { value: 99.2, suffix: "%", label: "Design Accuracy" },
            ],
          },
        },
      });
      // 6. FeaturedProjectSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "FeaturedProjectSection",
          order: 5,
          content: {
            tagline: "Featured Project",
            heading: "Engineering Excellence in Action",
            projectTitle: "The Obra 'C' Thermal Success",
            projectDescription:
              "Complete engineering services for a 2x660 MW supercritical thermal power plant in Uttar Pradesh, delivering comprehensive design, system integration, and technical validation.",
            projectImage:
              "https://res.cloudinary.com/dpa93copz/image/upload/v1787744210/encotec-Assets/himsufy4ajry8mvqoqt9.jpg",
            metrics: [
              { value: "1,320 MW", label: "Total Capacity", icon: "Zap" },
              { value: "Supercritical", label: "Technology", icon: "Target" },
              { value: "On Schedule", label: "Delivery", icon: "CheckCircle2" },
            ],
          },
        },
      });
      // 7. ValueSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ValueSection",
          order: 6,
          content: {
            tagline: "Value Delivered",
            heading: "Engineering Value",
            description:
              "Our engineering approach delivers measurable value through risk reduction, performance optimization, and technical excellence.",
            values: [
              {
                title: "Reduced Project Risk",
                description:
                  "Accurate planning and technical validation minimize execution risks and costly delays",
                icon: "ShieldCheck",
              },
              {
                title: "Optimized System Design",
                description:
                  "Performance-focused engineering ensures maximum efficiency and reliability",
                icon: "Target",
              },
              {
                title: "Strong Technical Foundation",
                description:
                  "Comprehensive documentation and design reviews support seamless execution",
                icon: "ClipboardCheck",
              },
              {
                title: "Regulatory Compliance",
                description:
                  "Designs meet all applicable standards and regulatory requirements",
                icon: "CheckCircle2",
              },
            ],
          },
        },
      });
      // 8. RelatedServicesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "RelatedServicesSection",
          order: 7,
          content: {
            tagline: "Related Services",
            heading: "Explore More Services",
            services: [
              {
                title: "Project Management",
                description:
                  "Structured planning, coordination, and control across all project phases",
                link: "/services/project-management",
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "EPC & Construction",
                description:
                  "Execution support across engineering, procurement, and construction",
                link: "/services",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200",
              },
              {
                title: "O&M Services",
                description:
                  "Long-term operational excellence and performance optimization",
                link: "/services",
                image:
                  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
              },
            ],
          },
        },
      });
      // 9. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 8,
          content: {
            heading: "Ready to Start Your Engineering Project?",
            description:
              "Let our engineering team help you build a strong technical foundation for your energy infrastructure project.",
            primaryBtnLabel: "Get Started",
            primaryBtnUrl: "/contact",
            secondaryBtnLabel: "View All Services",
            secondaryBtnUrl: "/services",
          },
        },
      });
      console.log("Created Engineering Services sections");
    }

    if (createdPage.slug === "project-management") {
      // 1. ProjectHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProjectHero",
          order: 0,
          content: {
            label: "PROJECT CONCEPTUALIZATION & DEVELOPMENT",
            headingPart1: "Building Your Vision on a ",
            headingHighlight: "Logical Foundation",
            description:
              "A great project doesn't start with a shovel in the ground; it starts with a logical, well-vetted plan. We are your strategic developers who ensure your project is technically sound and financially viable from day one.",
            floatingBadges: [
              { icon: "Map", text: "Pre-Feasibility" },
              { icon: "FileText", text: "DPR Creation" },
              { icon: "Briefcase", text: "EPC Selection" },
            ],
          },
        },
      });
      // 2. PhilosophySection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "PhilosophySection",
          order: 1,
          content: {
            headingPart1: "Not Just Detailed Engineering. ",
            headingHighlight: "Strategic Development.",
            paragraphs: [
              'We are not "detailed engineering" firms that gets lost in the minutiae. We understand that the earliest decisions in a project lifecycle have the most profound impact on its ultimate success.',
              'By adopting an "Owner\'s Mindset" from the very beginning, we evaluate site conditions, resource potential, and financial models to ensure your investment is built on reality, not just theory. We provide the clarity required for stakeholder confidence and project approval.',
            ],
            features: [
              {
                title: "Strategic Alignment",
                desc: "Aligning technical goals with business goals.",
                icon: "Target",
              },
              {
                title: "Financial Viability",
                desc: "Rigorous financial and economic analysis.",
                icon: "FileCheck",
              },
              {
                title: "Partner Selection",
                desc: "Facilitating the right contracting.",
                icon: "Users",
              },
              {
                title: "Risk Mitigation",
                desc: "Identifying challenges before they arise.",
                icon: "ShieldCheck",
              },
            ],
          },
        },
      });
      // 3. CoreOfferings
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CoreOfferings",
          order: 2,
          content: {
            heading: "Our Development Services",
            description:
              "End-to-end conceptualization to ensure your project starts strong.",
            offerings: [
              {
                title: "Feasibility & Pre-Feasibility Studies",
                description:
                  "We evaluate the conditions and resource potential to ensure your investment is built on reality, not just theory. Our comprehensive studies cover technical, economic, and environmental factors.",
                icon: "Map",
              },
              {
                title: "Detailed Project Reports (DPR)",
                description:
                  "We provide the technical and financial clarity required for stakeholder confidence and project approval. Our DPRs are an effective blueprint for project execution and financing.",
                icon: "FileText",
              },
              {
                title: "Strategic Sourcing & EPC Selection",
                description:
                  "We develop rigorous technical specifications and help you finalize EPC contractors, ensuring you have the right partners by your side. We manage the entire tendering and evaluation process.",
                icon: "Briefcase",
              },
            ],
          },
        },
      });
      // 4. StatsSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StatsSection",
          order: 3,
          content: {
            stats: [
              {
                value: 20,
                suffix: "+ GW",
                label: "Managed capacity under stewardship",
              },
              { value: 100, suffix: "%", label: "Owner's Mindset" },
              { value: 300, suffix: "+", label: "Specialized Engineers" },
            ],
          },
        },
      });
      // 5. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 4,
          content: {
            heading: "Ready to Build Your Vision?",
            description:
              "Let's start your project on a logical foundation with our expert conceptualization and development services.",
            ctaLabel: "Start the Conversation",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Project Management sections");
    }

    if (createdPage.slug === "power-generation") {
      // 1. StewardshipHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StewardshipHero",
          order: 0,
          content: {
            label: "Asset Stewardship (O&M)",
            headingPart1: "Operating With An ",
            headingHighlight: "Owner's Mindset",
            description:
              "We don't just \"maintain\" plants; we steward them. By adopting the owner's perspective, we focus on reliability, risk management, and long-term health, ensuring that every megawatt produced is optimized.",
          },
        },
      });
      // 2. StewardshipFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StewardshipFeatures",
          order: 1,
          content: {
            features: [
              {
                title: "Thermal & Supercritical Mastery",
                description:
                  "We manage some of India’s largest facilities, such as the 2x700 MW supercritical plant at Rajpura, with a focus on zero-error operations and maximum availability.",
                icon: "Zap",
              },
              {
                title: "Airport Utility Management",
                description:
                  "We are the silent force behind international hubs like DIAL, managing critical high-voltage assets, fire safety, and mechanical systems to ensure uninterrupted operations.",
                icon: "Plane",
              },
              {
                title: "Integrated ERP Support",
                description:
                  "All our sites are linked via a single ERP system, providing central project management and inventory support from our Noida headquarters for seamless operations.",
                icon: "Database",
              },
            ],
          },
        },
      });
      // 3. StewardshipPhilosophy
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StewardshipPhilosophy",
          order: 2,
          content: {
            headingPart1: "The Difference Between ",
            headingHighlight: "Maintenance & Stewardship",
            paragraphs: [
              "Maintenance is reactive; stewardship is proactive. As one of India's top five O&M specialists, we take total responsibility for the health of your assets.",
              "Our approach integrates predictive diagnostics, rigorous safety protocols, and continuous performance optimization. We don't just fix what's broken; we prevent failures before they occur, maximizing the lifespan and profitability of your infrastructure.",
            ],
            items: [
              { title: "Zero-Error Focus", icon: "ShieldCheck" },
              { title: "Predictive Diagnostics", icon: "Activity" },
              { title: "Centralized ERP", icon: "Database" },
              { title: "24/7 Monitoring", icon: "Settings" },
            ],
          },
        },
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Experience True Stewardship",
            description:
              "Let us take responsibility for your assets so you can focus on your core business.",
            ctaLabel: "Partner With Us",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Power Generation sections");
    }

    if (createdPage.slug === "transmission-distribution") {
      // 1. ConstructionHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ConstructionHero",
          order: 0,
          content: {
            label: "CONSTRUCTION, COMMISSIONING & RELOCATION",
            headingPart1: "Bringing Complex ",
            headingHighlight: "Infrastructure to Life",
            description:
              'At Encotec, we thrive on the challenge of "physical realization". From the massive IBR piping of a thermal plant to the precision mounting of solar modules, we bring your assets online with speed and safety.',
          },
        },
      });
      // 2. CapabilitiesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CapabilitiesSection",
          order: 1,
          content: {
            heading: "Physical Realization at Scale",
            description:
              "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
            capabilities: [
              {
                title: "Multi-Sector Expertise",
                description:
                  "We have delivered construction excellence across thermal power, solar PV, and wind projects globally. Our teams handle everything from civil works to complex mechanical erection.",
                icon: "HardHat",
              },
              {
                title: "Technical Due Diligence",
                description:
                  "We provide independent technical audits for plant acquisitions, helping you understand the true value, operational risks, and hidden costs of an investment.",
                icon: "FileCheck",
              },
              {
                title: "Restoration Strategy",
                description:
                  "For older plants, we provide comprehensive revamping and restoration plans to improve performance, extend lifecycle, and meet environmental standards.",
                icon: "RefreshCw",
              },
            ],
          },
        },
      });
      // 3. ValueProtection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ValueProtection",
          order: 2,
          content: {
            headingPart1: "Protecting Your ",
            headingHighlight: "Investment",
            bulletHeading: "What We Evaluate",
            paragraphs: [
              "Acquiring or relocating an industrial asset involves significant capital risk. Without a clear understanding of the asset's true condition, you may be inheriting expensive liabilities.",
              "Our independent technical audits provide the objective data you need to negotiate effectively, plan capital expenditures accurately, and ensure that your investment will deliver the expected returns over its intended lifecycle.",
            ],
            bullets: [
              "Structural integrity and material degradation",
              "Historical O&M records and failure analysis",
              "Environmental compliance and emissions",
              "Control system obsolescence",
              "Thermodynamic performance baseline",
            ],
          },
        },
      });
      // 4. ProcessFlow
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessFlow",
          order: 3,
          content: {
            headingPart1: "The Relocation ",
            headingHighlight: "Advantage",
            description:
              "Asset relocation is a highly specialized service that requires meticulous planning, precise execution, and deep engineering knowledge. Encotec is one of the few global providers with a proven track record in cross-border plant relocations.",
            bullets: [
              "Detailed dismantling protocols and tagging",
              "Logistics planning and customs clearance support",
              "Refurbishment of critical components during transit",
              "Re-erection and synchronization at the new site",
            ],
            steps: [
              {
                title: "Dismantle",
                desc: "Precision teardown",
                icon: "Settings",
              },
              { title: "Transport", desc: "Global logistics", icon: "Truck" },
              { title: "Erect", desc: "Expert installation", icon: "HardHat" },
              { title: "Commission", desc: "Grid sync & testing", icon: "Zap" },
            ],
          },
        },
      });
      // 5. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 4,
          content: {
            heading: "Planning an Acquisition or Relocation?",
            description:
              "Get the technical truth about your assets before you make a decision.",
            ctaLabel: "Request an Assessment",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Transmission & Distribution sections");
    }

    if (createdPage.slug === "renewable-energy") {
      // 1. AdvisoryHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AdvisoryHero",
          order: 0,
          content: {
            label: "Expert Advisory & Performance Audits",
            headingPart1: "Solving the Hardest ",
            headingHighlight: "Engineering Problems",
            description:
              "When a plant is running but not performing, or when technical faults disrupt your peace of mind, our expert advisory team steps in. We provide high-level problem solving that goes beyond basic maintenance.",
          },
        },
      });
      // 2. AdvisoryFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AdvisoryFeatures",
          order: 1,
          content: {
            features: [
              {
                title: "Specialised Testing (NDT)",
                description:
                  "We use Non-Destructive Testing to assess the health of your equipment without causing further downtime. Identify micro-fractures and wear before they lead to catastrophic failure.",
                icon: "Search",
              },
              {
                title: "Efficiency Audits",
                description:
                  "Our in-house team conducts energy efficiency and steam path audits to identify savings and reduce your carbon footprint. We find the lost megawatts in your system.",
                icon: "Activity",
              },
              {
                title: "5S & Process Improvement",
                description:
                  "We implement industrial standards (5S) to improve workplace safety and operational flow. A clean, organized plant is a safe and efficient plant.",
                icon: "TrendingUp",
              },
            ],
          },
        },
      });
      // 3. DiagnosticProcess
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "DiagnosticProcess",
          order: 2,
          content: {
            heading: "Our Diagnostic Approach",
            description:
              "We don't guess; we measure. Our advisory services are built on hard data and deep engineering expertise.",
            steps: [
              {
                step: "01",
                title: "Assess",
                desc: "Comprehensive site evaluation and data gathering",
              },
              {
                step: "02",
                title: "Analyze",
                desc: "Deep dive into performance metrics and NDT results",
              },
              {
                step: "03",
                title: "Advise",
                desc: "Actionable recommendations for improvement",
              },
              {
                step: "04",
                title: "Optimize",
                desc: "Implementation support and verification",
              },
            ],
          },
        },
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Is Your Asset Reaching Its Full Potential?",
            description:
              "Speak with our specialized engineers about our expert advisory and performance audits.",
            ctaLabel: "Request an Audit",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Renewable Energy sections");
    }

    if (createdPage.slug === "airport-services") {
      // 1. DueDiligenceHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "DueDiligenceHero",
          order: 0,
          content: {
            label: "Due Diligence & Asset Health",
            headingPart1: "Making Informed Decisions ",
            headingHighlight: "For the Long Term",
            description:
              "Before you buy an old plant or decide to move one, you need to know if it's fit for the future. Our due diligence services provide the technical truth about your assets.",
          },
        },
      });
      // 2. HealthFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "HealthFeatures",
          order: 1,
          content: {
            features: [
              {
                title: "Residual Life Assessment (RLA)",
                description:
                  "We conduct exhaustive studies to determine how many more years of efficient life your plant equipment actually has, helping you plan for replacements or upgrades.",
                icon: "Activity",
              },
              {
                title: "Technical Due Diligence",
                description:
                  "We provide independent technical audits for plant acquisitions, helping you understand the true value, operational risks, and hidden costs of an investment.",
                icon: "FileCheck",
              },
              {
                title: "Restoration Strategy",
                description:
                  "For older plants, we provide comprehensive revamping and restoration plans to improve performance, extend lifecycle, and meet environmental standards.",
                icon: "RefreshCw",
              },
            ],
          },
        },
      });
      // 3. ValueProtection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ValueProtection",
          order: 2,
          content: {
            headingPart1: "Protecting Your ",
            headingHighlight: "Investment",
            bulletHeading: "What We Evaluate",
            paragraphs: [
              "Acquiring or relocating an industrial asset involves significant capital risk. Without a clear understanding of the asset's true condition, you may be inheriting expensive liabilities.",
              "Our independent technical audits provide the objective data you need to negotiate effectively, plan capital expenditures accurately, and ensure that your investment will deliver the expected returns over its intended lifecycle.",
            ],
            bullets: [
              "Structural integrity and material degradation",
              "Historical O&M records and failure analysis",
              "Environmental compliance and emissions",
              "Control system obsolescence",
              "Thermodynamic performance baseline",
            ],
          },
        },
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Planning an Acquisition or Relocation?",
            description:
              "Get the technical truth about your assets before you make a decision.",
            ctaLabel: "Request an Assessment",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Airport Services sections");
    }

    if (createdPage.slug === "value-added") {
      // 1. SourcingHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SourcingHero",
          order: 0,
          content: {
            label: "STRATEGIC GLOBAL SOURCING",
            headingPart1: "The Global Link for ",
            headingHighlight: "Critical Equipment",
            description:
              "Downtime is often caused by a missing part, not a missing plan. Encotec acts as your strategic sourcing partner, leveraging deep relationships with manufacturers to get you what you need, when you need it.",
          },
        },
      });
      // 2. SourcingFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SourcingFeatures",
          order: 1,
          content: {
            features: [
              {
                title: "Global OEM Network",
                description:
                  "We have established tie-ups with over  major OEMs in China, Vietnam, and India, giving you direct access to high-quality components without the logistical headache.",
                icon: "Globe",
              },
              {
                title: "Comprehensive Inventory",
                description:
                  "We supply everything from high-pressure boiler spares to coal mill rollers, specialized electrical actuators, and valves.",
                icon: "Package",
              },
              {
                title: "Technical Support",
                description:
                  "We don't just supply parts; we provide the engineering support to ensure they are integrated correctly and perform to specification.",
                icon: "Wrench",
              },
            ],
          },
        },
      });
      // 3. SourcingAdvantage
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SourcingAdvantage",
          order: 2,
          content: {
            headingPart1: "More Than Just ",
            headingHighlight: "Procurement",
            description:
              'Procurement is transactional; strategic sourcing is a partnership. Because we operate plants ourselves, we understand the critical difference between a part that "fits" and a part that "performs".',
            paragraphs: [
              "Our engineering team vets every supplier and verifies every specification. We handle the complex logistics, customs clearance, and quality assurance, delivering peace of mind along with your critical spares.",
            ],
            cards: [
              { title: "Quality Assured", icon: "ShieldCheck" },
              { title: "Logistics Managed", icon: "Truck" },
              { title: "Vast network", icon: "Network" },
              { title: "Global OEMs", icon: "Globe" },
              { title: "Engineering Backed", icon: "Wrench" },
            ],
          },
        },
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Sourcing Critical Spares?",
            description:
              "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs.",
            ctaLabel: "Request a Quote",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Value-Added Services sections");
    }

    if (createdPage.slug === "leadership") {
      // 1. LeadershipHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "LeadershipHero",
          order: 0,
          content: {
            heroTitle: "LEADERSHIP & TEAM",
            heroSubtitle:
              "Meet the experienced leaders and engineers driving operational excellence and strategic growth across global energy markets.",
            badges: [
              "1,800+ Manpower",
              "300+ Engineers",
              "25+ Industry Experts",
              "12+ Years Average Experience",
              "5+ Countries",
            ],
            backgroundImage:
              "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2400",
          },
        },
      });

      // 2. LeadershipPhilosophy
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "LeadershipPhilosophy",
          order: 1,
          content: {
            philosophyTagline: "OUR PHILOSOPHY",
            philosophyHeading: "LEADING WITH AN OWNER'S MINDSET",
            philosophyPara1:
              "At Encotec, leadership is not just about managing teams; it's about taking full accountability for the outcomes we deliver. Our leadership team brings decades of hands-on experience from the world's most complex energy projects.",
            philosophyPara2:
              "We believe that true engineering excellence requires a culture where every team member is empowered to think critically, act decisively, and prioritize long-term asset performance over short-term gains.",
            philosophyQuote:
              "We don't just manage projects — we take ownership of outcomes, ensuring every asset is future-ready.",
            philosophyImage:
              "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200",
          },
        },
      });

      // 3. ExecutiveTeam
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ExecutiveTeam",
          order: 2,
          content: {
            tagline: "Executive Leadership",
            heading: "Visionaries Driving Our Mission",
            executives: [
              {
                name: "Arun Kumar Sarna",
                role: "Managing Director",
                bio: 'Arun Kumar Sarna is the Founder and CEO of Encotec Energy India, driving the company\'s vision to deliver comprehensive "shovel-to-socket" energy solutions globally. Under his leadership, Encotec has expanded across Thermal Power, Solar PV, and EHV Transmission & Distribution, embedding a signature "Owner’s Mindset" into the company\'s DNA.\n\nA pioneer in third-party O&M contracts in India, Mr. Sarna brings 40+ years of experience managing World Bank, KfW, and Japanese agency mega-projects. Globally, he has advised ESKOM (South Africa) and directed operations across Vietnam, Indonesia, and the Middle East.\n\nHe holds a Mechanical Engineering degree, a Master’s in Metallurgy from IIT Roorkee, and a PGDM from MDI Gurgaon, with executive certifications from Harvard Business School and IIT Mumbai.',
                tags: "Strategic Leadership, Business Development, Energy Infrastructure",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787296801/encotech/leadership/arun_kumar_sarna_white_bg.jpg",
              },
              {
                name: "Rajan Saxena",
                role: "Director ",
                bio: "Rajan Saxena is a senior energy-sector leader with 47 years of experience across thermal power, T&D, O&M services, plant overhauling, and Solar PV EPC. As Director at Encotec, he oversees operations, spare parts supply, modernization, and substation erection.\n\nPrior to Encotec, Mr. Saxena held senior leadership roles at global energy majors including GE T&D India, AREVA / Alstom, Skoda Power, DLF Power, and BHEL.\n\nHis expertise spans managing large service portfolios, full P&L accountability, EPC project execution, global procurement, logistics, and specialized repair facilities.",
                tags: "Operations Management, Plant Commissioning, Asset Optimization",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787296802/encotech/leadership/rajan_saxena_white_bg.jpg",
              },
              {
                name: "Rajeev Ahuja",
                role: "Director ",
                bio: "Rajeev Ahuja brings 38+ years of engineering and business management experience in the power and industrial sectors. As Director at Encotec, he leads corporate strategy, high-value contract bidding, proposals, commercial management, HR, Finance & Accounts, and P&L accountability.\n\nHe previously served in senior leadership roles at STEAG Energy Services India and Nicco Engineering, managing complete business cycles from opportunity identification to contract closeout.\n\nMr. Ahuja holds a Mechanical Engineering degree with international technical and business training in the UK and Thailand, having built and led BD teams of 25+ professionals.",
                tags: "Corporate Strategy, Business Development, Global Partnerships",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787114348/encotech/leadership/rajeev_ahuja_white_bg.jpg",
              },
            ],
          },
        },
      });

      // 4. SeniorLeadership
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SeniorLeadership",
          order: 3,
          content: {
            tagline: "Senior Leadership",
            heading: "Department Heads",
            heads: [
              {
                name: "Dr. Anita Desai",
                role: "VP Engineering",
                bio: "PhD in Thermal Engineering. 18+ years leading complex engineering design for power generation and transmission projects.",
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "Sanjay Mehta",
                role: "VP Business Development",
                bio: "15+ years driving strategic growth across India, Middle East, and Southeast Asia.",
                image:
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "Priya Krishnan",
                role: "Head of Renewable Energy",
                bio: "12+ years in solar and wind energy project development and execution.",
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "Arjun Reddy",
                role: "Head of Project Management",
                bio: "16+ years managing large-scale EPC projects across diverse geographies.",
                image:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "Dr. Klaus Werner",
                role: "Head of Quality & Safety",
                bio: "20+ years in quality management systems and international safety standards.",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
              },
              {
                name: "Meera Iyer",
                role: "Chief Financial Officer",
                bio: "14+ years in financial strategy and corporate governance for engineering firms.",
                image:
                  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800",
              },
            ],
          },
        },
      });

      // 5. TeamByNumbers
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "TeamByNumbers",
          order: 4,
          content: {
            stats: [
              { value: "1800+", label: "Total Professionals" },
              { value: "300+", label: "Senior Engineers" },
              { value: "25+", label: "Industry Experts" },
              { value: "5+", label: "Countries of Operation" },
              { value: "12+", label: "Years Avg Experience" },
            ],
          },
        },
      });

      // 6. CultureValues
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CultureValues",
          order: 5,
          content: {
            tagline: "OUR CULTURE",
            heading: "WHAT DEFINES US",
            value1Title: "Technical Mastery",
            value1Desc: "Deep domain expertise across every discipline.",
            value2Title: "Collaborative Spirit",
            value2Desc: "Cross-functional teamwork solving complex challenges.",
            value3Title: "Global Perspective",
            value3Desc: "Diverse experiences from 23+ countries.",
            value4Title: "Continuous Growth",
            value4Desc: "Investment in learning and professional development.",
          },
        },
      });

      // 7. JoinCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "JoinCTA",
          order: 6,
          content: {
            joinHeading: "Join Our Team of Experts",
            joinSubtitle:
              "We're always looking for talented engineers and energy professionals who share our passion for excellence.",
            ctaLabel1: "View Open Positions",
            ctaUrl1: "/careers",
            ctaLabel2: "Contact Us",
            ctaUrl2: "/contact",
          },
        },
      });
      console.log("Created Leadership sections");
    }

    if (createdPage.slug === "insights") {
      // 1. InsightsHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "InsightsHero",
          order: 0,
          content: {
            tagline: "Insights & Resources",
            heroTitle: "INSIGHTS, CASE STUDIES & INDUSTRY PERSPECTIVES",
            heroSubtitle:
              "Explore our thought leadership, project successes, and the latest updates from the forefront of global energy engineering.",
            backgroundImage:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
            tab1Label: "Case Studies",
            tab2Label: "News & Updates",
            tab3Label: "Blog & Articles",
          },
        },
      });

      // 2. FeaturedInsight
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "FeaturedInsight",
          order: 1,
          content: {
            badgeLabel: "Featured News",
            btnLabel: "Read Full Story",
            latestArticleTitle:
              "Record 14.3 GW Solar Capacity Added in First Four Months of FY27",
            latestArticleSummary:
              "India added 14.33 GW of solar capacity between April and July 2026 alone, accounting for 84% of all renewable additions in that period.",
            latestArticleDate: "August 17, 2026",
            latestArticleLocation: "India",
            latestArticleSlug:
              "record-14-3gw-solar-capacity-added-first-four-months-fy27",
            latestArticleImage:
              "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=2400",
          },
        },
      });

      // 3. InsightsStats
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "InsightsStats",
          order: 2,
          content: {
            stat1Value: "15",
            stat1Suffix: "+",
            stat1Label: "Case Studies Published",
            stat2Value: "50",
            stat2Suffix: "+",
            stat2Label: "Articles & Insights",
            stat3Value: "8",
            stat3Suffix: "",
            stat3Label: "Countries Covered",
            stat4Value: "10",
            stat4Suffix: "K+",
            stat4Label: "Monthly Readers",
          },
        },
      });

      // 4. InsightsCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "InsightsCTA",
          order: 3,
          content: {
            ctaHeading: "Have a Project in Mind?",
            ctaSubtitle:
              "Let's discuss how our engineering expertise can bring value to your next energy infrastructure project.",
            primaryBtnLabel: "Start Your Project",
            primaryBtnUrl: "/contact",
            secondaryBtnLabel: "View Our Services",
            secondaryBtnUrl: "/services",
          },
        },
      });

      // 5. RelatedInsights
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "RelatedInsights",
          order: 4,
          content: {
            heading: "Related Insights",
            viewAllLabel: "View All",
            readMoreLabel: "Read More",
          },
        },
      });

      // 6. ArticlesList
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ArticlesList",
          order: 5,
          content: {
            emptyMessage: "No insights found for this category.",
            articles: [
              // Case Studies
              {
                id: 1,
                slug: "obra-c-thermal-success",
                title: "The Obra 'C' Thermal Success",
                category: "Case Study",
                description:
                  "Executed complex IBR piping erection and commissioning for a massive 2x660 MW project in Uttar Pradesh.",
                date: "September 2023",
                location: "Uttar Pradesh, India",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The Obra 'C' Thermal Power Project represents a significant milestone in India's journey towards robust and reliable energy infrastructure. Encotec Energy India was entrusted with the critical task of IBR (Indian Boiler Regulations) piping erection, testing, and commissioning for this massive 2x660 MW supercritical thermal power plant.",
                  },
                  { type: "heading", text: "Project Scope and Complexity" },
                  {
                    type: "paragraph",
                    text: "The scope of work encompassed the complete erection of high-pressure piping systems, a task demanding unparalleled precision and adherence to stringent safety standards. The project involved handling thousands of tons of specialized alloy steel pipes, requiring advanced welding techniques and rigorous non-destructive testing (NDT).",
                  },
                  {
                    type: "quote",
                    text: "Our approach was rooted in meticulous planning and the deployment of highly skilled manpower. We understood that the integrity of the IBR piping is paramount to the plant's operational safety and efficiency.",
                  },
                  { type: "heading", text: "Overcoming Challenges" },
                  {
                    type: "paragraph",
                    text: "Executing a project of this magnitude in a challenging environment required innovative solutions. We implemented advanced project management tools to track progress in real-time, ensuring seamless coordination between engineering, procurement, and construction teams. Our proactive approach to risk management allowed us to anticipate potential bottlenecks and mitigate them effectively.",
                  },
                  {
                    type: "list",
                    items: [
                      "Zero lost-time incidents during the entire 18-month execution phase.",
                      "Achieved 100% first-time-right welding quality on critical high-pressure joints.",
                      "Completed the commissioning phase 2 weeks ahead of the baseline schedule.",
                    ],
                  },
                  { type: "heading", text: "Value Delivered" },
                  {
                    type: "paragraph",
                    text: "The successful completion of the Obra 'C' project not only reinforced Encotec's position as a leader in power plant engineering but also contributed significantly to the region's energy security. The plant now operates at peak efficiency, delivering reliable power to millions of homes and businesses.",
                  },
                ],
              },
              {
                id: 2,
                slug: "ensuring-reliability-rajpura",
                title: "Ensuring Reliability for Punjab's Power Heart",
                category: "Case Study",
                description:
                  " O&M for the 2x700 MW Rajpura Supercritical Power Plant, managing operations with an owner's mindset.",
                date: "February 2018",
                location: "Rajpura, Punjab",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "At Rajpura, we don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab. Since 2018, our team has been on the ground, treating this supercritical facility as if it were our own. Managing a plant of this scale requires more than just technical expertise - it requires continuous care and foresight.",
                  },
                  { type: "heading", text: "The Project & Partner" },
                  {
                    type: "paragraph",
                    text: "This comprehensive O&M engagement for the 2x700 MW Rajpura Supercritical Power Plant is executed in partnership with Nabha Power Limited (L&T Power Division).",
                  },
                  { type: "heading", text: "Our Hands-On Approach" },
                  {
                    type: "paragraph",
                    text: "Our 300+ engineers provide a full spectrum of services to keep the heart of this plant beating at peak efficiency. This includes:",
                  },
                  {
                    type: "list",
                    items: [
                      "Precision Maintenance: From the boilers and turbines to the critical balance of plant (BOP) equipment.",
                      "Smart Planning: We utilize condition monitoring and meticulous O&M planning to address potential issues before they cause downtime.",
                      "Expert Overhauling: We manage both annual and major capital overhauling, ensuring the plant's long-term health and performance.",
                    ],
                  },
                  { type: "heading", text: "The Human Impact" },
                  {
                    type: "paragraph",
                    text: "By maintaining a supercritical plant with such high standards, we are helping to provide more efficient, reliable, and cleaner power for the region, proving that large-scale engineering can have a local, human touch.",
                  },
                  {
                    type: "quote",
                    text: "We don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab.",
                  },
                ],
              },
              {
                id: 3,
                slug: "greener-future-gujarat-solar",
                title: "Engineering a Greener Future in the Sands of Gujarat",
                category: "Case Study",
                description:
                  "End-to-end installation and commissioning of a 10 MWp ground-mounted solar project, turning intense sun into sustainable power.",
                date: "March 2012",
                location: "Jainabad, Gujarat",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way. In 2013, we took on the challenge of bringing a 10 MWp ground-mounted solar project to life, turning the intense Gujarat sun into a sustainable power source.",
                  },
                  { type: "heading", text: "The Project & Partner" },
                  {
                    type: "paragraph",
                    text: "This 10 MWp Solar PV Installation and Commissioning project was successfully delivered in partnership with Moser Baer Engineering & Construction Ltd.",
                  },
                  { type: "heading", text: "Building with Precision" },
                  {
                    type: "paragraph",
                    text: "Our team managed the project from the ground up, focusing on every technical detail to ensure the best energy yield for our client:",
                  },
                  {
                    type: "list",
                    items: [
                      "Site-Specific Design: We started with a detailed design review tailored to the unique site conditions.",
                      "Full-Scale Erection: Our engineers handled the mounting of polycrystalline modules, complex cabling, and the installation of array junction boxes and inverters.",
                      "Grid Readiness: We concluded with rigorous testing and commissioning, ensuring the project was perfectly synchronized with the grid.",
                    ],
                  },
                  { type: "heading", text: "The Human Impact" },
                  {
                    type: "paragraph",
                    text: "This project wasn't just about installing panels; it was about Encotec's commitment to bridging the gap to a renewable future. By delivering a high-performing solar asset, we helped our partners take a significant step toward a cleaner tomorrow.",
                  },
                  {
                    type: "quote",
                    text: "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way.",
                  },
                ],
              },
              {
                id: 4,
                slug: "powering-gateway-india-airport",
                title: "Powering the Gateway to India",
                category: "Case Study",
                description:
                  "Specialized utility and electrical O&M for Indira Gandhi International Airport, ensuring the critical nervous system remains flawless.",
                date: "September 2023",
                location: "New Delhi, India",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: 'An international airport never sleeps, and neither does the infrastructure that supports it. At Indira Gandhi International Airport (IGI) in New Delhi, Encotec serves as a trusted auxiliary partner, ensuring that the critical electrical "nervous system" of one of the world\'s busiest hubs remains flawless.',
                  },
                  { type: "heading", text: "The Project & Partner" },
                  {
                    type: "paragraph",
                    text: "We provide Specialized Utility and Electrical O&M for Indira Gandhi International Airport (DIAL) in partnership with GMR Group / DIAL.",
                  },
                  { type: "heading", text: "Reliability Under Pressure" },
                  {
                    type: "paragraph",
                    text: "Managing airport utilities requires a specialized set of skills and a deep commitment to safety. Our team oversees:",
                  },
                  {
                    type: "list",
                    items: [
                      "High-Voltage Assets: Operation and maintenance of both Air Insulated (AIS) and Gas Insulated (GIS) substations.",
                      "Uninterrupted Support: Managing DG sets and critical terminal blocks to ensure power is always available, even in emergencies.",
                      "Safety First: Our work includes managing Fire Protection Systems (FPS) and Public Health Engineering (PHE) for both landside and airside facilities.",
                    ],
                  },
                  { type: "heading", text: "The Human Impact" },
                  {
                    type: "paragraph",
                    text: "Behind every seamless take-off and every bright terminal is a team of Encotec experts working quietly to ensure the safety and comfort of millions of travelers. We take pride in being the silent force that keeps India's gateway running.",
                  },
                  {
                    type: "quote",
                    text: "An international airport never sleeps, and neither does the infrastructure that supports it.",
                  },
                ],
              },
              // News
              {
                id: 5,
                slug: "record-14-3gw-solar-capacity-added-first-four-months-fy27",
                title:
                  "Record 14.3 GW Solar Capacity Added in First Four Months of FY27",
                category: "News",
                description:
                  "India added 14.33 GW of solar capacity between April and July 2026 alone, accounting for 84% of all renewable additions in that period.",
                date: "August 17, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "India added 14.33 GW of solar capacity between April and July 2026 alone, accounting for 84% of all renewable additions in that period. While the pace moderated slightly in July due to monsoon disruptions, the sector is still on track to potentially add over 50 GW in this fiscal year.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "This surge in new builds—particularly in ground-mounted and rooftop segments—directly increases the requirement for Encotec's construction and commissioning vertical to bring these complex assets online safely and efficiently.",
                  },
                ],
              },
              {
                id: 6,
                slug: "ai-data-centres-projected-add-26-3gw-national-grid",
                title:
                  "AI Data Centres Projected to Add 26.3 GW to the National Grid",
                category: "News",
                description:
                  "The Ministry of Power has informed Parliament that AI data centres are expected to add a concentrated load of 26.3 GW to the grid by 2031–32.",
                date: "August 17, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The Ministry of Power has informed Parliament that AI data centres are expected to add a concentrated load of 26.3 GW to the grid by 2031–32. Unlike traditional demand, these hyperscale facilities create massive, localized power needs that require advanced grid forecasting and integration with dedicated renewable energy sources.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "Encotec already manages critical infrastructure for global hubs like international airports. The specialized technical advisory needed to maintain zero-error electricity supply for data centres fits Encotec's focus on Expert Advisory and high-level problem solving.",
                  },
                ],
              },
              {
                id: 7,
                slug: "cabinet-stage-50000-crore-green-energy-corridor-phase-3",
                title:
                  "Cabinet Stage for Rs 50,000 Crore Green Energy Corridor (Phase III)",
                category: "News",
                description:
                  "The government has sent the third phase of the intra-state Green Energy Corridor (GEC) to the Union Cabinet for final approval carrying an outlay of over Rs 50,000 crore.",
                date: "August 11, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The government has sent the third phase of the intra-state Green Energy Corridor (GEC) to the Union Cabinet for final approval. This phase carries an outlay of over Rs 50,000 crore and targets the evacuation of approximately 135 GW of renewable energy by strengthening transmission lines in resource-rich states.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: 'Encotec’s expertise in Transmission & Distribution (up to 765 kV) and substation O&M is perfectly aligned with this infrastructure push. New corridors mean more critical high-voltage switchyards that require an "Owner’s Mindset" to ensure grid stability and reliability.',
                  },
                ],
              },
              {
                id: 8,
                slug: "national-green-hydrogen-mission-awards-production-major-refineries",
                title:
                  "National Green Hydrogen Mission Awards Production to Major Refineries",
                category: "News",
                description:
                  "Under the SIGHT scheme, the government has awarded 30 KTPA of Green Hydrogen production capacity to major refineries in Panipat, Bina, Vizag, and Numaligarh.",
                date: "August 11, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "Under the SIGHT scheme, the government has awarded 30 KTPA of Green Hydrogen production capacity to major refineries in Panipat, Bina, Vizag, and Numaligarh. These projects will be implemented via private developers using a Build Own Operate (BOO) model to enhance energy security.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "With Encotec’s focus on Project Conceptualisation and Development, these new hydrogen clusters represent a fresh frontier for technical due diligence and specialized mechanical engineering services, particularly in complex process piping.",
                  },
                ],
              },
              {
                id: 9,
                slug: "india-crosses-milestone-300gw-non-fossil-fuel-capacity",
                title:
                  "India Crosses Milestone of 300 GW Non-Fossil Fuel Capacity",
                category: "News",
                description:
                  "In a major leap for the nation’s clean energy transition, India has officially crossed 300 GW of non-fossil fuel-based installed capacity as of 31 July 2026.",
                date: "August 9, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "In a major leap for the nation’s clean energy transition, India has officially crossed 300 GW of non-fossil fuel-based installed capacity as of 31 July 2026. Solar power remains the primary driver at 164.59 GW, followed by wind at 58.14 GW. Non-fossil sources now account for over 54% of India’s total electricity generation capacity.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "As a global service provider bridging the gap between traditional power and renewables, this rapid expansion creates a massive demand for Encotec’s specialized commissioning and long-term stewardship (O&M) services for large-scale solar and wind assets.",
                  },
                ],
              },
              {
                id: 10,
                slug: "reliability-concerns-peak-after-68-major-renewable-grid-disturbances",
                title:
                  "Reliability Concerns Peak After 68 Major Renewable Grid Disturbances",
                category: "News",
                description:
                  "Data reveals India recorded 68 major grid disturbances in renewable complexes between 2022 and 2025, calling for stricter technical compliance and enhanced balancing.",
                date: "August 7, 2026",
                location: "",
                readTime: "",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1787744211/encotec-Assets/svypxqn8inxodhe9gpj1.jpg",
                content: [
                  {
                    type: "paragraph",
                    text: "Data reveals that India recorded 68 major grid disturbances in renewable complexes between 2022 and 2025, with some individual events causing generation losses of up to 7 GW. Regulators are now calling for stricter technical compliance, more flexible thermal plant operations, and enhanced balancing reserves.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: 'These challenges highlight the vital importance of "Asset Stewardship." Encotec’s ability to provide Performance Audits and Non-Destructive Testing (NDT) helps owners identify and solve hard engineering problems, ensuring their plants meet the high standards required to keep the national grid secure.',
                  },
                ],
              },
              {
                id: 11,
                slug: "ghaziabad-mandates-rooftop-solar",
                title: "Ghaziabad Mandates Rooftop Solar for New Buildings",
                category: "News",
                description:
                  "Ghaziabad makes rooftop solar installations mandatory for all building plan approvals, aligning with national solar adoption efforts.",
                date: "April 9, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "In a push for local energy independence, Ghaziabad has made rooftop solar installations mandatory for all building plan approvals. This aligns with national efforts like the PM Surya Ghar: Muft Bijli Yojana, which has already seen millions of households adopt solar power.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "This local mandate reflects the broader surge in the renewable energy sector, where Encotec provides full-lifecycle support from feasibility reports to testing and commissioning.",
                  },
                  {
                    type: "paragraph",
                    text: "Sources: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/ and https://jmkresearch.com/wp-content/uploads/2026/03/Q4-2025-RE-Report-Oct-Dec_JMK-Research.pdf",
                  },
                ],
              },
              {
                id: 12,
                slug: "insurance-surety-bonds-replace-bank-guarantees",
                title:
                  "Insurance Surety Bonds Replace Bank Guarantees in Power Sector",
                category: "News",
                description:
                  "Ministry of Power introduces Insurance Surety Bonds as an alternative to traditional Bank Guarantees across all power procurement frameworks.",
                date: "April 8, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: 'In a significant move to improve the "ease of doing business," the Ministry of Power has issued a directive allowing Insurance Surety Bonds (ISBs) as an alternative to traditional Bank Guarantees (BGs) across all power procurement frameworks. This reform is designed to reduce the liquidity burden on developers and utilities.',
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "This flexibility in financial instruments makes it easier for engineering and O&M partners to participate in large-scale infrastructure projects without tying up massive amounts of capital in banks. For Encotec, this opens up new opportunities to engage in larger projects with reduced financial barriers.",
                  },
                  {
                    type: "paragraph",
                    text: "Source: https://solarquarter.com/2026/04/08/ministry-of-power-introduces-insurance-surety-bonds-to-replace-bank-guarantees-in-the-power-sector/",
                  },
                ],
              },
              {
                id: 13,
                slug: "green-signal-3200mw-thermal-projects",
                title: "Green Signal for 3,200 MW of New Thermal Projects",
                category: "News",
                description:
                  "Expert Appraisal Committee recommends environmental clearance for two massive 1,600 MW ultra-supercritical coal-based projects.",
                date: "April 6, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The Expert Appraisal Committee has recommended environmental clearance for two massive 1,600 MW coal-based ultra-supercritical projects. One project by JSW Thermal Energy is slated for West Bengal, while Torrent Power will develop a project in Madhya Pradesh. Both will utilize ultra-supercritical technology and domestic coal.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "With Encotec's extensive experience in supercritical thermal O&M (like the Rajpura and Shree Singaji plants), these new high-tech units represent significant future opportunities for specialized engineering services.",
                  },
                  {
                    type: "paragraph",
                    text: "Source: https://powerpeakdigest.com/power-sector-news-roundup-for-april-6-2026/",
                  },
                ],
              },
              {
                id: 14,
                slug: "765kv-transmission-corridor-commissioned",
                title: "Massive 765 kV Transmission Corridor Commissioned",
                category: "News",
                description:
                  "A new 765 kV double-circuit transmission corridor spanning 700 km between Fatehgarh and Beawar has been commissioned for renewable energy evacuation.",
                date: "April 6, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "A new 765 kV double-circuit transmission corridor spanning 700 kilometres between Fatehgarh and Beawar has been commissioned. This project is essential for the high-capacity evacuation of renewable energy and includes the integration of advanced 765/400 kV substations.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "Encotec's specialized service line in Transmission & Distribution (up to 765 kV) and its expertise in substation O&M perfectly match the technical requirements of these new high-voltage corridors.",
                  },
                  {
                    type: "paragraph",
                    text: "Source: https://powerpeakdigest.com/power-peak-digest-for-april-6-2026/",
                  },
                ],
              },
              {
                id: 15,
                slug: "new-directions-imported-coal-power-plants",
                title: "New Directions for Imported Coal-Based Power Plants",
                category: "News",
                description:
                  "Ministry of Power issues fresh directions under Section 11 of the Electricity Act to ensure imported coal plants remain operational during high-demand months.",
                date: "March 27, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The Ministry of Power has issued fresh directions under Section 11 of the Electricity Act to generating companies using imported coal. These directions are aimed at ensuring that these plants remain operational and contribute to the national grid to prevent power shortages during the upcoming high-demand months.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "Maintaining imported coal-based units requires meticulous O&M planning and overhauling support, areas where Encotec provides essential back-office and on-site engineering expertise.",
                  },
                  {
                    type: "paragraph",
                    text: "Source: https://powermin.gov.in/en/announcements",
                  },
                ],
              },
              {
                id: 16,
                slug: "india-270gw-peak-power-demand",
                title: "India Braces for Record 270 GW Peak Power Demand",
                category: "News",
                description:
                  "India is fully prepared to handle a record 270 GW peak power demand this summer through strengthened generation capacity and grid management.",
                date: "March 20, 2026",
                location: "",
                readTime: "",
                image:
                  "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "Union Minister Manohar Lal Khattar announced that India is fully prepared to handle a record 270 GW peak power demand this summer. To meet this surge, the government has focused on strengthening generation capacity, ensuring coal availability for thermal plants, and enhancing grid management.",
                  },
                  { type: "heading", text: "Why It Matters to Encotec" },
                  {
                    type: "paragraph",
                    text: "As a specialist in thermal O&M and grid synchronization, Encotec's expertise in maintaining plant reliability is critical during these high-pressure peak periods. Our teams ensure that the plants we manage operate at maximum availability when the nation needs it most.",
                  },
                  {
                    type: "paragraph",
                    text: "Source: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/",
                  },
                ],
              },
              // Blogs
              {
                id: 17,
                slug: "owners-mindset-power-plant-care",
                title:
                  "Treating Your Power Plant Like Our Own: The Owner's Mindset",
                category: "Blog",
                description:
                  "What does having an Owner's Mindset mean for the people on the ground? It means our 250+ engineers see a vital asset that supports thousands of lives.",
                date: "April 2026",
                location: "",
                readTime: "6 min read",
                image:
                  "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "At Encotec, we often talk about having an \"Owner's mindset\". But what does that actually mean for the people on the ground? It means that when our 250+ engineers step onto a site, they aren't just looking at a contract; they are looking at a vital asset that supports thousands of lives.",
                  },
                  { type: "heading", text: "Continuous Care and Foresight" },
                  {
                    type: "paragraph",
                    text: "Whether we are managing a massive 2x700 MW supercritical plant in Rajpura or a captive unit in Goa, our approach is built on continuous care and foresight. We don't just wait for things to break; we use advanced condition monitoring and performance diagnostics to stay ahead of the curve.",
                  },
                  {
                    type: "quote",
                    text: "For us, energy isn't just about megawatts — it's about the 1,800+ dedicated staff members who show up every day to keep the world moving.",
                  },
                  { type: "heading", text: "Precision and Accountability" },
                  {
                    type: "paragraph",
                    text: "By treating every boiler, turbine, and auxiliary system with the same precision and accountability an owner would, we've been able to help our partners achieve peak efficiency and long-term reliability. This philosophy is what sets Encotec apart in the energy services landscape.",
                  },
                ],
              },
              {
                id: 18,
                slug: "sunbeams-to-megawatts-renewable-future",
                title:
                  "From Sunbeams to Megawatts: Engineering the Journey to a Renewable Future",
                category: "Blog",
                description:
                  "Our journey into renewables is a commitment to sustainable development — bridging the gap between traditional power and a solar future.",
                date: "March 2026",
                location: "",
                readTime: "7 min read",
                image:
                  "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "The transition to green energy is one of the greatest challenges of our time, and at Encotec, we believe in \"finding new ways to energy solutions\". Our journey into renewables isn't just a business line; it's a commitment to sustainable development and leaving the world better than we found it.",
                  },
                  { type: "heading", text: "Technical Mastery at Every Stage" },
                  {
                    type: "paragraph",
                    text: "Bridging the gap between traditional power and a solar future requires technical mastery at every stage. We support our partners through the entire lifecycle — starting from pre-feasibility reports and site assessments to the precision erection of polycrystalline modules.",
                  },
                  {
                    type: "quote",
                    text: "By combining our deep engineering roots with innovative solar technology, we are helping to ensure that the clean energy of tomorrow is as reliable as the power of today.",
                  },
                  { type: "heading", text: "Impactful Projects" },
                  {
                    type: "paragraph",
                    text: "Our experience spans impactful projects like the 10 MWp Solar PV project in Gujarat and the 125 MW Solar Thermal project in Pokharan. Each project reinforces our commitment to bridging the gap to a renewable future.",
                  },
                ],
              },
              {
                id: 19,
                slug: "silent-force-behind-your-flight",
                title:
                  "Powering the Gateway: The Specialized World of Airport Utility Management",
                category: "Blog",
                description:
                  "What keeps an international airport running flawlessly 24/7? Behind the scenes at DIAL and Noida International Airport, Encotec is at work.",
                date: "February 2026",
                location: "",
                readTime: "5 min read",
                image:
                  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2400",
                content: [
                  {
                    type: "paragraph",
                    text: "Have you ever wondered what keeps an international airport running flawlessly 24/7? Behind the scenes of the bustling terminals at Indira Gandhi International Airport (DIAL) and the upcoming Noida International Airport (YIAPL), Encotec is at work.",
                  },
                  { type: "heading", text: "A Unique Blend of Expertise" },
                  {
                    type: "paragraph",
                    text: "Managing critical infrastructure for global hubs requires a unique blend of high-voltage expertise and a safety-first culture. Our teams oversee everything from AIS and GIS substations to the Fire Protection Systems (FPS) and Public Health Engineering (PHE) that ensure traveler comfort and safety.",
                  },
                  {
                    type: "quote",
                    text: "It's a high-pressure job, but with our triple ISO certifications in Quality, Environment, and Safety, we take pride in being the silent force that ensures your journey begins and ends with a smile.",
                  },
                  { type: "heading", text: "Trusted Security Partner" },
                  {
                    type: "paragraph",
                    text: "We hold specific security clearances from the Bureau of Civil Aviation Security (BCAS), allowing us to act as a trusted auxiliary partner in these high-security environments. This level of trust is earned through consistent performance and unwavering commitment to safety standards.",
                  },
                ],
              },
            ],
          },
        },
      });

      // 7. NewsletterSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "NewsletterSection",
          order: 6,
          content: {
            tagline: "Inside Encotec",
            heading: "Stay Ahead in Energy Engineering",
            description:
              "Subscribe to our newsletter to receive the latest case studies, industry insights, and technical articles directly in your inbox.",
            privacyNote: "We respect your privacy. Unsubscribe at any time.",
          },
        },
      });

      // 8. InsightDetail
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "InsightDetail",
          order: 7,
          content: {
            backLabel: "Back to Insights",
            loadingText: "Loading insight details...",
            notFoundTitle: "Article Not Found",
            notFoundText:
              "The insight you are looking for doesn't exist or has been moved.",
            notFoundBtnLabel: "Back to Insights",
            shareLabel: "Share this article",
          },
        },
      });
      console.log("Created Insights sections");
    }

    if (createdPage.slug === "careers") {
      // 1. CareersHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersHero",
          order: 0,
          content: {
            heroTagline: "CAREERS AT ENCOTEC",
            heroTitle: "SHAPE THE FUTURE OF GLOBAL ENERGY",
            heroSubtitle:
              "Join a team of world-class engineers and energy professionals delivering critical infrastructure across 23+ countries.",
            backgroundImage:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2400",
            badge1Text: "200+ Team Members",
            badge2Text: "Offices in 8 Countries",
          },
        },
      });

      // 2. CareersCulture
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersCulture",
          order: 1,
          content: {
            cultureTagline: "WHY JOIN US",
            cultureHeading: "Engineering Careers That Matter",
            culturePara1:
              "At Encotec, we don't just build power plants; we engineer the foundation of modern society. Our team works on some of the most complex and critical energy infrastructure projects globally, from massive supercritical thermal plants to utility-scale renewable energy parks.",
            culturePara2:
              "We foster a culture of technical excellence, continuous learning, and collaborative problem-solving. When you join Encotec, you gain global exposure, working alongside industry veterans who are passionate about mentoring the next generation of engineering leaders.",
            cultureQuote:
              "We empower our engineers to take ownership, innovate, and deliver solutions that have a tangible impact on global energy security.",
            cultureImage:
              "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
          },
        },
      });

      // 3. CareersBenefits
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersBenefits",
          order: 2,
          content: {
            tagline: "WHAT WE OFFER",
            heading: "Benefits & Perks",
            benefitsList: [
              {
                title: "Global Exposure",
                description:
                  "Work on critical energy infrastructure projects across 23+ countries with diverse international teams.",
              },
              {
                title: "Technical Growth",
                description:
                  "Access to cutting-edge technologies, specialized training, and continuous learning programs.",
              },
              {
                title: "Competitive Compensation",
                description:
                  "Industry-leading salary packages with performance-based bonuses and comprehensive benefits.",
              },
              {
                title: "Health & Wellness",
                description:
                  "Comprehensive medical insurance, wellness programs, and support for physical and mental health.",
              },
              {
                title: "Work-Life Balance",
                description:
                  "Flexible working arrangements, generous leave policies, and a supportive team environment.",
              },
              {
                title: "Career Progression",
                description:
                  "Clear growth paths, leadership development, and mentorship from seasoned industry veterans.",
              },
            ],
          },
        },
      });

      // 4. CareersOpenPositions
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersOpenPositions",
          order: 3,
          content: {
            heading: "Current Openings",
            jobsList: [
              {
                title: "Sr. HR Executive / HR Executive – Corporate Office",
                dept: "HR",
                location: "Corporate Office, Noida",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on supporting day-to-day corporate HR operations, driving candidate sourcing pipelines, managing employee onboarding workflows, and maintaining accurate centralized HR data ecosystems.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "End-to-End Recruitment Support: Source active resumes from job portals, perform preliminary HR screening, coordinate interview schedules with technical line managers, and manage logistics for corporate selection drives.",
                      "Onboarding & Offboarding: Manage the corporate joining documentation process, execute structural employee orientation, create master employee profiles, and process employee exit/full-and-final settlement formalities.",
                      "HRIS & Data Management: Update and maintain the organization-wide Human Resources Information System (HRIS) with high accuracy regarding employee master records, leaves, attendance, and confirmation dates.",
                      "Employee Engagement Logistics: Assist in organizing corporate town halls, training deployment schedules, employee wellness activities, and company-wide festive celebrations.",
                      "Vendor & Billing Coordination: Track and process invoices from recruitment consultants, background verification agencies, training partners, and corporate insurance vendors for timely approval.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: MBA / PGDM in Human Resources / Industrial Relations from a recognized institute or university.",
                      "Experience: 2 to 5 years of corporate HR operations experience, preferably in infrastructure, energy, or engineering companies.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "High proficiency in Microsoft Excel and HRIS software, good verbal and written communication, active multitasking capabilities, and meticulous attention to detail.",
                    ],
                  },
                ],
              },

              {
                title:
                  "Sr. HR Executive / HR Executive – Site HR & Administration",
                dept: "HR",
                location: "Thermal Power Plant Sites PAN India",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on daily time-office operations, assisting with contractor labor tracking, processing local compliance documentation registers, and managing site administrative facilities.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "Time-Office & Attendance Management: Monitor daily biometric access logs, track plant shift rosters, maintain manual attendance registers for audit verification, and report daily manpower availability summaries to the Site HR Manager.",
                      "Contract Labor Verification: Assist in verifying contractor gate passes, checking physical worker counts against deployed rosters, and ensuring contractor statutory compliance documents (PF/ESIC chalans, insurance copies) are in order before processing invoices.",
                      "Statutory Documentation: Maintain all structural statutory registers, files, and cards mandatory under the Factories Act and Contract Labor (Regulation & Abolition) Act to ensure 100% readiness for surprise government inspections.",
                      "Site Welfare Coordination: Conduct daily inspections of site facility centers including checking canteen hygiene/food quality, workplace drinking water availability, and general first-aid/medical room inventories.",
                      "Local Administration Support: Coordinate site vehicle logistics, organize personal protective equipment (PPE) distribution camps, manage office stationary inventories, and issue basic site communication circulars under management guidance.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: Graduate with a Post Graduate Diploma in HR / IR, or a Bachelor of Business Administration (BBA) in HR.",
                      "Experience: 2 to 4 years of plant-level or industrial project site experience, ideally in thermal power plants, construction projects, or manufacturing heavy industries.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "Knowledge of the local language (highly essential for worker communication), familiarity with basic factory labor rules, resilience to working in heavy plant environments, and basic computer proficiency.",
                    ],
                  },
                ],
              },

              {
                title: "Assistant Manager / Manager – Finance & Accounts",
                dept: "Finance & Accounts",
                location: "Corporate Office, Noida",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on corporate financial management, statutory compliance, and contractual financial governance. This role acts as a bridge between the corporate office and multiple thermal power plant O&M sites, ensuring financial discipline, optimizing cash flows for plant shutdowns, and driving profitability tracking against site-specific SLAs.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "SLA Monitoring: Interpret O&M Service Level Agreements (SLAs) to track escalation clauses, bonus incentives, and penalty provisions.",
                      "Billing & Realization: Oversee the end-to-end commercial billing cycle for multiple power utility clients; ensure timely payment realization and manage outstanding ageings.",
                      "Site Financial Control: Supervise site-level accountants to ensure inventory tracking (spares/consumables) and mobilization expenses match corporate policies.",
                      "O&M Budgeting: Drive the formulation of annual corporate and individual plant O&M operating budgets.",
                      "Variance Analysis: Provide monthly variance analysis detailing plant overhauling costs, variable maintenance costs, and employee overheads.",
                      "Profitability Reviews: Present site-wise gross margin and EBITDA analysis to the executive leadership team.",
                      "Tax Governance: Manage direct and indirect tax compliances, with specific focus on GST for long-term service contracts, TDS, and corporate tax provisions.",
                      "Audit Leadership: Lead statutory, internal, and cost audit processes; resolve complex accounting issues under applicable frameworks (Ind AS / IFRS).",
                      "Working Capital: Optimize corporate cash flow cycles, keeping a buffer for emergency plant maintenance or forced shutdowns.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: CA, ICWA, MBA in Finance.",
                      "Experience Range: 5 to 10 years of robust post-qualification experience.",
                      "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "System Expertise: Advanced hands-on experience in SAP (FICO module) or Oracle ERP.",
                      "Leadership: Demonstrated ability to manage, mentor, and review the work of a team of junior accountants and site finance teams.",
                      "Analytical Polish: Expert level proficiency in financial reporting frameworks and advanced Excel modeling.",
                    ],
                  },
                ],
              },

              {
                title: "Head – Corporate Safety (EHS)",
                dept: "EHS",
                location: "Corporate Office, Noida",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on directing, designing, and governing the Environment, Health, and Safety (EHS) strategy across all operational thermal power plant O&M sites. Operating from the Corporate Office, this senior leadership role is responsible for establishing a zero-harm safety culture, standardizing high-risk safety protocols (e.g., confined spaces, hazardous energy control/LOTO, heavy lifting), ensuring stringent statutory compliance, and leading corporate EHS audits to protect workforce integrity and mitigate operational risk.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "Strategic EHS Governance & Leadership: Formulate, execute, and monitor the corporate Environment, Health, and Safety (EHS) vision, policy, and long-term roadmap across multiple thermal power plant O&M asset locations.",
                      "Establish standardized corporate safety management systems (SMS) aligned with global frameworks such as ISO 45001 (Occupational Health & Safety) and ISO 14001 (Environmental Management).",
                      "Advise executive management and site leaders on emerging EHS trends, regulatory exposures, and critical risk mitigation strategies.",
                      "High-Risk Operational Safety Management: Standardize strict safety protocols tailored to high-risk thermal plant operations, including Lockout/Tagout (LOTO), Confined Space Entry, Working at Heights, High-Voltage Electrical Isolation, and Turbine/Boiler maintenance overhauling.",
                      "Govern Job Safety Analyses (JSA) and Hazard Identification & Risk Assessment (HIRA) standards for routine, non-routine, and major shutdown maintenance activities.",
                      "Oversee the verification and structural integrity monitoring of heavy material handling systems, EOT cranes, and rigging infrastructure across operating sites.",
                      "Regulatory Compliance & Environmental Stewardship: Ensure organizational compliance with central and state environmental regulations, factory acts, labor codes, and pollution control board frameworks specific to thermal power facilities.",
                      "Oversee environmental compliance frameworks concerning ash management, industrial effluent discharges, and stack emissions tracking systems.",
                      "Serve as the lead organizational liaison with state factory inspectorates, pollution control agencies, and statutory bodies during serious events or regular regulatory audits.",
                      "Incident Investigation, Analytics & Root Cause Analysis (RCA): Direct the formal investigation process for corporate/site-level near-misses, dangerous occurrences, and lost-time injuries.",
                      "Deploy advanced Root Cause Analysis techniques such as TapRooT, 5-Why, and Fishbone to isolate systemic failures and mandate corrective and preventive actions (CAPA).",
                      "Manage corporate safety dashboards, analyzing lagging indicators (LTIFR, TRIR) and leading metrics to deliver performance updates to the Board.",
                      "Capability Building & Cultural Transformation: Incentivize a corporate-wide Zero-Harm safety culture through behavioral safety programs (BBS) and visible felt leadership initiatives.",
                      "Standardize safety training modules for corporate onboarding, technical plant maintenance competencies, specialized shutdown contractors, and emergency response teams.",
                      "Oversee contractor safety management programs, ensuring third-party workforce compliance matches internal company benchmarks.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: Bachelor’s degree in engineering (Mechanical or Electrical), Post Graduate Diploma or Degree in Industrial Safety from a government-recognized institute, or globally recognized safety qualifications such as NEBOSH International Diploma, CSP, or certified ISO 45001 / 14001 Lead Auditor status.",
                      "Experience Range: 15 to 18 years of robust post-qualification experience.",
                      "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "Demonstrated mastery over high-risk engineering controls, thermal plant process hazards, and contractor safety governance systems.",
                      "Outstanding leadership, executive presence, and persuasive capability to enforce uncompromising safety compliance at all tiers of organization.",
                      "Strong digital competency in managing integrated EHS software platforms and modern field inspection applications.",
                    ],
                  },
                ],
              },

              {
                title:
                  "Assistant Manager / Manager – Contracts & Materials Management",
                dept: "Contracts & Materials",
                location: "Corporate Office, Noida",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on corporate end-to-end supply chain architecture, strategic sourcing, and contract governance lifecycle for multiple thermal power plant O&M sites. This corporate role ensures optimal materials availability (critical spares, boiler/turbine consumables, chemical reagents) while strictly controlling lifecycle costs, optimizing inventory parameters, and drafting ironclad service level contracts to eliminate plant down-time risks.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "Corporate Category Management: Lead procurement strategy for specialized thermal power plant components, including Boiler Pressure Parts, Turbine auxiliaries, Coal Handling Plant (CHP) spares, and Ash Handling System components.",
                      "Vendor Lifecycle Ecosystem: Establish, evaluate, and scale an elite panel of approved vendors to optimize procurement lead times and lower TCO.",
                      "High-Value Technical Commercial Floating: Draft complex Request for Proposals (RFPs) and Tenders; organize comprehensive techno-commercial bid evaluations to finalize annual rate contracts.",
                      "O&M Sub-contracting Lifecycle: Formulate, negotiate, and execute specialized back-to-back sub-contracts for annual plant overhauling, major shutdowns, structural fabrications, non-destructive testing (NDT), and annual maintenance contracts (AMCs).",
                      "Risk & Indemnity Administration: Structurally build crucial risk mitigation clauses into contracts, including Liquidation Damages (LD), force majeure parameters, safety penalization matrices, and strict defect liability periods.",
                      "Claim Management & Resolution: Act as the corporate focal point to evaluate and process change order variants, contract amendments, contractual escalations, and commercial dispute reviews.",
                      "Corporate Materials Control: Implement corporate standardization matrices (Min-Max parameters, Reorder Points, and Safety Stock levels) across all operating sites to maximize material availability while preventing capital deadlocks.",
                      "Scrap & CAPEX Logistics: Formulate corporate directives for T&Ps retirement and inventory write-offs.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: Bachelor’s degree in engineering (Mechanical or Electrical or Instrumentation), Post Graduate Diploma or Degree in Supply Chain Management, Materials Management or equivalent MBA.",
                      "Experience Range: 5 to 10 years of robust post-qualification experience.",
                      "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "ERP Expertise: Advanced, fluent transactional mastery within the SAP MM/Ariba or Oracle SCM or equivalent enterprise systems.",
                      "Legal Exposure: Comprehensive grip over Indian Contract Act provisions, commercial taxation codes (GST structures for goods vs composite services), and international incoterms.",
                      "Negotiation Savvy: Refined executive presence, cross-functional collaboration capabilities, and sharp, data-driven cost-benefit analysis skills.",
                    ],
                  },
                ],
              },

              {
                title: "Project Manager",
                dept: "Project Management",
                location: "Corporate Office, Noida",
                type: "Full-time",
                desc: [
                  {
                    type: "paragraph",
                    text: "Focuses on managing operational readiness, resource scheduling, contractual health, and governance for a portfolio of operating thermal power plants. This role coordinates closely with site O&M heads, technical service teams, and client representatives to ensure high plant availability, strict SLA compliance, and smooth site mobilization.",
                  },
                  {
                    type: "paragraph",
                    text: "Key Responsibilities",
                  },
                  {
                    type: "list",
                    items: [
                      "Operational Readiness: Design and execute standard corporate frameworks for mobilizing new O&M site contracts.",
                      "Resource Deployment: Coordinate with HR, Procurement, and technical wings to ensure deployment of tools, plants, consumables and qualified manpower during the transition phase.",
                      "SOP Implementation: Deploy corporate operational guidelines, safety protocols, and maintenance management workflows at new sites.",
                      "Performance Tracking: Monitor site-level Key Performance Indicators (KPIs) including Plant Availability Factor (PAF), Heat Rate, Auxiliary Power Consumption (APC), and specific oil/coal consumption.",
                      "Commercial Interface: Identify variations in contract scopes, prepare claims for extra works, and manage mitigation pathways for Liquidated Damages (LD) risks.",
                      "Client Relationship: Conduct monthly and quarterly project review meetings with clients.",
                      "Turnaround Scheduling: Lead the corporate planning team to review and optimize master schedules using Primavera P6 or MS Project for major boiler and turbine overhauls.",
                      "Cross-Site Allocation: Orchestrate the movement of critical specialized tooling, testing equipment, and expert task forces across different operating sites to minimize shutdown days.",
                      "Risk Management: Maintain a corporate risk register for all running projects, identifying bottlenecks in spares availability or technical challenges ahead of time.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Qualifications & Requirements",
                  },
                  {
                    type: "list",
                    items: [
                      "Education: Bachelor’s degree in engineering (Mechanical or Electrical or Instrumentation), PMP (Project Management Professional) certification shall be an added advantage.",
                      "Experience Range: 8 to 15 years of robust post-qualification experience.",
                      "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies.",
                    ],
                  },
                  {
                    type: "paragraph",
                    text: "Core Competencies",
                  },
                  {
                    type: "list",
                    items: [
                      "Software Tools: High proficiency in Primavera P6, MS Project, and enterprise resource platforms like SAP (Project System - PS / Plant Maintenance - PM modules).",
                      "Analytical Skills: Strong capability in reviewing commercial contracts, evaluating techno-commercial variations, and reading engineering layouts.",
                      "Leadership & Mobility: Exceptional cross-functional leadership skills; ability to influence site teams and willingness to travel frequently to power plant locations for operational reviews.",
                    ],
                  },
                ],
              },
            ],
          },
        },
      });

      // 5. CareersGallery
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersGallery",
          order: 4,
          content: {
            tagline: "INSIDE ENCOTEC",
            heading: "Life at Encotec",
            galleryList: [
              {
                image:
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
                caption: "Team Collaboration",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
                caption: "On-Site Engineering",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
                caption: "Strategic Planning",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
                caption: "Field Operations",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800",
                caption: "Team Celebrations",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
                caption: "Project Reviews",
              },
            ],
          },
        },
      });

      // 6. CareersProcess
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersProcess",
          order: 5,
          content: {
            heading: "How to Join Us",
            processSteps: [
              {
                title: "Apply Online",
                description:
                  "Submit your resume and cover letter through our portal.",
              },
              {
                title: "Initial Screening",
                description:
                  "Our HR team reviews your application within 5 business days.",
              },
              {
                title: "Technical Interview",
                description:
                  "Meet with our engineering leads for a technical discussion.",
              },
              {
                title: "Final Offer",
                description:
                  "Receive your offer and begin your journey with Encotec.",
              },
            ],
          },
        },
      });

      // 7. CareersCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersCTA",
          order: 6,
          content: {
            ctaHeading: "Don't See the Right Role?",
            ctaSubtitle:
              "We're always looking for talented engineers and energy professionals. Send us your resume and we'll keep you in mind for future opportunities.",
            hrEmail: "hr@encotecenergy.com",
          },
        },
      });
      console.log("Created Careers sections");
    }

    if (createdPage.slug === "certifications") {
      // 1. CertificationsHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CertificationsHero",
          order: 0,
          content: {
            heroTitle: "CERTIFICATIONS & PARTNERS",
            heroSubtitle:
              "Our commitment to global standards of quality, safety, and environmental management, backed by strategic alliances with industry leaders.",
            tagline: "Trust & Excellence",
            backgroundImage:
              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2400",
            badge1Text: "ISO Certified",
            badge2Text: "Boiler & Electrical Licenses, BCAS",
            badge3Text: "15+ Years Excellence",
          },
        },
      });

      // 2. TrustStats
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "TrustStats",
          order: 1,
          content: {
            stats1Value: "15+",
            stats1Label: "Years of Excellence",
            stats2Value: "100%",
            stats2Label: "Compliance Rate",
            stats3Value: "",
            stats3Label: "",
            stats4Value: "",
            stats4Label: "",
          },
        },
      });

      // 3. CertificationsGrid
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CertificationsGrid",
          order: 2,
          content: {
            tagline: "QUALITY POLICY & ACCREDITATION",
            heading: "Triple ISO Integrated Management System",
            description:
              "Certified by Universal Certification Services (UCSPL) and internationally accredited under IAF & KAB standards for encotec Energy (India) Private Limited.",
            certificationsList: [
              {
                id: "iso-9001",
                title: "ISO 9001:2015",
                subtitle: "Quality Management System",
                category: "Quality Assurance",
                certNumber: "UCSPL09802500815",
                issueDate: "28/03/2025",
                expiryDate: "27/03/2028",
                issuer:
                  "Universal Certification Services Private Limited (UCSPL)",
                accreditation: "IAF & KAB (KAB-QC-80)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784530188/encotech/certificates/iso-9001-certificate.jpg",
                scope:
                  "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
              },
              {
                id: "iso-14001",
                title: "ISO 14001:2015",
                subtitle: "Environmental Management System",
                category: "Environmental Protection",
                certNumber: "UCSPL14612500168",
                issueDate: "28/03/2025",
                expiryDate: "27/03/2028",
                issuer:
                  "Universal Certification Services Private Limited (UCSPL)",
                accreditation: "IAF & KAB (KAB-EC-61)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784530189/encotech/certificates/iso-14001-certificate.jpg",
                scope:
                  "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
              },
              {
                id: "iso-45001",
                title: "ISO 45001:2018",
                subtitle: "Occupational Health & Safety Management System",
                category: "Workplace Health & Safety",
                certNumber: "UCSPL45612500154",
                issueDate: "28/03/2025",
                expiryDate: "27/03/2028",
                issuer:
                  "Universal Certification Services Private Limited (UCSPL)",
                accreditation: "IAF & KAB (KAB-OC-61)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784530191/encotech/certificates/iso-45001-certificate.jpg",
                scope:
                  "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
              },
              {
                id: "ibr-boiler-erector",
                title: "IBR Special Class Boiler Erector & Repairer",
                subtitle: "Regulation 392 - Indian Boiler Regulations 1950",
                category: "Boiler & Pressure Vessel",
                certNumber: "30/DOB/BE/SC/Boil./2025",
                issueDate: "21/05/2025",
                expiryDate: "20/05/2027",
                issuer:
                  "Boiler Directorate, Government of Uttar Pradesh, Kanpur",
                accreditation: "Indian Boiler Regulations (IBR 1950)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784529235/encotech/certificates/ibr-boiler-approval-certificate.jpg",
                scope:
                  "Certificate of approval as Category 'Special Class (WP > 125 Kg/cm²)' Boiler Erector/Repairer and Steam/Feed Pipe Line Fabricator.",
              },
              {
                id: "maharashtra-electrical",
                title: "Maharashtra Electrical Contractor License",
                subtitle: "Govt. of Maharashtra Energy & Labour Dept.",
                category: "Electrical Licensing",
                certNumber: "109320520004032024",
                issueDate: "04/03/2024",
                expiryDate: "03/03/2027",
                issuer:
                  "Licensing Board, Industry, Energy & Labour Dept., Govt. of Maharashtra",
                accreditation: "Govt. of Maharashtra Energy Dept.",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784529236/encotech/certificates/maharashtra-electrical-license.jpg",
                scope:
                  "Official License for execution of electrical contractor works and high-voltage power installations in Maharashtra.",
              },
              {
                id: "delhi-electrical",
                title: "Delhi Electrical Contractor Licence (Form B)",
                subtitle: "Labour Dept., Govt. of NCT of Delhi",
                category: "Electrical Licensing",
                certNumber: "50590000003551",
                issueDate: "09/08/2021",
                expiryDate: "08/08/2046",
                issuer: "Labour Department, Govt. of NCT of Delhi",
                accreditation: "Govt. of NCT of Delhi",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784529237/encotech/certificates/delhi-electrical-license.jpg",
                scope:
                  "Class-I Electrical Contractor Licence for electrical installation works across National Capital Territory of Delhi.",
              },
              {
                id: "avsec-induction",
                title: "AVSEC Induction Course Certificate",
                subtitle: "Aviation Security Training Institute (ASTI)",
                category: "Airport Aviation Security",
                certNumber: "GMRAA-ASTI/AVSEC-2024/44/07",
                issueDate: "20/05/2024",
                expiryDate: "24/05/2024",
                issuer: "ASTI - DIAL (GMRAA), New Delhi",
                accreditation: "BCAS Accredited ASTI",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784529238/encotech/certificates/avsec-induction-certificate.jpg",
                scope:
                  "Certification of AVSEC Induction Course completion for Aviation Security Compliance Officer at international airports.",
              },
              {
                id: "bcas-airport-clearance",
                title: "BCAS Airport Auxiliary Service Clearance",
                subtitle:
                  "Bureau of Civil Aviation Security, Ministry of Civil Aviation",
                category: "Airport Aviation Security",
                certNumber: "E20220286415",
                issueDate: "31/03/2023",
                expiryDate: "30/03/2028",
                issuer:
                  "Bureau of Civil Aviation Security (BCAS), Govt. of India",
                accreditation: "Ministry of Civil Aviation (MoCA)",
                image:
                  "https://res.cloudinary.com/dpa93copz/image/upload/v1784529239/encotech/certificates/bcas-airport-security-clearance.jpg",
                scope:
                  "Official Security Clearance for Encotec Energy India Pvt. Ltd. and its Directors as Auxiliary Service Provider at Airports.",
              },
            ],
          },
        },
      });

      // 4. StrategicPartners
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StrategicPartners",
          order: 3,
          content: {
            tagline: "Strategic Alliances",
            heading: "Trusted by Industry Leaders",
            description:
              "We collaborate with the world's leading technology providers and energy conglomerates to deliver state-of-the-art solutions.",
            partnersList: [
              {
                name: "Siemens Energy",
                monogram: "SE",
                role: "Gas Turbine Technology",
              },
              {
                name: "GE Vernova",
                monogram: "GE",
                role: "Power Generation Systems",
              },
              {
                name: "BHEL",
                monogram: "BH",
                role: "Heavy Electrical Equipment",
              },
              {
                name: "NTPC",
                monogram: "NT",
                role: "Thermal Power Operations",
              },
              {
                name: "L&T Energy",
                monogram: "LT",
                role: "EPC & Construction",
              },
              {
                name: "Tata Power",
                monogram: "TP",
                role: "Integrated Power Solutions",
              },
              {
                name: "Adani Power",
                monogram: "AP",
                role: "Private Sector Energy",
              },
              {
                name: "JSW Energy",
                monogram: "JW",
                role: "Diversified Energy Portfolio",
              },
            ],
          },
        },
      });

      // 5. IndustryMemberships
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "IndustryMemberships",
          order: 4,
          content: {
            heading: "INDUSTRY MEMBERSHIPS",
            description:
              "Active participation in shaping the future of India's energy sector through key industry bodies and associations.",
            membershipsList: [
              { name: "Confederation of Indian Industry (CII)", year: "2010" },
              {
                name: "Federation of Indian Chambers of Commerce (FICCI)",
                year: "2012",
              },
              {
                name: "Indian Electrical & Electronics Mfrs. Assoc. (IEEMA)",
                year: "2014",
              },
              {
                name: "Central Board of Irrigation and Power (CBIP)",
                year: "2015",
              },
              {
                name: "Independent Power Producers Assoc. (IPPAI)",
                year: "2016",
              },
              {
                name: "Associated Chambers of Commerce (ASSOCHAM)",
                year: "2018",
              },
            ],
          },
        },
      });

      // 6. CertificationsCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CertificationsCTA",
          order: 5,
          content: {
            ctaHeading: "Partner With Excellence",
            ctaSubtitle:
              "Experience engineering services backed by global certifications and a commitment to uncompromising quality.",
            ctaLabel: "Discuss Your Project",
            ctaUrl: "/contact",
          },
        },
      });
      console.log("Created Certifications sections");
    }

    if (createdPage.slug === "contact") {
      // 1. ContactHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ContactHero",
          order: 0,
          content: {
            tagline: "Get in Touch",
            headingPart1: "Let's Build the Future of",
            headingItalicHighlight: "Energy Together",
            heroSubtitle:
              "Reach out to our team of experts for project inquiries, strategic partnerships, or to learn more about our engineering capabilities.",
            backgroundImage:
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
          },
        },
      });

      // 2. ContactInfo
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ContactInfo",
          order: 1,
          content: {
            infoHeading: "Get in",
            infoHeadingItalic: "Touch",
            infoDesc:
              "Reach out to our team of experts for project inquiries, strategic partnerships, or to learn more about our engineering capabilities.",
            locationTitle: "Corporate Headquarters",
            addressLine1: "Noida, Uttar Pradesh",
            addressLine2: "India",
            phoneNumber: "+91 120 4155612",
            emailAddress: "sales@encotecenergy.com",
            businessHoursTitle: "Business Hours",
            quickContactTitle: "Quick Contact",
            generalInquiriesLabel: "General Inquiries",
            careersLabel: "Careers",
            careersEmailAddress: "hr@encotecenergy.com",
            formHeading: "Send us a message",
            fullNameLabel: "Full Name *",
            emailAddressLabel: "Email Address *",
            phoneNumberLabel: "Phone Number",
            companyNameLabel: "Company Name",
            subjectLabel: "Subject *",
            selectSubjectDefault: "Select a subject",
            messageLabel: "Message *",
            submitButtonLabel: "Send Message",
            fullNamePlaceholder: "John Doe",
            emailAddressPlaceholder: "john@company.com",
            phoneNumberPlaceholder: "+1 (555) 000-0000",
            companyNamePlaceholder: "Company Ltd.",
            messagePlaceholder: "How can we help you?",
            openingHours: [
              { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST" },
              { days: "Saturday", hours: "9:00 AM - 1:00 PM IST" },
              { days: "Sunday", hours: "Closed" },
            ],
          },
        },
      });
      console.log("Created Contact sections");
    }

    // Seed sections for Privacy Policy
    if (createdPage.slug === "privacy-policy") {
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "PrivacyContent",
          order: 0,
          content: {
            headline: "Privacy Policy",
            breadcrumb: "Start / Privacy Policy",
            contentBlocks: [
              {
                type: "heading",
                text: "General Information",
              },
              {
                type: "paragraph",
                text: "Below we inform you about the collection of personal data when using our website www.encotecenergy.com.",
              },
              {
                type: "list",
                items: [
                  "1. The term 'personal data', with reference to the definition in Art. 4 No. 1 of Regulation (EU) 2016/679 (DSGVO / GDPR) and applicable national data protection legislation, means all data that can be related to you personally (such as name, address, e-mail addresses and user behaviour).",
                  "2. We process personal data as a matter of principle only to the extent necessary to provide a functioning website and the content and services offered by us.",
                  "3. Your personal data will be deleted or blocked as soon as the purpose of storage no longer applies or statutory retention periods expire.",
                  "4. If we wish to use contracted service providers for individual functions on our website or use your data for advertising purposes, we inform you in detail about the respective processes.",
                ],
              },
              {
                type: "heading",
                text: "Responsible Office",
              },
              {
                type: "quote",
                text: "Encotec Energy (India) Pvt. Ltd.\nlegally represented by the managing directors Arun Kumar Sarna, Rajeev Ahuja, Dr. Ralf Gilgen\n\nC-85, Sector-63\nNoida-201 301\nUttar Pradesh\nIndia\n\nPhone: +91 120 4155612 | Fax: +91 120 4540611\nEmail: rajeev.ahuja@encotecenergy.com",
              },
              {
                type: "heading",
                text: "Data Protection Officer",
              },
              {
                type: "paragraph",
                text: "You can contact our data protection officer at: Rajeev Ahuja, Encotec Energy (India) Pvt. Ltd., C-85, Sector-63, Noida-201 301, Uttar Pradesh, India. Phone: +91 120 4155612, Email: rajeev.ahuja@encotecenergy.com",
              },
              {
                type: "heading",
                text: "Your Rights",
              },
              {
                type: "list",
                items: [
                  "The right to information / access to personal data stored with us",
                  "The right to rectification of inaccurate data and erasure ('right to be forgotten')",
                  "The right to restriction of data processing during verification",
                  "The right to object to data processing for legitimate reasons or advertising/analytics",
                  "The right to data portability in structured machine-readable format",
                  "The right to lodge complaints with a competent data protection supervisory authority",
                ],
              },
              {
                type: "heading",
                text: "Processing of Personal Data for Informational Website Use",
              },
              {
                type: "paragraph",
                text: "If you access our website without registering, we only collect technically necessary data transmitted by your web browser to ensure security, optimization and uptime stability:",
              },
              {
                type: "list",
                items: [
                  "Browser type and browser version",
                  "Operating system used",
                  "Referrer URL",
                  "Hostname of the accessing computer",
                  "Time of the server request",
                  "IP address (stored in server log files for maximum 7 days)",
                ],
              },
              {
                type: "heading",
                text: "Processing of Personal Data by Cookies",
              },
              {
                type: "paragraph",
                text: "We use transient (session) cookies, persistent cookies, and local storage objects to remember visitor preferences and provide secure features. For complete cookie settings and opt-out instructions, visit our Cookie Policy.",
              },
              {
                type: "heading",
                text: "Further Functions & Services of Our Website",
              },
              {
                type: "paragraph",
                text: "In addition to informational use, we process inquiry data and partner service requests under strict confidentiality agreements with vetted service providers.",
              },
              {
                type: "heading",
                text: "Objection or Revocation Against Data Processing",
              },
              {
                type: "paragraph",
                text: "You can revoke your consent or object to the processing of your data at any time by contacting our office or emailing rajeev.ahuja@encotecenergy.com.",
              },
              {
                type: "heading",
                text: "Processing of Personal Data in Connection with Applications",
              },
              {
                type: "paragraph",
                text: "Candidate applications and resume details are processed exclusively for recruitment evaluations and deleted within 6 months of procedure completion unless talent pool consent is given.",
              },
              {
                type: "heading",
                text: "EU Whistleblower Directive & Compliance",
              },
              {
                type: "quote",
                text: "personal / confidential / locked\nLegal Counsel / Compliance Officer\nEncotec Energy (India) Pvt. Ltd.\nC-85, Sector-63\nNoida-201 301\nUttar Pradesh, India",
              },
            ],
          },
        },
      });
      console.log("Created Privacy Policy sections");
    }

    // Seed sections for Cookie Policy
    if (createdPage.slug === "cookie-policy") {
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CookieContent",
          order: 0,
          content: {
            headline: "Cookie Policy",
            breadcrumb: "Start / Cookie Policy",
            contentBlocks: [
              {
                type: "heading",
                text: "Privacy Preference & Cookies Overview",
              },
              {
                type: "paragraph",
                text: "We use cookies on our website www.encotecenergy.com. Some of them are essential, while others help us to improve this website and your experience.",
              },
              {
                type: "heading",
                text: "Essential Cookies (Always Active)",
              },
              {
                type: "list",
                items: [
                  "borlabs-cookie — Provider: Encotec Energy (India) Pvt. Ltd. — Purpose: Saves visitor cookie preferences — Duration: 1 Year",
                  "pll_language — Provider: Encotec Energy (India) Pvt. Ltd. — Purpose: Saves visitor language settings — Duration: 1 Year",
                ],
              },
              {
                type: "heading",
                text: "Statistics & Performance Cookies (Optional)",
              },
              {
                type: "list",
                items: [
                  "Google Tag Manager / Google Analytics (_ga, _gat, _gid, gtag) — Provider: Google Ireland Limited — Purpose: Anonymous visitor traffic statistics — Duration: 2 Years / 24 Hours",
                ],
              },
              {
                type: "heading",
                text: "Browser Configuration & Disabling Cookies",
              },
              {
                type: "list",
                items: [
                  "Chrome: Settings > Privacy and security > Third-party cookies",
                  "Firefox: Settings > Privacy & Security > Cookies and Site Data",
                  "Safari: Preferences > Privacy > Block all cookies",
                  "Edge: Settings > Cookies and site permissions",
                ],
              },
              {
                type: "heading",
                text: "Contact & Inquiries",
              },
              {
                type: "quote",
                text: "Encotec Energy (India) Pvt. Ltd.\nC-85, Sector-63, Noida-201 301, Uttar Pradesh, India\nPhone: +91 120 4155612 | Email: rajeev.ahuja@encotecenergy.com",
              },
            ],
          },
        },
      });
      console.log("Created Cookie Policy sections");
    }
  }

  // 5. Navigation Links
  const navLinks = [
    {
      label: "About",
      url: "/about",
      type: "Main Link",
      order: 1,
      isStatic: true,
    },
    {
      label: "Services",
      url: "/services",
      type: "Main Link",
      order: 2,
      isStatic: true,
    },
    {
      label: "Insights",
      url: "/insights",
      type: "Main Link",
      order: 3,
      isStatic: true,
    },
    {
      label: "Careers",
      url: "/careers",
      type: "Main Link",
      order: 4,
      isStatic: true,
    },
    {
      label: "Certifications",
      url: "/certifications",
      type: "Main Link",
      order: 5,
      isStatic: true,
    },
    {
      label: "Leadership",
      url: "/leadership",
      type: "Main Link",
      order: 6,
      isStatic: true,
    },
    {
      label: "Contact Us",
      url: "/contact",
      type: "Main Link",
      order: 7,
      isStatic: true,
    },
    {
      label: "Privacy Policy",
      url: "/privacy-policy",
      type: "Footer Link",
      order: 8,
      isStatic: true,
    },
    {
      label: "Cookie Policy",
      url: "/cookie-policy",
      type: "Footer Link",
      order: 9,
      isStatic: true,
    },
  ];

  for (const link of navLinks) {
    await prisma.navLink.create({
      data: link,
    });
  }
  console.log("Created navigation links");

  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
