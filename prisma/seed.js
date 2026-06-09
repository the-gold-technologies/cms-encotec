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
      email: "admin@encotech.com",
      password: hashedPassword,
    },
  });
  console.log("Created admin user:", adminUser.email);

  // 3. Create Global Config
  await prisma.globalConfig.create({
    data: {
      id: "global",
      siteTitle: "Encotech",
      siteDescription: "Engineering & Project Management Services - Member of Dornier Group",
      favicon: "",
      googleAnalyticsId: "G-XXXXXXXXXX",
      gtmId: "GTM-XXXXXXX",
      socialLinks: {
        twitter: "https://twitter.com/encotech",
        linkedin: "https://linkedin.com/company/encotech"
      },
    },
  });
  console.log("Created global config");

  // 4. Create Static Pages
  const pages = [
    {
      title: "Home",
      slug: "home",
      description: "Welcome to Encotec",
      metaTitle: "Encotech - Member of Dornier Group",
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
      description: "Encotech Services",
      metaTitle: "Our Services - Encotec",
      metaDescription: "Explore our range of engineering and advisory services",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Insights",
      slug: "insights",
      description: "Encotech Insights",
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
    {
      title: "Certifications",
      slug: "certifications",
      description: "Our Certifications",
      metaTitle: "Certifications - Encotec",
      metaDescription: "Our quality standards and ISO certifications",
      isStatic: true,
      visibility: "public",
    },
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
            backgroundImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200",
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
          }
        }
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
              { id: 1, title: "Logical Foundation", description: "We start by conceptualizing the project through rigorous feasibility studies and Detailed Project Reports (DPR).", icon: "Search" },
              { id: 2, title: "Strategic Alignment", description: "Our team develops technical specifications and assists in the selection of the right partners to ensure a solid start.", icon: "PenTool" },
              { id: 3, title: "Technical Realization", description: "We manage the precision erection and commissioning of assets, whether they are new builds or relocated plants.", icon: "HardHat" },
              { id: 4, title: "Owner's O&M", description: "We transition into long-term stewardship, providing operation and maintenance with the same care as the asset owner.", icon: "CheckCircle2" },
              { id: 5, title: "Continuous Improvement", description: "Through regular performance diagnostics and energy audits, we ensure your asset remains efficient and reliable for its entire lifecycle.", icon: "Activity" }
            ]
          }
        }
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
          }
        }
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
          }
        }
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
              { headline: "Ready to Move from Consultancy to Partnership?", text: "Discover how our \"Owner's Mindset\" can transform your project's performance." },
              { headline: "Let's Build Your Project's Future Together.", text: "Contact us for end-to-end solutions, from conceptualization to commissioning." },
              { headline: "Is Your Asset Reaching Its Full Potential?", text: "Speak with our 300+ engineers about our expert advisory and performance audits." },
              { headline: "Sourcing Critical Spares? We've Got the Global Reach.", text: "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs." },
              { headline: "Join the 13+ Cities That Trust Encotec.", text: "Experience the peace of mind that comes with a top-tier O&M partner." },
              { headline: "Planning an Asset Relocation?", text: "Let our experts manage the complex transition of your plant from one site — or country — to another." }
            ]
          }
        }
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
              { quote: "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own — uptime improved by 12% in the first year alone.", name: "Rajesh Mehta", title: "Senior Vice President, Operations", company: "National Thermal Power Corp.", initials: "RM" },
              { quote: "From feasibility to commissioning, Encotec delivered our 200 MW solar project on schedule and under budget. Their engineering precision and attention to detail set a new benchmark for our portfolio.", name: "Sarah Al-Rashid", title: "Project Director, Renewable Energy", company: "Gulf Energy Solutions", initials: "SA" }
            ]
          }
        }
      });

      // 9. LogoStripSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "LogoStripSection",
          order: 8,
          content: {
            tagline: "Trusted by Industry Leaders",
            logos: ["Siemens Energy", "General Electric", "Vestas", "NextEra", "Orsted", "Enel", "Iberdrola"]
          }
        }
      });

      // 10. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 9,
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
          }
        }
      });
      console.log("Created Home sections (all 10 Encotec sections)");
    }
  }

  // 5. Navigation Links
  const navLinks = [
    { label: "About", url: "/about", type: "Main Link", order: 1, isStatic: true },
    { label: "Services", url: "/services", type: "Main Link", order: 2, isStatic: true },
    { label: "Insights", url: "/insights", type: "Main Link", order: 3, isStatic: true },
    { label: "Careers", url: "/careers", type: "Main Link", order: 4, isStatic: true },
    { label: "Certifications", url: "/certifications", type: "Main Link", order: 5, isStatic: true },
    { label: "Leadership", url: "/leadership", type: "Main Link", order: 6, isStatic: true },
    { label: "Contact Us", url: "/contact", type: "Main Link", order: 7, isStatic: true }
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
