const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ==========================================
// PRODUCTION DATA DUMP FROM cms.encotecenergy.com
// ==========================================

const globalConfigData = {
  "id": "global",
  "siteTitle": "Encotec Energy - Power Plant O&M and Engineering Services",
  "siteDescription": "Engineering & Project Management Services",
  "favicon": "https://res.cloudinary.com/nksowtej/image/upload/v1791883261/encotec-Assets/l1f3ivu0zmuwydqdf2yg.png",
  "googleAnalyticsId": "",
  "gtmId": "",
  "searchConsoleId": "",
  "customHeaderScripts": null,
  "customFooterScripts": null,
  "socialLinks": [],
  "canonicalOrdering": "default",
  "sitemapEnabled": true,
  "sitemapCustomContent": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<company>\n    <name>Encotec</name>\n    <website>https://www.example.com</website>\n    <location>Gurugram, India</location>\n\n    <employees>\n        <employee>\n            <id>EMP001</id>\n            <name>John Doe</name>\n            <department>Engineering</department>\n            <designation>Software Engineer</designation>\n            <email>john.doe@example.com</email>\n            <status>Active</status>\n        </employee>\n\n        <employee>\n            <id>EMP002</id>\n            <name>Jane Smith</name>\n            <department>HR</department>\n            <designation>HR Executive</designation>\n            <email>jane.smith@example.com</email>\n            <status>Active</status>\n        </employee>\n\n        <employee>\n            <id>EMP003</id>\n            <name>Rahul Kumar</name>\n            <department>Operations</department>\n            <designation>Operations Manager</designation>\n            <email>rahul.kumar@example.com</email>\n            <status>Inactive</status>\n        </employee>\n    </employees>\n</company>\n",
  "robotsTxt": "This is a dummy text file.\n\nYou can use this file for testing uploads, downloads, or text editor functionality.\n\nSample text:\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nThis is placeholder content and does not contain any real personal information.\n\nEnd of file.\n",
  "schema": null,
  "headingOptions": {
    "heroHeadingTag": "h1"
  }
};

const navLinksData = [
  {
    "id": "cmuoccd4f005blqb6oc3jurs1",
    "label": "About",
    "url": "/about",
    "type": "Main Link",
    "parent": "-",
    "order": 1,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd4k005clqb6ucusm8vc",
    "label": "Services",
    "url": "/services",
    "type": "Dropdown",
    "parent": "-",
    "order": 2,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd4q005dlqb6oub30tkm",
    "label": "Insights",
    "url": "/insights",
    "type": "Dropdown",
    "parent": "-",
    "order": 3,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8w0w0009lq5gbzinkg15",
    "label": "Gallery",
    "url": "/gallery",
    "type": "Main Link",
    "parent": "-",
    "order": 4,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd4u005elqb6m2hdl4qk",
    "label": "Careers",
    "url": "/careers",
    "type": "Main Link",
    "parent": "-",
    "order": 5,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd51005glqb6652b9mer",
    "label": "Leadership",
    "url": "/leadership",
    "type": "Main Link",
    "parent": "-",
    "order": 7,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd53005hlqb6ga2r976u",
    "label": "Contact Us",
    "url": "/contact",
    "type": "Main Link",
    "parent": "-",
    "order": 8,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd55005ilqb6jeohzjhp",
    "label": "Privacy Policy",
    "url": "/privacy-policy",
    "type": "Footer Link",
    "parent": "-",
    "order": 9,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmuoccd5a005jlqb64ee1jx7x",
    "label": "Cookie Policy",
    "url": "/cookie-policy",
    "type": "Footer Link",
    "parent": "-",
    "order": 10,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8w88000alq5gmzzvu3ow",
    "label": "Project Management",
    "url": "/services/project-management",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 1,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8wf9000glq5gxarizpek",
    "label": "Case Studies",
    "url": "/insights/case-studies",
    "type": "Sub-link",
    "parent": "cmuoccd4q005dlqb6oub30tkm",
    "order": 1,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8wgd000hlq5gcfwatp7d",
    "label": "News & Updates",
    "url": "/insights/news-updates",
    "type": "Sub-link",
    "parent": "cmuoccd4q005dlqb6oub30tkm",
    "order": 2,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8w9h000blq5gtuh3svq8",
    "label": "Power Generation (O&M)",
    "url": "/services/power-generation",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 2,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8wam000clq5gj1tlv3m3",
    "label": "Construction, Commissioning & Relocation",
    "url": "/services/construction-commissioning",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 3,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8whh000ilq5g20ibxh3k",
    "label": "Blogs & Articles",
    "url": "/insights/blogs-articles",
    "type": "Sub-link",
    "parent": "cmuoccd4q005dlqb6oub30tkm",
    "order": 3,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8wbs000dlq5gwhbrvavf",
    "label": "Technical Advisory & Performance Audits",
    "url": "/services/technical-advisory",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 4,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8wcw000elq5ggu3r7uyi",
    "label": "Due Diligence & Asset Health",
    "url": "/services/due-diligence",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 5,
    "description": null,
    "title": null,
    "isStatic": true
  },
  {
    "id": "cmv6g8we2000flq5gb05auqah",
    "label": "Value-Added Services",
    "url": "/services/value-added",
    "type": "Sub-link",
    "parent": "cmuoccd4k005clqb6ucusm8vc",
    "order": 6,
    "description": null,
    "title": null,
    "isStatic": true
  }
];

