"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  emptyMessage: "No insights found for this category.",
  articles: [
    {
      id: 1,
      slug: "obra-c-thermal-success",
      title: "The Obra 'C' Thermal Success",
      category: "Case Study",
      description: "Executed complex IBR piping erection and commissioning for a massive 2x660 MW project in Uttar Pradesh.",
      date: "March 2024",
      location: "Uttar Pradesh, India",
      readTime: "",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "The Obra 'C' Thermal Power Project represents a significant milestone in India's journey towards robust and reliable energy infrastructure. Encotec Energy India was entrusted with the critical task of IBR (Indian Boiler Regulations) piping erection, testing, and commissioning for this massive 2x660 MW supercritical thermal power plant."
        },
        {
          type: "heading",
          text: "Project Scope and Complexity"
        },
        {
          type: "paragraph",
          text: "The scope of work encompassed the complete erection of high-pressure piping systems, a task demanding unparalleled precision and adherence to stringent safety standards. The project involved handling thousands of tons of specialized alloy steel pipes, requiring advanced welding techniques and rigorous non-destructive testing (NDT)."
        },
        {
          type: "quote",
          text: "Our approach was rooted in meticulous planning and the deployment of highly skilled manpower. We understood that the integrity of the IBR piping is paramount to the plant's operational safety and efficiency."
        },
        {
          type: "heading",
          text: "Overcoming Challenges"
        },
        {
          type: "paragraph",
          text: "Executing a project of this magnitude in a challenging environment required innovative solutions. We implemented advanced project management tools to track progress in real-time, ensuring seamless coordination between engineering, procurement, and construction teams. Our proactive approach to risk management allowed us to anticipate potential bottlenecks and mitigate them effectively."
        },
        {
          type: "list",
          items: [
            "Zero lost-time incidents during the entire 18-month execution phase.",
            "Achieved 100% first-time-right welding quality on critical high-pressure joints.",
            "Completed the commissioning phase 2 weeks ahead of the baseline schedule."
          ]
        },
        {
          type: "heading",
          text: "Value Delivered"
        },
        {
          type: "paragraph",
          text: "The successful completion of the Obra 'C' project not only reinforced Encotec's position as a leader in power plant engineering but also contributed significantly to the region's energy security. The plant now operates at peak efficiency, delivering reliable power to millions of homes and businesses."
        }
      ]
    },
    {
      id: 2,
      slug: "ensuring-reliability-rajpura",
      title: "Ensuring Reliability for Punjab's Power Heart",
      category: "Case Study",
      description: "O&M services for the 2x700 MW Rajpura Supercritical Power Plant, managing operations with an owner's mindset.",
      date: "2018 & Beyond",
      location: "Rajpura, Punjab",
      readTime: "",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "At Rajpura, we don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab. Since 2018, our team has been on the ground, treating this supercritical facility as if it were our own. Managing a plant of this scale requires more than just technical expertise - it requires continuous care and foresight."
        },
        {
          type: "heading",
          text: "The Project & Partner"
        },
        {
          type: "paragraph",
          text: "This comprehensive O&M engagement for the 2x700 MW Rajpura Supercritical Power Plant is executed in partnership with Nabha Power Limited (L&T Power Division)."
        },
        {
          type: "heading",
          text: "Our Hands-On Approach"
        },
        {
          type: "paragraph",
          text: "Our 300+ engineers provide a full spectrum of services to keep the heart of this plant beating at peak efficiency. This includes:"
        },
        {
          type: "list",
          items: [
            "Precision Maintenance: From the boilers and turbines to the critical balance of plant (BOP) equipment.",
            "Smart Planning: We utilize condition monitoring and meticulous O&M planning to address potential issues before they cause downtime.",
            "Expert Overhauling: We manage both annual and major capital overhauling, ensuring the plant's long-term health and performance."
          ]
        },
        {
          type: "heading",
          text: "The Human Impact"
        },
        {
          type: "paragraph",
          text: "By maintaining a supercritical plant with such high standards, we are helping to provide more efficient, reliable, and cleaner power for the region, proving that large-scale engineering can have a local, human touch."
        },
        {
          type: "quote",
          text: "We don't just see a massive 1,400 MW plant; we see the energy that fuels homes, businesses, and lives across Punjab."
        }
      ]
    },
    {
      id: 3,
      slug: "greener-future-gujarat-solar",
      title: "Engineering a Greener Future in the Sands of Gujarat",
      category: "Case Study",
      description: "End-to-end installation and commissioning of a 10 MWp ground-mounted solar project, turning intense sun into sustainable power.",
      date: "2013",
      location: "Jainabad, Gujarat",
      readTime: "",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way. In 2013, we took on the challenge of bringing a 10 MWp ground-mounted solar project to life, turning the intense Gujarat sun into a sustainable power source."
        },
        {
          type: "heading",
          text: "The Project & Partner"
        },
        {
          type: "paragraph",
          text: "This 10 MWp Solar PV Installation and Commissioning project was successfully delivered in partnership with Moser Baer Engineering & Construction Ltd."
        },
        {
          type: "heading",
          text: "Building with Precision"
        },
        {
          type: "paragraph",
          text: "Our team managed the project from the ground up, focusing on every technical detail to ensure the best energy yield for our client:"
        },
        {
          type: "list",
          items: [
            "Site-Specific Design: We started with a detailed design review tailored to the unique site conditions.",
            "Full-Scale Erection: Our engineers handled the mounting of polycrystalline modules, complex cabling, and the installation of array junction boxes and inverters.",
            "Grid Readiness: We concluded with rigorous testing and commissioning, ensuring the project was perfectly synchronized with the grid."
          ]
        },
        {
          type: "heading",
          text: "The Human Impact"
        },
        {
          type: "paragraph",
          text: "This project wasn't just about installing panels; it was about Encotec's commitment to bridging the gap to a renewable future. By delivering a high-performing solar asset, we helped our partners take a significant step toward a cleaner tomorrow."
        },
        {
          type: "quote",
          text: "Transitioning to renewable energy is a journey, and at Jainabad, Gujarat, Encotec was proud to lead the way."
        }
      ]
    },
    {
      id: 4,
      slug: "powering-gateway-india-airport",
      title: "Powering the Gateway to India",
      category: "Case Study",
      description: "Specialized utility and electrical O&M for Indira Gandhi International Airport, ensuring the critical nervous system remains flawless.",
      date: "September 2023",
      location: "New Delhi, India",
      readTime: "",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "An international airport never sleeps, and neither does the infrastructure that supports it. At Indira Gandhi International Airport (IGI) in New Delhi, Encotec serves as a trusted auxiliary partner, ensuring that the critical electrical \"nervous system\" of one of the world's busiest hubs remains flawless."
        },
        {
          type: "heading",
          text: "The Project & Partner"
        },
        {
          type: "paragraph",
          text: "We provide Specialized Utility and Electrical O&M for Indira Gandhi International Airport (DIAL) in partnership with GMR Group / DIAL."
        },
        {
          type: "heading",
          text: "Reliability Under Pressure"
        },
        {
          type: "paragraph",
          text: "Managing airport utilities requires a specialized set of skills and a deep commitment to safety. Our team oversees:"
        },
        {
          type: "list",
          items: [
            "High-Voltage Assets: Operation and maintenance of both Air Insulated (AIS) and Gas Insulated (GIS) substations.",
            "Uninterrupted Support: Managing DG sets and critical terminal blocks to ensure power is always available, even in emergencies.",
            "Safety First: Our work includes managing Fire Protection Systems (FPS) and Public Health Engineering (PHE) for both landside and airside facilities."
          ]
        },
        {
          type: "heading",
          text: "The Human Impact"
        },
        {
          type: "paragraph",
          text: "Behind every seamless take-off and every bright terminal is a team of Encotec experts working quietly to ensure the safety and comfort of millions of travelers. We take pride in being the silent force that keeps India's gateway running."
        },
        {
          type: "quote",
          text: "An international airport never sleeps, and neither does the infrastructure that supports it."
        }
      ]
    },
    {
      id: 5,
      slug: "insurance-surety-bonds-replace-bank-guarantees",
      title: "Insurance Surety Bonds Replace Bank Guarantees in Power Sector",
      category: "News",
      description: "Ministry of Power introduces Insurance Surety Bonds as an alternative to traditional Bank Guarantees across all power procurement frameworks.",
      date: "April 8, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "In a significant move to improve the \"ease of doing business,\" the Ministry of Power has issued a directive allowing Insurance Surety Bonds (ISBs) as an alternative to traditional Bank Guarantees (BGs) across all power procurement frameworks. This reform is designed to reduce the liquidity burden on developers and utilities."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "This flexibility in financial instruments makes it easier for engineering and O&M partners to participate in large-scale infrastructure projects without tying up massive amounts of capital in banks. For Encotec, this opens up new opportunities to engage in larger projects with reduced financial barriers."
        },
        {
          type: "paragraph",
          text: "Source: https://solarquarter.com/2026/04/08/ministry-of-power-introduces-insurance-surety-bonds-to-replace-bank-guarantees-in-the-power-sector/"
        }
      ]
    },
    {
      id: 6,
      slug: "india-270gw-peak-power-demand",
      title: "India Braces for Record 270 GW Peak Power Demand",
      category: "News",
      description: "India is fully prepared to handle a record 270 GW peak power demand this summer through strengthened generation capacity and grid management.",
      date: "March 20, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "Union Minister Manohar Lal Khattar announced that India is fully prepared to handle a record 270 GW peak power demand this summer. To meet this surge, the government has focused on strengthening generation capacity, ensuring coal availability for thermal plants, and enhancing grid management."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "As a specialist in thermal O&M and grid synchronization, Encotec's expertise in maintaining plant reliability is critical during these high-pressure peak periods. Our teams ensure that the plants we manage operate at maximum availability when the nation needs it most."
        },
        {
          type: "paragraph",
          text: "Source: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/"
        }
      ]
    },
    {
      id: 7,
      slug: "green-signal-3200mw-thermal-projects",
      title: "Green Signal for 3,200 MW of New Thermal Projects",
      category: "News",
      description: "Expert Appraisal Committee recommends environmental clearance for two massive 1,600 MW ultra-supercritical coal-based projects.",
      date: "April 6, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "The Expert Appraisal Committee has recommended environmental clearance for two massive 1,600 MW coal-based ultra-supercritical projects. One project by JSW Thermal Energy is slated for West Bengal, while Torrent Power will develop a project in Madhya Pradesh. Both will utilize ultra-supercritical technology and domestic coal."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "With Encotec's extensive experience in supercritical thermal O&M (like the Rajpura and Shree Singaji plants), these new high-tech units represent significant future opportunities for specialized engineering services."
        },
        {
          type: "paragraph",
          text: "Source: https://powerpeakdigest.com/power-sector-news-roundup-for-april-6-2026/"
        }
      ]
    },
    {
      id: 8,
      slug: "ghaziabad-mandates-rooftop-solar",
      title: "Ghaziabad Mandates Rooftop Solar for New Buildings",
      category: "News",
      description: "Ghaziabad makes rooftop solar installations mandatory for all building plan approvals, aligning with national solar adoption efforts.",
      date: "April 9, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "In a push for local energy independence, Ghaziabad has made rooftop solar installations mandatory for all building plan approvals. This aligns with national efforts like the PM Surya Ghar: Muft Bijli Yojana, which has already seen millions of households adopt solar power."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "This local mandate reflects the broader surge in the renewable energy sector, where Encotec provides full-lifecycle support from feasibility reports to testing and commissioning."
        },
        {
          type: "paragraph",
          text: "Sources: https://www.eqmagpro.com/india-prepared-to-handle-record-270-gw-peak-power-demand-this-summer-eq/ and https://jmkresearch.com/wp-content/uploads/2026/03/Q4-2025-RE-Report-Oct-Dec_JMK-Research.pdf"
        }
      ]
    },
    {
      id: 9,
      slug: "765kv-transmission-corridor-commissioned",
      title: "Massive 765 kV Transmission Corridor Commissioned",
      category: "News",
      description: "A new 765 kV double-circuit transmission corridor spanning 700 km between Fatehgarh and Beawar has been commissioned for renewable energy evacuation.",
      date: "April 6, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "A new 765 kV double-circuit transmission corridor spanning 700 kilometres between Fatehgarh and Beawar has been commissioned. This project is essential for the high-capacity evacuation of renewable energy and includes the integration of advanced 765/400 kV substations."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "Encotec's specialized service line in Transmission & Distribution (up to 765 kV) and its expertise in substation O&M perfectly match the technical requirements of these new high-voltage corridors."
        },
        {
          type: "paragraph",
          text: "Source: https://powerpeakdigest.com/power-sector-news-roundup-for-april-6-2026/"
        }
      ]
    },
    {
      id: 10,
      slug: "new-directions-imported-coal-power-plants",
      title: "New Directions for Imported Coal-Based Power Plants",
      category: "News",
      description: "Ministry of Power issues fresh directions under Section 11 of the Electricity Act to ensure imported coal plants remain operational during high-demand months.",
      date: "March 27, 2026",
      location: "",
      readTime: "",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "The Ministry of Power has issued fresh directions under Section 11 of the Electricity Act to generating companies using imported coal. These directions are aimed at ensuring that these plants remain operational and contribute to the national grid to prevent power shortages during the upcoming high-demand months."
        },
        {
          type: "heading",
          text: "Why It Matters to Encotec"
        },
        {
          type: "paragraph",
          text: "Maintaining imported coal-based units requires meticulous O&M planning and overhauling support, areas where Encotec provides essential back-office and on-site engineering expertise."
        },
        {
          type: "paragraph",
          text: "Source: https://powermin.gov.in/en/announcements"
        }
      ]
    },
    {
      id: 11,
      slug: "owners-mindset-power-plant-care",
      title: "Treating Your Power Plant Like Our Own: The Magic of the Owner's Mindset",
      category: "Blog",
      description: "What does having an Owner's Mindset mean for the people on the ground? It means our 250+ engineers see a vital asset that supports thousands of lives.",
      date: "April 2026",
      location: "",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "At Encotec, we often talk about having an \"Owner's mindset\". But what does that actually mean for the people on the ground? It means that when our 250+ engineers step onto a site, they aren't just looking at a contract; they are looking at a vital asset that supports thousands of lives."
        },
        {
          type: "heading",
          text: "Continuous Care and Foresight"
        },
        {
          type: "paragraph",
          text: "Whether we are managing a massive 2x700 MW supercritical plant in Rajpura or a captive unit in Goa, our approach is built on continuous care and foresight. We don't just wait for things to break; we use advanced condition monitoring and performance diagnostics to stay ahead of the curve."
        },
        {
          type: "quote",
          text: "For us, energy isn't just about megawatts — it's about the 1,800+ dedicated staff members who show up every day to keep the world moving."
        },
        {
          type: "heading",
          text: "Precision and Accountability"
        },
        {
          type: "paragraph",
          text: "By treating every boiler, turbine, and auxiliary system with the same precision and accountability an owner would, we've been able to help our partners achieve peak efficiency and long-term reliability. This philosophy is what sets Encotec apart in the energy services landscape."
        }
      ]
    },
    {
      id: 12,
      slug: "sunbeams-to-megawatts-renewable-future",
      title: "From Sunbeams to Megawatts: Engineering the Journey to a Renewable Future",
      category: "Blog",
      description: "Our journey into renewables is a commitment to sustainable development — bridging the gap between traditional power and a solar future.",
      date: "March 2026",
      location: "",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "The transition to green energy is one of the greatest challenges of our time, and at Encotec, we believe in \"finding new ways to energy solutions\". Our journey into renewables isn't just a business line; it's a commitment to sustainable development and leaving the world better than we found it."
        },
        {
          type: "heading",
          text: "Technical Mastery at Every Stage"
        },
        {
          type: "paragraph",
          text: "Bridging the gap between traditional power and a solar future requires technical mastery at every stage. We support our partners through the entire lifecycle — starting from pre-feasibility reports and site assessments to the precision erection of polycrystalline modules."
        },
        {
          type: "quote",
          text: "By combining our deep engineering roots with innovative solar technology, we are helping to ensure that the clean energy of tomorrow is as reliable as the power of today."
        },
        {
          type: "heading",
          text: "Impactful Projects"
        },
        {
          type: "paragraph",
          text: "Our experience spans impactful projects like the 10 MWp Solar PV project in Gujarat and the 125 MW Solar Thermal project in Pokharan. Each project reinforces our commitment to bridging the gap to a renewable future."
        }
      ]
    },
    {
      id: 13,
      slug: "silent-force-behind-your-flight",
      title: "Powering the Gateway: The Specialized World of Airport Utility Management",
      category: "Blog",
      description: "What keeps an international airport running flawlessly 24/7? Behind the scenes at DIAL and Noida International Airport, Encotec is at work.",
      date: "February 2026",
      location: "",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?auto=format&fit=crop&q=80&w=2400",
      content: [
        {
          type: "paragraph",
          text: "Have you ever wondered what keeps an international airport running flawlessly 24/7? Behind the scenes of the bustling terminals at Indira Gandhi International Airport (DIAL) and the upcoming Noida International Airport (YIAPL), Encotec is at work."
        },
        {
          type: "heading",
          text: "A Unique Blend of Expertise"
        },
        {
          type: "paragraph",
          text: "Managing critical infrastructure for global hubs requires a unique blend of high-voltage expertise and a safety-first culture. Our teams oversee everything from AIS and GIS substations to the Fire Protection Systems (FPS) and Public Health Engineering (PHE) that ensure traveler comfort and safety."
        },
        {
          type: "quote",
          text: "It's a high-pressure job, but with our triple ISO certifications in Quality, Environment, and Safety, we take pride in being the silent force that ensures your journey begins and ends with a smile."
        },
        {
          type: "heading",
          text: "Trusted Security Partner"
        },
        {
          type: "paragraph",
          text: "We hold specific security clearances from the Bureau of Civil Aviation Security (BCAS), allowing us to act as a trusted auxiliary partner in these high-security environments. This level of trust is earned through consistent performance and unwavering commitment to safety standards."
        }
      ]
    }
  ]
};

