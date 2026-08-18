"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ContentBlocksEditor } from "@/components/ContentBlocksEditor";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";

const defaultFormData = {
  emptyMessage: "",
  articles: [
    {
      id: 1,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          items: [
            "Zero lost-time incidents during the entire 18-month execution phase.",
            "Achieved 100% first-time-right welding quality on critical high-pressure joints.",
            "Completed the commissioning phase 2 weeks ahead of the baseline schedule."
          ]
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 2,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          items: [
            "Precision Maintenance: From the boilers and turbines to the critical balance of plant (BOP) equipment.",
            "Smart Planning: We utilize condition monitoring and meticulous O&M planning to address potential issues before they cause downtime.",
            "Expert Overhauling: We manage both annual and major capital overhauling, ensuring the plant's long-term health and performance."
          ]
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 3,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          items: [
            "Site-Specific Design: We started with a detailed design review tailored to the unique site conditions.",
            "Full-Scale Erection: Our engineers handled the mounting of polycrystalline modules, complex cabling, and the installation of array junction boxes and inverters.",
            "Grid Readiness: We concluded with rigorous testing and commissioning, ensuring the project was perfectly synchronized with the grid."
          ]
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 4,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          items: [
            "High-Voltage Assets: Operation and maintenance of both Air Insulated (AIS) and Gas Insulated (GIS) substations.",
            "Uninterrupted Support: Managing DG sets and critical terminal blocks to ensure power is always available, even in emergencies.",
            "Safety First: Our work includes managing Fire Protection Systems (FPS) and Public Health Engineering (PHE) for both landside and airside facilities."
          ]
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 5,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 6,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 7,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 8,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 9,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 10,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 11,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 12,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    },
    {
      id: 13,
      slug: "",
      title: "",
      category: "",
      description: "",
      date: "",
      location: "",
      readTime: "",
      image: "",
      content: [
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        },
        {
          type: "",
          text: ""
        }
      ]
    }
  ]
};

