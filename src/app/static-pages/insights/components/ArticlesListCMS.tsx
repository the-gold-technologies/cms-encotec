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
      description:
        "Executed complex IBR piping erection and commissioning for a massive 2x660 MW project in Uttar Pradesh.",
      date: "March 2024",
      location: "Uttar Pradesh, India",
      readTime: "",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=2400",
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
  ],
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
