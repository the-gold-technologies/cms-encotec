"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";

const defaultFormData = {
  tagline: "",
  heroTitle: "",
  heroSubtitle: "",
  backgroundImage: "",
  caseStudiesBackgroundImage: "",
  newsBackgroundImage: "",
  blogsBackgroundImage: "",
  tab1Label: "",
  tab2Label: "",
  tab3Label: "",
};

export function InsightsHeroCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(defaultFormData);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null);
  const [selectedCaseStudiesImage, setSelectedCaseStudiesImage] = useState<File | string | null>(null);
  const [selectedNewsImage, setSelectedNewsImage] = useState<File | string | null>(null);
  const [selectedBlogsImage, setSelectedBlogsImage] = useState<File | string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/insights")
      .then((json) => {
        if (json.success && json.data?.InsightsHero) {
          const merged = { ...defaultFormData, ...json.data.InsightsHero };
          setFormData(merged);
          if (merged.backgroundImage) setSelectedImage(merged.backgroundImage);
          if (merged.caseStudiesBackgroundImage) setSelectedCaseStudiesImage(merged.caseStudiesBackgroundImage);
          if (merged.newsBackgroundImage) setSelectedNewsImage(merged.newsBackgroundImage);
          if (merged.blogsBackgroundImage) setSelectedBlogsImage(merged.blogsBackgroundImage);
        } else {
          if (defaultFormData.backgroundImage) setSelectedImage(defaultFormData.backgroundImage);
          if (defaultFormData.caseStudiesBackgroundImage) setSelectedCaseStudiesImage(defaultFormData.caseStudiesBackgroundImage);
          if (defaultFormData.newsBackgroundImage) setSelectedNewsImage(defaultFormData.newsBackgroundImage);
          if (defaultFormData.blogsBackgroundImage) setSelectedBlogsImage(defaultFormData.blogsBackgroundImage);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadIfFile = async (img: File | string | null): Promise<string> => {
    if (!img) return "";
    if (img instanceof File) {
      const urls = await uploadFiles([img]);
      return urls[0] || "";
    }
    return img;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Hero Section...");
    try {
      const [imgUrl, caseUrl, newsUrl, blogsUrl] = await Promise.all([
        uploadIfFile(selectedImage),
        uploadIfFile(selectedCaseStudiesImage),
        uploadIfFile(selectedNewsImage),
        uploadIfFile(selectedBlogsImage),
      ]);

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
        caseStudiesBackgroundImage: caseUrl,
        newsBackgroundImage: newsUrl,
        blogsBackgroundImage: blogsUrl,
      };

      const res = await fetch("/api/insights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "InsightsHero", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Hero Section saved successfully!", { id: toastId });
        setFormData(payload);
        setSelectedImage(imgUrl);
        setSelectedCaseStudiesImage(caseUrl);
        setSelectedNewsImage(newsUrl);
        setSelectedBlogsImage(blogsUrl);
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
        title="Hero Section"
        description="Manage the tagline, titles, background images for the main page and dedicated subpages, and filter tabs."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Hero Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Insights & Resources"
              required
            />
            <InputField
              label="Hero Title"
              name="heroTitle"
              value={formData.heroTitle}
              onChange={handleChange}
              placeholder="e.g. INSIGHTS, CASE STUDIES & INDUSTRY PERSPECTIVES"
              required
            />
          </div>
          <InputField
            label="Hero Subtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            placeholder="e.g. Explore our thought leadership, project successes, and the latest updates from the forefront of global energy engineering."
            required
          />

          {/* Main Insights Hero Background */}
          <ImagePickerField
            label="Main Hero Background Image (Insights Landing Page)"
            sublabel="Parallax background layer for /insights"
            value={selectedImage}
            onChange={setSelectedImage}
          />

          {/* Dedicated Subpages Hero Backgrounds */}
          <div className="p-5 bg-gray-50/70 border border-gray-200/70 rounded-xl flex flex-col gap-5">
            <div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight">
                Dedicated Subpages Hero Backgrounds
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize individual hero background images for Case Studies, News &amp; Updates, and Blogs &amp; Articles subpages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ImagePickerField
                label="Case Studies Hero BG"
                sublabel="Overrides /insights/case-studies hero background"
                value={selectedCaseStudiesImage}
                onChange={setSelectedCaseStudiesImage}
              />
              <ImagePickerField
                label="News & Updates Hero BG"
                sublabel="Overrides /insights/news-updates hero background"
                value={selectedNewsImage}
                onChange={setSelectedNewsImage}
              />
              <ImagePickerField
                label="Blogs & Articles Hero BG"
                sublabel="Overrides /insights/blogs-articles hero background"
                value={selectedBlogsImage}
                onChange={setSelectedBlogsImage}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Tab 1 Label (Case Studies)"
              name="tab1Label"
              value={formData.tab1Label}
              onChange={handleChange}
              placeholder="e.g. Case Studies"
              required
            />
            <InputField
              label="Tab 2 Label (News)"
              name="tab2Label"
              value={formData.tab2Label}
              onChange={handleChange}
              placeholder="e.g. News & Updates"
              required
            />
            <InputField
              label="Tab 3 Label (Blogs)"
              name="tab3Label"
              value={formData.tab3Label}
              onChange={handleChange}
              placeholder="e.g. Blog & Articles"
              required
            />
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