export function ArticlesListCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All");
  const [collapsedArticles, setCollapsedArticles] = useState<Record<number, boolean>>({});

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
    articleId: number,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => {
      const updatedList = prev.articles.map((art: any) =>
        art.id === articleId ? { ...art, [field]: value } : art
      );
      return { ...prev, articles: updatedList };
    });
  };

  const handleContentBlocksChange = (articleId: number, newBlocks: any[]) => {
    setFormData((prev) => {
      const updatedList = prev.articles.map((art: any) =>
        art.id === articleId ? { ...art, content: newBlocks } : art
      );
      return { ...prev, articles: updatedList };
    });
  };

  const addArticle = (category: string = "News") => {
    setFormData((prev) => {
      let maxId = prev.articles.length > 0 ? Math.max(...prev.articles.map((a: any) => a.id || 0)) : 0;
      const today = new Date();
      const monthYear = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      maxId += 1;
      const slugPrefix = category.toLowerCase().replace(/\s+/g, "-");
      const newItem = {
        id: maxId,
        slug: `new-${slugPrefix}-${maxId}`,
        title: `New ${category} Article ${maxId}`,
        category: category,
        description: `Summary overview for new ${category.toLowerCase()} article...`,
        date: monthYear,
        location: category === "Case Study" ? "India" : "",
        readTime: category === "Blog" ? "5 min read" : "",
        image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=2400",
        content: [
          { type: "paragraph", text: "Write article introduction paragraph here..." },
          { type: "heading", text: "Why It Matters to Encotec" },
          { type: "paragraph", text: "Explain the technical relevance and business impact..." },
        ],
      };

      return {
        ...prev,
        articles: [newItem, ...prev.articles], // Prepend new article to top
      };
    });

    toast.success(`Added new ${category} article slot!`);
  };

  const removeArticle = (articleId: number) => {
    if (formData.articles.length <= 1) {
      toast.error("At least one article is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      articles: prev.articles.filter((a: any) => a.id !== articleId),
    }));
    toast.success("Article removed");
  };

  const toggleCollapse = (articleId: number) => {
    setCollapsedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const setAllCollapsed = (collapsed: boolean) => {
    const newState: Record<number, boolean> = {};
    formData.articles.forEach((a: any) => {
      newState[a.id] = collapsed;
    });
    setCollapsedArticles(newState);
  };

  const handleSave = async () => {
    // Check if any articles have JSON syntax errors
    const errors: string[] = [];
    formData.articles.forEach((art: any, i: number) => {
      if (art.rawContent) {
        try {
          JSON.parse(art.rawContent);
        } catch (e) {
          errors.push(`Article #${i + 1} (${art.title}) has invalid Content JSON syntax`);
        }
      }
    });

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Insights & Case Studies List...");
    try {
      // Upload any File objects in article cover images
      const imageSources = formData.articles.map((art: any) => art.image);
      const uploadedUrls = await uploadFiles(imageSources);

      const cleanArticles = formData.articles.map((art: any, i: number) => {
        const { rawContent, ...rest } = art;
        return {
          ...rest,
          image: uploadedUrls[i] || (typeof art.image === "string" ? art.image : ""),
        };
      });

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
        setFormData((prev) => ({ ...prev, articles: cleanArticles }));
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

  // Filter displayed articles
  const filteredArticles = formData.articles.filter((art: any) => {
    if (activeCategoryFilter === "All") return true;
    return art.category === activeCategoryFilter;
  });

  const countCaseStudies = formData.articles.filter((a: any) => a.category === "Case Study").length;
  const countNews = formData.articles.filter((a: any) => a.category === "News").length;
  const countBlogs = formData.articles.filter((a: any) => a.category === "Blog").length;

  const renderAddButton = () => (
    <button
      type="button"
      onClick={() => addArticle("News")}
      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
    >
      <Plus size={14} />
      <span>Add Article</span>
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Insights list (Case Studies, News & Blogs)"
        description="Manage the complete directory of case studies, news updates, and blog articles."
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

          {/* Top Control Bar: Articles Count, Filters & Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">
                Articles ({formData.articles.length})
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                {[
                  { label: "All", count: formData.articles.length },
                  { label: "Case Study", count: countCaseStudies },
                  { label: "News", count: countNews },
                  { label: "Blog", count: countBlogs },
                ].map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      activeCategoryFilter === cat.label
                        ? "bg-brand-pink text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs mr-2">
                <button
                  type="button"
                  onClick={() => setAllCollapsed(true)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 font-medium hover:bg-gray-100 rounded"
                >
                  Collapse All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setAllCollapsed(false)}
                  className="px-2 py-1 text-gray-500 hover:text-gray-900 font-medium hover:bg-gray-100 rounded"
                >
                  Expand All
                </button>
              </div>

              {renderAddButton()}
            </div>
          </div>

          {/* Articles List */}
          <div className="flex flex-col gap-6">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                No articles match category filter &quot;{activeCategoryFilter}&quot;.
              </div>
            ) : (
              filteredArticles.map((art: any) => {
                const isCollapsed = !!collapsedArticles[art.id];
                return (
                  <div
                    key={art.id}
                    className="p-6 border border-gray-200 rounded-xl flex flex-col gap-4 relative bg-gray-50/20 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            art.category === "Case Study"
                              ? "bg-blue-100 text-blue-700"
                              : art.category === "News"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {art.category || "Uncategorized"}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 truncate max-w-md">
                          {art.title || "Untitled Article"}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleCollapse(art.id)}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
                          title={isCollapsed ? "Expand Article" : "Collapse Article"}
                        >
                          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeArticle(art.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Article"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Article Title"
                            value={art.title}
                            onChange={(e) =>
                              handleArticleFieldChange(art.id, "title", e.target.value)
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
                                  art.id,
                                  "category",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-3 bg-white border border-gray-200 focus:outline-none focus:border-brand-pink transition-colors text-sm rounded-lg"
                            >
                              <option value="Case Study">Case Study</option>
                              <option value="News">News</option>
                              <option value="Blog">Blog</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                          <InputField
                            label="Unique URL Slug"
                            value={art.slug}
                            onChange={(e) =>
                              handleArticleFieldChange(art.id, "slug", e.target.value)
                            }
                            required
                          />

                          <ImagePickerField
                            label="Article Cover Image"
                            value={art.image}
                            onChange={(file) =>
                              handleArticleFieldChange(art.id, "image", file)
                            }
                            sublabel="Drag and drop or browse cover image file"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Display Date (e.g. August 17, 2026)"
                            value={art.date}
                            onChange={(e) =>
                              handleArticleFieldChange(art.id, "date", e.target.value)
                            }
                            required
                          />

                          <InputField
                            label="Location (optional)"
                            value={art.location || ""}
                            onChange={(e) =>
                              handleArticleFieldChange(art.id, "location", e.target.value)
                            }
                          />

                          <InputField
                            label="Read Time (optional, e.g. 6 min read)"
                            value={art.readTime || ""}
                            onChange={(e) =>
                              handleArticleFieldChange(art.id, "readTime", e.target.value)
                            }
                          />
                        </div>

                        <TextAreaField
                          label="Short Description Summary"
                          value={art.description}
                          onChange={(e) =>
                            handleArticleFieldChange(art.id, "description", e.target.value)
                          }
                          rows={2}
                          required
                        />

                        <ContentBlocksEditor
                          blocks={art.content || []}
                          onChange={(newBlocks) => handleContentBlocksChange(art.id, newBlocks)}
                        />
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
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
