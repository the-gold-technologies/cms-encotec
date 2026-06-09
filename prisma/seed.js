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