const pagesData = [
  {
    "id": "cmuocccui000olqb6l15k7l44",
    "title": "About Us",
    "slug": "about",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "About Encotec",
    "metaTitle": "About Us - Encotec",
    "metaDescription": "Providing engineering services since 2009",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccul000qlqb6bbmthndx",
        "type": "AboutHero",
        "order": 0,
        "content": {
          "tagline": "About Encotec Energy",
          "description": "A full-spectrum engineering and services company operating across power generation, transmission & distribution, and renewable energy sectors.",
          "headingPart1": "Engineering Excellence,",
          "backgroundImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
          "newsBackgroundImage": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2400",
          "blogsBackgroundImage": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2400",
          "headingItalicHighlight": "Delivered with Ownership",
          "caseStudiesBackgroundImage": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=2400"
        }
      },
      {
        "id": "cmuocccun000slqb6c625jn3l",
        "type": "WhoWeAre",
        "order": 1,
        "content": {
          "tagline": "Who We Are",
          "paragraphs": [
            "At Encotec, we believe that energy infrastructure is about more than just steel and circuits - it is about the responsibility of keeping the world moving. We have evolved from a traditional O&M service provider into a Global Service Provider that offers end-to-end solutions for the entire life of your project.",
            "We approach every plant, every substation, and every utility we manage with what we call an \"Owner's Mindset\". This means we don't just provide a service; we take total responsibility for your assets, treating them with the same care, accountability, and long-term vision as if they were our own."
          ],
          "headingPart1": "Energy is More Than ",
          "heritageTagline": "Our Heritage. Our Future.",
          "headingHighlight": "Just Infrastructure",
          "heritageDescription": "Incorporated in 2009 with operations commencing in 2011, Encotec spent its formative years as a proud member of the German Dornier/VPC Group, inheriting a legacy of rigorous European engineering, precision, and quality. In January 2026, Encotec achieved a historic milestone, transitioning into a 100% independent, Indian-owned enterprise. Today, we offer the global market a rare and powerful combination: the meticulous technical discipline of our European roots, supercharged by the agility, scale, and ingenuity of Indian enterprise. Whether optimizing mega-power plants or managing the critical utilities of international airports, we are proudly Indian, globally benchmarked, and ready to engineer the future of energy and infrastructure."
        }
      },
      {
        "id": "cmuocccup000ulqb6zb7t2scw",
        "type": "MissionVisionValues",
        "order": 2,
        "content": {
          "tagline": "Our Heart and Soul",
          "valuesDesc": "We are defined by Accountability, Innovation, and Total Care. By adopting the owner's perspective, we ensure that safety and efficiency are never compromised.",
          "valuesList": [
            {
              "icon": "ShieldCheck",
              "title": "Safety First (Zero Harm)",
              "description": "Safety is not just a policy; it is our culture. We believe in zero fatalities, zero injuries, and zero excuses. We protect our people, our partners, and the communities we operate in."
            },
            {
              "icon": "BrainCircuit",
              "title": "The Owner's Mindset",
              "description": "We do not just maintain assets; we optimize them. We make proactive, cost-effective decisions as if the facility's balance sheet were our own."
            },
            {
              "icon": "Cog",
              "title": "Engineering Excellence",
              "description": "Born from European precision and powered by Indian innovation, we deliver technically robust, predictable, and world-class solutions to the most complex energy and infrastructure challenges."
            },
            {
              "icon": "HandshakeIcon",
              "title": "Unshakable Integrity",
              "description": "We build trust through transparency. We honor our commitments, maintain strict ethical standards, and operate with absolute honesty in every global market."
            },
            {
              "icon": "Leaf",
              "title": "Sustainable Agility",
              "description": "We are adaptable and forward-looking. From supercritical thermal overhauls and greenfield solar EPC, to managing the utilities of world-class international airports, we continuously evolve our skills to meet the demands of a changing world."
            }
          ],
          "visionDesc": "To be the globally preferred engineering and O&M partner, driving the future of sustainable energy and critical infrastructure through Indian ingenuity and world-class execution.",
          "description": "Our purpose is to bridge the gap between technical complexity and business success.",
          "missionDesc": "To empower the global energy and infrastructure sectors by delivering comprehensive, lifecycle-optimized O&M and EPC solutions. We operate every asset with an 'Owner's Mindset,' ensuring maximum reliability, uncompromising safety, and sustainable value creation for our clients.",
          "valuesTitle": "Core Values",
          "visionTitle": "Vision",
          "missionTitle": "Mission"
        }
      },
      {
        "id": "cmuocccuq000wlqb6qw9alf5a",
        "type": "ScaleImpact",
        "order": 3,
        "content": {
          "stats": [
            {
              "icon": "Users",
              "label": "Manpower",
              "value": "2200+",
              "description": "Dedicated workforce keeping assets safe and productive"
            },
            {
              "icon": "Users",
              "label": "Engineers",
              "value": "350+",
              "description": "Multidisciplinary engineering and technical team"
            },
            {
              "icon": "Briefcase",
              "label": "Industry Experts",
              "value": "25+",
              "description": "Providing high-level expert advisory and operational diagnostics"
            },
            {
              "icon": "Zap",
              "label": "Active O&M",
              "value": "10+ GW",
              "description": "Active power capacity under operation and maintenance stewardship"
            },
            {
              "icon": "Zap",
              "label": "Cumulative Track Record",
              "value": "20+ GW",
              "description": "Cumulative power capacity track record executed across global projects"
            },
            {
              "icon": "ShieldCheck",
              "label": "Certified",
              "value": "Triple ISO",
              "description": "Quality (9001), Environment (14001), Safety (45001)"
            },
            {
              "icon": "Globe",
              "label": "Countries of Operation",
              "value": "5+",
              "description": "Offices and operations across 5+ countries internationally."
            }
          ],
          "heading": "Encotec by the Numbers",
          "footerNote": "Our scale is not just a measure of size, but a reflection of our ability to consistently deliver high-performance outcomes across complex engineering environments.",
          "description": "Our growth is a testament to the trust our partners place in us. As of 2025–26, our impact is felt across the industry."
        }
      },
      {
        "id": "cmuocccus000ylqb6mw2arxfo",
        "type": "Timeline",
        "order": 4,
        "content": {
          "phases": [
            {
              "title": "2011–2012: Construction Beginnings",
              "description": "We began our major journey into the green frontier, successfully contributing to 35+ MW Solar PV projects in Gujarat and 125 MW Solar Thermal projects in Rajasthan."
            },
            {
              "title": "2013 & Beyond: O&M Leadership",
              "description": "Solidified our reputation as top-tier stewards with long-term O&M management contracts, annual maintenance contracts, and overhauling jobs."
            },
            {
              "title": "2018-2026: Supercritical Excellence",
              "description": "Embarked on our flagship O&M partnerships for the 2x700 MW supercritical power plant at Nabha Power / Rajpura, 2x660 MW supercritical power plant at Jhajjar, and recently took over complete O&M of BTG+BOP+C&I systems for 3x660 MW supercritical units at PPGCL, Prayagraj (Tata Power)."
            },
            {
              "title": "2018 & Beyond: Environmental",
              "description": "Delivering a sustainable, cleaner industrial future by helping industries meet stringent environmental standards through specialized FGD O&M excellence."
            },
            {
              "title": "2021: Going Global",
              "description": "Took our expertise global, managing critical commissioning projects internationally."
            },
            {
              "title": "2021 & Beyond: New Chapters",
              "description": "We provide specialized utility management for major international airports, including Indira Gandhi International Airport, Delhi (DIAL) and the newly inaugurated Noida International Airport (NIA)."
            }
          ],
          "heading": "A Timeline of Growth",
          "tagline": "Our Journey",
          "description": "We have spent over a decade building a legacy of excellence, one project at a time."
        }
      },
      {
        "id": "cmuocccut0010lqb62v0eu877",
        "type": "Sustainability",
        "order": 5,
        "content": {
          "focuses": [
            "Specialized energy audits by our in-house Encotec team to identify savings and reduce carbon footprints",
            "Residual Life Assessments (RLA) to help owners revitalize older plants for improved efficiency and environmental compliance",
            "ISO 14001 environmental management integrated into daily operations across all sites",
            "Supporting the transition from traditional power to a sustainable, renewable future"
          ],
          "heading": "Committed to a Greener Tomorrow",
          "tagline": "ESG Commitment",
          "footerNote": "Our approach ensures that sustainability is not an afterthought, but an integral part of how we design, execute, and operate energy systems.",
          "paragraphs": [
            "Sustainability is not a policy at Encotec; it is our promise. We are committed to sustainable development by integrating high standards of environmental management into everything we do.",
            "Our in-house Encotec team conducts  energy audits to identify savings and reduce the carbon footprints of operational plants. Through our expert advisory and Residual Life Assessments (RLA), we help owners revitalize old plants, making them more efficient and environmentally compliant."
          ]
        }
      },
      {
        "id": "cmuocccuv0012lqb6hqujefje",
        "type": "GlobalPresence",
        "order": 6,
        "content": {
          "areas": [
            {
              "desc": "Turkey, UAE, Indonesia, Vietnam, Germany",
              "title": "International Operations"
            },
            {
              "desc": "Noida, India",
              "title": "Headquarters"
            }
          ],
          "tagline": "Our Reach",
          "areaDesc0": "Turkey, UAE, Indonesia, Vietnam, Germany",
          "areaDesc1": "Noida, India",
          "areaTitle0": "International Operations",
          "areaTitle1": "Headquarters",
          "calloutDesc": "We combine local execution strength with global engineering expertise, ensuring that we bring the same \"Owner's Mindset\" to every project, no matter the geography.",
          "description": "While our headquarters is in Noida, our footprint spans the world. In India, we are present in 13+ locations. Internationally, we have established strong roots in Turkey, the UAE, Indonesia, Vietnam, and Germany, ensuring that wherever infrastructure needs stewardship, Encotec is there.",
          "calloutTitle": "Wherever Energy is Needed",
          "headingPart1": "A Global Presence",
          "headingHighlight": "with a Local Touch"
        }
      },
      {
        "id": "cmuocccuw0014lqb6rldxvosr",
        "type": "Leadership",
        "order": 7,
        "content": {
          "heading": "Leadership Team",
          "leaders": [
            {
              "bio": "Arun Kumar Sarna is the Founder and CEO of Encotec Energy India, driving the company's vision to deliver comprehensive \"shovel-to-socket\" energy solutions globally. Under his leadership, Encotec has expanded across Thermal Power, Solar PV, and EHV Transmission & Distribution, embedding a signature \"Owner’s Mindset\" into the company's DNA.\n\nA pioneer in third-party O&M contracts in India, Mr. Sarna brings 40+ years of experience managing World Bank, KfW, and Japanese agency mega-projects. Globally, he has advised ESKOM (South Africa) and directed operations across Vietnam, Indonesia, and the Middle East.\n\nHe holds a Mechanical Engineering degree, a Master’s in Metallurgy from IIT Roorkee, and a PGDM from MDI Gurgaon, with executive certifications from Harvard Business School and IIT Mumbai.",
              "name": "Arun Kumar Sarna",
              "role": "Managing Director",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883255/encotech/leadership/arun_kumar_sarna_white_bg.jpg"
            },
            {
              "bio": "Rajan Saxena is a senior energy-sector leader with 47 years of experience across thermal power, T&D, O&M services, plant overhauling, and Solar PV EPC. As Director at Encotec, he oversees operations, spare parts supply, modernization, and substation erection.\n\nPrior to Encotec, Mr. Saxena held senior leadership roles at global energy majors including GE T&D India, AREVA / Alstom, Skoda Power, DLF Power, and BHEL.\n\nHis expertise spans managing large service portfolios, full P&L accountability, EPC project execution, global procurement, logistics, and specialized repair facilities.",
              "name": "Rajan Saxena",
              "role": "Director",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883256/encotech/leadership/rajan_saxena_white_bg.jpg"
            },
            {
              "bio": "Rajeev Ahuja brings 38+ years of engineering and business management experience in the power and industrial sectors. As Director at Encotec, he leads corporate strategy, high-value contract bidding, proposals, commercial management, HR, Finance & Accounts, and P&L accountability.\n\nHe previously served in senior leadership roles at STEAG Energy Services India and Nicco Engineering, managing complete business cycles from opportunity identification to contract closeout.\n\nMr. Ahuja holds a Mechanical Engineering degree with international technical and business training in the UK and Thailand, having built and led BD teams of 25+ professionals.",
              "name": "Rajeev Ahuja",
              "role": "Director",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883215/encotech/leadership/rajeev_ahuja_white_bg.jpg"
            }
          ],
          "description": "Experienced leaders driving operational excellence and strategic growth"
        }
      },
      {
        "id": "cmuocccux0016lqb6yvow5hfs",
        "type": "ClosingStatement",
        "order": 8,
        "content": {
          "ctaUrl": "/contact",
          "ctaLabel": "Partner With Us",
          "description": "- not just at commissioning, but throughout the lifecycle of every asset.",
          "headingPart1": "Encotec integrates ",
          "headingPart2": " to deliver solutions that perform",
          "headingHighlight": "engineering expertise, execution capability, and operational excellence"
        }
      }
    ]
  },
  {
    "id": "cmv6g7hnr0002lq5ggualc7qm",
    "title": "Blogs & Articles",
    "slug": "blogs-articles",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "published",
    "isStatic": false,
    "description": null,
    "metaTitle": "Blogs & Articles - Encotec",
    "metaDescription": "Industry perspectives, technical deep dives, and expert articles from Encotec.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": []
  },
  {
    "id": "cmuocccwc0021lqb6wb77v23x",
    "title": "Careers",
    "slug": "careers",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Join our team",
    "metaTitle": "Careers - Encotec",
    "metaDescription": "Build your engineering career with us",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccwe0023lqb6muvva6u4",
        "type": "CareersHero",
        "order": 0,
        "content": {
          "heroTitle": "SHAPE THE FUTURE OF GLOBAL ENERGY",
          "badge1Text": "350+ Engineers & 2200+ Manpower",
          "badge2Text": "Offices & Operations in 5+ Countries",
          "heroTagline": "CAREERS AT ENCOTEC",
          "heroSubtitle": "Join a team of world-class engineers and energy professionals delivering critical infrastructure with offices and operations across 5+ countries.",
          "backgroundImage": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2400"
        }
      },
      {
        "id": "cmuocccwi0025lqb6h8v4mzl6",
        "type": "CareersCulture",
        "order": 1,
        "content": {
          "cultureImage": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1200",
          "culturePara1": "At Encotec, we don't just build power plants; we engineer the foundation of modern society. Our team works on some of the most complex and critical energy infrastructure projects globally, from massive supercritical thermal plants to utility-scale renewable energy parks.",
          "culturePara2": "We foster a culture of technical excellence, continuous learning, and collaborative problem-solving. When you join Encotec, you gain global exposure, working alongside industry veterans who are passionate about mentoring the next generation of engineering leaders.",
          "cultureQuote": "We empower our engineers to take ownership, innovate, and deliver solutions that have a tangible impact on global energy security.",
          "cultureHeading": "Engineering Careers That Matter",
          "cultureTagline": "WHY JOIN US"
        }
      },
      {
        "id": "cmuocccwk0027lqb6gtnei3tn",
        "type": "CareersBenefits",
        "order": 2,
        "content": {
          "heading": "Benefits & Perks",
          "tagline": "WHAT WE OFFER",
          "benefitsList": [
            {
              "title": "Global Exposure",
              "description": "Work on critical energy infrastructure projects across 5+ countries with diverse international teams."
            },
            {
              "title": "Technical Growth",
              "description": "Access to cutting-edge technologies, specialized training, and continuous learning programs."
            },
            {
              "title": "Competitive Compensation",
              "description": "Industry-leading salary packages with performance-based bonuses and comprehensive benefits."
            },
            {
              "title": "Health & Wellness",
              "description": "Comprehensive medical insurance, wellness programs, and support for physical and mental health."
            },
            {
              "title": "Work-Life Balance",
              "description": "Flexible working arrangements, generous leave policies, and a supportive team environment."
            },
            {
              "title": "Career Progression",
              "description": "Clear growth paths, leadership development, and mentorship from seasoned industry veterans."
            }
          ]
        }
      },
      {
        "id": "cmuocccwo0029lqb64fo9s4io",
        "type": "CareersOpenPositions",
        "order": 3,
        "content": {
          "heading": "Current Openings",
          "jobsList": [
            {
              "dept": "HR",
              "desc": [
                {
                  "text": "Focuses on supporting day-to-day corporate HR operations, driving candidate sourcing pipelines, managing employee onboarding workflows, and maintaining accurate centralized HR data ecosystems.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "End-to-End Recruitment Support: Source active resumes from job portals, perform preliminary HR screening, coordinate interview schedules with technical line managers, and manage logistics for corporate selection drives.",
                    "Onboarding & Offboarding: Manage the corporate joining documentation process, execute structural employee orientation, create master employee profiles, and process employee exit/full-and-final settlement formalities.",
                    "HRIS & Data Management: Update and maintain the organization-wide Human Resources Information System (HRIS) with high accuracy regarding employee master records, leaves, attendance, and confirmation dates.",
                    "Employee Engagement Logistics: Assist in organizing corporate town halls, training deployment schedules, employee wellness activities, and company-wide festive celebrations.",
                    "Vendor & Billing Coordination: Track and process invoices from recruitment consultants, background verification agencies, training partners, and corporate insurance vendors for timely approval."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: MBA / PGDM in Human Resources / Industrial Relations from a recognized institute or university.",
                    "Experience: 2 to 5 years of corporate HR operations experience, preferably in infrastructure, energy, or engineering companies."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "High proficiency in Microsoft Excel and HRIS software, good verbal and written communication, active multitasking capabilities, and meticulous attention to detail."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Sr. HR Executive / HR Executive – Corporate Office",
              "location": "Corporate Office, Noida"
            },
            {
              "dept": "HR",
              "desc": [
                {
                  "text": "Focuses on daily time-office operations, assisting with contractor labor tracking, processing local compliance documentation registers, and managing site administrative facilities.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Time-Office & Attendance Management: Monitor daily biometric access logs, track plant shift rosters, maintain manual attendance registers for audit verification, and report daily manpower availability summaries to the Site HR Manager.",
                    "Contract Labor Verification: Assist in verifying contractor gate passes, checking physical worker counts against deployed rosters, and ensuring contractor statutory compliance documents (PF/ESIC chalans, insurance copies) are in order before processing invoices.",
                    "Statutory Documentation: Maintain all structural statutory registers, files, and cards mandatory under the Factories Act and Contract Labor (Regulation & Abolition) Act to ensure 100% readiness for surprise government inspections.",
                    "Site Welfare Coordination: Conduct daily inspections of site facility centers including checking canteen hygiene/food quality, workplace drinking water availability, and general first-aid/medical room inventories.",
                    "Local Administration Support: Coordinate site vehicle logistics, organize personal protective equipment (PPE) distribution camps, manage office stationary inventories, and issue basic site communication circulars under management guidance."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: Graduate with a Post Graduate Diploma in HR / IR, or a Bachelor of Business Administration (BBA) in HR.",
                    "Experience: 2 to 4 years of plant-level or industrial project site experience, ideally in thermal power plants, construction projects, or manufacturing heavy industries."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Knowledge of the local language (highly essential for worker communication), familiarity with basic factory labor rules, resilience to working in heavy plant environments, and basic computer proficiency."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Sr. HR Executive / HR Executive – Site HR & Administration",
              "location": "Thermal Power Plant Sites PAN India"
            },
            {
              "dept": "Finance & Accounts",
              "desc": [
                {
                  "text": "Focuses on corporate financial management, statutory compliance, and contractual financial governance. This role acts as a bridge between the corporate office and multiple thermal power plant O&M sites, ensuring financial discipline, optimizing cash flows for plant shutdowns, and driving profitability tracking against site-specific SLAs.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "SLA Monitoring: Interpret O&M Service Level Agreements (SLAs) to track escalation clauses, bonus incentives, and penalty provisions.",
                    "Billing & Realization: Oversee the end-to-end commercial billing cycle for multiple power utility clients; ensure timely payment realization and manage outstanding ageings.",
                    "Site Financial Control: Supervise site-level accountants to ensure inventory tracking (spares/consumables) and mobilization expenses match corporate policies.",
                    "O&M Budgeting: Drive the formulation of annual corporate and individual plant O&M operating budgets.",
                    "Variance Analysis: Provide monthly variance analysis detailing plant overhauling costs, variable maintenance costs, and employee overheads.",
                    "Profitability Reviews: Present site-wise gross margin and EBITDA analysis to the executive leadership team.",
                    "Tax Governance: Manage direct and indirect tax compliances, with specific focus on GST for long-term service contracts, TDS, and corporate tax provisions.",
                    "Audit Leadership: Lead statutory, internal, and cost audit processes; resolve complex accounting issues under applicable frameworks (Ind AS / IFRS).",
                    "Working Capital: Optimize corporate cash flow cycles, keeping a buffer for emergency plant maintenance or forced shutdowns."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: CA, ICWA, MBA in Finance.",
                    "Experience Range: 5 to 10 years of robust post-qualification experience.",
                    "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "System Expertise: Advanced hands-on experience in SAP (FICO module) or Oracle ERP.",
                    "Leadership: Demonstrated ability to manage, mentor, and review the work of a team of junior accountants and site finance teams.",
                    "Analytical Polish: Expert level proficiency in financial reporting frameworks and advanced Excel modeling."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Assistant Manager / Manager – Finance & Accounts",
              "location": "Corporate Office, Noida"
            },
            {
              "dept": "EHS",
              "desc": [
                {
                  "text": "Focuses on directing, designing, and governing the Environment, Health, and Safety (EHS) strategy across all operational thermal power plant O&M sites. Operating from the Corporate Office, this senior leadership role is responsible for establishing a zero-harm safety culture, standardizing high-risk safety protocols (e.g., confined spaces, hazardous energy control/LOTO, heavy lifting), ensuring stringent statutory compliance, and leading corporate EHS audits to protect workforce integrity and mitigate operational risk.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
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
                    "Oversee contractor safety management programs, ensuring third-party workforce compliance matches internal company benchmarks."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: Bachelor’s degree in engineering (Mechanical or Electrical), Post Graduate Diploma or Degree in Industrial Safety from a government-recognized institute, or globally recognized safety qualifications such as NEBOSH International Diploma, CSP, or certified ISO 45001 / 14001 Lead Auditor status.",
                    "Experience Range: 15 to 18 years of robust post-qualification experience.",
                    "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Demonstrated mastery over high-risk engineering controls, thermal plant process hazards, and contractor safety governance systems.",
                    "Outstanding leadership, executive presence, and persuasive capability to enforce uncompromising safety compliance at all tiers of organization.",
                    "Strong digital competency in managing integrated EHS software platforms and modern field inspection applications."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Head – Corporate Safety (EHS)",
              "location": "Corporate Office, Noida"
            },
            {
              "dept": "Contracts & Materials",
              "desc": [
                {
                  "text": "Focuses on corporate end-to-end supply chain architecture, strategic sourcing, and contract governance lifecycle for multiple thermal power plant O&M sites. This corporate role ensures optimal materials availability (critical spares, boiler/turbine consumables, chemical reagents) while strictly controlling lifecycle costs, optimizing inventory parameters, and drafting ironclad service level contracts to eliminate plant down-time risks.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Corporate Category Management: Lead procurement strategy for specialized thermal power plant components, including Boiler Pressure Parts, Turbine auxiliaries, Coal Handling Plant (CHP) spares, and Ash Handling System components.",
                    "Vendor Lifecycle Ecosystem: Establish, evaluate, and scale an elite panel of approved vendors to optimize procurement lead times and lower TCO.",
                    "High-Value Technical Commercial Floating: Draft complex Request for Proposals (RFPs) and Tenders; organize comprehensive techno-commercial bid evaluations to finalize annual rate contracts.",
                    "O&M Sub-contracting Lifecycle: Formulate, negotiate, and execute specialized back-to-back sub-contracts for annual plant overhauling, major shutdowns, structural fabrications, non-destructive testing (NDT), and annual maintenance contracts (AMCs).",
                    "Risk & Indemnity Administration: Structurally build crucial risk mitigation clauses into contracts, including Liquidation Damages (LD), force majeure parameters, safety penalization matrices, and strict defect liability periods.",
                    "Claim Management & Resolution: Act as the corporate focal point to evaluate and process change order variants, contract amendments, contractual escalations, and commercial dispute reviews.",
                    "Corporate Materials Control: Implement corporate standardization matrices (Min-Max parameters, Reorder Points, and Safety Stock levels) across all operating sites to maximize material availability while preventing capital deadlocks.",
                    "Scrap & CAPEX Logistics: Formulate corporate directives for T&Ps retirement and inventory write-offs."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: Bachelor’s degree in engineering (Mechanical or Electrical or Instrumentation), Post Graduate Diploma or Degree in Supply Chain Management, Materials Management or equivalent MBA.",
                    "Experience Range: 5 to 10 years of robust post-qualification experience.",
                    "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "ERP Expertise: Advanced, fluent transactional mastery within the SAP MM/Ariba or Oracle SCM or equivalent enterprise systems.",
                    "Legal Exposure: Comprehensive grip over Indian Contract Act provisions, commercial taxation codes (GST structures for goods vs composite services), and international incoterms.",
                    "Negotiation Savvy: Refined executive presence, cross-functional collaboration capabilities, and sharp, data-driven cost-benefit analysis skills."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Assistant Manager / Manager – Contracts & Materials Management",
              "location": "Corporate Office, Noida"
            },
            {
              "dept": "Project Management",
              "desc": [
                {
                  "text": "Focuses on managing operational readiness, resource scheduling, contractual health, and governance for a portfolio of operating thermal power plants. This role coordinates closely with site O&M heads, technical service teams, and client representatives to ensure high plant availability, strict SLA compliance, and smooth site mobilization.",
                  "type": "paragraph"
                },
                {
                  "text": "Key Responsibilities",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Operational Readiness: Design and execute standard corporate frameworks for mobilizing new O&M site contracts.",
                    "Resource Deployment: Coordinate with HR, Procurement, and technical wings to ensure deployment of tools, plants, consumables and qualified manpower during the transition phase.",
                    "SOP Implementation: Deploy corporate operational guidelines, safety protocols, and maintenance management workflows at new sites.",
                    "Performance Tracking: Monitor site-level Key Performance Indicators (KPIs) including Plant Availability Factor (PAF), Heat Rate, Auxiliary Power Consumption (APC), and specific oil/coal consumption.",
                    "Commercial Interface: Identify variations in contract scopes, prepare claims for extra works, and manage mitigation pathways for Liquidated Damages (LD) risks.",
                    "Client Relationship: Conduct monthly and quarterly project review meetings with clients.",
                    "Turnaround Scheduling: Lead the corporate planning team to review and optimize master schedules using Primavera P6 or MS Project for major boiler and turbine overhauls.",
                    "Cross-Site Allocation: Orchestrate the movement of critical specialized tooling, testing equipment, and expert task forces across different operating sites to minimize shutdown days.",
                    "Risk Management: Maintain a corporate risk register for all running projects, identifying bottlenecks in spares availability or technical challenges ahead of time."
                  ]
                },
                {
                  "text": "Qualifications & Requirements",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Education: Bachelor’s degree in engineering (Mechanical or Electrical or Instrumentation), PMP (Project Management Professional) certification shall be an added advantage.",
                    "Experience Range: 8 to 15 years of robust post-qualification experience.",
                    "Industry Focus: Proven track record in corporate offices or large units within the Power Sector, Infrastructure, EPC, or heavy engineering O&M companies."
                  ]
                },
                {
                  "text": "Core Competencies",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Software Tools: High proficiency in Primavera P6, MS Project, and enterprise resource platforms like SAP (Project System - PS / Plant Maintenance - PM modules).",
                    "Analytical Skills: Strong capability in reviewing commercial contracts, evaluating techno-commercial variations, and reading engineering layouts.",
                    "Leadership & Mobility: Exceptional cross-functional leadership skills; ability to influence site teams and willingness to travel frequently to power plant locations for operational reviews."
                  ]
                }
              ],
              "type": "Full-time",
              "title": "Project Manager",
              "location": "Corporate Office, Noida"
            }
          ]
        }
      },
      {
        "id": "cmuocccwv002blqb6sxme02w1",
        "type": "CareersGallery",
        "order": 4,
        "content": {
          "heading": "Life at Encotec",
          "tagline": "INSIDE ENCOTEC",
          "galleryList": [
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883264/encotec-Assets/culture/encotec_team_collab.jpg",
              "caption": "Technical Schematics & Site Collaboration"
            },
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883265/encotec-Assets/culture/encotec_control_room.jpg",
              "caption": "SCADA & DCS Control Room Operations"
            },
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883266/encotec-Assets/culture/encotec_site_inspection.jpg",
              "caption": "Substation & Transmission Inspection"
            },
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883267/encotec-Assets/culture/encotec_field_operations.jpg",
              "caption": "Precision Turbine & Generator Overhaul"
            },
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883268/encotec-Assets/culture/encotec_solar_inspection.jpg",
              "caption": "Utility-Scale Solar Farm Diagnostics"
            },
            {
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883270/encotec-Assets/culture/encotec_project_review.jpg",
              "caption": "Engineering & Project Reviews"
            }
          ]
        }
      },
      {
        "id": "cmuocccwy002dlqb6zb8d7fsz",
        "type": "CareersProcess",
        "order": 5,
        "content": {
          "heading": "How to Join Us",
          "processSteps": [
            {
              "title": "Apply Online",
              "description": "Submit your resume and cover letter through our portal."
            },
            {
              "title": "Initial Screening",
              "description": "Our HR team reviews your application within 5 business days."
            },
            {
              "title": "Technical Interview",
              "description": "Meet with our engineering leads for a technical discussion."
            },
            {
              "title": "Final Offer",
              "description": "Receive your offer and begin your journey with Encotec."
            }
          ]
        }
      },
      {
        "id": "cmuocccx3002flqb6kfe0xnti",
        "type": "CareersCTA",
        "order": 6,
        "content": {
          "hrEmail": "careers@encotecenergy.com",
          "ctaHeading": "Don't See the Right Role?",
          "ctaSubtitle": "We're always looking for talented engineers and energy professionals. Send us your resume and we'll keep you in mind for future opportunities."
        }
      }
    ]
  },
  {
    "id": "cmv6g7hih0000lq5gfqflkd8z",
    "title": "Case Studies",
    "slug": "case-studies",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "published",
    "isStatic": false,
    "description": null,
    "metaTitle": "Case Studies - Encotec",
    "metaDescription": "Explore our detailed engineering and operational case studies.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": []
  },
  {
    "id": "cmuoccd060043lqb6w0veenxr",
    "title": "Construction, Commissioning & Relocation",
    "slug": "construction-commissioning",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Construction, commissioning, and relocation services.",
    "metaTitle": "Construction, Commissioning & Relocation | Encotec",
    "metaDescription": "Turnkey construction, erection, commissioning, synchronization, and plant relocation services for power and industrial infrastructure.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": [
      {
        "id": "cmuoccd0a0045lqb6yvwi6jir",
        "type": "ConstructionHero",
        "order": 0,
        "content": {
          "label": "CONSTRUCTION, COMMISSIONING & RELOCATION",
          "description": "At Encotec, we thrive on the challenge of \"physical realization\". From the massive IBR piping of a thermal plant to the precision mounting of solar modules, we bring your assets online with speed and safety.",
          "headingPart1": "Bringing Complex ",
          "headingHighlight": "Infrastructure to Life"
        }
      },
      {
        "id": "cmuoccd0d0047lqb6okbqw4uq",
        "type": "CapabilitiesSection",
        "order": 1,
        "content": {
          "heading": "Physical Realization at Scale",
          "description": "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
          "capabilities": [
            {
              "icon": "HardHat",
              "title": "Multi-Sector Expertise",
              "description": "We have delivered construction excellence across thermal power, solar PV, and wind projects globally. Our teams handle everything from civil works to complex mechanical erection."
            },
            {
              "icon": "FileCheck",
              "title": "Technical Due Diligence",
              "description": "We provide independent technical audits for plant acquisitions, helping you understand the true value, operational risks, and hidden costs of an investment."
            },
            {
              "icon": "RefreshCw",
              "title": "Restoration Strategy",
              "description": "For older plants, we provide comprehensive revamping and restoration plans to improve performance, extend lifecycle, and meet environmental standards."
            }
          ]
        }
      },
      {
        "id": "cmuoccd0h0049lqb6ga02kbdb",
        "type": "ValueProtection",
        "order": 2,
        "content": {
          "bullets": [
            "Structural integrity and material degradation",
            "Historical O&M records and failure analysis",
            "Environmental compliance and emissions",
            "Control system obsolescence",
            "Thermodynamic performance baseline"
          ],
          "paragraphs": [
            "Acquiring or relocating an industrial asset involves significant capital risk. Without a clear understanding of the asset's true condition, you may be inheriting expensive liabilities.",
            "Our independent technical audits provide the objective data you need to negotiate effectively, plan capital expenditures accurately, and ensure that your investment will deliver the expected returns over its intended lifecycle."
          ],
          "headingPart1": "Protecting Your ",
          "bulletHeading": "What We Evaluate",
          "headingHighlight": "Investment"
        }
      },
      {
        "id": "cmuoccd0m004blqb64g3xw89o",
        "type": "ProcessFlow",
        "order": 3,
        "content": {
          "steps": [
            {
              "desc": "Precision teardown",
              "icon": "Settings",
              "title": "Dismantle"
            },
            {
              "desc": "Global logistics",
              "icon": "Truck",
              "title": "Transport"
            },
            {
              "desc": "Expert installation",
              "icon": "HardHat",
              "title": "Erect"
            },
            {
              "desc": "Grid sync & testing",
              "icon": "Zap",
              "title": "Commission"
            }
          ],
          "bullets": [
            "Detailed dismantling protocols and tagging",
            "Logistics planning and customs clearance support",
            "Refurbishment of critical components during transit",
            "Re-erection and synchronization at the new site"
          ],
          "description": "Asset relocation is a highly specialized service that requires meticulous planning, precise execution, and deep engineering knowledge. Encotec is one of the few global providers with a proven track record in cross-border plant relocations.",
          "headingPart1": "The Relocation ",
          "headingHighlight": "Advantage"
        }
      },
      {
        "id": "cmuoccd0p004dlqb67wmig506",
        "type": "CTASection",
        "order": 4,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Planning an Acquisition or Relocation?",
          "ctaLabel": "Request an Assessment",
          "description": "Get the technical truth about your assets before you make a decision."
        }
      }
    ]
  },
  {
    "id": "cmuocccxw002vlqb6won9lkf2",
    "title": "Contact",
    "slug": "contact",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Contact us",
    "metaTitle": "Contact Us - Encotec",
    "metaDescription": "Get in touch with Encotec",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccy0002xlqb676chl1f7",
        "type": "ContactHero",
        "order": 0,
        "content": {
          "tagline": "Get in Touch",
          "headingPart1": "Let's Build the Future of",
          "heroSubtitle": "Reach out to our team of experts for project inquiries, strategic partnerships, or to learn more about our engineering capabilities.",
          "backgroundImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400",
          "headingItalicHighlight": "Energy Together"
        }
      },
      {
        "id": "cmuocccy3002zlqb6fjc2zkoi",
        "type": "ContactInfo",
        "order": 1,
        "content": {
          "infoDesc": "Reach out to our team of experts for project inquiries, strategic partnerships, or to learn more about our engineering capabilities.",
          "formHeading": "Send us a message",
          "infoHeading": "Get in",
          "phoneNumber": "+91 120 4155612",
          "addressLine1": "C-85, Sector-63",
          "addressLine2": "Noida - 201 301, Uttar Pradesh, India",
          "careersLabel": "Careers",
          "emailAddress": "sales@encotecenergy.com",
          "messageLabel": "Message *",
          "openingHours": [
            {
              "days": "Monday - Friday",
              "hours": "9:00 AM - 6:00 PM IST"
            },
            {
              "days": "Saturday",
              "hours": "9:00 AM - 1:00 PM IST"
            },
            {
              "days": "Sunday",
              "hours": "Closed"
            }
          ],
          "subjectLabel": "Subject *",
          "fullNameLabel": "Full Name *",
          "locationTitle": "Corporate Headquarters",
          "companyNameLabel": "Company Name",
          "phoneNumberLabel": "Phone Number",
          "emailAddressLabel": "Email Address *",
          "infoHeadingItalic": "Touch",
          "quickContactTitle": "Quick Contact",
          "submitButtonLabel": "Send Message",
          "businessHoursTitle": "Business Hours",
          "messagePlaceholder": "How can we help you?",
          "careersEmailAddress": "careers@encotecenergy.com",
          "fullNamePlaceholder": "John Doe",
          "selectSubjectDefault": "Select a subject",
          "generalInquiriesLabel": "General Inquiries",
          "companyNamePlaceholder": "Company Ltd.",
          "phoneNumberPlaceholder": "+1 (555) 000-0000",
          "emailAddressPlaceholder": "john@company.com"
        }
      }
    ]
  },
  {
    "id": "cmuoccd420058lqb6uxugm36z",
    "title": "Cookie Policy",
    "slug": "cookie-policy",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Cookie Policy and Privacy Preferences for Encotec Energy website.",
    "metaTitle": "Cookie Policy - Encotec Energy (India)",
    "metaDescription": "Overview of cookies, statistical tracking, and privacy preference settings on Encotec Energy website.",
    "targetKeywords": "cookie policy, cookies, privacy preference, essential cookies, statistics cookies, borlabs cookie",
    "canonicalUrl": "https://www.encotecenergy.com/en/cookie-policy/",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": "Cookie Policy - Encotec Energy (India)",
    "ogDescription": "Information about cookies and managing privacy preferences on Encotec Energy.",
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuoccd48005alqb6f4d1aypw",
        "type": "CookieContent",
        "order": 0,
        "content": {
          "headline": "Cookie Policy",
          "breadcrumb": "Start / Cookie Policy",
          "contentBlocks": [
            {
              "text": "Privacy Preference & Cookies Overview",
              "type": "heading"
            },
            {
              "text": "We use cookies on our website www.encotecenergy.com. Some of them are essential, while others help us to improve this website and your experience.",
              "type": "paragraph"
            },
            {
              "text": "Essential Cookies (Always Active)",
              "type": "heading"
            },
            {
              "type": "list",
              "items": [
                "encotec-consent — Provider: Encotec Energy (India) Pvt. Ltd. — Purpose: Remembers visitor privacy and cookie consent preferences — Duration: 1 Year",
                "session_id — Provider: Encotec Energy (India) Pvt. Ltd. — Purpose: Maintains secure session state during form submissions — Duration: Session"
              ]
            },
            {
              "text": "Statistics & Performance Cookies (Optional)",
              "type": "heading"
            },
            {
              "type": "list",
              "items": [
                "Google Tag Manager / Google Analytics (_ga, _gat, _gid, gtag) — Provider: Google Ireland Limited — Purpose: Anonymous visitor traffic statistics — Duration: 2 Years / 24 Hours"
              ]
            },
            {
              "text": "Browser Configuration & Disabling Cookies",
              "type": "heading"
            },
            {
              "type": "list",
              "items": [
                "Chrome: Settings > Privacy and security > Third-party cookies",
                "Firefox: Settings > Privacy & Security > Cookies and Site Data",
                "Safari: Preferences > Privacy > Block all cookies",
                "Edge: Settings > Cookies and site permissions"
              ]
            },
            {
              "text": "Contact & Inquiries",
              "type": "heading"
            },
            {
              "text": "Encotec Energy (India) Pvt. Ltd.\nC-85, Sector-63, Noida-201 301, Uttar Pradesh, India\nPhone: +91 120 4155612 | Email: rajeev.ahuja@encotecenergy.com",
              "type": "quote"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "cmuoccd1y004nlqb6rnwv1uq9",
    "title": "Due Diligence & Asset Health",
    "slug": "due-diligence",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Due diligence and asset health evaluation services.",
    "metaTitle": "Due Diligence & Asset Health | Encotec",
    "metaDescription": "Independent technical due diligence, residual life assessments (RLA), and health evaluations for power and infrastructure assets.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": [
      {
        "id": "cmuoccd28004plqb6cw9a79r2",
        "type": "DueDiligenceHero",
        "order": 0,
        "content": {
          "label": "Due Diligence & Asset Health",
          "description": "Before you buy an old plant or decide to move one, you need to know if it's fit for the future. Our due diligence services provide the technical truth about your assets.",
          "headingPart1": "Making Informed Decisions ",
          "headingHighlight": "For the Long Term"
        }
      },
      {
        "id": "cmuoccd2f004rlqb6d3ngn8cv",
        "type": "HealthFeatures",
        "order": 1,
        "content": {
          "features": [
            {
              "icon": "Activity",
              "title": "Residual Life Assessment (RLA)",
              "description": "We conduct exhaustive studies to determine how many more years of efficient life your plant equipment actually has, helping you plan for replacements or upgrades."
            },
            {
              "icon": "FileCheck",
              "title": "Technical Due Diligence",
              "description": "We provide independent technical audits for plant acquisitions, helping you understand the true value, operational risks, and hidden costs of an investment."
            },
            {
              "icon": "RefreshCw",
              "title": "Restoration Strategy",
              "description": "For older plants, we provide comprehensive revamping and restoration plans to improve performance, extend lifecycle, and meet environmental standards."
            }
          ]
        }
      },
      {
        "id": "cmuoccd2h004tlqb6ui5fcd3t",
        "type": "ValueProtection",
        "order": 2,
        "content": {
          "bullets": [
            "Structural integrity and material degradation",
            "Historical O&M records and failure analysis",
            "Environmental compliance and emissions",
            "Control system obsolescence",
            "Thermodynamic performance baseline"
          ],
          "paragraphs": [
            "Acquiring or relocating an industrial asset involves significant capital risk. Without a clear understanding of the asset's true condition, you may be inheriting expensive liabilities.",
            "Our independent technical audits provide the objective data you need to negotiate effectively, plan capital expenditures accurately, and ensure that your investment will deliver the expected returns over its intended lifecycle."
          ],
          "headingPart1": "Protecting Your ",
          "bulletHeading": "What We Evaluate",
          "headingHighlight": "Investment"
        }
      },
      {
        "id": "cmuoccd2m004vlqb6508yufq0",
        "type": "CTASection",
        "order": 3,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Planning an Acquisition or Relocation?",
          "ctaLabel": "Request an Assessment",
          "description": "Get the technical truth about your assets before you make a decision."
        }
      }
    ]
  },
  {
    "id": "cmv0if8100004lq96qaobnhuc",
    "title": "Gallery",
    "slug": "gallery",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "published",
    "isStatic": false,
    "description": null,
    "metaTitle": "Gallery - Encotec",
    "metaDescription": "Our project gallery and visual showcase",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": [
      {
        "id": "cmv6g7vrp0004lq5gdteue2gx",
        "type": "GalleryHero",
        "order": 0,
        "content": {
          "tagline": "VISUAL SHOWCASE",
          "heroTitle": "POWER, PRECISION & FIELD MASTERY",
          "tab1Label": "3500+ MW Managed",
          "tab2Label": "350+ Engineers",
          "tab3Label": "Global Footprint",
          "heroSubtitle": "Explore our operations across landmark power generation facilities, critical infrastructure overhauls, high-voltage transmission networks, and global engineering sites worldwide.",
          "backgroundImage": "https://res.cloudinary.com/nksowtej/image/upload/v1791883271/encotec-Assets/hero/supercritical_thermal_plant.jpg"
        }
      },
      {
        "id": "cmv6g7vuo0006lq5g4o9nbk17",
        "type": "GalleryGrid",
        "order": 1,
        "content": {
          "items": [
            {
              "id": 1,
              "tag": "BTG + BOP",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883271/encotec-Assets/hero/supercritical_thermal_plant.jpg",
              "title": "Supercritical Thermal Generation Unit",
              "category": "Thermal Power",
              "location": "Prayagraj Power Generation",
              "description": "Comprehensive operation & maintenance of 3x660 MW BTG & BOP systems."
            },
            {
              "id": 2,
              "tag": "Field Service",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883267/encotec-Assets/culture/encotec_field_operations.jpg",
              "title": "Field Engineering Operations",
              "category": "O&M & Field Engineering",
              "location": "Power Generation Facility",
              "description": "High-precision engineering and safety protocols during on-site operations."
            },
            {
              "id": 3,
              "tag": "Solar O&M",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883268/encotec-Assets/culture/encotec_solar_inspection.jpg",
              "title": "Solar PV Park Inspection",
              "category": "Renewables",
              "location": "Utility Solar Facility",
              "description": "Routine diagnostic inspection and string health monitoring for utility solar installations."
            },
            {
              "id": 4,
              "tag": "Automation",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883265/encotec-Assets/culture/encotec_control_room.jpg",
              "title": "Centralized SCADA & DCS Control",
              "category": "O&M & Field Engineering",
              "location": "Central Control Room",
              "description": "24/7 centralized monitoring, heat rate optimization, and automated trip prevention."
            },
            {
              "id": 5,
              "tag": "Asset Health",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883266/encotec-Assets/culture/encotec_site_inspection.jpg",
              "title": "On-Site Infrastructure Assessment",
              "category": "O&M & Field Engineering",
              "location": "Industrial Site",
              "description": "Technical audit, residual life assessment, and condition monitoring."
            },
            {
              "id": 6,
              "tag": "Transmission",
              "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
              "title": "High Voltage Switchyard & Substation",
              "category": "Transmission & Grid",
              "location": "Substation Facility",
              "description": "EHV transformer maintenance, switchgear testing, and protection calibration."
            },
            {
              "id": 7,
              "tag": "Wind Power",
              "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2000",
              "title": "Wind Farm Fleet Maintenance",
              "category": "Renewables",
              "location": "Wind Energy Park",
              "description": "Multi-megawatt wind turbine generator preventive maintenance and gearbox inspections."
            },
            {
              "id": 8,
              "tag": "Advisory",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883264/encotec-Assets/culture/encotec_team_collab.jpg",
              "title": "Technical Advisory & Engineering Review",
              "category": "O&M & Field Engineering",
              "location": "Engineering Headquarters",
              "description": "Cross-functional engineering reviews and performance improvement plans."
            },
            {
              "id": 9,
              "tag": "Commissioning",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883270/encotec-Assets/culture/encotec_project_review.jpg",
              "title": "Project Planning & Commissioning Management",
              "category": "O&M & Field Engineering",
              "location": "Project Management Office",
              "description": "Project milestone tracking, contractor coordination, and commissioning timelines."
            },
            {
              "id": 10,
              "tag": "Safety",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883262/encotec-Assets/about/human_centric_engineer.jpg",
              "title": "Field Safety & Technical Standards",
              "category": "O&M & Field Engineering",
              "location": "Industrial Facility",
              "description": "Field safety adherence and certified technicians managing complex energy assets."
            },
            {
              "id": 11,
              "tag": "Overhaul",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883273/encotec-Assets/news/mtn3bph7tcvncvxfil1o.jpg",
              "title": "Plant Modernization & Overhaul",
              "category": "Thermal Power",
              "location": "Generating Station",
              "description": "Major overhaul operations and equipment modernization for prolonged plant life."
            },
            {
              "id": 12,
              "tag": "Asset Care",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883257/encotec-Assets/svypxqn8inxodhe9gpj1.jpg",
              "title": "Industrial Infrastructure Stewardship",
              "category": "Thermal Power",
              "location": "Energy Complex",
              "description": "Comprehensive lifecycle stewardship of critical energy generation assets."
            }
          ],
          "heading": "Capturing Energy in Action",
          "tagline": "FIELD OPERATIONS & ASSET PORTFOLIO",
          "categories": [
            "All",
            "Thermal Power",
            "Renewables",
            "Transmission & Grid",
            "O&M & Field Engineering",
            "Aviation & Industrial",
            "Global Sourcing"
          ],
          "sectionTitle": "Capturing Energy in Action",
          "sectionSubtitle": "A visual chronicle of our field engineering presence across supercritical power stations, renewable energy parks, high-voltage substations, and critical airport infrastructure."
        }
      },
      {
        "id": "cmv6g7vvu0008lq5gy2jpfpfp",
        "type": "GalleryCTA",
        "order": 2,
        "content": {
          "heading": "Ready to Elevate Your Energy Asset Performance?",
          "buttonLink": "/contact",
          "buttonText": "Discuss Your Project",
          "description": "Partner with 350+ specialized engineers and 2200+ trained personnel dedicated to zero downtime, safety, and operational mastery."
        }
      }
    ]
  },
  {
    "id": "cmuocccsq0001lqb6ayb2phor",
    "title": "Home",
    "slug": "home",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Welcome to Encotec",
    "metaTitle": "Encotec Energy - Power Plant O&M and Engineering Services",
    "metaDescription": "Providing engineering services since 2009",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuoccct70003lqb6byc3hu70",
        "type": "HeroSection",
        "order": 0,
        "content": {
          "stats": [
            {
              "label": "INCORPORATION",
              "value": "2009"
            },
            {
              "label": "COMMENCED OPERATIONS",
              "value": "2011"
            },
            {
              "label": "COUNTRIES",
              "value": "5+"
            },
            {
              "label": "ENGINEERS",
              "value": "350+"
            },
            {
              "label": "ACTIVE O&M",
              "value": "10+ GW"
            }
          ],
          "images": [
            "https://res.cloudinary.com/nksowtej/image/upload/v1791883271/encotec-Assets/hero/supercritical_thermal_plant.jpg",
            "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200"
          ],
          "tagline": "End-to-End Solutions for Critical Assets",
          "description": "Encotec delivers specialised engineering, operations and maintenance services across power generation and critical infrastructure. From keeping complex power plants running reliably to supporting construction, commissioning, airport utilities and critical equipment sourcing, we combine technical expertise with hands-on execution.",
          "serviceTags": [
            {
              "url": "/services/power-generation",
              "label": "STEWARDSHIP"
            },
            {
              "url": "/services/construction-commissioning",
              "label": "COMMISSIONING"
            },
            {
              "url": "/services/technical-advisory",
              "label": "ADVISORY"
            },
            {
              "url": "/services/value-added",
              "label": "GLOBAL SOURCING"
            }
          ],
          "headlineLine1": "Engineering",
          "headlineLine2": "Operational Reliability.",
          "primaryBtnUrl": "/services",
          "backgroundImage": "https://res.cloudinary.com/nksowtej/image/upload/v1791883271/encotec-Assets/hero/supercritical_thermal_plant.jpg",
          "primaryBtnLabel": "Explore Our Services",
          "secondaryBtnUrl": "/contact",
          "headlineHighlight": "Expertise.",
          "secondaryBtnLabel": "Talk to Our Experts",
          "projectsBadgeLabel": "",
          "projectsBadgeNumber": ""
        }
      },
      {
        "id": "cmuocccte0005lqb69u4fxpgx",
        "type": "AboutUs",
        "order": 1,
        "content": {
          "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883262/encotec-Assets/about/human_centric_engineer.jpg",
          "stats": [
            {
              "icon": "Globe",
              "label": "COUNTRIES OF OPERATION",
              "value": "5+"
            },
            {
              "icon": "Award",
              "label": "INDUSTRY EXPERTS",
              "value": "25+"
            },
            {
              "icon": "Users",
              "label": "MANPOWER",
              "value": "2200+"
            },
            {
              "icon": "Zap",
              "label": "CUMULATIVE TRACK RECORD",
              "value": "20+ GW"
            }
          ],
          "ctaUrl": "/about",
          "ctaLabel": "Explore Our Story",
          "imageAlt": "Encotec Indian power plant engineer in thermal generation facility",
          "upperTag": "Positioning & Leadership",
          "badgeIcon": "Zap",
          "badgeLabel": "Pioneering Energy",
          "badgeValue": "Est. 2009",
          "paragraphs": [
            "Critical infrastructure demands more than technical capability. It requires experience, disciplined execution and a clear understanding of what keeps an asset safe, reliable and productive.",
            "Encotec partners with asset owners, operators, EPC companies and infrastructure organisations to manage complex technical challenges across the asset lifecycle.",
            "Our teams bring together engineering expertise, field experience and operational discipline to deliver solutions that work in the real world - from construction and commissioning through long-term operations and maintenance.",
            "The result: dependable performance, informed decision-making and greater confidence in critical assets."
          ],
          "headingLabel": "Keeping Critical Infrastructure",
          "bannerHeading": "Beyond Maintenance. Responsible Asset Stewardship.",
          "sectionNumber": "",
          "bannerButtonUrl": "/contact",
          "bannerButtonLabel": "Talk to Our Experts",
          "bannerDescription": "We believe critical infrastructure deserves more than a service provider. It deserves a partner who understands the responsibility that comes with operating, maintaining and improving assets that people and businesses depend on. That is how we turn technical expertise into lasting value.",
          "headingItalicHighlight": "Performing"
        }
      },
      {
        "id": "cmuocccti0007lqb6lalfawgg",
        "type": "ServicesSection",
        "order": 2,
        "content": {
          "heading": "Specialised Services for Critical Assets",
          "tagline": "What We Do",
          "services": [
            {
              "icon": "Flame",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883271/encotec-Assets/hero/supercritical_thermal_plant.jpg",
              "title": "Power Plant O&M",
              "ctaUrl": "/services/power-generation",
              "ctaLabel": "Explore Power Plant O&M",
              "subtitle": "Reliable operations. Disciplined maintenance. Better asset performance.",
              "description": "We operate and maintain power-generation assets with a focus on availability, safety, preventive maintenance and operational efficiency across large thermal plants and substations."
            },
            {
              "icon": "ClipboardCheck",
              "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
              "title": "Construction & Commissioning",
              "ctaUrl": "/services/construction-commissioning",
              "ctaLabel": "Explore Construction & Commissioning",
              "subtitle": "From installation to successful commissioning.",
              "description": "Encotec supports complex energy projects through erection, installation, testing and commissioning - helping clients move from construction to reliable operation with greater control over quality, safety and timelines."
            },
            {
              "icon": "ShieldCheck",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883266/encotec-Assets/culture/encotec_site_inspection.jpg",
              "title": "Due Diligence & Asset Health",
              "ctaUrl": "/services/due-diligence",
              "ctaLabel": "Explore Due Diligence & Asset Health",
              "subtitle": "Making informed decisions for the long term.",
              "description": "Before acquiring, relocating or upgrading plant assets, our independent due diligence and Residual Life Assessments (RLA) provide the objective data needed to understand true condition and mitigate investment risks."
            },
            {
              "icon": "Search",
              "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
              "title": "Technical Advisory",
              "ctaUrl": "/services/technical-advisory",
              "ctaLabel": "Explore Technical Advisory",
              "subtitle": "Technical insight for better asset decisions.",
              "description": "When critical assets face performance, reliability or maintenance challenges, Encotec provides diagnostics, condition assessments, audits, and modernisation support to improve efficiency."
            },
            {
              "icon": "Wrench",
              "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
              "title": "Critical Spare Parts Sourcing",
              "ctaUrl": "/services/value-added",
              "ctaLabel": "Explore Spare Parts Solutions",
              "subtitle": "The right part. The right specification. When it matters.",
              "description": "Equipment downtime can quickly become expensive. Encotec helps clients source critical power-plant spare parts, particularly for Chinese-origin equipment, to exact client specifications."
            }
          ],
          "description": "From power generation to aviation infrastructure, Encotec provides specialised services designed around the technical and operational needs of critical assets."
        }
      },
      {
        "id": "cmuoccctp0009lqb6p149hxnc",
        "type": "ProcessSection",
        "order": 3,
        "content": {
          "steps": [
            {
              "id": 1,
              "icon": "Search",
              "title": "Logical Foundation",
              "description": "We start by conceptualizing the project through rigorous feasibility studies and Detailed Project Reports (DPRs)."
            },
            {
              "id": 2,
              "icon": "PenTool",
              "title": "Strategic Alignment",
              "description": "Our team develops technical specifications and assists in the selection of the right partners to ensure a solid start."
            },
            {
              "id": 3,
              "icon": "HardHat",
              "title": "Technical Realization",
              "description": "We manage the precision erection and commissioning of assets, whether they are new builds or relocated plants."
            },
            {
              "id": 4,
              "icon": "CheckCircle2",
              "title": "Operations / Optimization",
              "description": "We transition into long-term stewardship, providing operation and maintenance with the same care as the asset owner."
            },
            {
              "id": 5,
              "icon": "Activity",
              "title": "Continuous Improvement",
              "description": "Through regular performance diagnostics and energy audits, we ensure your asset remains efficient and reliable for its entire lifecycle."
            }
          ],
          "heading": "Workflow Followed for Each Project",
          "tagline": "Our Workflow"
        }
      },
      {
        "id": "cmuoccctt000blqb63s1dvek6",
        "type": "ProjectShowcaseSection",
        "order": 4,
        "content": {
          "heading": "Stewardship in Action",
          "tagline": "Case Studies",
          "projects": [
            {
              "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2000",
              "title": "Supercritical Mastery at Rajpura",
              "ctaUrl": "/insights/ensuring-reliability-rajpura",
              "category": "Asset Stewardship",
              "location": "Rajpura, Punjab",
              "description": "Providing O&M services for a 2x700 MW Supercritical plant, ensuring long-term reliability for Punjab's energy heart."
            },
            {
              "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=2000",
              "title": "Powering India's Gateway (DIAL)",
              "ctaUrl": "/insights/powering-gateway-india-airport",
              "category": "Airport Utility Management",
              "location": "New Delhi",
              "description": "Five years of continuous, high-reliability utility management at Delhi International Airport, recently renewed for another five years due to exceptional performance."
            }
          ],
          "viewAllUrl": "/insights",
          "description": "Delivering critical energy infrastructure with precision engineering and an owner's mindset.",
          "viewAllLabel": "View All Case Studies"
        }
      },
      {
        "id": "cmuoccctw000dlqb60fyhmk1q",
        "type": "GlobalFootprintSection",
        "order": 5,
        "content": {
          "stats": [
            {
              "label": "COUNTRIES",
              "value": "5+"
            },
            {
              "label": "ACTIVE O&M",
              "value": "10+ GW"
            },
            {
              "label": "CUMULATIVE TRACK RECORD",
              "value": "20+ GW"
            },
            {
              "label": "MANPOWER",
              "value": "2200+"
            },
            {
              "label": "ENGINEERS",
              "value": "350+"
            },
            {
              "label": "INDUSTRY EXPERTS",
              "value": "25+"
            }
          ],
          "heading": "Connected Intelligence",
          "tagline": "Global Presence",
          "locations": [
            {
              "name": "India (HQ)",
              "phone": "+91 120 4155612",
              "suite": "Noida, Uttar Pradesh",
              "region": "India",
              "address": "Corporate Headquarters",
              "coordinates": [
                77.39,
                28.58
              ]
            },
            {
              "name": "Turkey",
              "phone": "+90 312 555 0100",
              "suite": "Ankara, Turkey",
              "region": "International",
              "address": "Celikler Energy Project",
              "coordinates": [
                32.86,
                39.93
              ]
            },
            {
              "name": "Bahrain",
              "phone": "+973 1755 0200",
              "suite": "Manama, Bahrain",
              "region": "International",
              "address": "Energy Infrastructure",
              "coordinates": [
                50.58,
                26.07
              ]
            },
            {
              "name": "UAE",
              "phone": "+971 4 555 0199",
              "suite": "Dubai, UAE",
              "region": "International",
              "address": "Regional Infrastructure Project",
              "coordinates": [
                55.27,
                25.2
              ]
            },
            {
              "name": "Indonesia",
              "phone": "+62 21 555 0188",
              "suite": "Jakarta, Indonesia",
              "region": "International",
              "address": "Power Plant Operations",
              "coordinates": [
                106.84,
                -6.21
              ]
            },
            {
              "name": "Vietnam",
              "phone": "+84 24 555 0177",
              "suite": "Hanoi, Vietnam",
              "region": "International",
              "address": "Renewable Project Site",
              "coordinates": [
                105.83,
                21.03
              ]
            },
            {
              "name": "Germany",
              "phone": "+49 30 555 0166",
              "suite": "Berlin, Germany",
              "region": "International",
              "address": "Dornier Group Hub",
              "coordinates": [
                13.4,
                52.52
              ]
            },
            {
              "name": "Tanzania",
              "phone": "+255 22 555 0155",
              "suite": "Dar es Salaam, Tanzania",
              "region": "International",
              "address": "Grid Commissioning Project",
              "coordinates": [
                39.2,
                -6.79
              ]
            },
            {
              "name": "China",
              "phone": "+86 10 555 0144",
              "suite": "Beijing, China",
              "region": "International",
              "address": "Sourcing & Procurement Hub",
              "coordinates": [
                116.4,
                39.9
              ]
            },
            {
              "name": "Croatia",
              "phone": "+385 1 555 0133",
              "suite": "Zagreb, Croatia",
              "region": "International",
              "address": "Engineering Services",
              "coordinates": [
                15.98,
                45.81
              ]
            }
          ],
          "description": "A live network of energy systems operating in synchronization across continents."
        }
      },
      {
        "id": "cmuocccu2000flqb6v3o401ol",
        "type": "WhyEncotecSection",
        "order": 6,
        "content": {
          "ctaBlocks": [
            {
              "text": "Experienced engineers, technicians and operational teams with hands-on knowledge of complex energy assets.",
              "headline": "Technical Depth"
            },
            {
              "text": "Experience spanning operations, maintenance, construction, erection, testing, commissioning and specialised technical services.",
              "headline": "Execution Experience"
            },
            {
              "text": "We look beyond completing a scope of work to understand how our work affects availability, performance, safety and continuity.",
              "headline": "Operational Focus"
            },
            {
              "text": "Engineering, field execution, maintenance and sourcing capabilities brought together under one partner.",
              "headline": "Integrated Expertise"
            },
            {
              "text": "Encotec combines international infrastructure expertise with strong, dependable on-ground execution capabilities across India and global energy markets.",
              "headline": "Global Know-How. Local Execution."
            }
          ],
          "revealWord1": "Engineering Expertise.",
          "revealWord2": "Operational Reliability.",
          "revealWord3": "Why Clients Choose Encotec."
        }
      },
      {
        "id": "cmuocccu7000hlqb6ctz349bi",
        "type": "Testimonials",
        "order": 7,
        "content": {
          "heading": "Trusted by Industry Leaders",
          "tagline": "Testimonials",
          "testimonials": [
            {
              "name": "Rajesh Mehta",
              "quote": "Encotec's O&M team transformed our plant's performance. Their owner's mindset approach meant they treated our 700 MW facility as if it were their own - uptime improved by 12% in the first year alone.",
              "title": "Senior Vice President, Operations",
              "company": "National Thermal Power Corp.",
              "initials": "RM"
            },
            {
              "name": "Sarah Al-Rashid",
              "quote": "From feasibility to commissioning, Encotec delivered our 200 MW solar project on schedule and under budget. Their engineering precision and attention to detail set a new benchmark for our portfolio.",
              "title": "Project Director, Renewable Energy",
              "company": "Gulf Energy Solutions",
              "initials": "SA"
            },
            {
              "name": "Dr. Klaus Werner",
              "quote": "Working with Encotec on our 765 kV substation was exceptional. Their deep expertise in transmission infrastructure and commitment to safety standards gave us complete confidence throughout the project.",
              "title": "Chief Engineer, Grid Infrastructure",
              "company": "European Power Networks",
              "initials": "KW"
            },
            {
              "name": "Priya Sharma",
              "quote": "Encotec's project management capabilities are world-class. They coordinated complex multi-disciplinary teams across three countries, delivering our airport MEP systems with zero safety incidents.",
              "title": "Managing Director",
              "company": "Apex Infrastructure Group",
              "initials": "PS"
            }
          ]
        }
      },
      {
        "id": "cmuocccu9000jlqb6xticn199",
        "type": "LogoStripSection",
        "order": 8,
        "content": {
          "logos": [
            {
              "name": "Moser Baer",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883222/encotec-Assets/logos/moserbaer.png"
            },
            {
              "name": "Reliance Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883248/encotec-Assets/logos/reliance_power.png"
            },
            {
              "name": "Cairn India",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883230/encotec-Assets/logos/cairn.png"
            },
            {
              "name": "Electrical Inspectorate",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883245/encotec-Assets/logos/electrical_inspectorate.png"
            },
            {
              "name": "Coastal Gujarat Power Limited (CGPL)",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883235/encotec-Assets/logos/cgpl.png"
            },
            {
              "name": "Thermax",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883224/encotec-Assets/logos/thermax.png"
            },
            {
              "name": "Tata Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883234/encotec-Assets/logos/tata_power.png"
            },
            {
              "name": "Adani Group",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883217/encotec-Assets/logos/adani.png"
            },
            {
              "name": "Invensys Controls",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883248/encotec-Assets/logos/invensys.png"
            },
            {
              "name": "Sterlite Energy",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883245/encotec-Assets/logos/sterlite_energy.png"
            },
            {
              "name": "Action Ispat & Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883244/encotec-Assets/logos/action_ispat.png"
            },
            {
              "name": "GMR Group",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883221/encotec-Assets/logos/gmr.png"
            },
            {
              "name": "Adhunik Group",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883249/encotec-Assets/logos/adhunik.png"
            },
            {
              "name": "Jaypee Group",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883231/encotec-Assets/logos/jaypee.png"
            },
            {
              "name": "Odisha Power Generation Corporation",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883237/encotec-Assets/logos/opgc.png"
            },
            {
              "name": "Jindal Steel & Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883225/encotec-Assets/logos/jindal.png"
            },
            {
              "name": "Alstom",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883219/encotec-Assets/logos/alstom.png"
            },
            {
              "name": "Bharat Oman Refineries Limited",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883223/encotec-Assets/logos/borl.png"
            },
            {
              "name": "Indiabulls Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883227/encotec-Assets/logos/indiabulls.png"
            },
            {
              "name": "AREVA",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883226/encotec-Assets/logos/areva.png"
            },
            {
              "name": "ABB",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883216/encotec-Assets/logos/abb.png"
            },
            {
              "name": "JSW Energy",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883224/encotec-Assets/logos/jsw.png"
            },
            {
              "name": "KSK Energy",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883239/encotec-Assets/logos/ksk.png"
            },
            {
              "name": "Noida International Airport",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883238/encotec-Assets/logos/noida_airport.png"
            },
            {
              "name": "Sterling and Wilson",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883240/encotec-Assets/logos/sterling_wilson.png"
            },
            {
              "name": "IL&FS",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883229/encotec-Assets/logos/il_fs.png"
            },
            {
              "name": "Ideal Energy Projects (IEPL)",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883250/encotec-Assets/logos/iepl.png"
            },
            {
              "name": "GE Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883220/encotec-Assets/logos/ge.png"
            },
            {
              "name": "Hiranmaye Energy",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883242/encotec-Assets/logos/hiranmaye.png"
            },
            {
              "name": "MP Power",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883247/encotec-Assets/logos/mp_wz.png"
            },
            {
              "name": "Coastal Energen",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883252/encotec-Assets/logos/coastal_energen.png"
            },
            {
              "name": "Sterlite",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883236/encotec-Assets/logos/sterlite.png"
            },
            {
              "name": "Nabha Power Limited (NPL)",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883253/encotec-Assets/logos/nabha_power.png"
            },
            {
              "name": "Sea Eagles",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883254/encotec-Assets/logos/sea_eagles.png"
            },
            {
              "name": "WBPDCL",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883232/encotec-Assets/logos/wbpdcl.png"
            },
            {
              "name": "UPRVUNL",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883228/encotec-Assets/logos/uprvunl.png"
            }
          ],
          "tagline": "Trusted by Industry Leaders"
        }
      },
      {
        "id": "cmuocccub000llqb6v28fo6mt",
        "type": "CTASection",
        "order": 9,
        "content": {
          "tagline": "Partner With Us",
          "copyright": "© 2026 Encotec Engineering.",
          "footerNote": "Looking for precision and reliability? Get in touch to learn more about our certified quality and safety-first approach.",
          "description": "From India to the world, see how we are setting new standards in power infrastructure. Join the 13+ projects that rely on Encotec for their critical needs.",
          "headingPart1": "Experience Global",
          "primaryBtnUrl": "#",
          "primaryBtnLabel": "Start Your Project",
          "secondaryBtnUrl": "+91 120 4155612",
          "headingHighlight": "Engineering Excellence.",
          "secondaryBtnLabel": "Talk to an Expert"
        }
      },
      {
        "id": "cmuocccuf000nlqb6h1ny93zr",
        "type": "FooterCMS",
        "order": 10,
        "content": {
          "certificates": [
            {
              "alt": "ISO 9001:2015",
              "src": "https://res.cloudinary.com/nksowtej/image/upload/v1791883258/encotec-Assets/u2hnzxahnlqpe1rsgh2h.png",
              "description": "QUALITY MANAGEMENT SYSTEM"
            },
            {
              "alt": "ISO 14001:2015",
              "src": "https://res.cloudinary.com/nksowtej/image/upload/v1791883259/encotec-Assets/gke8cxzlk56pimretbul.png",
              "description": "ENVIRONMENTAL MANAGEMENT SYSTEM"
            },
            {
              "alt": "ISO 45001:2018",
              "src": "https://res.cloudinary.com/nksowtej/image/upload/v1791883260/encotec-Assets/g2miviz99upogv9ys9ws.png",
              "description": "OCCUPATIONAL HEALTH & SAFETY MANAGEMENT SYSTEM"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "cmuocccvj001klqb695dumsng",
    "title": "Insights",
    "slug": "insights",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "encotec Insights",
    "metaTitle": "Insights & Case Studies - Encotec",
    "metaDescription": "Read about our projects and industry insights",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccvm001mlqb655sz9jkz",
        "type": "InsightsHero",
        "order": 0,
        "content": {
          "tagline": "Insights & Resources",
          "heroTitle": "INSIGHTS, CASE STUDIES & INDUSTRY PERSPECTIVES",
          "tab1Label": "Case Studies",
          "tab2Label": "News & Updates",
          "tab3Label": "Blog & Articles",
          "heroSubtitle": "Explore our thought leadership, project successes, and the latest updates from the forefront of global energy engineering.",
          "backgroundImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400"
        }
      },
      {
        "id": "cmuocccvp001olqb6xf9bnz5o",
        "type": "FeaturedInsight",
        "order": 1,
        "content": {
          "btnLabel": "Read Full Story",
          "badgeLabel": "Featured Achievement",
          "latestArticleDate": "October 1, 2026",
          "latestArticleSlug": "encotec-takes-over-om-3x660mw-supercritical-thermal-power-plant-ppgcl",
          "latestArticleImage": "https://res.cloudinary.com/nksowtej/image/upload/v1791883273/encotec-Assets/news/mtn3bph7tcvncvxfil1o.jpg",
          "latestArticleTitle": "ENCOTEC Takes Over O&M of 3 X 660 MW Supercritical Thermal Power Plant at PPGCL, Prayagraj (Tata Power)",
          "latestArticleSummary": "ENCOTEC has officially taken over the Operation & Maintenance of BTG + BOP + C&I systems for the 3 X 660 MW Supercritical Coal-based Thermal Power Plant of M/s Prayagraj Power Generation Company Ltd. (PPGCL - Tata Power) at Bara Tehsil, District Prayagraj.",
          "latestArticleLocation": "Prayagraj, Uttar Pradesh, India"
        }
      },
      {
        "id": "cmuocccvq001qlqb6oclhxwy8",
        "type": "InsightsStats",
        "order": 2,
        "content": {
          "stat1Label": "Case Studies Published",
          "stat1Value": "15",
          "stat2Label": "Articles & Insights",
          "stat2Value": "50",
          "stat3Label": "Countries Covered",
          "stat3Value": "5",
          "stat4Label": "Monthly Readers",
          "stat4Value": "10",
          "stat1Suffix": "+",
          "stat2Suffix": "+",
          "stat3Suffix": "+",
          "stat4Suffix": "K+"
        }
      },
      {
        "id": "cmuocccvs001slqb69ze34kc3",
        "type": "InsightsCTA",
        "order": 3,
        "content": {
          "ctaHeading": "Have a Project in Mind?",
          "ctaSubtitle": "Let's discuss how our engineering expertise can bring value to your next energy infrastructure project.",
          "primaryBtnUrl": "/contact",
          "primaryBtnLabel": "Start Your Project",
          "secondaryBtnUrl": "/services",
          "secondaryBtnLabel": "View Our Services"
        }
      },
      {
        "id": "cmuocccvv001ulqb65nz1esx7",
        "type": "RelatedInsights",
        "order": 4,
        "content": {
          "heading": "Related Insights",
          "viewAllLabel": "View All",
          "readMoreLabel": "Read More"
        }
      },
      {
        "id": "cmuocccw0001wlqb64leblows",
        "type": "ArticlesList",
        "order": 5,
        "content": {
          "articles": [
            {
              "id": 1,
              "date": "September 2023",
              "slug": "obra-c-thermal-success",
              "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2400",
              "title": "The Obra 'C' Thermal Success",
              "content": [
                {
                  "text": "The Obra 'C' Thermal Power Project represents a significant milestone in India's journey towards robust and reliable energy infrastructure. Encotec Energy India was entrusted with the critical task of IBR (Indian Boiler Regulations) piping erection, testing, and commissioning for this massive 2x660 MW supercritical thermal power plant.",
                  "type": "paragraph"
                },
                {
                  "text": "Project Scope and Complexity",
                  "type": "heading"
                },
                {
                  "text": "The scope of work encompassed the complete erection of high-pressure piping systems, a task demanding unparalleled precision and adherence to stringent safety standards. The project involved handling thousands of tons of specialized alloy steel pipes, requiring advanced welding techniques and rigorous non-destructive testing (NDT).",
                  "type": "paragraph"
                },
                {
                  "text": "Our approach was rooted in meticulous planning and the deployment of highly skilled manpower. We understood that the integrity of the IBR piping is paramount to the plant's operational safety and efficiency.",
                  "type": "quote"
                },
                {
                  "text": "Overcoming Challenges",
                  "type": "heading"
                },
                {
                  "text": "Executing a project of this magnitude in a challenging environment required innovative solutions. We implemented advanced project management tools to track progress in real-time, ensuring seamless coordination between engineering, procurement, and construction teams. Our proactive approach to risk management allowed us to anticipate potential bottlenecks and mitigate them effectively.",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Zero lost-time incidents during the entire 18-month execution phase.",
                    "Achieved 100% first-time-right welding quality on critical high-pressure joints.",
                    "Completed the commissioning phase 2 weeks ahead of the baseline schedule."
                  ]
                },
                {
                  "text": "Value Delivered",
                  "type": "heading"
                },
                {
                  "text": "The successful completion of the Obra 'C' project not only reinforced Encotec's position as a leader in power plant engineering but also contributed significantly to the region's energy security. The plant now operates at peak efficiency, delivering reliable power to millions of homes and businesses.",
                  "type": "paragraph"
                }
              ],
              "category": "Case Study",
              "location": "Uttar Pradesh, India",
              "readTime": "",
              "description": "Executed complex IBR piping erection and commissioning for a massive 2x660 MW project in Uttar Pradesh."
            },
            {
              "id": 2,
              "date": "February 2018",
              "slug": "ensuring-reliability-rajpura",
              "image": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2400",
              "title": "Ensuring Reliability for Punjab's Power Heart",
              "content": [
                {
                  "text": "At Rajpura, we don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab. Since 2018, our team has been on the ground, treating this supercritical facility as if it were our own. Managing a plant of this scale requires more than just technical expertise - it requires continuous care and foresight.",
                  "type": "paragraph"
                },
                {
                  "text": "The Project & Partner",
                  "type": "heading"
                },
                {
                  "text": "This comprehensive O&M engagement for the 2x700 MW Rajpura Supercritical Power Plant is executed in partnership with Nabha Power Limited (L&T Power Division).",
                  "type": "paragraph"
                },
                {
                  "text": "Our Hands-On Approach",
                  "type": "heading"
                },
                {
                  "text": "Our 350+ engineers provide a full spectrum of services to keep the heart of this plant beating at peak efficiency. This includes:",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Precision Maintenance: From the boilers and turbines to the critical balance of plant (BOP) equipment.",
                    "Smart Planning: We utilize condition monitoring and meticulous O&M planning to address potential issues before they cause downtime.",
                    "Expert Overhauling: We manage both annual and major capital overhauling, ensuring the plant's long-term health and performance."
                  ]
                },
                {
                  "text": "The Human Impact",
                  "type": "heading"
                },
                {
                  "text": "By maintaining a supercritical plant with such high standards, we are helping to provide more efficient, reliable, and cleaner power for the region, proving that large-scale engineering can have a local, human touch.",
                  "type": "paragraph"
                },
                {
                  "text": "We don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab.",
                  "type": "quote"
                }
              ],
              "category": "Case Study",
              "location": "Rajpura, Punjab",
              "readTime": "",
              "description": " O&M for the 2x700 MW Rajpura Supercritical Power Plant, managing operations with an owner's mindset."
            },
            {
              "id": 3,
              "date": "March 2012",
              "slug": "greener-future-gujarat-solar",
              "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400",
              "title": "Engineering a Greener Future in the Sands of Gujarat",
              "content": [
                {
                  "text": "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way. In 2013, we took on the challenge of bringing a 10 MWp ground-mounted solar project to life, turning the intense Gujarat sun into a sustainable power source.",
                  "type": "paragraph"
                },
                {
                  "text": "The Project & Partner",
                  "type": "heading"
                },
                {
                  "text": "This 10 MWp Solar PV Installation and Commissioning project was successfully delivered in partnership with Moser Baer Engineering & Construction Ltd.",
                  "type": "paragraph"
                },
                {
                  "text": "Building with Precision",
                  "type": "heading"
                },
                {
                  "text": "Our team managed the project from the ground up, focusing on every technical detail to ensure the best energy yield for our client:",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "Site-Specific Design: We started with a detailed design review tailored to the unique site conditions.",
                    "Full-Scale Erection: Our engineers handled the mounting of polycrystalline modules, complex cabling, and the installation of array junction boxes and inverters.",
                    "Grid Readiness: We concluded with rigorous testing and commissioning, ensuring the project was perfectly synchronized with the grid."
                  ]
                },
                {
                  "text": "The Human Impact",
                  "type": "heading"
                },
                {
                  "text": "This project wasn't just about installing panels; it was about Encotec's commitment to bridging the gap to a renewable future. By delivering a high-performing solar asset, we helped our partners take a significant step toward a cleaner tomorrow.",
                  "type": "paragraph"
                },
                {
                  "text": "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way.",
                  "type": "quote"
                }
              ],
              "category": "Case Study",
              "location": "Jainabad, Gujarat",
              "readTime": "",
              "description": "End-to-end installation and commissioning of a 10 MWp ground-mounted solar project, turning intense sun into sustainable power."
            },
            {
              "id": 4,
              "date": "September 2023",
              "slug": "powering-gateway-india-airport",
              "image": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=2400",
              "title": "Powering the Gateway to India",
              "content": [
                {
                  "text": "An international airport never sleeps, and neither does the infrastructure that supports it. At Indira Gandhi International Airport (IGI) in New Delhi, Encotec serves as a trusted auxiliary partner, supporting the reliable operation of critical electrical infrastructure for one of the world's busiest hubs.",
                  "type": "paragraph"
                },
                {
                  "text": "The Project & Partner",
                  "type": "heading"
                },
                {
                  "text": "We provide Specialized Utility and Electrical O&M for Indira Gandhi International Airport (DIAL) in partnership with GMR Group / DIAL.",
                  "type": "paragraph"
                },
                {
                  "text": "Reliability Under Pressure",
                  "type": "heading"
                },
                {
                  "text": "Managing airport utilities requires a specialized set of skills and a deep commitment to safety. Our team oversees:",
                  "type": "paragraph"
                },
                {
                  "type": "list",
                  "items": [
                    "High-Voltage Assets: Operation and maintenance of both Air Insulated (AIS) and Gas Insulated (GIS) substations.",
                    "Uninterrupted Support: Managing DG sets and critical terminal blocks to ensure power is always available, even in emergencies.",
                    "Safety First: Our work includes managing Fire Protection Systems (FPS) and Public Health Engineering (PHE) for both landside and airside facilities."
                  ]
                },
                {
                  "text": "The Human Impact",
                  "type": "heading"
                },
                {
                  "text": "Behind every seamless take-off and every bright terminal is a team of Encotec experts working quietly to ensure the safety and comfort of millions of travelers. We take pride in being the silent force that keeps India's gateway running.",
                  "type": "paragraph"
                },
                {
                  "text": "An international airport never sleeps, and neither does the infrastructure that supports it.",
                  "type": "quote"
                }
              ],
              "category": "Case Study",
              "location": "New Delhi, India",
              "readTime": "",
              "description": "Specialized utility and electrical O&M for Indira Gandhi International Airport, supporting the reliable operation of critical electrical infrastructure."
            },
            {
              "id": 21,
              "date": "October 1, 2026",
              "slug": "encotec-takes-over-om-3x660mw-supercritical-thermal-power-plant-ppgcl",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883273/encotec-Assets/news/mtn3bph7tcvncvxfil1o.jpg",
              "title": "ENCOTEC Takes Over O&M of 3 X 660 MW Supercritical Thermal Power Plant at PPGCL, Prayagraj (Tata Power)",
              "content": [
                {
                  "text": "ENCOTEC has officially taken over operations & maintenance of 3 X 660 MW Supercritical Coal based Thermal Power Plant of M/s Prayagraj Power Generation Company Ltd. at Bara Tehsil, District Prayagraj, Uttar Pradesh, India (PPGCL) w.e.f. 1st October 2026.",
                  "type": "paragraph"
                },
                {
                  "text": "An asset of this calibre represents a crown jewel of technical excellence and strategic opportunity for us.",
                  "type": "paragraph"
                },
                {
                  "type": "image",
                  "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883274/encotec-Assets/news/owax5vxcilst16qrnqxt.jpg"
                },
                {
                  "text": "This seamless operational handover would not have been possible without the immense support, guidance, and trusted collaboration from the Corporate and Site Management Teams of PPGCL.",
                  "type": "paragraph"
                },
                {
                  "text": "As we embark on this new chapter, ENCOTEC is fully committed to delivering operational excellence and driving shared success at PPGCL thereby, making this journey an unforgettable success! 🌟",
                  "type": "quote"
                }
              ],
              "category": "News",
              "location": "Prayagraj, Uttar Pradesh, India",
              "readTime": "2 min read",
              "description": "ENCOTEC has officially taken over the Operation & Maintenance of BTG + BOP + C&I systems for the 3 X 660 MW Supercritical Coal-based Thermal Power Plant of M/s Prayagraj Power Generation Company Ltd. (PPGCL - Tata Power) at Bara Tehsil, District Prayagraj, Uttar Pradesh, India w.e.f. 1st October 2026."
            },
            {
              "id": 5,
              "date": "August 17, 2026",
              "slug": "record-14-3gw-solar-capacity-added-first-four-months-fy27",
              "image": "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=2400",
              "title": "Record 14.3 GW Solar Capacity Added in First Four Months of FY27",
              "content": [
                {
                  "text": "India added 14.33 GW of solar capacity between April and July 2026 alone, accounting for 84% of all renewable additions in that period. While the pace moderated slightly in July due to monsoon disruptions, the sector is still on track to potentially add over 50 GW in this fiscal year.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "This surge in new builds - particularly in ground-mounted and rooftop segments - directly increases the requirement for Encotec's construction and commissioning vertical to bring these complex assets online safely and efficiently.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "India added 14.33 GW of solar capacity between April and July 2026 alone, accounting for 84% of all renewable additions in that period."
            },
            {
              "id": 6,
              "date": "August 17, 2026",
              "slug": "ai-data-centres-projected-add-26-3gw-national-grid",
              "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2400",
              "title": "AI Data Centres Projected to Add 26.3 GW to the National Grid",
              "content": [
                {
                  "text": "The Ministry of Power has informed Parliament that AI data centres are expected to add a concentrated load of 26.3 GW to the grid by 2031–32. Unlike traditional demand, these hyperscale facilities create massive, localized power needs that require advanced grid forecasting and integration with dedicated renewable energy sources.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "Encotec already manages critical infrastructure for global hubs like international airports. The specialized technical advisory needed to maintain zero-error electricity supply for data centres fits Encotec's focus on Expert Advisory and high-level problem solving.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "The Ministry of Power has informed Parliament that AI data centres are expected to add a concentrated load of 26.3 GW to the grid by 2031–32."
            },
            {
              "id": 7,
              "date": "August 11, 2026",
              "slug": "cabinet-stage-50000-crore-green-energy-corridor-phase-3",
              "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
              "title": "Cabinet Stage for Rs 50,000 Crore Green Energy Corridor (Phase III)",
              "content": [
                {
                  "text": "The government has sent the third phase of the intra-state Green Energy Corridor (GEC) to the Union Cabinet for final approval. This phase carries an outlay of over Rs 50,000 crore and targets the evacuation of approximately 135 GW of renewable energy by strengthening transmission lines in resource-rich states.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "Encotec’s expertise in Transmission & Distribution (up to 765 kV) and substation O&M is perfectly aligned with this infrastructure push. New corridors mean more critical high-voltage switchyards that require an \"Owner’s Mindset\" to ensure grid stability and reliability.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "The government has sent the third phase of the intra-state Green Energy Corridor (GEC) to the Union Cabinet for final approval carrying an outlay of over Rs 50,000 crore."
            },
            {
              "id": 8,
              "date": "August 11, 2026",
              "slug": "national-green-hydrogen-mission-awards-production-major-refineries",
              "image": "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=2400",
              "title": "National Green Hydrogen Mission Awards Production to Major Refineries",
              "content": [
                {
                  "text": "Under the SIGHT scheme, the government has awarded 30 KTPA of Green Hydrogen production capacity to major refineries in Panipat, Bina, Vizag, and Numaligarh. These projects will be implemented via private developers using a Build Own Operate (BOO) model to enhance energy security.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "With Encotec’s focus on Project Conceptualisation and Development, these new hydrogen clusters represent a fresh frontier for technical due diligence and specialized mechanical engineering services, particularly in complex process piping.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Under the SIGHT scheme, the government has awarded 30 KTPA of Green Hydrogen production capacity to major refineries in Panipat, Bina, Vizag, and Numaligarh."
            },
            {
              "id": 9,
              "date": "August 9, 2026",
              "slug": "india-crosses-milestone-300gw-non-fossil-fuel-capacity",
              "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2400",
              "title": "India Crosses Milestone of 300 GW Non-Fossil Fuel Capacity",
              "content": [
                {
                  "text": "In a major leap for the nation’s clean energy transition, India has officially crossed 300 GW of non-fossil fuel-based installed capacity as of 31 July 2026. Solar power remains the primary driver at 164.59 GW, followed by wind at 58.14 GW. Non-fossil sources now account for over 54% of India’s total electricity generation capacity.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "As a global service provider bridging the gap between traditional power and renewables, this rapid expansion creates a massive demand for Encotec’s specialized commissioning and long-term stewardship (O&M) services for large-scale solar and wind assets.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "In a major leap for the nation’s clean energy transition, India has officially crossed 300 GW of non-fossil fuel-based installed capacity as of 31 July 2026."
            },
            {
              "id": 10,
              "date": "August 7, 2026",
              "slug": "reliability-concerns-peak-after-68-major-renewable-grid-disturbances",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883257/encotec-Assets/svypxqn8inxodhe9gpj1.jpg",
              "title": "Reliability Concerns Peak After 68 Major Renewable Grid Disturbances",
              "content": [
                {
                  "text": "Data reveals that India recorded 68 major grid disturbances in renewable complexes between 2022 and 2025, with some individual events causing generation losses of up to 7 GW. Regulators are now calling for stricter technical compliance, more flexible thermal plant operations, and enhanced balancing reserves.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "These challenges highlight the vital importance of \"Asset Stewardship.\" Encotec’s ability to provide Performance Audits and Non-Destructive Testing (NDT) helps owners identify and solve hard engineering problems, ensuring their plants meet the high standards required to keep the national grid secure.",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Data reveals India recorded 68 major grid disturbances in renewable complexes between 2022 and 2025, calling for stricter technical compliance and enhanced balancing."
            },
            {
              "id": 11,
              "date": "April 9, 2026",
              "slug": "ghaziabad-mandates-rooftop-solar",
              "image": "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=2400",
              "title": "Ghaziabad Mandates Rooftop Solar for New Buildings",
              "content": [
                {
                  "text": "In a push for local energy independence, Ghaziabad has made rooftop solar installations mandatory for all building plan approvals. This aligns with national efforts like the PM Surya Ghar: Muft Bijli Yojana, which has already seen millions of households adopt solar power.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "This local mandate reflects the broader surge in the renewable energy sector, where Encotec provides full-lifecycle support from feasibility reports to testing and commissioning.",
                  "type": "paragraph"
                },
                {
                  "text": "Sources: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/ and https://jmkresearch.com/wp-content/uploads/2026/03/Q4-2025-RE-Report-Oct-Dec_JMK-Research.pdf",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Ghaziabad makes rooftop solar installations mandatory for all building plan approvals, aligning with national solar adoption efforts."
            },
            {
              "id": 12,
              "date": "April 8, 2026",
              "slug": "insurance-surety-bonds-replace-bank-guarantees",
              "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2400",
              "title": "Insurance Surety Bonds Replace Bank Guarantees in Power Sector",
              "content": [
                {
                  "text": "In a significant move to improve the \"ease of doing business,\" the Ministry of Power has issued a directive allowing Insurance Surety Bonds (ISBs) as an alternative to traditional Bank Guarantees (BGs) across all power procurement frameworks. This reform is designed to reduce the liquidity burden on developers and utilities.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "This flexibility in financial instruments makes it easier for engineering and O&M partners to participate in large-scale infrastructure projects without tying up massive amounts of capital in banks. For Encotec, this opens up new opportunities to engage in larger projects with reduced financial barriers.",
                  "type": "paragraph"
                },
                {
                  "text": "Source: https://solarquarter.com/2026/04/08/ministry-of-power-introduces-insurance-surety-bonds-to-replace-bank-guarantees-in-the-power-sector/",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Ministry of Power introduces Insurance Surety Bonds as an alternative to traditional Bank Guarantees across all power procurement frameworks."
            },
            {
              "id": 13,
              "date": "April 6, 2026",
              "slug": "green-signal-3200mw-thermal-projects",
              "image": "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&q=80&w=2400",
              "title": "Green Signal for 3,200 MW of New Thermal Projects",
              "content": [
                {
                  "text": "The Expert Appraisal Committee has recommended environmental clearance for two massive 1,600 MW coal-based ultra-supercritical projects. One project by JSW Thermal Energy is slated for West Bengal, while Torrent Power will develop a project in Madhya Pradesh. Both will utilize ultra-supercritical technology and domestic coal.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "With Encotec's extensive experience in supercritical thermal O&M (like the Rajpura and Shree Singaji plants), these new high-tech units represent significant future opportunities for specialized engineering services.",
                  "type": "paragraph"
                },
                {
                  "text": "Source: https://powerpeakdigest.com/power-sector-news-roundup-for-april-6-2026/",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Expert Appraisal Committee recommends environmental clearance for two massive 1,600 MW ultra-supercritical coal-based projects."
            },
            {
              "id": 14,
              "date": "April 6, 2026",
              "slug": "765kv-transmission-corridor-commissioned",
              "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2400",
              "title": "Massive 765 kV Transmission Corridor Commissioned",
              "content": [
                {
                  "text": "A new 765 kV double-circuit transmission corridor spanning 700 kilometres between Fatehgarh and Beawar has been commissioned. This project is essential for the high-capacity evacuation of renewable energy and includes the integration of advanced 765/400 kV substations.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "Encotec's specialized service line in Transmission & Distribution (up to 765 kV) and its expertise in substation O&M perfectly match the technical requirements of these new high-voltage corridors.",
                  "type": "paragraph"
                },
                {
                  "text": "Source: https://powerpeakdigest.com/power-peak-digest-for-april-6-2026/",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "A new 765 kV double-circuit transmission corridor spanning 700 km between Fatehgarh and Beawar has been commissioned for renewable energy evacuation."
            },
            {
              "id": 15,
              "date": "March 27, 2026",
              "slug": "new-directions-imported-coal-power-plants",
              "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2400",
              "title": "New Directions for Imported Coal-Based Power Plants",
              "content": [
                {
                  "text": "The Ministry of Power has issued fresh directions under Section 11 of the Electricity Act to generating companies using imported coal. These directions are aimed at ensuring that these plants remain operational and contribute to the national grid to prevent power shortages during the upcoming high-demand months.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "Maintaining imported coal-based units requires meticulous O&M planning and overhauling support, areas where Encotec provides essential back-office and on-site engineering expertise.",
                  "type": "paragraph"
                },
                {
                  "text": "Source: https://powermin.gov.in/en/announcements",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "Ministry of Power issues fresh directions under Section 11 of the Electricity Act to ensure imported coal plants remain operational during high-demand months."
            },
            {
              "id": 16,
              "date": "March 20, 2026",
              "slug": "india-270gw-peak-power-demand",
              "image": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=2400",
              "title": "India Braces for Record 270 GW Peak Power Demand",
              "content": [
                {
                  "text": "Union Minister Manohar Lal Khattar announced that India is fully prepared to handle a record 270 GW peak power demand this summer. To meet this surge, the government has focused on strengthening generation capacity, ensuring coal availability for thermal plants, and enhancing grid management.",
                  "type": "paragraph"
                },
                {
                  "text": "Why It Matters to Encotec",
                  "type": "heading"
                },
                {
                  "text": "As a specialist in thermal O&M and grid synchronization, Encotec's expertise in maintaining plant reliability is critical during these high-pressure peak periods. Our teams ensure that the plants we manage operate at maximum availability when the nation needs it most.",
                  "type": "paragraph"
                },
                {
                  "text": "Source: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/",
                  "type": "paragraph"
                }
              ],
              "category": "News",
              "location": "",
              "readTime": "",
              "description": "India is fully prepared to handle a record 270 GW peak power demand this summer through strengthened generation capacity and grid management."
            },
            {
              "id": 17,
              "date": "April 2026",
              "slug": "owners-mindset-power-plant-care",
              "image": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2400",
              "title": "Treating Your Power Plant Like Our Own: The Owner's Mindset",
              "content": [
                {
                  "text": "At Encotec, we often talk about having an \"Owner's mindset\". But what does that actually mean for the people on the ground? It means that when our 350+ engineers step onto a site, they aren't just looking at a contract; they are looking at a vital asset that supports thousands of lives.",
                  "type": "paragraph"
                },
                {
                  "text": "Continuous Care and Foresight",
                  "type": "heading"
                },
                {
                  "text": "Whether we are managing a massive 2x700 MW supercritical plant in Rajpura or a captive unit in Goa, our approach is built on continuous care and foresight. We don't just wait for things to break; we use advanced condition monitoring and performance diagnostics to stay ahead of the curve.",
                  "type": "paragraph"
                },
                {
                  "text": "For us, energy isn't just about megawatts - it's about the 1,800+ dedicated staff members who show up every day to keep the world moving.",
                  "type": "quote"
                },
                {
                  "text": "Precision and Accountability",
                  "type": "heading"
                },
                {
                  "text": "By treating every boiler, turbine, and auxiliary system with the same precision and accountability an owner would, we've been able to help our partners achieve peak efficiency and long-term reliability. This philosophy is what sets Encotec apart in the energy services landscape.",
                  "type": "paragraph"
                }
              ],
              "category": "Blog",
              "location": "",
              "readTime": "6 min read",
              "description": "What does having an Owner's Mindset mean for the people on the ground? It means our 350+ engineers see a vital asset that supports thousands of lives."
            },
            {
              "id": 18,
              "date": "March 2026",
              "slug": "sunbeams-to-megawatts-renewable-future",
              "image": "https://images.unsplash.com/photo-1545208942-e1c9c916524b?auto=format&fit=crop&q=80&w=2400",
              "title": "From Sunbeams to Megawatts: Engineering the Journey to a Renewable Future",
              "content": [
                {
                  "text": "The transition to green energy is one of the greatest challenges of our time, and at Encotec, we believe in \"finding new ways to energy solutions\". Our journey into renewables isn't just a business line; it's a commitment to sustainable development and leaving the world better than we found it.",
                  "type": "paragraph"
                },
                {
                  "text": "Technical Mastery at Every Stage",
                  "type": "heading"
                },
                {
                  "text": "Bridging the gap between traditional power and a solar future requires technical mastery at every stage. We support our partners through the entire lifecycle - starting from pre-feasibility reports and site assessments to the precision erection of polycrystalline modules.",
                  "type": "paragraph"
                },
                {
                  "text": "By combining our deep engineering roots with innovative solar technology, we are helping to ensure that the clean energy of tomorrow is as reliable as the power of today.",
                  "type": "quote"
                },
                {
                  "text": "Impactful Projects",
                  "type": "heading"
                },
                {
                  "text": "Our experience spans impactful projects like the 10 MWp Solar PV project in Gujarat and the 125 MW Solar Thermal project in Pokharan. Each project reinforces our commitment to bridging the gap to a renewable future.",
                  "type": "paragraph"
                }
              ],
              "category": "Blog",
              "location": "",
              "readTime": "7 min read",
              "description": "Our journey into renewables is a commitment to sustainable development - bridging the gap between traditional power and a solar future."
            },
            {
              "id": 19,
              "date": "February 2026",
              "slug": "silent-force-behind-your-flight",
              "image": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2400",
              "title": "Powering the Gateway: The Specialized World of Airport Utility Management",
              "content": [
                {
                  "text": "Have you ever wondered what keeps an international airport running flawlessly 24/7? Behind the scenes of the bustling terminals at Indira Gandhi International Airport (DIAL) and the upcoming Noida International Airport (YIAPL), Encotec is at work.",
                  "type": "paragraph"
                },
                {
                  "text": "A Unique Blend of Expertise",
                  "type": "heading"
                },
                {
                  "text": "Managing critical infrastructure for global hubs requires a unique blend of high-voltage expertise and a safety-first culture. Our teams oversee everything from AIS and GIS substations to the Fire Protection Systems (FPS) and Public Health Engineering (PHE) that ensure traveler comfort and safety.",
                  "type": "paragraph"
                },
                {
                  "text": "It's a high-pressure job, but with our triple ISO certifications in Quality, Environment, and Safety, we take pride in being the silent force that ensures your journey begins and ends with a smile.",
                  "type": "quote"
                },
                {
                  "text": "Trusted Security Partner",
                  "type": "heading"
                },
                {
                  "text": "We hold specific security clearances from the Bureau of Civil Aviation Security (BCAS), allowing us to act as a trusted auxiliary partner in these high-security environments. This level of trust is earned through consistent performance and unwavering commitment to safety standards.",
                  "type": "paragraph"
                }
              ],
              "category": "Blog",
              "location": "",
              "readTime": "5 min read",
              "description": "What keeps an international airport running flawlessly 24/7? Behind the scenes at DIAL and Noida International Airport, Encotec is at work."
            }
          ],
          "newsHeading": "News & Announcements",
          "newsTagline": "Corporate & Industry Updates",
          "blogsHeading": "Blogs & Technical Articles",
          "blogsTagline": "Engineering Thought Leadership",
          "emptyMessage": "No insights found for this category.",
          "newsSubtitle": "Stay updated with corporate milestones, contract awards, and energy sector developments.",
          "blogsSubtitle": "Insightful engineering commentary on the owner’s mindset, the renewable transition, and critical utility care.",
          "newsCtaHeading": "Need official commentary or executive interviews?",
          "newsCtaTagline": "Press & Media Relations",
          "blogsCtaHeading": "Want deeper technical insights directly in your inbox?",
          "blogsCtaTagline": "Engineering Thought Leadership",
          "newsViewAllText": "View All News",
          "blogsViewAllText": "View All Articles",
          "newsCtaButtonLink": "/contact",
          "newsCtaButtonText": "Get In Touch",
          "blogsCtaButtonLink": "/contact",
          "blogsCtaButtonText": "Contact Advisory Team",
          "caseStudiesHeading": "Case Studies",
          "caseStudiesTagline": "Proven Field Engineering",
          "newsCtaDescription": "Reach out to Encotec’s communications office for official statements, media packs, and event participation.",
          "blogsCtaDescription": "Connect with our advisory teams to receive whitepapers, turbine performance analyses, and power grid modernization frameworks.",
          "caseStudiesSubtitle": "Real-world plant turnarounds, commissioning feats, and efficiency audits across thermal and renewable infrastructure.",
          "caseStudiesCtaHeading": "Let our engineering specialists review your plant specs.",
          "caseStudiesCtaTagline": "Have a Complex Power Asset Challenge?",
          "caseStudiesViewAllText": "View All Case Studies",
          "caseStudiesCtaButtonLink": "/contact",
          "caseStudiesCtaButtonText": "Contact Our Engineers",
          "caseStudiesCtaDescription": "From supercritical boiler turnarounds to EHV substation diagnostics, Encotec delivers owner-mindset stewardship for mission-critical infrastructure."
        }
      },
      {
        "id": "cmuocccw7001ylqb6xacfasp5",
        "type": "NewsletterSection",
        "order": 6,
        "content": {
          "heading": "Stay Ahead in Energy Engineering",
          "tagline": "Inside Encotec",
          "description": "Subscribe to our newsletter to receive the latest case studies, industry insights, and technical articles directly in your inbox.",
          "privacyNote": "We respect your privacy. Unsubscribe at any time."
        }
      },
      {
        "id": "cmuocccw90020lqb6j7cbtgy0",
        "type": "InsightDetail",
        "order": 7,
        "content": {
          "backLabel": "Back to Insights",
          "shareLabel": "Share this article",
          "loadingText": "Loading insight details...",
          "notFoundText": "The insight you are looking for doesn't exist or has been moved.",
          "notFoundTitle": "Article Not Found",
          "notFoundBtnLabel": "Back to Insights"
        }
      }
    ]
  },
  {
    "id": "cmuocccx7002glqb65ccr9qxa",
    "title": "Leadership",
    "slug": "leadership",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Our Leadership Team",
    "metaTitle": "Leadership - Encotec",
    "metaDescription": "Meet our leadership team",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccx9002ilqb61ibph9hj",
        "type": "LeadershipHero",
        "order": 0,
        "content": {
          "badges": [
            "2200+ Manpower",
            "350+ Engineers",
            "25+ Industry Experts",
            "12+ Years Average Experience",
            "5+ Countries"
          ],
          "heroTitle": "LEADERSHIP & TEAM",
          "heroSubtitle": "Meet the experienced leaders and engineers driving operational excellence and strategic growth across global energy markets.",
          "backgroundImage": "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2400"
        }
      },
      {
        "id": "cmuocccxb002klqb68mxgexuv",
        "type": "LeadershipPhilosophy",
        "order": 1,
        "content": {
          "philosophyImage": "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200",
          "philosophyPara1": "At Encotec, leadership is not just about managing teams; it's about taking full accountability for the outcomes we deliver. Our leadership team brings decades of hands-on experience from the world's most complex energy projects.",
          "philosophyPara2": "We believe that true engineering excellence requires a culture where every team member is empowered to think critically, act decisively, and prioritize long-term asset performance over short-term gains.",
          "philosophyQuote": "We don't just manage projects - we take ownership of outcomes, ensuring every asset is future-ready.",
          "philosophyHeading": "LEADING WITH AN OWNER'S MINDSET",
          "philosophyTagline": "OUR PHILOSOPHY"
        }
      },
      {
        "id": "cmuocccxe002mlqb6ax9kyw5k",
        "type": "ExecutiveTeam",
        "order": 2,
        "content": {
          "heading": "Visionaries Driving Our Mission",
          "tagline": "Executive Leadership",
          "executives": [
            {
              "bio": "Arun Kumar Sarna is the Founder and CEO of Encotec Energy India, driving the company's vision to deliver comprehensive \"shovel-to-socket\" energy solutions globally. Under his leadership, Encotec has expanded across Thermal Power, Solar PV, and EHV Transmission & Distribution, embedding a signature \"Owner’s Mindset\" into the company's DNA.\n\nA pioneer in third-party O&M contracts in India, Mr. Sarna brings 40+ years of experience managing World Bank, KfW, and Japanese agency mega-projects. Globally, he has advised ESKOM (South Africa) and directed operations across Vietnam, Indonesia, and the Middle East.\n\nHe holds a Mechanical Engineering degree, a Master’s in Metallurgy from IIT Roorkee, and a PGDM from MDI Gurgaon, with executive certifications from Harvard Business School and IIT Mumbai.",
              "name": "Arun Kumar Sarna",
              "role": "Managing Director",
              "tags": "Strategic Leadership, Business Development, Energy Infrastructure",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883255/encotech/leadership/arun_kumar_sarna_white_bg.jpg"
            },
            {
              "bio": "Rajan Saxena is a senior energy-sector leader with 47 years of experience across thermal power, T&D, O&M services, plant overhauling, and Solar PV EPC. As Director at Encotec, he oversees operations, spare parts supply, modernization, and substation erection.\n\nPrior to Encotec, Mr. Saxena held senior leadership roles at global energy majors including GE T&D India, AREVA / Alstom, Skoda Power, DLF Power, and BHEL.\n\nHis expertise spans managing large service portfolios, full P&L accountability, EPC project execution, global procurement, logistics, and specialized repair facilities.",
              "name": "Rajan Saxena",
              "role": "Director ",
              "tags": "Operations Management, Plant Commissioning, Asset Optimization",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883256/encotech/leadership/rajan_saxena_white_bg.jpg"
            },
            {
              "bio": "Rajeev Ahuja brings 38+ years of engineering and business management experience in the power and industrial sectors. As Director at Encotec, he leads corporate strategy, high-value contract bidding, proposals, commercial management, HR, Finance & Accounts, and P&L accountability.\n\nHe previously served in senior leadership roles at STEAG Energy Services India and Nicco Engineering, managing complete business cycles from opportunity identification to contract closeout.\n\nMr. Ahuja holds a Mechanical Engineering degree with international technical and business training in the UK and Thailand, having built and led BD teams of 25+ professionals.",
              "name": "Rajeev Ahuja",
              "role": "Director ",
              "tags": "Corporate Strategy, Business Development, Global Partnerships",
              "image": "https://res.cloudinary.com/nksowtej/image/upload/v1791883215/encotech/leadership/rajeev_ahuja_white_bg.jpg"
            }
          ]
        }
      },
      {
        "id": "cmuocccxg002olqb6y6adamml",
        "type": "SeniorLeadership",
        "order": 3,
        "content": {
          "heads": [
            {
              "bio": "PhD in Thermal Engineering. 18+ years leading complex engineering design for power generation and transmission projects.",
              "name": "Dr. Anita Desai",
              "role": "VP Engineering",
              "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
            },
            {
              "bio": "15+ years driving strategic growth across India, Middle East, and Southeast Asia.",
              "name": "Sanjay Mehta",
              "role": "VP Business Development",
              "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"
            },
            {
              "bio": "12+ years in solar and wind energy project development and execution.",
              "name": "Priya Krishnan",
              "role": "Head of Renewable Energy",
              "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800"
            },
            {
              "bio": "16+ years managing large-scale EPC projects across diverse geographies.",
              "name": "Arjun Reddy",
              "role": "Head of Project Management",
              "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800"
            },
            {
              "bio": "20+ years in quality management systems and international safety standards.",
              "name": "Dr. Klaus Werner",
              "role": "Head of Quality & Safety",
              "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"
            },
            {
              "bio": "14+ years in financial strategy and corporate governance for engineering firms.",
              "name": "Meera Iyer",
              "role": "Chief Financial Officer",
              "image": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800"
            }
          ],
          "heading": "Department Heads",
          "tagline": "Senior Leadership"
        }
      },
      {
        "id": "cmuocccxi002qlqb6588ycmmu",
        "type": "TeamByNumbers",
        "order": 4,
        "content": {
          "stats": [
            {
              "label": "Total Professionals",
              "value": "2200+"
            },
            {
              "label": "Engineers",
              "value": "350+"
            },
            {
              "label": "Industry Experts",
              "value": "25+"
            },
            {
              "label": "Countries of Operation",
              "value": "5+"
            },
            {
              "label": "Years Avg Experience",
              "value": "12+"
            }
          ]
        }
      },
      {
        "id": "cmuocccxo002slqb6vek43pam",
        "type": "CultureValues",
        "order": 5,
        "content": {
          "heading": "WHAT DEFINES US",
          "tagline": "OUR CULTURE",
          "value1Desc": "Deep domain expertise across every discipline.",
          "value2Desc": "Cross-functional teamwork solving complex challenges.",
          "value3Desc": "Diverse experiences across 5+ countries.",
          "value4Desc": "Investment in learning and professional development.",
          "value1Title": "Technical Mastery",
          "value2Title": "Collaborative Spirit",
          "value3Title": "Global Perspective",
          "value4Title": "Continuous Growth"
        }
      },
      {
        "id": "cmuocccxr002ulqb61uvj75ax",
        "type": "JoinCTA",
        "order": 6,
        "content": {
          "ctaUrl1": "/careers",
          "ctaUrl2": "/contact",
          "ctaLabel1": "View Open Positions",
          "ctaLabel2": "Contact Us",
          "joinHeading": "Join Our Team of Experts",
          "joinSubtitle": "We're always looking for talented engineers and energy professionals who share our passion for excellence."
        }
      }
    ]
  },
  {
    "id": "cmv6g7hlc0001lq5gt2cyssy1",
    "title": "News & Updates",
    "slug": "news-updates",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "published",
    "isStatic": false,
    "description": null,
    "metaTitle": "News & Updates - Encotec",
    "metaDescription": "Latest news, milestones, and announcements from Encotec Energy.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": []
  },
  {
    "id": "cmuoccczi003ulqb6vtfsmwo9",
    "title": "Power Generation",
    "slug": "power-generation",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Asset stewardship and operations & maintenance services.",
    "metaTitle": "Power Generation (O&M) - Encotec",
    "metaDescription": "Asset stewardship and operations & maintenance services.",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuoccczp003wlqb6kdx7zyit",
        "type": "StewardshipHero",
        "order": 0,
        "content": {
          "label": "Asset Stewardship (O&M)",
          "description": "We don't just \"maintain\" plants; we steward them. By adopting the owner's perspective, we focus on reliability, risk management, and long-term health, ensuring that every megawatt produced is optimized.",
          "headingPart1": "Operating With An ",
          "headingHighlight": "Owner's Mindset"
        }
      },
      {
        "id": "cmuoccczu003ylqb6q66plyrg",
        "type": "StewardshipFeatures",
        "order": 1,
        "content": {
          "features": [
            {
              "icon": "Zap",
              "title": "Thermal & Supercritical Mastery",
              "description": "We manage some of India’s largest facilities, such as the 2x700 MW supercritical plant at Rajpura and the 3x660 MW supercritical power plant at PPGCL Prayagraj (Tata Power), with a focus on zero-error operations and maximum availability."
            },
            {
              "icon": "Plane",
              "title": "Airport Utility Management",
              "description": "We are the silent force behind international hubs like DIAL, managing critical high-voltage assets, fire safety, and mechanical systems to ensure uninterrupted operations."
            },
            {
              "icon": "Database",
              "title": "Integrated ERP Support",
              "description": "All our sites are linked via a single ERP system, providing central project management and inventory support from our Noida headquarters for seamless operations."
            }
          ]
        }
      },
      {
        "id": "cmuoccczy0040lqb6oovgv4jw",
        "type": "StewardshipPhilosophy",
        "order": 2,
        "content": {
          "items": [
            {
              "icon": "ShieldCheck",
              "title": "Zero-Error Focus"
            },
            {
              "icon": "Activity",
              "title": "Predictive Diagnostics"
            },
            {
              "icon": "Database",
              "title": "Centralized ERP"
            },
            {
              "icon": "Settings",
              "title": "24/7 Monitoring"
            }
          ],
          "paragraphs": [
            "Maintenance is reactive; stewardship is proactive. As independent O&M specialists, we take total responsibility for the health of your assets.",
            "Our approach integrates predictive diagnostics, rigorous safety protocols, and continuous performance optimization. We don't just fix what's broken; we prevent failures before they occur, maximizing the lifespan and profitability of your infrastructure."
          ],
          "headingPart1": "The Difference Between ",
          "headingHighlight": "Maintenance & Stewardship"
        }
      },
      {
        "id": "cmuoccd030042lqb6xs263d04",
        "type": "CTASection",
        "order": 3,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Experience True Stewardship",
          "ctaLabel": "Partner With Us",
          "description": "Let us take responsibility for your assets so you can focus on your core business."
        }
      }
    ]
  },
  {
    "id": "cmuoccd3i0055lqb6kydtlhbd",
    "title": "Privacy Policy",
    "slug": "privacy-policy",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd.",
    "metaTitle": "Privacy Policy - Encotec Energy (India)",
    "metaDescription": "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd. Learn about our personal data processing, data subject rights, cookies, and regulatory compliance.",
    "targetKeywords": "privacy policy, data protection, encotec energy, GDPR, personal data, whistleblower directive",
    "canonicalUrl": "https://www.encotecenergy.com/en/privacy-policy/",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": "Privacy Policy - Encotec Energy (India)",
    "ogDescription": "Official Privacy Policy of Encotec Energy (India) Pvt. Ltd. Learn how we protect and manage personal data.",
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuoccd3z0057lqb6radyf2ap",
        "type": "PrivacyContent",
        "order": 0,
        "content": {
          "headline": "Privacy Policy",
          "breadcrumb": "Start / Privacy Policy",
          "contentBlocks": [
            {
              "text": "General Information",
              "type": "heading"
            },
            {
              "text": "Below we inform you about the collection of personal data when using our website www.encotecenergy.com.",
              "type": "paragraph"
            },
            {
              "type": "list",
              "items": [
                "1. The term 'personal data', with reference to the definition in Art. 4 No. 1 of Regulation (EU) 2016/679 (DSGVO / GDPR) and applicable national data protection legislation, means all data that can be related to you personally (such as name, address, e-mail addresses and user behaviour).",
                "2. We process personal data as a matter of principle only to the extent necessary to provide a functioning website and the content and services offered by us.",
                "3. Your personal data will be deleted or blocked as soon as the purpose of storage no longer applies or statutory retention periods expire.",
                "4. If we wish to use contracted service providers for individual functions on our website or use your data for advertising purposes, we inform you in detail about the respective processes."
              ]
            },
            {
              "text": "Responsible Office",
              "type": "heading"
            },
            {
              "text": "Encotec Energy (India) Pvt. Ltd.\nlegally represented by the managing directors Arun Kumar Sarna, Rajeev Ahuja\n\nC-85, Sector-63\nNoida-201 301\nUttar Pradesh\nIndia\n\nPhone: +91 120 4155612 | Fax: +91 120 4540611\nEmail: rajeev.ahuja@encotecenergy.com",
              "type": "quote"
            },
            {
              "text": "Data Protection Officer",
              "type": "heading"
            },
            {
              "text": "You can contact our data protection officer at: Rajeev Ahuja, Encotec Energy (India) Pvt. Ltd., C-85, Sector-63, Noida-201 301, Uttar Pradesh, India. Phone: +91 120 4155612, Email: rajeev.ahuja@encotecenergy.com",
              "type": "paragraph"
            },
            {
              "text": "Your Rights",
              "type": "heading"
            },
            {
              "type": "list",
              "items": [
                "The right to information / access to personal data stored with us",
                "The right to rectification of inaccurate data and erasure ('right to be forgotten')",
                "The right to restriction of data processing during verification",
                "The right to object to data processing for legitimate reasons or advertising/analytics",
                "The right to data portability in structured machine-readable format",
                "The right to lodge complaints with a competent data protection supervisory authority"
              ]
            },
            {
              "text": "Processing of Personal Data for Informational Website Use",
              "type": "heading"
            },
            {
              "text": "If you access our website without registering, we only collect technically necessary data transmitted by your web browser to ensure security, optimization and uptime stability:",
              "type": "paragraph"
            },
            {
              "type": "list",
              "items": [
                "Browser type and browser version",
                "Operating system used",
                "Referrer URL",
                "Hostname of the accessing computer",
                "Time of the server request",
                "IP address (stored in server log files for maximum 7 days)"
              ]
            },
            {
              "text": "Processing of Personal Data by Cookies",
              "type": "heading"
            },
            {
              "text": "We use transient (session) cookies, persistent cookies, and local storage objects to remember visitor preferences and provide secure features. For complete cookie settings and opt-out instructions, visit our Cookie Policy.",
              "type": "paragraph"
            },
            {
              "text": "Further Functions & Services of Our Website",
              "type": "heading"
            },
            {
              "text": "In addition to informational use, we process inquiry data and partner service requests under strict confidentiality agreements with vetted service providers.",
              "type": "paragraph"
            },
            {
              "text": "Objection or Revocation Against Data Processing",
              "type": "heading"
            },
            {
              "text": "You can revoke your consent or object to the processing of your data at any time by contacting our office or emailing rajeev.ahuja@encotecenergy.com.",
              "type": "paragraph"
            },
            {
              "text": "Processing of Personal Data in Connection with Applications",
              "type": "heading"
            },
            {
              "text": "Candidate applications and resume details are processed exclusively for recruitment evaluations and deleted within 6 months of procedure completion unless talent pool consent is given.",
              "type": "paragraph"
            },
            {
              "text": "EU Whistleblower Directive & Compliance",
              "type": "heading"
            },
            {
              "text": "personal / confidential / locked\nLegal Counsel / Compliance Officer\nEncotec Energy (India) Pvt. Ltd.\nC-85, Sector-63\nNoida-201 301\nUttar Pradesh, India",
              "type": "quote"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "cmuocccz1003jlqb606ws933d",
    "title": "Project Management",
    "slug": "project-management",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Structured project conceptualisation and development services.",
    "metaTitle": "Project Management - Encotec",
    "metaDescription": "Structured project conceptualisation and development services.",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccz4003llqb66a7s80sy",
        "type": "ProjectHero",
        "order": 0,
        "content": {
          "label": "PROJECT CONCEPTUALIZATION & DEVELOPMENT",
          "description": "A great project doesn't start with a shovel in the ground; it starts with a logical, well-vetted plan. We are your strategic developers who ensure your project is technically sound and financially viable from day one.",
          "headingPart1": "Building Your Vision on a ",
          "floatingBadges": [
            {
              "icon": "Map",
              "text": "Pre-Feasibility"
            },
            {
              "icon": "FileText",
              "text": "DPR Creation"
            },
            {
              "icon": "Briefcase",
              "text": "EPC Selection"
            }
          ],
          "headingHighlight": "Logical Foundation"
        }
      },
      {
        "id": "cmuocccz5003nlqb6tjyd31s3",
        "type": "PhilosophySection",
        "order": 1,
        "content": {
          "features": [
            {
              "desc": "Aligning technical goals with business goals.",
              "icon": "Target",
              "title": "Strategic Alignment"
            },
            {
              "desc": "Rigorous financial and economic analysis.",
              "icon": "FileCheck",
              "title": "Financial Viability"
            },
            {
              "desc": "Facilitating the right contracting.",
              "icon": "Users",
              "title": "Partner Selection"
            },
            {
              "desc": "Identifying challenges before they arise.",
              "icon": "ShieldCheck",
              "title": "Risk Mitigation"
            }
          ],
          "paragraphs": [
            "We are not \"detailed engineering\" firms that gets lost in the minutiae. We understand that the earliest decisions in a project lifecycle have the most profound impact on its ultimate success.",
            "By adopting an \"Owner's Mindset\" from the very beginning, we evaluate site conditions, resource potential, and financial models to ensure your investment is built on reality, not just theory. We provide the clarity required for stakeholder confidence and project approval."
          ],
          "headingPart1": "Not Just Detailed Engineering. ",
          "headingHighlight": "Strategic Development."
        }
      },
      {
        "id": "cmuocccz8003plqb6fws52tyy",
        "type": "CoreOfferings",
        "order": 2,
        "content": {
          "heading": "Our Development Services",
          "offerings": [
            {
              "icon": "Map",
              "title": "Feasibility & Pre-Feasibility Studies",
              "description": "We evaluate the conditions and resource potential to ensure your investment is built on reality, not just theory. Our comprehensive studies cover technical, economic, and environmental factors."
            },
            {
              "icon": "FileText",
              "title": "Detailed Project Reports (DPR)",
              "description": "We provide the technical and financial clarity required for stakeholder confidence and project approval. Our DPRs are an effective blueprint for project execution and financing."
            },
            {
              "icon": "Briefcase",
              "title": "Strategic Sourcing & EPC Selection",
              "description": "We develop rigorous technical specifications and help you finalize EPC contractors, ensuring you have the right partners by your side. We manage the entire tendering and evaluation process."
            }
          ],
          "description": "End-to-end conceptualization to ensure your project starts strong."
        }
      },
      {
        "id": "cmuoccczb003rlqb6xpc2siei",
        "type": "StatsSection",
        "order": 3,
        "content": {
          "stats": [
            {
              "label": "Managed capacity under stewardship",
              "value": 20,
              "suffix": "+ GW"
            },
            {
              "label": "Owner's Mindset",
              "value": 100,
              "suffix": "%"
            },
            {
              "label": "Specialized Engineers",
              "value": 350,
              "suffix": "+"
            }
          ]
        }
      },
      {
        "id": "cmuoccczd003tlqb6fidl3k32",
        "type": "CTASection",
        "order": 4,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Ready to Build Your Vision?",
          "ctaLabel": "Start the Conversation",
          "description": "Let's start your project on a logical foundation with our expert conceptualization and development services."
        }
      }
    ]
  },
  {
    "id": "cmuocccuz0017lqb6cgbyk57s",
    "title": "Services",
    "slug": "services",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "encotec Services",
    "metaTitle": "Our Services - Encotec",
    "metaDescription": "Explore our range of engineering and advisory services",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuocccv00019lqb6b7k1v9ix",
        "type": "ServicesHero",
        "order": 0,
        "content": {
          "tagline": "Our Services",
          "description": "We bridge the gap between technical complexity and commercial success. Whether you are conceptualizing a new plant or optimizing an existing one, we provide the end-to-end expertise required to keep your world running.",
          "headingPart1": "Integrated Solutions Across the",
          "headingItalicHighlight": "Asset Lifecycle"
        }
      },
      {
        "id": "cmuocccv2001blqb6i8zeo7dg",
        "type": "IntroSection",
        "order": 1,
        "content": {
          "paragraph1": "At Encotec, we don't just provide engineering services; we provide peace of mind. We approach every facility we manage with an \"Owner's Mindset\", meaning we treat your infrastructure with the same care, precision, and long-term vision as if it were our own.",
          "paragraph2": "With a family of 2200+ personnel and 350+ specialized engineers, we bridge the gap between technical complexity and commercial success. Below is an overview of how we provide end-to-end expertise across the asset lifecycle."
        }
      },
      {
        "id": "cmuocccv5001dlqb6t71cnsax",
        "type": "CoreServices",
        "order": 2,
        "content": {
          "heading": "Core Services",
          "services": [
            {
              "icon": "Target",
              "link": "/services/project-management",
              "title": "Project Conceptualisation & Development",
              "value": [
                "Technically sound planning",
                "Financially viable projects",
                "Stakeholder confidence"
              ],
              "overview": "We help you build on a solid foundation, from pre-feasibility studies to the final selection of your EPC partners.",
              "capabilities": [
                "Feasibility & Pre-Feasibility Studies",
                "Detailed Project Reports (DPR)",
                "Strategic Sourcing & Technical Specifications",
                "EPC Contractor Selection",
                "Contract Mobilisation",
                "Engineering Review",
                "Procurement  Manufacturing and Inspection oversight",
                "Construction Supervision",
                "Pre- Commissioning, Commissioning and Testing",
                "Handover and Closeout"
              ]
            },
            {
              "icon": "HardHat",
              "link": "/services/construction-commissioning",
              "title": "Construction, Commissioning & Relocation",
              "value": [
                "Speed and safety",
                "Seamless cross-border transitions",
                "Physical realization of complex assets"
              ],
              "overview": "Whether it's a new build or moving an entire plant across borders, we handle the complex installation and synchronization of your assets.",
              "capabilities": [
                "Multi-Sector Construction Expertise",
                "International Commissioning",
                "Grid Synchronization & Performance Tests",
                "Asset Dismantling & Relocation",
                "Complex IBR Piping Erection"
              ]
            },
            {
              "icon": "Settings",
              "link": "/services/power-generation",
              "title": "Asset Stewardship (O&M)",
              "value": [
                "Optimized megawatt production",
                "Long-term asset health",
                "Owner-perspective care"
              ],
              "overview": "As a leading independent power plant O&M specialist in India, we provide continuous care for thermal plants, international airports, and critical utilities.",
              "capabilities": [
                "Thermal & Supercritical Mastery",
                "Airport Utility Management",
                "Integrated ERP Support",
                "Zero-Error Operations",
                "Risk Management & Reliability Focus"
              ]
            },
            {
              "icon": "ClipboardCheck",
              "link": "/services/technical-advisory",
              "title": "Expert Advisory & Performance Audits",
              "value": [
                "Reduced megawatt production costs",
                "Improved workplace safety",
                "Restored operational efficiency"
              ],
              "overview": "When problems arise or efficiency drops, our specialists provide on-site diagnostics and high-level technical solutions.",
              "capabilities": [
                "Specialised Testing (NDT)",
                "Energy Efficiency Audits",
                "Steam Path Audits",
                "5S & Process Improvement",
                "High-Level Problem Solving"
              ]
            },
            {
              "icon": "ShieldCheck",
              "link": "/services/due-diligence",
              "title": "Due Diligence & Asset Health",
              "value": [
                "Informed investment decisions",
                "Understanding true asset value",
                "Future-proofed infrastructure"
              ],
              "overview": "We evaluate the \"residual life\" of older plants to help owners make informed decisions about acquisitions or relocations.",
              "capabilities": [
                "Residual Life Assessment (RLA)",
                "Technical Due Diligence",
                "Independent Technical Audits",
                "Revamping & Restoration Strategy",
                "Environmental Compliance Planning"
              ]
            },
            {
              "icon": "Package",
              "link": "/services/value-added",
              "title": "Strategic Global Sourcing (Spare Parts)",
              "value": [
                "Reduced downtime",
                "Strategic sourcing partnerships",
                "Guaranteed specification performance"
              ],
              "overview": "Access our trusted network of major OEMs in China, Vietnam, and India to keep your facility running without interruption.",
              "capabilities": [
                "Global OEM Network (65+ tie-ups)",
                "Comprehensive Inventory Supply",
                "High-Pressure Boiler Spares",
                "Electrical Actuators & Mill Rollers",
                "Engineering Integration Support"
              ]
            }
          ],
          "showLessLabel": "Show Less",
          "viewDetailsLabel": "View Details",
          "exploreServiceLabel": "Explore Service",
          "valueDeliveredLabel": "Value Delivered",
          "keyCapabilitiesLabel": "Key Capabilities"
        }
      },
      {
        "id": "cmuocccvd001flqb647iv3q03",
        "type": "IndustriesSection",
        "order": 3,
        "content": {
          "heading": "Industries We Serve",
          "industries": [
            {
              "icon": "Flame",
              "name": "Power Generation",
              "subtitle": "Thermal & Renewable"
            },
            {
              "icon": "Network",
              "name": "Transmission & Distribution",
              "subtitle": "Grid Infrastructure"
            },
            {
              "icon": "Building",
              "name": "Infrastructure & Industrial",
              "subtitle": "Facilities"
            },
            {
              "icon": "Plane",
              "name": "Airports & Utility Systems",
              "subtitle": "Critical Infrastructure"
            },
            {
              "icon": "Zap",
              "name": "Energy & Climate Projects",
              "subtitle": "Sustainable Solutions"
            }
          ],
          "description": "We deliver solutions across a wide range of sectors"
        }
      },
      {
        "id": "cmuocccvf001hlqb69kfmkiu6",
        "type": "ProcessSection",
        "order": 4,
        "content": {
          "steps": [
            {
              "title": "Assess",
              "number": "01",
              "description": "Technical and commercial evaluation"
            },
            {
              "title": "Design",
              "number": "02",
              "description": "Engineering and system planning"
            },
            {
              "title": "Execute",
              "number": "03",
              "description": "Construction and commissioning"
            },
            {
              "title": "Operate",
              "number": "04",
              "description": "Maintenance and optimization"
            }
          ],
          "heading": "How We Deliver",
          "description": "Our structured approach ensures precision and reliability at every stage"
        }
      },
      {
        "id": "cmuocccvh001jlqb6us9x04o4",
        "type": "ClosingSection",
        "order": 5,
        "content": {
          "ctaUrl": "/contact",
          "ctaLabel": "Start Your Project",
          "headingPart1": "Our integrated approach ensures that every project - ",
          "headingPart2": " - is delivered with precision, reliability, and long-term performance in mind.",
          "headingHighlight": "from concept to operation"
        }
      }
    ]
  },
  {
    "id": "cmuoccd0t004elqb6q87bllt0",
    "title": "Technical Advisory & Performance Audits",
    "slug": "technical-advisory",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Expert advisory and performance diagnostic audits.",
    "metaTitle": "Technical Advisory & Performance Audits | Encotec",
    "metaDescription": "Expert technical advisory, performance diagnostic audits, and plant modernization services for power generation and industrial facilities.",
    "targetKeywords": "",
    "canonicalUrl": "",
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": {},
    "sections": [
      {
        "id": "cmuoccd10004glqb6sqis14zm",
        "type": "AdvisoryHero",
        "order": 0,
        "content": {
          "label": "Expert Advisory & Performance Audits",
          "description": "When a plant is running but not performing, or when technical faults disrupt your peace of mind, our expert advisory team steps in. We provide high-level problem solving that goes beyond basic maintenance.",
          "headingPart1": "Solving the Hardest ",
          "headingHighlight": "Engineering Problems"
        }
      },
      {
        "id": "cmuoccd18004ilqb67lmuglfl",
        "type": "AdvisoryFeatures",
        "order": 1,
        "content": {
          "features": [
            {
              "icon": "Search",
              "title": "Specialised Testing (NDT)",
              "description": "We use Non-Destructive Testing to assess the health of your equipment without causing further downtime. Identify micro-fractures and wear before they lead to catastrophic failure."
            },
            {
              "icon": "Activity",
              "title": "Efficiency Audits",
              "description": "Our in-house team conducts energy efficiency and steam path audits to identify savings and reduce your carbon footprint. We find the lost megawatts in your system."
            },
            {
              "icon": "TrendingUp",
              "title": "5S & Process Improvement",
              "description": "We implement industrial standards (5S) to improve workplace safety and operational flow. A clean, organized plant is a safe and efficient plant."
            }
          ]
        }
      },
      {
        "id": "cmuoccd1e004klqb6vkfhqymh",
        "type": "DiagnosticProcess",
        "order": 2,
        "content": {
          "steps": [
            {
              "desc": "Comprehensive site evaluation and data gathering",
              "step": "01",
              "title": "Assess"
            },
            {
              "desc": "Deep dive into performance metrics and NDT results",
              "step": "02",
              "title": "Analyze"
            },
            {
              "desc": "Actionable recommendations for improvement",
              "step": "03",
              "title": "Advise"
            },
            {
              "desc": "Implementation support and verification",
              "step": "04",
              "title": "Optimize"
            }
          ],
          "heading": "Our Diagnostic Approach",
          "description": "We don't guess; we measure. Our advisory services are built on hard data and deep engineering expertise."
        }
      },
      {
        "id": "cmuoccd1r004mlqb694bf7gmk",
        "type": "CTASection",
        "order": 3,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Is Your Asset Reaching Its Full Potential?",
          "ctaLabel": "Request an Audit",
          "description": "Speak with our specialized engineers about our expert advisory and performance audits."
        }
      }
    ]
  },
  {
    "id": "cmuoccd2o004wlqb656bo4wau",
    "title": "Value-Added Services",
    "slug": "value-added",
    "parent": "-",
    "order": 0,
    "type": "standard",
    "visibility": "public",
    "isStatic": true,
    "description": "Strategic global sourcing and spare parts supply.",
    "metaTitle": "Value-Added Services - Encotec",
    "metaDescription": "Strategic global sourcing and spare parts supply.",
    "targetKeywords": null,
    "canonicalUrl": null,
    "noIndex": false,
    "featuredImage": null,
    "ogTitle": null,
    "ogDescription": null,
    "ogImage": null,
    "schema": null,
    "headingOptions": null,
    "sections": [
      {
        "id": "cmuoccd2r004ylqb6g4b4or9n",
        "type": "SourcingHero",
        "order": 0,
        "content": {
          "label": "STRATEGIC GLOBAL SOURCING",
          "description": "Downtime is often caused by a missing part, not a missing plan. Encotec acts as your strategic sourcing partner, leveraging deep relationships with manufacturers to get you what you need, when you need it.",
          "headingPart1": "The Global Link for ",
          "headingHighlight": "Critical Equipment"
        }
      },
      {
        "id": "cmuoccd2w0050lqb6wg6azrkg",
        "type": "SourcingFeatures",
        "order": 1,
        "content": {
          "features": [
            {
              "icon": "Globe",
              "title": "Global OEM Network",
              "description": "We have established tie-ups with 65+ major OEMs in China, Vietnam, and India, giving you direct access to high-quality components without the logistical headache."
            },
            {
              "icon": "Package",
              "title": "Comprehensive Inventory",
              "description": "We supply everything from high-pressure boiler spares to coal mill rollers, specialized electrical actuators, and valves."
            },
            {
              "icon": "Wrench",
              "title": "Technical Support",
              "description": "We don't just supply parts; we provide the engineering support to ensure they are integrated correctly and perform to specification."
            }
          ]
        }
      },
      {
        "id": "cmuoccd320052lqb6u4lp6fxr",
        "type": "SourcingAdvantage",
        "order": 2,
        "content": {
          "cards": [
            {
              "icon": "ShieldCheck",
              "title": "Quality Assured"
            },
            {
              "icon": "Truck",
              "title": "Logistics Managed"
            },
            {
              "icon": "Network",
              "title": "Vast network"
            },
            {
              "icon": "Globe",
              "title": "Global OEMs"
            },
            {
              "icon": "Wrench",
              "title": "Engineering Backed"
            }
          ],
          "paragraphs": [
            "Our engineering team vets every supplier and verifies every specification. We handle the complex logistics, customs clearance, and quality assurance, delivering peace of mind along with your critical spares."
          ],
          "description": "Procurement is transactional; strategic sourcing is a partnership. Because we operate plants ourselves, we understand the critical difference between a part that \"fits\" and a part that \"performs\".",
          "headingPart1": "More Than Just ",
          "headingHighlight": "Procurement"
        }
      },
      {
        "id": "cmuoccd360054lqb6ic36zkuw",
        "type": "CTASection",
        "order": 3,
        "content": {
          "ctaUrl": "/contact",
          "heading": "Sourcing Critical Spares?",
          "ctaLabel": "Request a Quote",
          "description": "Access our network of major OEMs in China, Vietnam, and beyond for your spare part needs."
        }
      }
    ]
  }
];

const enquiriesData = [
  {
    "id": "cmvwfpzdd0001lqtqsnb8eej1",
    "name": "Richard Lawson",
    "email": "richard.lawson@jmailservice.com",
    "interestedIn": "Asset Stewardship (O&M)",
    "budget": "Richard Lawson",
    "projectGoals": "Phone: 8054002077\nCompany: Richard Lawson\nLocation: traffic\nService Required: Asset Stewardship (O&M)\nMessage:\nIf I could get your business in front of hundreds of local searchers by tomorrow - would you be interested?",
    "createdAt": "2026-10-31T13:26:26.641Z",
    "updatedAt": "2026-10-31T13:26:26.641Z"
  },
  {
    "id": "cmvs7izmm0000lqtq9uy8fw3b",
    "name": "AFSAR HUSSAIN",
    "email": "afsarhussain1999@gmail.com",
    "interestedIn": "Asset Stewardship (O&M)",
    "budget": "Jindal power limited Under Noble Enterprises",
    "projectGoals": "Phone: +917277126760\nCompany: Jindal power limited Under Noble Enterprises\nLocation: Odisha\nService Required: Asset Stewardship (O&M)\nMessage:\nI am AFSAR HUSSAIN, I am Diploma Electrical Engineering, I have 8 years experience in INSTRUMENTATION",
    "createdAt": "2026-10-28T14:25:58.749Z",
    "updatedAt": "2026-10-28T14:25:58.749Z"
  },
  {
    "id": "cmvas98cb0002lqegsrxhbbqd",
    "name": "Ashish hadbe ",
    "email": "ashish5hadbe@gmail.com",
    "interestedIn": "General Business Enquiry",
    "budget": "Ashahitech ",
    "projectGoals": "Phone: 8208735113\nCompany: Ashahitech \nLocation: Maharashtra \nService Required: General Business Enquiry\nMessage:\nCall me ",
    "createdAt": "2026-10-16T09:46:24.250Z",
    "updatedAt": "2026-10-16T09:46:24.250Z"
  },
  {
    "id": "cmv7saf4s0004lqoureahvv74",
    "name": "dheeraj kumar",
    "email": "dk0733652@gmail.com",
    "interestedIn": "General Business Enquiry",
    "budget": "prayagraj power generation company",
    "projectGoals": "Phone: 8948905689\nCompany: prayagraj power generation company\nLocation: prayagraj power generation company\nService Required: General Business Enquiry\nMessage:\nsir please talk to me about vacancy in company",
    "createdAt": "2026-10-14T07:24:01.153Z",
    "updatedAt": "2026-10-14T07:24:01.153Z"
  },
  {
    "id": "cmv2w2hs90006lq96fcv8aedp",
    "name": "Lisa Bassett",
    "email": "lisa@veisaworkair.com",
    "interestedIn": "Asset Stewardship (O&M)",
    "budget": "Crystal Springs West",
    "projectGoals": "Phone: +19703096633\nCompany: Crystal Springs West\nLocation: N/A\nService Required: Asset Stewardship (O&M)\nMessage:\nWe are currently evaluating potential partners for upcoming projects and came across your company.\n\nCould you please connect me with the appropriate contact person in your firm for the project.\n\nI would appreciate it if you could kindly get back to me at your earliest convenience so we can discuss this opportunity further.",
    "createdAt": "2026-10-10T21:10:58.953Z",
    "updatedAt": "2026-10-10T21:10:58.953Z"
  },
  {
    "id": "cmv0v371v0005lq96jcxiwnfb",
    "name": "GOVIND SAHU",
    "email": "govindkumarsahu@ntpc.co.in",
    "interestedIn": "General Business Enquiry",
    "budget": "NTPC Limited",
    "projectGoals": "Phone: +91 9708455108\nCompany: NTPC Limited\nLocation: NTPC SIPAT 500 MW UNIT\nService Required: General Business Enquiry\nMessage:\nI serached and found that Encotech Limited is supplier of Plasma ignition system to power plants. Please provide Quotation of plasma ignition system for our 500 MW BHEL unit in one elevation.",
    "createdAt": "2026-10-09T11:07:59.722Z",
    "updatedAt": "2026-10-09T11:07:59.722Z"
  },
  {
    "id": "cmuwq2b0s0007lqa8bctlh53j",
    "name": "Christopher Hughes",
    "email": "christopher.hughes@jmailservice.com",
    "interestedIn": "Asset Stewardship (O&M)",
    "budget": "Christopher Hughes",
    "projectGoals": "Phone: 8054002077\nCompany: Christopher Hughes\nLocation: traffic\nService Required: Asset Stewardship (O&M)\nMessage:\nOur system drives targeted traffic to your website within 24 hours of setup. You pick the keywords, we do the rest.\nIs this something you'd like to explore?",
    "createdAt": "2026-10-06T13:36:15.435Z",
    "updatedAt": "2026-10-06T13:36:15.435Z"
  },
  {
    "id": "cmugvwu3d000dlqtr7mqsrmgl",
    "name": "Rajeev Ahuja",
    "email": "rajeevahuja70@gmail.com",
    "interestedIn": "general",
    "budget": "TENS",
    "projectGoals": "Phone: +91 9811662417\nCompany: TENS\nMessage:\nTest Message.",
    "createdAt": "2026-09-25T11:35:39.096Z",
    "updatedAt": "2026-09-25T11:35:39.096Z"
  },
  {
    "id": "cmugvmkmd000blqtr1bkkql3z",
    "name": "Rajeev Ahuja",
    "email": "rajeevahuja70@gmail.com",
    "interestedIn": "general",
    "budget": "TENS",
    "projectGoals": "Phone: +91 9811662417\nCompany: TENS\nMessage:\nTest Message",
    "createdAt": "2026-09-25T11:27:40.253Z",
    "updatedAt": "2026-09-25T11:27:40.253Z"
  }
];

const jobApplicationsData = [
  {
    "id": "cmv68hhfg0008lq96f8a0orcl",
    "name": "Jitender Singh",
    "email": "jsraguvanshi1911@gmail.com",
    "phone": "+91 7000027204",
    "jobTitle": "Sr. HR Executive / HR Executive – Corporate Office",
    "department": "HR",
    "jobLocation": "Corporate Office, Noida",
    "experience": "12 Years",
    "coverLetter": "I am writing to express my interest in an HR Business Partner role within your organization. With over 12+ years of progressive experience spanning talent acquisition, employee relations, statutory compliance, payroll administration, and full employee lifecycle management, I am confident I can contribute meaningfully to your HR function from day one. I have built strong capabilities in industrial relations, grievance resolution, compensation and offer management, and HRIS platforms including SAP Success Factors and Darwinbox.",
    "resumeName": "Mr Jitender_Singh_HRBP.docx",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/raw/upload/v1791868911/encotec-resumes/a66ctesnzzat58lwsops",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-13T05:21:52.242Z",
    "updatedAt": "2026-10-13T05:21:52.242Z"
  },
  {
    "id": "cmv64mo2c0007lq96g8pldo1b",
    "name": "nilesh soni",
    "email": "nilesh_soni_87@yahoo.co.in",
    "phone": "7999505036",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "15",
    "coverLetter": null,
    "resumeName": "Nilesh soni Resume for Mechanical Manager (CPP & Utility) .pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791862435/encotec-resumes/xrfia2uohnndhapslm2h.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-13T03:33:55.668Z",
    "updatedAt": "2026-10-13T03:33:55.668Z"
  },
  {
    "id": "cmuy1fnpt000blqa84blwb0fb",
    "name": "Shubham Kumar yadav",
    "email": "shubhamyadavy906@gmail.com",
    "phone": "9229826740",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "3",
    "coverLetter": null,
    "resumeName": "shubham kumar yadav-1.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791373339/encotec-resumes/xk9xftcs4qukqmggh6cq.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-07T11:42:20.357Z",
    "updatedAt": "2026-10-07T11:42:20.357Z"
  },
  {
    "id": "cmuwxeezt000alqa8cjbm7lgh",
    "name": "Shubham Kumar",
    "email": "shubham.kmr.9115@gmail.com",
    "phone": "+919115374739",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "02 diploma electrical engineering",
    "coverLetter": "Name shubham Kumar \nDiploma electrical engineering experience 2 years NTPC Tanda Ambedkar Nagar Uttar Pradesh",
    "resumeName": "polytechnic.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791306097/encotec-resumes/qfsrp9d4wej4gpsjc10y.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-06T17:01:37.759Z",
    "updatedAt": "2026-10-06T17:01:37.759Z"
  },
  {
    "id": "cmuwwwc5h0009lqa8vi7eads3",
    "name": "Shubham Kumar",
    "email": "shubham.kmr.9115@gmail.com",
    "phone": "+919115374739",
    "jobTitle": "Sr. HR Executive / HR Executive – Site HR & Administration",
    "department": "HR",
    "jobLocation": "Thermal Power Plant Sites PAN India",
    "experience": "02 diploma electrical engineering",
    "coverLetter": "Name shubham Kumar \nDiploma electrical engineering \n02 years Experience NTPC Tanda Ambedkar Nagar Uttar Pradesh \nDepartment control and instrumentation tecnician maintinance",
    "resumeName": "polytechnic.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791305253/encotec-resumes/gzrhljmvspwwvrntusbk.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-06T16:47:34.247Z",
    "updatedAt": "2026-10-06T16:47:34.247Z"
  },
  {
    "id": "cmuwu7tk40008lqa8r551i316",
    "name": "Suraj Yadav",
    "email": "surajyadav5548@gmail.com",
    "phone": "7235895281",
    "jobTitle": "Sr. HR Executive / HR Executive – Site HR & Administration",
    "department": "HR",
    "jobLocation": "Thermal Power Plant Sites PAN India",
    "experience": "1.5",
    "coverLetter": "Immediate join 7days",
    "resumeName": "Suraj_Resume_Updated.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791300750/encotec-resumes/uookawnmdubyqnifmr1s.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-06T15:32:31.189Z",
    "updatedAt": "2026-10-06T15:32:31.189Z"
  },
  {
    "id": "cmuv4wra00005lqa80k5s8bn2",
    "name": "Biswajeet Behera",
    "email": "biswajeetbehera17@gmail.com",
    "phone": "+917606085179",
    "jobTitle": "Head – Corporate Safety (EHS)",
    "department": "EHS",
    "jobLocation": "Corporate Office, Noida",
    "experience": "9yrs experience know as a HSE Manager",
    "coverLetter": "Senior HSE / Corporate Safety Professional with strong experience in developing and leading organization-wide Health, Safety & Environment (HSE) strategies across multiple sites, projects, and business operations. Proven ability to build a strong safety culture, strengthen compliance systems, reduce workplace incidents, and drive continuous improvement in safety performance.\n\nExperienced in HSE governance, risk management, audits & compliance, incident investigation, emergency preparedness, contractor safety, safety training, ISO management systems, and leadership engagement. Adept at translating corporate safety objectives into practical site-level initiatives and measurable performance outcomes.\n\nKey Achievements:-\nDeveloped and implemented corporate HSE policies, standards, procedures, and safety governance frameworks across multiple locations.\nLed initiatives focused on incident reduction, risk mitigation, near-miss reporting, and proactive safety culture development.\nStrengthened HSE audit and compliance systems, ensuring alignment with statutory requirements and applicable ISO standards.\nEstablished effective contractor and subcontractor safety management systems, including competency assessment, induction, audits, and performance monitoring.\nImproved employee safety awareness through leadership safety programs, toolbox talks, training, behavioral safety initiatives, and management engagement.\nLed incident/accident investigations and root-cause analysis, ensuring corrective and preventive actions were implemented effectively.\nSupported senior management with HSE dashboards, KPIs, risk reviews, compliance reporting, and strategic safety recommendations.\nSuccessfully managed emergency preparedness, crisis response, fire & life safety, occupational safety, and business continuity-related initiatives.\nNotice Period\n\nNotice Period: 30 Days\nAvailability: Can join as per organizational requirement, with flexibility to discuss an earlier joining date where feasible.\n\nCareer Value Proposition:-\n“My objective is to build a proactive, business-aligned safety culture where HSE is not only a compliance function but a core part of operational excellence, employee well-being, and sustainable business growth.”",
    "resumeName": "Biswajeet Resume.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791197777/encotec-resumes/a6x9y6uphslhcpk8jhmm.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-05T10:56:18.406Z",
    "updatedAt": "2026-10-05T10:56:18.406Z"
  },
  {
    "id": "cmuuvgg1m0004lqa8hz142e6o",
    "name": "Kiran Mahagaonker",
    "email": "Kiran.max@gmail.com",
    "phone": "+919945168462",
    "jobTitle": "Project Manager",
    "department": "Project Management",
    "jobLocation": "Corporate Office, Noida",
    "experience": "19 / Senior Manager - Projects",
    "coverLetter": null,
    "resumeName": "Kiran_Mahagaonker_Resume.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791181900/encotec-resumes/tfwacxica7xoifzu3rff.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-05T06:31:40.846Z",
    "updatedAt": "2026-10-05T06:31:40.846Z"
  },
  {
    "id": "cmuuux75r0003lqa8c6jg8bi6",
    "name": "Rohit Poswal",
    "email": "poswal_rohit@yahoo.com",
    "phone": "8708654214",
    "jobTitle": "Project Manager",
    "department": "Project Management",
    "jobLocation": "Corporate Office, Noida",
    "experience": "17",
    "coverLetter": "Dear Sir/Madam,\n\nI am writing to express my interest in suitable senior-level opportunities within your organization. I bring extensive experience in O&M, project execution, plant operations, manpower management, commissioning, and contract management in the power sector.\n\nWith more than 15 years of professional experience, I have been involved in managing O&M activities, project execution, plant commissioning and handover, manpower deployment, client coordination, billing, and overall site operations. My experience includes handling large-scale power plant projects and coordinating with clients, contractors, and multidisciplinary teams to ensure safe, reliable, and cost-effective operations.\n\nI am confident that my technical expertise, leadership capabilities, and hands-on experience in managing complex site operations can contribute significantly to your organization.\n\nI would appreciate the opportunity to discuss how my experience and skills can meet your current requirements. Please find my CV attached for your kind consideration.",
    "resumeName": "rohit Resume.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791181002/encotec-resumes/vlxzf83nudoencwfzncz.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-05T06:16:42.847Z",
    "updatedAt": "2026-10-05T06:16:42.847Z"
  },
  {
    "id": "cmuu1s1x30002lqa8d5e3teut",
    "name": "Gaurav Kumar",
    "email": "gaurav.kumar29109@gmail.com",
    "phone": "8210919347",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "10",
    "coverLetter": null,
    "resumeName": "Gaurav_Kumar_Solar_Energy_ATS_Resume.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1791132053/encotec-resumes/kqkat2wnjtweyzpzv1rq.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-10-04T16:40:53.943Z",
    "updatedAt": "2026-10-04T16:40:53.943Z"
  },
  {
    "id": "cmum8i1ad0000lqmgt38dvq7y",
    "name": "Shivam Kumar Mishra",
    "email": "shivamishra472@gmail.com",
    "phone": "+917985397963",
    "jobTitle": "Sr. HR Executive / HR Executive – Site HR & Administration",
    "department": "HR",
    "jobLocation": "Thermal Power Plant Sites PAN India",
    "experience": "Site Manager",
    "coverLetter": null,
    "resumeName": "SHIVAM KUMAR MISHRA RESUME (1).pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1790659613/encotec-resumes/lc3ao3yx1wcoddutnech.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-29T05:26:54.468Z",
    "updatedAt": "2026-09-29T05:26:54.468Z"
  },
  {
    "id": "cmujtc96o000glqtrv0g70w69",
    "name": "Shravan Kumar Sinha",
    "email": "shravan12.sinha@gmail.com",
    "phone": "7999478415",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "15+Yrs/ Site-HR",
    "coverLetter": null,
    "resumeName": "Resume SKS.pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1790513217/encotec-resumes/lzzyu0zoo0jlvovcoewd.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-27T12:46:58.160Z",
    "updatedAt": "2026-09-27T12:46:58.160Z"
  },
  {
    "id": "cmuhqo7dy000flqtrrms9dbq2",
    "name": "Rakesh Nath",
    "email": "nrakesh77@gmail.com",
    "phone": "9954889308",
    "jobTitle": "General Application",
    "department": "General",
    "jobLocation": "India / Remote",
    "experience": "12",
    "coverLetter": null,
    "resumeName": "PDF Rak new RESUME (1) (1).pdf",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/image/upload/v1790387803/encotec-resumes/g6dh648hgl1azeixukzf.pdf",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-26T01:56:44.494Z",
    "updatedAt": "2026-09-26T01:56:44.494Z"
  },
  {
    "id": "cmugvp83o000clqtrbz7c9u37",
    "name": "Rajeev Ahuja",
    "email": "rajeevahuja70@gmail.com",
    "phone": "+91 9811662417",
    "jobTitle": "Project Manager",
    "department": "Project Management",
    "jobLocation": "Corporate Office, Noida",
    "experience": "20 Years",
    "coverLetter": "Test Message",
    "resumeName": "Brief CVs.docx",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/raw/upload/v1790335783/encotec-resumes/jnjsi5locnaz1wazwhtq",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-25T11:29:43.986Z",
    "updatedAt": "2026-09-25T11:29:43.986Z"
  },
  {
    "id": "cmugoxe8n000alqtrzhjn5uv4",
    "name": "BEANT SINGH",
    "email": "beantss1987@gmail.com",
    "phone": "7077240528",
    "jobTitle": "Sr. HR Executive / HR Executive – Site HR & Administration",
    "department": "HR",
    "jobLocation": "Thermal Power Plant Sites PAN India",
    "experience": "13 yrs",
    "coverLetter": "My name is Beant Singh , and I have over 13 years of experience in HR Administartion. I am excited about this position because it aligns with my background, and I look forward to bringing my expertise  to your team.my notice periofd is 30 days.",
    "resumeName": "Resume BEANT SINGH.doc",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/raw/upload/v1790324407/encotec-resumes/yplupujpq1z2i0cmurmn",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-25T08:20:07.895Z",
    "updatedAt": "2026-09-25T08:20:07.895Z"
  },
  {
    "id": "cmugoul6k0009lqtr95m1mds8",
    "name": "BEANT SINGH",
    "email": "beantss1987@gmail.com",
    "phone": "7077240528",
    "jobTitle": "Sr. HR Executive / HR Executive – Corporate Office",
    "department": "HR",
    "jobLocation": "Corporate Office, Noida",
    "experience": "13 yrs",
    "coverLetter": "My name is Beant Singh , and I have over 13 years of experience in HR Administartion. I am excited about this position because it aligns with my background, and I look forward to bringing my expertise  to your team.my notice periofd is 30 days.",
    "resumeName": "Resume BEANT SINGH.doc",
    "resumeUrl": "https://res.cloudinary.com/dpa93copz/raw/upload/v1790324276/encotec-resumes/rgudbnc81nqm9dp35oh7",
    "resumeBase64": null,
    "status": "Pending",
    "createdAt": "2026-09-25T08:17:56.913Z",
    "updatedAt": "2026-09-25T08:17:56.913Z"
  }
];

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
    console.log(`Created page: "${page.title}" (${page.slug}) with ${sections.length} sections`);
  }

  // 5. Create Navigation Links (Roots first, then Sublinks)
  console.log("Creating navigation links...");
  for (const link of navLinksData) {
    await prisma.navLink.create({
      data: link,
    });
  }
  console.log(`Created ${navLinksData.length} navigation links`);

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
    console.log(`Created ${enquiriesData.length} enquiries`);
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
    console.log(`Created ${jobApplicationsData.length} job applications`);
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