export function ArticlesListCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.ArticlesList) {
          setFormData({ ...defaultFormData, ...json.data.ArticlesList });
        }
      })
      .catch(console.error);
  }, []);

  const handleEmptyMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, emptyMessage: value }));
  };

  const handleArticleFieldChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.articles];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, articles: updatedList };
    });
  };

  const handleContentJSONChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedList = [...prev.articles];
      try {
        const parsed = JSON.parse(value);
        updatedList[index] = { ...updatedList[index], content: parsed };
      } catch (e) {
        // Just store the raw string temporarily so they can finish typing
        (updatedList[index] as any).rawContent = value;
      }
      return { ...prev, articles: updatedList };
    });
  };

  const addArticle = () => {
    const newId =
      formData.articles.length > 0
        ? Math.max(...formData.articles.map((a) => a.id)) + 1
        : 1;
    setFormData((prev) => ({
      ...prev,
      articles: [
        ...prev.articles,
        {
          id: newId,
          slug: `new-article-${newId}`,
          title: "New Insight / Case Study",
          category: "Blog",
          description: "A short description...",
          date: "June 2026",
          location: "",
          readTime: "5 min read",
          image:
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
          content: [
            { type: "paragraph", text: "Start writing your article here..." },
          ],
        },
      ],
    }));
    toast.success("Added new article slot");
  };

  const removeArticle = (index: number) => {
    if (formData.articles.length <= 1) {
      toast.error("At least one article is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      articles: prev.articles.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Check if any articles have JSON syntax errors
    const errors: string[] = [];
    formData.articles.forEach((art: any, i) => {
      if (art.rawContent) {
        try {
          JSON.parse(art.rawContent);
        } catch (e) {
          errors.push(`Article #${i + 1} has invalid Content JSON syntax`);
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    // Clean rawContent temp fields before saving
    const cleanArticles = formData.articles.map((art: any) => {
      const { rawContent, ...rest } = art;
      return rest;
    });

    setIsSaving(true);
    const toastId = toast.loading("Saving Insights & Case Studies List...");
    try {
      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ArticlesList",
          content: { articles: cleanArticles },
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Insights list saved successfully!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Insights list (Case Studies, News & Blogs)"
        description="Manage the complete directory of case studies, news updates, and articles."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <InputField
            label="Empty Category Grid Message"
            name="emptyMessage"
            value={formData.emptyMessage || ""}
            onChange={handleEmptyMessageChange}
            required
          />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">
              Articles ({formData.articles.length})
            </span>
            <button
              onClick={addArticle}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-pink text-white rounded text-xs font-semibold hover:bg-[#a0004f] transition-all"
            >
              <Plus size={14} /> Add Article
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {formData.articles.map((art: any, idx) => (
              <div
                key={idx}
                className="p-6 border border-gray-200 rounded-xl flex flex-col gap-4 relative bg-gray-50/20"
              >
                <button
                  onClick={() => removeArticle(idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove Article"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Article Title"
                    value={art.title}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "title", e.target.value)
                    }
                    required
                  />

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={art.category}
                      onChange={(e) =>
                        handleArticleFieldChange(
                          idx,
                          "category",
                          e.target.value,
                        )
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-brand-pink transition-colors text-sm"
                    >
                      <option value="Case Study">Case Study</option>
                      <option value="News">News</option>
                      <option value="Blog">Blog</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Unique URL Slug"
                    value={art.slug}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "slug", e.target.value)
                    }
                    required
                  />

                  <InputField
                    label="Cover Image URL"
                    value={art.image}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "image", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Display Date (e.g. March 2024)"
                    value={art.date}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "date", e.target.value)
                    }
                    required
                  />

                  <InputField
                    label="Location (optional)"
                    value={art.location || ""}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "location", e.target.value)
                    }
                  />

                  <InputField
                    label="Read Time (optional, e.g. 6 min read)"
                    value={art.readTime || ""}
                    onChange={(e) =>
                      handleArticleFieldChange(idx, "readTime", e.target.value)
                    }
                  />
                </div>

                <TextAreaField
                  label="Short Description Summary"
                  value={art.description}
                  onChange={(e) =>
                    handleArticleFieldChange(idx, "description", e.target.value)
                  }
                  rows={2}
                  required
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Rich Content Blocks JSON (Paragraphs, Headings, Quotes,
                    Lists)
                  </label>
                  <textarea
                    value={
                      art.rawContent !== undefined
                        ? art.rawContent
                        : JSON.stringify(art.content, null, 2)
                    }
                    onChange={(e) =>
                      handleContentJSONChange(idx, e.target.value)
                    }
                    rows={8}
                    className="w-full font-mono p-4 border border-gray-200 rounded text-xs focus:outline-none focus:border-brand-pink"
                    required
                  />
                  <span className="text-[10px] text-gray-400">
                    Format: [{"{"} "type": "paragraph" | "heading" | "quote",
                    "text": "..." {"}"}, {"{"} "type": "list", "items":
                    ["item1", "item2"] {"}"}]
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
