"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";

interface ProjectItem {
  title: string;
  location: string;
  category: string;
  description: string;
  image: File | string | null;
}

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
  projects: [
    {
      title: "",
      location: "",
      category: "",
      description: "",
      image: null as File | string | null
    },
    {
      title: "",
      location: "",
      category: "",
      description: "",
      image: null as File | string | null
    }
  ]
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.projects || !Array.isArray(merged.projects)) {
    merged.projects = defaultFormData.projects.map((p) => ({ ...p }));
  } else {
    const arr = [...merged.projects];
    while (arr.length < 2) {
      const def = defaultFormData.projects[arr.length] || { title: "", location: "", category: "", description: "", image: null };
      arr.push({ ...def });
    }
    merged.projects = arr.slice(0, 2);
  }
  return merged;
};

interface ProjectShowcaseSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ProjectShowcaseSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "ProjectShowcaseSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: ProjectShowcaseSectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectChange = (index: number, key: keyof ProjectItem, value: File | string | null) => {
    setFormData((prev) => {
      const updated = prev.projects.map((p, idx) =>
        idx === index ? { ...p, [key]: value } : p
      );
      return { ...prev, projects: updated };
    });
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (formData.projects.some((p) => !p.title?.trim() || !p.location?.trim())) {
      errs.push("All project titles and locations must be filled");
    }

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Case Studies showcase section...");
    try {
      // Upload any File objects in projects
      const imageSources = formData.projects.map((p) => p.image);
      const uploadedUrls = await uploadFiles(imageSources);

      const processedProjects = formData.projects.map((p, idx) => ({
        ...p,
        image: uploadedUrls[idx] || "",
      }));

      const payload = {
        ...formData,
        projects: processedProjects,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey ?? "ProjectShowcaseSection", content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Case Studies section saved successfully!", { id: toastId });
        setFormData((prev) => ({ ...prev, projects: processedProjects }));
        if (onSave) onSave(payload as unknown as Record<string, unknown>);
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
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Case Studies Showcase Section"
          description="Manage Encotec's featured home projects (exactly 2 items)."
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
        />

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-8 pt-6 animate-in fade-in duration-500">
              
              {/* Header Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Case Studies"
                  required
                />
                <InputField
                  label="Section Title Headline"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Stewardship in Action"
                  required
                />
                <TextAreaField
                  label="Section Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your showcase work..."
                  containerClassName="col-span-2"
                  rows={2}
                />
              </div>

              {/* Projects Grid */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Featured Case Study Cards (2 Items)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.projects.map((project, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 p-6 rounded-2xl bg-gray-50/20 flex flex-col gap-4 relative group"
                    >
                      <span className="text-[10px] font-bold text-[#a0004f] uppercase tracking-widest">
                        Case Study 0{i + 1}
                      </span>
                      <InputField
                        label="Project Title"
                        value={project.title}
                        onChange={(e) => handleProjectChange(i, "title", e.target.value)}
                        placeholder="e.g. Supercritical Mastery at Rajpura"
                      />
                      <InputField
                        label="Location Details"
                        value={project.location}
                        onChange={(e) => handleProjectChange(i, "location", e.target.value)}
                        placeholder="e.g. Rajpura, Punjab"
                      />
                      <InputField
                        label="Category Label"
                        value={project.category}
                        onChange={(e) => handleProjectChange(i, "category", e.target.value)}
                        placeholder="e.g. Asset Stewardship"
                      />
                      <TextAreaField
                        label="Case Study Description"
                        value={project.description}
                        onChange={(e) => handleProjectChange(i, "description", e.target.value)}
                        placeholder="Project narrative subtext details..."
                        rows={3}
                      />

                      {/* Image picker */}
                      <ImagePickerField
                        label={`Case Study Showcase Image #${i + 1}`}
                        value={project.image}
                        onChange={(file) => handleProjectChange(i, "image", file)}
                        sublabel="Drag and drop or browse case study image asset"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
                <SaveButton
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-44 h-12 text-sm"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
