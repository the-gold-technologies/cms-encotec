"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

// 1. DueDiligenceHeroCMS
export function DueDiligenceHeroCMS({ saveUrl }: { saveUrl: string }) {
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
        const sectionData = json.data?.["DueDiligenceHero"];
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
    const toastId = toast.loading("Saving Due Diligence Hero...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "DueDiligenceHero",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Due Diligence Hero saved!", { id: toastId });
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
        title="Due Diligence Hero Section"
        description="Manage Due Diligence tagline, heading, and description."
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

// 2. HealthFeaturesCMS
export function HealthFeaturesCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    features: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["HealthFeatures"];
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
    const toastId = toast.loading("Saving Health Features...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "HealthFeatures", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Health Features saved!", { id: toastId });
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
        title="Asset Health Features"
        description="Manage Residual Life Assessment, Technical Audits and Restoration cards."
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
                    label="Lucide Icon (e.g. Activity, FileCheck, RefreshCw)"
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

// 3. ValueProtectionCMS
export function ValueProtectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headingPart1: "",
    headingHighlight: "",
    bulletHeading: "",
    paragraphs: ["", ""],
    bullets: ["", "", "", "", ""],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["ValueProtection"];
        if (json.success && sectionData) {
          setFormData({
            headingPart1: sectionData.headingPart1 || "",
            headingHighlight: sectionData.headingHighlight || "",
            bulletHeading: sectionData.bulletHeading || "",
            paragraphs: sectionData.paragraphs || ["", ""],
            bullets: sectionData.bullets || ["", "", "", "", ""],
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

  const handleBulletChange = (index: number, val: string) => {
    setFormData((prev) => {
      const b = [...prev.bullets];
      b[index] = val;
      return { ...prev, bullets: b };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Value Protection...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ValueProtection", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Value Protection saved!", { id: toastId });
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
        title="Investment Protection Checklist"
        description="Manage the What We Evaluate checklist details."
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
          <InputField
            label="Checklist Section Heading"
            name="bulletHeading"
            value={formData.bulletHeading}
            onChange={handleChange}
            required
          />

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4 bg-gray-50/10">
            <h4 className="text-sm font-bold text-gray-700">
              Intro Paragraphs
            </h4>
            <TextAreaField
              label="Paragraph 1"
              value={formData.paragraphs[0] || ""}
              onChange={(e) => {
                const p = [...formData.paragraphs];
                p[0] = e.target.value;
                setFormData((prev) => ({ ...prev, paragraphs: p }));
              }}
              required
              rows={2}
            />
            <TextAreaField
              label="Paragraph 2"
              value={formData.paragraphs[1] || ""}
              onChange={(e) => {
                const p = [...formData.paragraphs];
                p[1] = e.target.value;
                setFormData((prev) => ({ ...prev, paragraphs: p }));
              }}
              required
              rows={2}
            />
          </div>

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4 bg-gray-50/10">
            <h4 className="text-sm font-bold text-gray-700">
              Checklist Points
            </h4>
            {formData.bullets.map((b, i) => (
              <InputField
                key={i}
                label={`Point ${i + 1}`}
                value={b}
                onChange={(e) => handleBulletChange(i, e.target.value)}
                required
              />
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
