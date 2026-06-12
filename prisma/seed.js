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
    {
      title: "Engineering Services",
      slug: "engineering-services",
      description: "Comprehensive engineering solutions for reliable energy infrastructure.",
      metaTitle: "Engineering Services - Encotec",
      metaDescription: "Comprehensive engineering solutions for reliable energy infrastructure.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Project Management",
      slug: "project-management",
      description: "Structured project conceptualisation and development services.",
      metaTitle: "Project Management - Encotec",
      metaDescription: "Structured project conceptualisation and development services.",
      isStatic: true,
      visibility: "public",
    },
    {
      title: "Power Generation",
      slug: "power-generation",
      description: "Asset stewardship and operations & maintenance services.",
      metaTitle: "Power Generation (O&M) - Encotec",
      metaDescription: "Asset stewardship and operations & maintenance services.",
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

    if (createdPage.slug === "about") {
      // 1. AboutHero
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AboutHero",
          order: 0,
          content: {
            tagline: "About Encotec Energy",
            heading: "Engineering Excellence, Delivered with Ownership",
            description: "A full-spectrum engineering and services company operating across power generation, transmission & distribution, and renewable energy sectors.",
            backgroundImage: "https://images.unsplash.com/photo-1497435334941-8c899a9bd6a2?auto=format&fit=crop&q=80&w=2400",
          }
        }
      });
      // 2. WhoWeAre
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "WhoWeAre",
          order: 1,
          content: {
            tagline: "Who We Are",
            heading: "Energy is More Than Just Infrastructure",
            headingHighlight: "Just Infrastructure",
            paragraphs: [
              "At Encotec, we believe that energy infrastructure is about more than just steel and circuits — it is about the responsibility of keeping the world moving. We have evolved from a traditional consulting firm into a Global Service Provider that offers end-to-end solutions for the entire life of your project.",
              "We approach every plant, every substation, and every utility we manage with what we call an \"Owner's Mindset\". This means we don't just provide a service; we take total responsibility for your assets, treating them with the same care, accountability, and long-term vision as if they were our own."
            ]
          }
        }
      });
      // 3. MissionVisionValues
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "MissionVisionValues",
          order: 2,
          content: {
            tagline: "Our Heart and Soul",
            description: "Our purpose is to bridge the gap between technical complexity and business success.",
            missionTitle: "Mission",
            missionDesc: "To deliver error-free, high-standard services through continuous innovation and a relentless commitment to \"finding new ways to energy solutions\".",
            visionTitle: "Vision",
            visionDesc: "To be the most trusted global partner in energy stewardship, leading the transition from traditional power to a sustainable future.",
            valuesTitle: "Core Values",
            valuesDesc: "We are defined by Accountability, Innovation, and Total Care. By adopting the owner's perspective, we ensure that safety and efficiency are never compromised.",
            valuesList: [
              { title: "Accountability", description: "We treat every site with the care of an owner, taking full responsibility for outcomes.", icon: "HeartHandshake" },
              { title: "Innovation", description: "We constantly find new ways to improve energy solutions for reliability and efficiency.", icon: "Award" },
              { title: "Safety First", description: "We ensure excellence isn't just a goal — it's our standard at every project site.", icon: "ShieldCheck" },
              { title: "Quality Standards", description: "Triple ISO Certified in Quality (9001), Environment (14001), and Safety (45001).", icon: "TrendingUp" },
              { title: "Client Partnership", description: "We work as trusted partners, aligning our solutions with client objectives.", icon: "Users" },
              { title: "Sustainability", description: "Bridging the gap between traditional power and the renewable future.", icon: "Leaf" }
            ]
          }
        }
      });
      // 4. ScaleImpact
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ScaleImpact",
          order: 3,
          content: {
            heading: "Encotec by the Numbers",
            description: "Our growth is a testament to the trust our partners place in us. As of 2025–26, our impact is felt across the industry.",
            stats: [
              { value: "1,800+", label: "Dedicated Staff", description: "Working across global sites", icon: "Users" },
              { value: "300+", label: "Specialized Engineers", description: "Providing high-level expert advisory and diagnostics", icon: "Briefcase" },
              { value: "8,000+", label: "MW Managed", description: "Total power capacity under our stewardship", icon: "Zap" },
              { value: "Triple ISO", label: "Certified", description: "Quality (9001), Environment (14001), Safety (45001)", icon: "ShieldCheck" },
              { value: "65+", label: "Global OEMs", description: "Tie-ups across China, Vietnam, Korea, and India", icon: "Globe" }
            ],
            footerNote: "Our scale is not just a measure of size, but a reflection of our ability to consistently deliver high-performance outcomes across complex engineering environments."
          }
        }
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
            description: "We have spent over a decade building a legacy of excellence, one project at a time.",
            phases: [
              { title: "2011–2012: Construction Beginnings", description: "We began our major journey with complex IBR piping erection and commissioning for the massive 2x660 MW Obra 'C' project." },
              { title: "2013: Renewable Expansion", description: "Expanded into the green frontier, successfully commissioning 10 MWp Solar PV projects in Gujarat and Solar Thermal projects in Rajasthan." },
              { title: "2014–2021: O&M Leadership", description: "Solidified our reputation as top-tier stewards with the long-term O&M management of 2x600 MW units at Tuticorin." },
              { title: "2018: Supercritical Excellence", description: "Embarked on our flagship O&M partnership for the 2x700 MW Supercritical Power Plant at Jhajjar." },
              { title: "2021: Going Global", description: "Took our expertise global, managing critical commissioning projects internationally." },
              { title: "2025 & Beyond: New Chapters", description: "We are currently providing specialized utility management for international hubs like Delhi (DIAL) and Noida (YIAPL) International Airports." }
            ]
          }
        }
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
              "Our in-house Encotec-Dornier team conducts specialized energy audits to identify savings and reduce the carbon footprints of operational plants. Through our expert advisory and Residual Life Assessments (RLA), we help owners revitalize old plants, making them more efficient and environmentally compliant."
            ],
            focuses: [
              "Specialized energy audits by our in-house Encotec-Dornier team to identify savings and reduce carbon footprints",
              "Residual Life Assessments (RLA) to help owners revitalize older plants for improved efficiency and environmental compliance",
              "ISO 14001 environmental management integrated into daily operations across all sites",
              "Supporting the transition from traditional power to a sustainable, renewable future"
            ],
            footerNote: "Our approach ensures that sustainability is not an afterthought, but an integral part of how we design, execute, and operate energy systems."
          }
        }
      });
      // 7. GlobalPresence
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "GlobalPresence",
          order: 6,
          content: {
            tagline: "Our Reach",
            heading: "A Global Presence with a Local Touch",
            description: "While our headquarters is in Noida, our footprints span the world. In India, we are present in 13+ key cities from Jamshedpur to Vizag. Internationally, we have established strong roots in Turkey, Bahrain, and Greece, ensuring that wherever infrastructure needs stewardship, Encotec is there.",
            areas: [
              { title: "International Operations", desc: "Turkey, Bahrain, Greece" },
              { title: "Headquarters", desc: "Noida, India" },
              { title: "Eastern & Central India", desc: "Jamshedpur, Haldia, Khandwa" },
              { title: "Coastal & Southern India", desc: "Vizag and expanding regions" }
            ],
            calloutTitle: "Wherever Energy is Needed",
            calloutDesc: "We combine local execution strength with global engineering expertise, ensuring that we bring the same \"Owner's Mindset\" to every project, no matter the geography."
          }
        }
      });
      // 8. Leadership
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "Leadership",
          order: 7,
          content: {
            heading: "Leadership Team",
            description: "Experienced leaders driving operational excellence and strategic growth",
            leaders: [
              { role: "Managing Director", name: "[Name]", bio: "Brings extensive leadership experience in engineering, project execution, and energy infrastructure development. With a deep understanding of large-scale power and industrial projects, has been instrumental in shaping the strategic direction of Encotec. Under this leadership, the organization has expanded its capabilities across engineering, project management, and operations, establishing a strong presence in both domestic and international markets. Focuses on driving long-term value creation through operational excellence, technical innovation, and strong client partnerships." },
              { role: "Director – Operations", name: "[Name]", bio: "Leads operational delivery across multiple projects, ensuring efficient execution, adherence to quality standards, and optimal resource utilization. With significant experience in operation and maintenance of power plants, substations, and infrastructure systems, plays a key role in maintaining performance, reliability, and safety across all sites. This expertise ensures that projects are executed with precision while meeting both technical and commercial objectives." }
            ]
          }
        }
      });
      // 9. ClosingStatement
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ClosingStatement",
          order: 8,
          content: {
            heading: "Encotec integrates engineering expertise, execution capability, and operational excellence to deliver solutions that perform",
            highlight: "engineering expertise, execution capability, and operational excellence",
            description: "— not just at commissioning, but throughout the lifecycle of every asset.",
            ctaLabel: "Partner With Us",
            ctaUrl: "/contact"
          }
        }
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
            heading: "Integrated Solutions Across the Asset Lifecycle",
            description: "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running."
          }
        }
      });

      // 2. IntroSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "IntroSection",
          order: 1,
          content: {
            paragraph1: "At Encotec, we don't just provide engineering services; we provide peace of mind. We approach every facility we manage with an \"Owner's Mindset\", meaning we treat your infrastructure with the same care, precision, and long-term vision as if it were our own.",
            paragraph2: "With a family of over 1,800 staff members and 300+ specialized engineers, we bridge the gap between technical complexity and commercial success. Below is an overview of how we provide end-to-end expertise across the asset lifecycle."
          }
        }
      });

      // 3. CoreServices
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CoreServices",
          order: 2,
          content: {
            heading: "Core Services",
            services: [
              {
                title: "Project Conceptualisation & Development",
                icon: "Target",
                link: "/services/project-management",
                overview: "We help you build on a solid foundation, from pre-feasibility studies to the final selection of your EPC partners.",
                capabilities: [
                  "Feasibility & Pre-Feasibility Studies",
                  "Detailed Project Reports (DPR)",
                  "Strategic Sourcing & Technical Specifications",
                  "EPC Contractor Selection",
                  "Financial Assessments"
                ],
                value: [
                  "Technically sound planning",
                  "Financially viable projects",
                  "Stakeholder confidence"
                ]
              },
              {
                title: "Construction, Commissioning & Relocation",
                icon: "HardHat",
                link: "/services/transmission-distribution",
                overview: "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
                capabilities: [
                  "Multi-Sector Construction Expertise",
                  "International Commissioning",
                  "Grid Synchronization & Performance Tests",
                  "Asset Dismantling & Relocation",
                  "Complex IBR Piping Erection"
                ],
                value: [
                  "Speed and safety",
                  "Seamless cross-border transitions",
                  "Physical realization of complex assets"
                ]
              },
              {
                title: "Asset Stewardship (O&M)",
                icon: "Settings",
                link: "/services/power-generation",
                overview: "As one of India's top five O&M specialists, we provide continuous care for thermal plants, international airports, and critical utilities.",
                capabilities: [
                  "Thermal & Supercritical Mastery",
                  "Airport Utility Management",
                  "Integrated ERP Support",
                  "Zero-Error Operations",
                  "Risk Management & Reliability Focus"
                ],
                value: [
                  "Optimized megawatt production",
                  "Long-term asset health",
                  "Owner-perspective care"
                ]
              },
              {
                title: "Expert Advisory & Performance Audits",
                icon: "ClipboardCheck",
                link: "/services/renewable-energy",
                overview: "When problems arise or efficiency drops, our specialists provide on-site diagnostics and high-level technical solutions.",
                capabilities: [
                  "Specialised Testing (NDT)",
                  "Energy Efficiency Audits",
                  "Steam Path Audits",
                  "5S & Process Improvement",
                  "High-Level Problem Solving"
                ],
                value: [
                  "Reduced megawatt production costs",
                  "Improved workplace safety",
                  "Restored operational efficiency"
                ]
              },
              {
                title: "Due Diligence & Asset Health",
                icon: "ShieldCheck",
                link: "/services/airport-services",
                overview: "We evaluate the \"residual life\" of older plants to help owners make informed decisions about acquisitions or relocations.",
                capabilities: [
                  "Residual Life Assessment (RLA)",
                  "Technical Due Diligence",
                  "Independent Technical Audits",
                  "Revamping & Restoration Strategy",
                  "Environmental Compliance Planning"
                ],
                value: [
                  "Informed investment decisions",
                  "Understanding true asset value",
                  "Future-proofed infrastructure"
                ]
              },
              {
                title: "Strategic Global Sourcing (Spare Parts)",
                icon: "Package",
                link: "/services/value-added",
                overview: "Access our trusted network of major OEMs in China, Vietnam, and India to keep your facility running without interruption.",
                capabilities: [
                  "Global OEM Network (65+ tie-ups)",
                  "Comprehensive Inventory Supply",
                  "High-Pressure Boiler Spares",
                  "Electrical Actuators & Mill Rollers",
                  "Engineering Integration Support"
                ],
                value: [
                  "Reduced downtime",
                  "Strategic sourcing partnerships",
                  "Guaranteed specification performance"
                ]
              }
            ]
          }
        }
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
              { name: "Power Generation", subtitle: "Thermal & Renewable", icon: "Flame" },
              { name: "Transmission & Distribution", subtitle: "Grid Infrastructure", icon: "Network" },
              { name: "Infrastructure & Industrial", subtitle: "Facilities", icon: "Building" },
              { name: "Airports & Utility Systems", subtitle: "Critical Infrastructure", icon: "Plane" },
              { name: "Energy & Climate Projects", subtitle: "Sustainable Solutions", icon: "Zap" }
            ]
          }
        }
      });

      // 5. ProcessSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessSection",
          order: 4,
          content: {
            heading: "How We Deliver",
            description: "Our structured approach ensures precision and reliability at every stage",
            steps: [
              { title: "Assess", description: "Technical and commercial evaluation", number: "01" },
              { title: "Design", description: "Engineering and system planning", number: "02" },
              { title: "Execute", description: "Construction and commissioning", number: "03" },
              { title: "Operate", description: "Maintenance and optimization", number: "04" }
            ]
          }
        }
      });

      // 6. ClosingSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ClosingSection",
          order: 5,
          content: {
            heading: "Our integrated approach ensures that every project — from concept to operation — is delivered with precision, reliability, and long-term performance in mind.",
            highlight: "from concept to operation",
            ctaLabel: "Start Your Project",
            ctaUrl: "/contact"
          }
        }
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
            description: "Comprehensive engineering solutions forming the foundation of reliable and efficient energy infrastructure across power generation, transmission, and renewable energy projects.",
            floatingStats: [
              "500+ Projects Engineered",
              "8000+ MW Designed",
              "99.2% Design Accuracy"
            ],
            backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2400"
          }
        }
      });
      // 2. OverviewSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "OverviewSection",
          order: 1,
          content: {
            tagline: "Overview",
            heading: "Building the Foundation of Reliable Energy Infrastructure",
            paragraphs: [
              "Our engineering services deliver comprehensive solutions that form the foundation of reliable and efficient energy infrastructure. We bring deep technical expertise across feasibility analysis, system design, and detailed engineering for power generation, transmission, and renewable energy projects.",
              "From initial site assessment to final design validation, our engineering team ensures every project is built on a strong technical foundation that optimizes performance, minimizes risk, and delivers long-term value."
            ],
            quote: "Engineering excellence is not just about technical precision — it's about understanding the entire lifecycle and designing for reliability, efficiency, and sustainable performance.",
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
            badgeTitle: "Engineering Excellence",
            badgeValue: "Since 2009"
          }
        }
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
            description: "Our engineering services span the complete project lifecycle, from initial assessment to detailed design and technical validation.",
            capabilities: [
              { title: "Site Assessment & Evaluation", description: "Comprehensive technical evaluation of site conditions, resource availability, and project feasibility", icon: "Target", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" },
              { title: "Energy Yield Analysis", description: "Detailed resource assessment and energy generation forecasting for optimal project planning", icon: "TrendingUp", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200" },
              { title: "Feasibility Studies", description: "Pre-feasibility and detailed feasibility studies with technical and commercial evaluation", icon: "FileText", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" },
              { title: "Design & Engineering", description: "Design review, detailed engineering, and preparation of comprehensive project reports (DPR)", icon: "Layout", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200" },
              { title: "System Integration", description: "Power evacuation planning and system integration for seamless grid connectivity", icon: "Zap", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" },
              { title: "Transmission & Substation Design", description: "Transmission line design (33kV to 765kV) and substation design (AIS/GIS systems)", icon: "Network", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" }
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
            tagline: "Our Approach",
            heading: "Engineering Methodology",
            description: "A systematic approach to engineering excellence, ensuring every project is built on a foundation of technical rigor and precision.",
            steps: [
              { title: "Assessment", description: "Comprehensive site evaluation, resource analysis, and technical feasibility assessment", icon: "Search", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" },
              { title: "Analysis", description: "Energy yield forecasting, system modeling, and detailed technical evaluation", icon: "TrendingUp", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200" },
              { title: "Design", description: "Detailed engineering, system design, and comprehensive project documentation", icon: "PencilRuler", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" },
              { title: "Integration", description: "Power evacuation planning, grid connectivity design, and system integration", icon: "Settings", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" },
              { title: "Validation", description: "Design review, technical validation, and regulatory compliance verification", icon: "ShieldCheck", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200" }
            ]
          }
        }
      });
      // 5. StatsSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StatsSection",
          order: 4,
          content: {
            heading: "Engineering Impact",
            description: "Delivering measurable results through technical excellence and precision engineering",
            stats: [
              { value: 500, suffix: "+", label: "Projects Engineered" },
              { value: 8000, suffix: "+ MW", label: "Capacity Designed" },
              { value: 23, suffix: "+", label: "Countries Served" },
              { value: 99.2, suffix: "%", label: "Design Accuracy" }
            ]
          }
        }
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
            projectDescription: "Complete engineering services for a 2x660 MW supercritical thermal power plant in Uttar Pradesh, delivering comprehensive design, system integration, and technical validation.",
            projectImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
            metrics: [
              { value: "1,320 MW", label: "Total Capacity", icon: "Zap" },
              { value: "Supercritical", label: "Technology", icon: "Target" },
              { value: "On Schedule", label: "Delivery", icon: "CheckCircle2" }
            ]
          }
        }
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
            description: "Our engineering approach delivers measurable value through risk reduction, performance optimization, and technical excellence.",
            values: [
              { title: "Reduced Project Risk", description: "Accurate planning and technical validation minimize execution risks and costly delays", icon: "ShieldCheck" },
              { title: "Optimized System Design", description: "Performance-focused engineering ensures maximum efficiency and reliability", icon: "Target" },
              { title: "Strong Technical Foundation", description: "Comprehensive documentation and design reviews support seamless execution", icon: "ClipboardCheck" },
              { title: "Regulatory Compliance", description: "Designs meet all applicable standards and regulatory requirements", icon: "CheckCircle2" }
            ]
          }
        }
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
              { title: "Project Management", description: "Structured planning, coordination, and control across all project phases", link: "/services/project-management", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200" },
              { title: "EPC & Construction", description: "Execution support across engineering, procurement, and construction", link: "/services", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200" },
              { title: "O&M Services", description: "Long-term operational excellence and performance optimization", link: "/services", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200" }
            ]
          }
        }
      });
      // 9. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 8,
          content: {
            heading: "Ready to Start Your Engineering Project?",
            description: "Let our engineering team help you build a strong technical foundation for your energy infrastructure project.",
            primaryBtnLabel: "Get Started",
            primaryBtnUrl: "/contact",
            secondaryBtnLabel: "View All Services",
            secondaryBtnUrl: "/services"
          }
        }
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
            label: "Project Conceptualisation & Development",
            headline: "Building Your Vision on a Logical Foundation",
            description: "A great project doesn't start with a shovel in the ground; it starts with a logical, well-vetted plan. We are your strategic developers who ensure your project is technically sound and financially viable from day one.",
            floatingBadges: [
              { icon: "Map", text: "Pre-Feasibility" },
              { icon: "FileText", text: "DPR Creation" },
              { icon: "Briefcase", text: "EPC Selection" }
            ]
          }
        }
      });
      // 2. PhilosophySection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "PhilosophySection",
          order: 1,
          content: {
            heading: "Not Just Detailed Engineering. Strategic Development.",
            paragraphs: [
              "We are not a \"detailed engineering\" firm that gets lost in the minutiae. We understand that the earliest decisions in a project's lifecycle have the most profound impact on its ultimate success.",
              "By adopting an \"Owner's Mindset\" from the very beginning, we evaluate site conditions, resource potential, and financial models to ensure your investment is built on reality, not just theory. We provide the clarity required for stakeholder confidence and project approval."
            ],
            features: [
              { title: "Strategic Alignment", desc: "Aligning technical specs with business goals", icon: "Target" },
              { title: "Financial Viability", desc: "Rigorous financial and resource assessments", icon: "FileCheck" },
              { title: "Partner Selection", desc: "Finalising the right EPC contractors", icon: "Users" },
              { title: "Risk Mitigation", desc: "Identifying challenges before they arise", icon: "ShieldCheck" }
            ]
          }
        }
      });
      // 3. CoreOfferings
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CoreOfferings",
          order: 2,
          content: {
            heading: "Our Development Services",
            description: "End-to-end conceptualisation to ensure your project starts strong.",
            offerings: [
              { title: "Feasibility & Pre-Feasibility Studies", description: "We evaluate site conditions and resource potential to ensure your investment is built on reality, not just theory. Our comprehensive studies cover technical, economic, and environmental factors.", icon: "Map" },
              { title: "Detailed Project Reports (DPR)", description: "We provide the technical and financial clarity required for stakeholder confidence and project approval. Our DPRs serve as the definitive blueprint for project execution and financing.", icon: "FileText" },
              { title: "Strategic Sourcing & EPC Selection", description: "We develop rigorous technical specifications and help you finalise EPC contractors, ensuring you have the right partners by your side. We manage the entire tendering and evaluation process.", icon: "Briefcase" }
            ]
          }
        }
      });
      // 4. StatsSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StatsSection",
          order: 3,
          content: {
            stats: [
              { value: 8000, suffix: "+", label: "MW Conceptualised" },
              { value: 100, suffix: "%", label: "Owner's Mindset" },
              { value: 300, suffix: "+", label: "Specialized Engineers" }
            ]
          }
        }
      });
      // 5. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 4,
          content: {
            heading: "Ready to Build Your Vision?",
            description: "Let's start your project on a logical foundation with our expert conceptualisation and development services.",
            ctaLabel: "Start the Conversation",
            ctaUrl: "/contact"
          }
        }
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
            heading: "Operating With An Owner's Mindset",
            description: "We don't just \"maintain\" plants; we steward them. By adopting the owner's perspective, we focus on reliability, risk management, and long-term health, ensuring that every megawatt produced is optimized."
          }
        }
      });
      // 2. StewardshipFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StewardshipFeatures",
          order: 1,
          content: {
            features: [
              { title: "Thermal & Supercritical Mastery", description: "We manage some of India’s largest facilities, such as the 2x700 MW supercritical plant at Rajpura, with a focus on zero-error operations and maximum availability.", icon: "Zap" },
              { title: "Airport Utility Management", description: "We are the silent force behind international hubs like DIAL, managing critical high-voltage assets, fire safety, and mechanical systems to ensure uninterrupted operations.", icon: "Plane" },
              { title: "Integrated ERP Support", description: "All our sites are linked via a single ERP system, providing central project management and inventory support from our Noida headquarters for seamless operations.", icon: "Database" }
            ]
          }
        }
      });
      // 3. StewardshipPhilosophy
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StewardshipPhilosophy",
          order: 2,
          content: {
            heading: "The Difference Between Maintenance & Stewardship",
            paragraphs: [
              "Maintenance is reactive; stewardship is proactive. As one of India's top five O&M specialists, we take total responsibility for the health of your assets.",
              "Our approach integrates predictive diagnostics, rigorous safety protocols, and continuous performance optimization. We don't just fix what's broken; we prevent failures before they occur, maximizing the lifespan and profitability of your infrastructure."
            ],
            items: [
              { title: "Zero-Error Focus", icon: "ShieldCheck" },
              { title: "Predictive Diagnostics", icon: "Activity" },
              { title: "Centralized ERP", icon: "Database" },
              { title: "24/7 Monitoring", icon: "Settings" }
            ]
          }
        }
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Experience True Stewardship",
            description: "Let us take responsibility for your assets so you can focus on your core business.",
            ctaLabel: "Partner With Us",
            ctaUrl: "/contact"
          }
        }
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
            label: "Construction, Commissioning & Relocation",
            heading: "Bringing Complex Infrastructure to Life",
            description: "At Encotec, we thrive on the challenge of \"physical realization\". From the massive IBR piping of a thermal plant to the precision mounting of solar modules, we bring your assets online with speed and safety."
          }
        }
      });
      // 2. CapabilitiesSection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CapabilitiesSection",
          order: 1,
          content: {
            heading: "Physical Realization at Scale",
            description: "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
            capabilities: [
              { title: "Multi-Sector Expertise", description: "We have delivered construction excellence across thermal power, solar PV, and wind projects globally. Our teams handle everything from civil works to complex mechanical erection.", icon: "HardHat" },
              { title: "International Commissioning", description: "Our teams have managed grid synchronization and performance tests in diverse markets, including Greece and Turkey. We ensure your plant meets all local and international standards.", icon: "Globe" },
              { title: "Asset Relocation Services", description: "Unique to Encotec, we support owners in the complex process of dismantling, shifting, and reinstalling plants from one site—or country—to another, ensuring minimal downtime.", icon: "Truck" }
            ]
          }
        }
      });
      // 3. ProcessFlow
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ProcessFlow",
          order: 2,
          content: {
            heading: "The Relocation Advantage",
            description: "Asset relocation is a highly specialized service that requires meticulous planning, precise execution, and deep engineering knowledge. Encotec is one of the few global providers with a proven track record in cross-border plant relocations.",
            bullets: [
              "Detailed dismantling protocols and tagging",
              "Logistics planning and customs clearance support",
              "Refurbishment of critical components during transit",
              "Re-erection and synchronization at the new site"
            ],
            steps: [
              { "title": "Dismantle", "desc": "Precision teardown", "icon": "Settings" },
              { "title": "Transport", "desc": "Global logistics", "icon": "Truck" },
              { "title": "Erect", "desc": "Expert installation", "icon": "HardHat" },
              { "title": "Commission", "desc": "Grid sync & testing", "icon": "Zap" }
            ]
          }
        }
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Ready to Bring Your Asset Online?",
            description: "From new builds to complex cross-border relocations, our teams are ready to execute.",
            ctaLabel: "Discuss Your Project",
            ctaUrl: "/contact"
          }
        }
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
            heading: "Solving the Hardest Engineering Problems",
            description: "When a plant is running but not performing, or when technical faults disrupt your peace of mind, our expert advisory team steps in. We provide high-level problem solving that goes beyond basic maintenance."
          }
        }
      });
      // 2. AdvisoryFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "AdvisoryFeatures",
          order: 1,
          content: {
            features: [
              { title: "Specialised Testing (NDT)", description: "We use Non-Destructive Testing to assess the health of your equipment without causing further downtime. Identify micro-fractures and wear before they lead to catastrophic failure.", icon: "Search" },
              { title: "Efficiency Audits", description: "Our in-house team conducts energy efficiency and steam path audits to identify savings and reduce your carbon footprint. We find the lost megawatts in your system.", icon: "Activity" },
              { title: "5S & Process Improvement", description: "We implement industrial standards (5S) to improve workplace safety and operational flow. A clean, organized plant is a safe and efficient plant.", icon: "TrendingUp" }
            ]
          }
        }
      });
      // 3. DiagnosticProcess
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "DiagnosticProcess",
          order: 2,
          content: {
            heading: "Our Diagnostic Approach",
            description: "We don't guess; we measure. Our advisory services are built on hard data and deep engineering expertise.",
            steps: [
              { step: "01", title: "Assess", desc: "Comprehensive site evaluation and data gathering" },
              { step: "02", title: "Analyze", desc: "Deep dive into performance metrics and NDT results" },
              { step: "03", title: "Advise", desc: "Actionable recommendations for improvement" },
              { step: "04", title: "Optimize", desc: "Implementation support and verification" }
            ]
          }
        }
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Is Your Asset Reaching Its Full Potential?",
            description: "Speak with our specialized engineers about our expert advisory and performance audits.",
            ctaLabel: "Request an Audit",
            ctaUrl: "/contact"
          }
        }
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
            heading: "Making Informed Decisions For the Long Term",
            description: "Before you buy an old plant or decide to move one, you need to know if it's fit for the future. Our due diligence services provide the technical truth about your assets."
          }
        }
      });
      // 2. HealthFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "HealthFeatures",
          order: 1,
          content: {
            features: [
              { title: "Residual Life Assessment (RLA)", description: "We conduct exhaustive studies to determine how many more years of efficient life your plant equipment actually has, helping you plan for replacements or upgrades.", icon: "Activity" },
              { title: "Technical Due Diligence", description: "We provide independent technical audits for plant acquisitions, helping you understand the true value, operational risks, and hidden costs of an investment.", icon: "FileCheck" },
              { title: "Restoration Strategy", description: "For older plants, we provide comprehensive revamping and restoration plans to improve performance, extend lifecycle, and meet modern environmental standards.", icon: "RefreshCw" }
            ]
          }
        }
      });
      // 3. ValueProtection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ValueProtection",
          order: 2,
          content: {
            heading: "Protecting Your Investment",
            description: "Acquiring or relocating an industrial asset involves significant capital risk. Without a clear understanding of the asset's true condition, you may be inheriting expensive liabilities.",
            bullets: [
              "Structural integrity and material degradation",
              "Historical O&M records and failure analysis",
              "Environmental compliance and emissions",
              "Control systems obsolescence",
              "Thermodynamic performance baseline"
            ]
          }
        }
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Planning an Acquisition or Relocation?",
            description: "Get the technical truth about your assets before you make a decision.",
            ctaLabel: "Request an Assessment",
            ctaUrl: "/contact"
          }
        }
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
            label: "Strategic Global Sourcing",
            heading: "The Global Link for Critical Equipment",
            description: "Downtime is often caused by a missing part, not a missing plan. Encotec acts as your strategic sourcing partner, leveraging deep relationships with manufacturers to get you what you need, when you need it."
          }
        }
      });
      // 2. SourcingFeatures
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SourcingFeatures",
          order: 1,
          content: {
            features: [
              { title: "Global OEM Network", description: "We have established tie-ups with over 65 major OEMs in China, Vietnam, Korea, and India, giving you direct access to high-quality components without the logistical headache.", icon: "Globe" },
              { title: "Comprehensive Inventory", description: "We supply everything from high-pressure boiler spares to coal mill rollers and specialized electrical actuators, ensuring your entire plant is covered.", icon: "Package" },
              { title: "Technical Support", description: "We don’t just supply parts; we provide the engineering support to ensure they are integrated correctly and perform to specification within your existing systems.", icon: "Wrench" }
            ]
          }
        }
      });
      // 3. SourcingAdvantage
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SourcingAdvantage",
          order: 2,
          content: {
            heading: "More Than Just Procurement",
            description: "Procurement is transactional; strategic sourcing is a partnership. Because we operate plants ourselves, we understand the critical difference between a part that \"fits\" and a part that \"performs\".",
            paragraphs: [
              "Our engineering team vets every supplier and verifies every specification. We handle the complex logistics, customs clearance, and quality assurance, delivering peace of mind along with your critical spares."
            ],
            cards: [
              { title: "Quality Assured", icon: "ShieldCheck" },
              { title: "65+ Global OEMs", icon: "Globe" },
              { title: "Logistics Managed", icon: "Truck" },
              { title: "Engineering Backed", icon: "Wrench" }
            ]
          }
        }
      });
      // 4. CTASection
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CTASection",
          order: 3,
          content: {
            heading: "Sourcing Critical Spares?",
            description: "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs.",
            ctaLabel: "Request a Quote",
            ctaUrl: "/contact"
          }
        }
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
            heroTitle: "Our Leadership",
            heroSubtitle: "Meet the executive team guiding Encotec's engineering and project management operations",
            heroBadge1: "200+ Professionals",
            heroBadge2: "15+ Years Average Experience",
            heroBadge3: "23+ Countries",
            backgroundImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2400"
          }
        }
      });

      // 2. LeadershipPhilosophy
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "LeadershipPhilosophy",
          order: 1,
          content: {
            philosophyTagline: "Our Philosophy",
            philosophyHeading: "Leading With an Owner's Mindset",
            philosophyPara1: "At Encotec, leadership is not just about managing teams; it's about taking full accountability for the outcomes we deliver. Our leadership team brings decades of hands-on experience from the world's most complex energy projects.",
            philosophyPara2: "We believe that true engineering excellence requires a culture where every team member is empowered to think critically, act decisively, and prioritize long-term asset performance over short-term gains.",
            philosophyQuote: "We don't just manage projects — we take ownership of outcomes, treating every asset as if it were our own.",
            philosophyImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200"
          }
        }
      });

      // 3. ExecutiveTeam
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "ExecutiveTeam",
          order: 2,
          content: {
            exec1Name: "Vikram Sharma",
            exec1Role: "Managing Director & Founder",
            exec1Bio: "25+ years of leadership in energy infrastructure. Founded Encotec with a vision to bring an owner's mindset to every project. Under his leadership, Encotec has grown from a specialized engineering firm to a full-spectrum energy services provider operating across 23+ countries.",
            exec1Tags: "Strategic Leadership, Business Development, Energy Policy",
            exec2Name: "Rajesh Patel",
            exec2Role: "Director – Operations",
            exec2Bio: "20+ years in power plant operations and project execution. Leads operational delivery across multiple projects, ensuring efficient execution, quality standards, and optimal resource utilization across thermal, renewable, and transmission projects.",
            exec2Tags: "Operations Management, Plant Commissioning, Asset Optimization"
          }
        }
      });

      // 4. SeniorLeadership
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "SeniorLeadership",
          order: 3,
          content: {
            leader1Name: "Dr. Anita Desai", leader1Role: "VP Engineering", leader1Bio: "PhD in Thermal Engineering. 18+ years leading complex engineering design for power generation and transmission projects.",
            leader2Name: "Sanjay Mehta", leader2Role: "VP Business Development", leader2Bio: "15+ years driving strategic growth across India, Middle East, and Southeast Asia.",
            leader3Name: "Priya Krishnan", leader3Role: "Head of Renewable Energy", leader3Bio: "12+ years in solar and wind energy project development and execution.",
            leader4Name: "Arjun Reddy", leader4Role: "Head of Project Management", leader4Bio: "16+ years managing large-scale EPC projects across diverse geographies.",
            leader5Name: "Dr. Klaus Werner", leader5Role: "Head of Quality & Safety", leader5Bio: "20+ years in quality management systems and international safety standards.",
            leader6Name: "Meera Iyer", leader6Role: "Chief Financial Officer", leader6Bio: "14+ years in financial strategy and corporate governance for engineering firms."
          }
        }
      });

      // 5. TeamByNumbers
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "TeamByNumbers",
          order: 4,
          content: {
            stats1Value: "1800", stats1Label: "Total Professionals",
            stats2Value: "150", stats2Label: "Senior Engineers",
            stats3Value: "23", stats3Label: "Countries of Operation",
            stats4Value: "15", stats4Label: "Years Avg Experience"
          }
        }
      });

      // 6. CultureValues
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CultureValues",
          order: 5,
          content: {
            value1Title: "Technical Mastery", value1Desc: "Deep domain expertise across every discipline",
            value2Title: "Collaborative Spirit", value2Desc: "Cross-functional teams solving complex challenges",
            value3Title: "Global Perspective", value3Desc: "Diverse experiences from 23+ countries",
            value4Title: "Continuous Growth", value4Desc: "Investment in learning and professional development"
          }
        }
      });

      // 7. JoinCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "JoinCTA",
          order: 6,
          content: {
            joinHeading: "Join Our Team of Experts",
            joinSubtitle: "We're always looking for talented engineers and energy professionals who share our passion for excellence."
          }
        }
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
            heroTitle: "Encotech Insights",
            heroSubtitle: "Stay updated with our latest project features, white papers, and corporate achievements",
            backgroundImage: "https://images.unsplash.com/photo-1497435334941-8c899a9bd6a2?auto=format&fit=crop&q=80&w=2400"
          }
        }
      });

      // 2. FeaturedInsight
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "FeaturedInsight",
          order: 1,
          content: {
            latestArticleTitle: "Advancing Clean Energy Infrastructure",
            latestArticleSummary: "A comprehensive look at our recent initiatives in supporting utility-scale solar integration.",
            latestArticleDate: "March 2024",
            latestArticleLocation: "Uttar Pradesh, India"
          }
        }
      });

      // 3. StatsBanner
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StatsBanner",
          order: 2,
          content: {
            stats1Value: "15", stats1Suffix: "+", stats1Label: "Case Studies Published",
            stats2Value: "50", stats2Suffix: "+", stats2Label: "Articles & Insights",
            stats3Value: "8", stats3Suffix: "", stats3Label: "Countries Covered",
            stats4Value: "10", stats4Suffix: "K+", stats4Label: "Monthly Readers"
          }
        }
      });

      // 4. InsightsCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "InsightsCTA",
          order: 3,
          content: {
            ctaHeading: "Have a Project in Mind?",
            ctaSubtitle: "Let's discuss how our engineering expertise can bring value to your next energy infrastructure project."
          }
        }
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
            heroTitle: "Careers at Encotec",
            heroSubtitle: "Shape the future of energy and infrastructure engineering with our exceptional team",
            backgroundImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2400"
          }
        }
      });

      // 2. CareersCulture
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersCulture",
          order: 1,
          content: {
            cultureTagline: "Why Join Us",
            cultureHeading: "Engineering Careers That Matter",
            culturePara1: "At Encotec, we don't just build power plants; we engineer the foundation of modern society. Our team works on some of the most complex and critical energy infrastructure projects globally, from massive supercritical thermal plants to utility-scale renewable energy parks.",
            culturePara2: "We foster a culture of technical excellence, continuous learning, and collaborative problem-solving. When you join Encotec, you gain global exposure, working alongside industry veterans who are passionate about mentoring the next generation of engineering leaders.",
            cultureQuote: "We empower our engineers to take ownership, innovate, and deliver solutions that have a tangible impact on global energy security.",
            cultureImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200"
          }
        }
      });

      // 3. CareersBenefits
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersBenefits",
          order: 2,
          content: {
            benefitsList: [
              { title: "Global Exposure", description: "Work on critical energy infrastructure projects across 23+ countries with diverse international teams." },
              { title: "Technical Growth", description: "Access to cutting-edge technologies, specialized training, and continuous learning programs." },
              { title: "Competitive Compensation", description: "Industry-leading salary packages with performance-based bonuses and comprehensive benefits." },
              { title: "Health & Wellness", description: "Comprehensive medical insurance, wellness programs, and support for physical and mental health." },
              { title: "Work-Life Balance", description: "Flexible working arrangements, generous leave policies, and a supportive team environment." },
              { title: "Career Progression", description: "Clear growth paths, leadership development, and mentorship from seasoned industry veterans." }
            ]
          }
        }
      });

      // 4. CareersOpenPositions
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersOpenPositions",
          order: 3,
          content: {
            jobsList: [
              { title: "Senior Power Plant Engineer", dept: "Engineering", location: "Mumbai, India", type: "Full-time", desc: "Lead engineering design and technical reviews for supercritical thermal power projects." },
              { title: "Renewable Energy Analyst", dept: "Engineering", location: "Dubai, UAE", type: "Full-time", desc: "Conduct energy yield analysis and feasibility studies for solar and wind projects." },
              { title: "Project Manager — EPC", dept: "Project Management", location: "Riyadh, KSA", type: "Full-time", desc: "Manage end-to-end execution of large-scale EPC projects in the Middle East." },
              { title: "Commissioning Engineer", dept: "Engineering", location: "Houston, USA", type: "Contract", desc: "Oversee testing and commissioning of power generation equipment and systems." },
              { title: "O&M Site Manager", dept: "Operations", location: "Rajpura, India", type: "Full-time", desc: "Lead day-to-day operations and maintenance of a 2x700 MW supercritical plant." },
              { title: "Electrical Design Engineer", dept: "Engineering", location: "Mumbai, India", type: "Full-time", desc: "Design transmission lines (33kV-765kV) and substation systems (AIS/GIS)." },
              { title: "Business Development Manager", dept: "Corporate", location: "Singapore", type: "Full-time", desc: "Drive business growth across the Asia-Pacific region for energy services." },
              { title: "Quality Assurance Lead", dept: "Operations", location: "Frankfurt, Germany", type: "Full-time", desc: "Implement and oversee quality management systems across European projects." }
            ]
          }
        }
      });

      // 5. CareersGallery
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersGallery",
          order: 4,
          content: {
            galleryList: [
              { image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", caption: "Team Collaboration" },
              { image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800", caption: "On-Site Engineering" },
              { image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800", caption: "Strategic Planning" },
              { image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800", caption: "Field Operations" },
              { image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800", caption: "Team Celebrations" },
              { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800", caption: "Project Reviews" }
            ]
          }
        }
      });

      // 6. CareersProcess
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersProcess",
          order: 5,
          content: {
            processSteps: [
              { title: "Apply Online", description: "Submit your resume and cover letter through our portal." },
              { title: "Initial Screening", description: "Our HR team reviews your application within 5 business days." },
              { title: "Technical Interview", description: "Meet with our engineering leads for a technical discussion." },
              { title: "Final Offer", description: "Receive your offer and begin your journey with Encotec." }
            ]
          }
        }
      });

      // 7. CareersCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CareersCTA",
          order: 6,
          content: {
            ctaHeading: "Don't See the Right Role?",
            ctaSubtitle: "We're always looking for talented engineers and energy professionals. Send us your resume and we'll keep you in mind for future opportunities.",
            hrEmail: "careers@encotec.com"
          }
        }
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
            heroTitle: "Certifications",
            heroSubtitle: "We hold ourselves to the highest standards of safety, quality, and environmental responsibility",
            backgroundImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2400"
          }
        }
      });

      // 2. TrustStats
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "TrustStats",
          order: 1,
          content: {
            stats1Value: "15", stats1Label: "Years of Excellence",
            stats2Value: "100", stats2Label: "Compliance Rate",
            stats3Value: "50", stats3Label: "Global Audits Passed",
            stats4Value: "23", stats4Label: "Countries Recognized"
          }
        }
      });

      // 3. CertificationsGrid
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CertificationsGrid",
          order: 2,
          content: {
            certificationsList: [
              { title: "ISO 9001:2015", category: "Quality Management", desc: "Ensuring consistent quality in our engineering, procurement, and construction services." },
              { title: "ISO 14001:2015", category: "Environmental Management", desc: "Commitment to minimizing our environmental footprint across all project sites." },
              { title: "ISO 45001:2018", category: "Occupational Health & Safety", desc: "Maintaining the highest standards of workplace safety for our employees and contractors." },
              { title: "ASME 'U' & 'S' Stamps", category: "Boiler & Pressure Vessel", desc: "Authorized to manufacture and assemble power boilers and pressure vessels." },
              { title: "NABL Accreditation", category: "Testing & Calibration", desc: "Recognized competence of our testing and calibration laboratories." },
              { title: "IBR Certification", category: "Indian Boiler Regulations", desc: "Certified as a special class boiler repairer and erector under IBR 1950." }
            ]
          }
        }
      });

      // 4. StrategicPartners
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "StrategicPartners",
          order: 3,
          content: {
            partnersList: [
              { name: "Siemens Energy", monogram: "SE", role: "Gas Turbine Technology" },
              { name: "GE Vernova", monogram: "GE", role: "Power Generation Systems" },
              { name: "BHEL", monogram: "BH", role: "Heavy Electrical Equipment" },
              { name: "NTPC", monogram: "NT", role: "Thermal Power Operations" },
              { name: "L&T Energy", monogram: "LT", role: "EPC & Construction" },
              { name: "Tata Power", monogram: "TP", role: "Integrated Power Solutions" },
              { name: "Adani Power", monogram: "AP", role: "Private Sector Energy" },
              { name: "JSW Energy", monogram: "JW", role: "Diversified Energy Portfolio" }
            ]
          }
        }
      });

      // 5. IndustryMemberships
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "IndustryMemberships",
          order: 4,
          content: {
            membershipsList: [
              { name: "Confederation of Indian Industry (CII)", year: "2010" },
              { name: "Federation of Indian Chambers of Commerce (FICCI)", year: "2012" },
              { name: "Indian Electrical & Electronics Mfrs. Assoc. (IEEMA)", year: "2014" },
              { name: "Central Board of Irrigation and Power (CBIP)", year: "2015" },
              { name: "Independent Power Producers Assoc. (IPPAI)", year: "2016" },
              { name: "Associated Chambers of Commerce (ASSOCHAM)", year: "2018" }
            ]
          }
        }
      });

      // 6. CertificationsCTA
      await prisma.section.create({
        data: {
          pageId: createdPage.id,
          type: "CertificationsCTA",
          order: 5,
          content: {
            ctaHeading: "Partner With Excellence",
            ctaSubtitle: "Experience engineering services backed by global certifications and a commitment to uncompromising quality."
          }
        }
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
            backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400"
          }
        }
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
            infoDesc: "Reach out to our team of experts for project inquiries, strategic partnerships, or to learn more about our engineering capabilities.",
            locationTitle: "Corporate Headquarters",
            addressLine1: "Bandra Kurla Complex, BKC",
            addressLine2: "Mumbai 400051, India",
            phoneNumber: "+91 22 6655 0178",
            emailAddress: "info@encotec.com",
            openingHours: [
              { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST" },
              { days: "Saturday", hours: "9:00 AM - 1:00 PM IST" },
              { days: "Sunday", hours: "Closed" }
            ]
          }
        }
      });
      console.log("Created Contact sections");
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
