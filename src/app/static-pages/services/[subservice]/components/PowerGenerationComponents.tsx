"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

// 1. StewardshipHeroCMS
export function StewardshipHeroCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    label: "",
    headingPart1: "",
    headingHighlight: "",
    description: "",
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["StewardshipHero"];
        if (json.success && sectionData) {
          setFormData({
            label: sectionData.label || "",
            headingPart1: sectionData.headingPart1 || "",
            headingHighlight: sectionData.headingHighlight || "",
            description: sectionData.description || "",
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Stewardship Hero...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "StewardshipHero", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Stewardship Hero saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Stewardship Hero Section"
        description="Manage O&M Hero tagline, main heading, and intro description copy."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Hero Label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <InputField
              label="Heading Part 1 (Normal)"
              name="headingPart1"
              value={formData.headingPart1}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
            <InputField
              label="Heading Highlight (Gradient)"
              name="headingHighlight"
              value={formData.headingHighlight}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
          </div>
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 2. StewardshipFeaturesCMS
export function StewardshipFeaturesCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    features: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["StewardshipFeatures"];
        if (json.success && sectionData) {
          setFormData({
            features: sectionData.features || [],
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleFeatureChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.features];
      items[index] = { ...items[index], [field]: val };
      return { features: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Features...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "StewardshipFeatures",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Features saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Stewardship Core Features"
        description="Manage O&M competency detail cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.features.map((feat, i) => (
              <div
                key={i}
                className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3"
              >
                <div className="text-xs font-bold text-gray-400">
                  Feature Card #{i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={feat.title}
                    onChange={(e) =>
                      handleFeatureChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Lucide Icon (e.g. Zap, Plane, Database)"
                    value={feat.icon}
                    onChange={(e) =>
                      handleFeatureChange(i, "icon", e.target.value)
                    }
                    required
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={feat.description}
                  onChange={(e) =>
                    handleFeatureChange(i, "description", e.target.value)
                  }
                  required
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 3. StewardshipPhilosophyCMS
export function StewardshipPhilosophyCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headingPart1: "",
    headingHighlight: "",
    paragraphs: ["", ""],
    items: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["StewardshipPhilosophy"];
        if (json.success && sectionData) {
          setFormData({
            headingPart1: sectionData.headingPart1 || "",
            headingHighlight: sectionData.headingHighlight || "",
            paragraphs: sectionData.paragraphs || ["", ""],
            items: sectionData.items || [],
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParagraphChange = (index: number, val: string) => {
    setFormData((prev) => {
      const paras = [...prev.paragraphs];
      paras[index] = val;
      return { ...prev, paragraphs: paras };
    });
  };

  const handleItemChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Philosophy...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "StewardshipPhilosophy",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Philosophy saved!", { id: toastId });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Error saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Philosophy & Focus Areas"
        description="Manage O&M proactive values paragraphs and focus grid cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <InputField
              label="Heading Part 1 (Normal)"
              name="headingPart1"
              value={formData.headingPart1}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
            <InputField
              label="Heading Highlight (Pink)"
              name="headingHighlight"
              value={formData.headingHighlight}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
          </div>

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-700">Paragraphs</h4>
            {formData.paragraphs.map((p, i) => (
              <TextAreaField
                key={i}
                label={`Paragraph ${i + 1}`}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                rows={3}
                required
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 bg-white border rounded-xl"
              >
                <InputField
                  label="Title"
                  value={item.title}
                  onChange={(e) => handleItemChange(i, "title", e.target.value)}
                  required
                />
                <InputField
                  label="Lucide Icon (e.g. ShieldCheck, Settings)"
                  value={item.icon}
                  onChange={(e) => handleItemChange(i, "icon", e.target.value)}
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton
              onClick={handleSave}
              disabled={isSaving}
              className="w-44 h-12"
            />
          </div>
        </div>
      )}
    </div>
  );
}
