"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

// 1. AdvisoryHeroCMS
export function AdvisoryHeroCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    label: "",
    heading: "",
    description: ""
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["AdvisoryHero"];
        if (json.success && sectionData) {
          setFormData({
            label: sectionData.label || "",
            heading: sectionData.heading || "",
            description: sectionData.description || ""
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Advisory Hero...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "AdvisoryHero", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Advisory Hero saved!", { id: toastId });
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
        title="Advisory Hero Section"
        description="Manage Advisory tagline, main headline, and intro copy."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Hero Label" name="label" value={formData.label} onChange={handleChange} required />
          <InputField label="Heading" name="heading" value={formData.heading} onChange={handleChange} required />
          <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required rows={3} />
          
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}

// 2. AdvisoryFeaturesCMS
export function AdvisoryFeaturesCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    features: [] as any[]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["AdvisoryFeatures"];
        if (json.success && sectionData) {
          setFormData({
            features: sectionData.features || []
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
        body: JSON.stringify({ section: "AdvisoryFeatures", content: formData })
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
        title="Advisory Core Features"
        description="Manage NDT testing, energy audits and process improvements cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.features.map((feat, i) => (
              <div key={i} className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3">
                <div className="text-xs font-bold text-gray-400">Feature Card #{i + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Title" value={feat.title} onChange={(e) => handleFeatureChange(i, "title", e.target.value)} required />
                  <InputField label="Lucide Icon (e.g. Search, Activity, TrendingUp)" value={feat.icon} onChange={(e) => handleFeatureChange(i, "icon", e.target.value)} required />
                </div>
                <TextAreaField label="Description" value={feat.description} onChange={(e) => handleFeatureChange(i, "description", e.target.value)} required rows={2} />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}

// 3. DiagnosticProcessCMS
export function DiagnosticProcessCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    steps: [] as any[]
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["DiagnosticProcess"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            steps: sectionData.steps || []
          });
        }
      })
      .catch(console.error);
  }, [saveUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.steps];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, steps: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Diagnostic Process...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "DiagnosticProcess", content: formData })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Diagnostic approach saved!", { id: toastId });
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
        title="Diagnostic Approach Steps"
        description="Manage the 4-step diagnostic approach (Assess, Analyze, Advise, Optimize)."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField label="Heading" name="heading" value={formData.heading} onChange={handleChange} required />
          <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} required rows={2} />

          <div className="grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.steps.map((step, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-xl">
                <div className="text-xs font-bold text-gray-400">Step #{step.step || i + 1}</div>
                <InputField label="Title" value={step.title} onChange={(e) => handleStepChange(i, "title", e.target.value)} required />
                <InputField label="Description" value={step.desc} onChange={(e) => handleStepChange(i, "desc", e.target.value)} required />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton onClick={handleSave} disabled={isSaving} className="w-44 h-12" />
          </div>
        </div>
      )}
    </div>
  );
}
