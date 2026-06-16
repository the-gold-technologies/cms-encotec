"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

// 1. ConstructionHeroCMS
export function ConstructionHeroCMS({ saveUrl }: { saveUrl: string }) {
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
        const sectionData = json.data?.["ConstructionHero"];
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
    const toastId = toast.loading("Saving Construction Hero...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ConstructionHero",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Construction Hero saved!", { id: toastId });
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
        title="Construction Hero Section"
        description="Manage Construction tagline, main headline, and description."
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

// 2. ConstructionCapabilitiesCMS
export function ConstructionCapabilitiesCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    capabilities: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["CapabilitiesSection"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            capabilities: sectionData.capabilities || [],
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

  const handleCapChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.capabilities];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, capabilities: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Capabilities...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CapabilitiesSection",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Capabilities saved!", { id: toastId });
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
        title="Construction Capabilities"
        description="Manage Multi-Sector, Commissioning, and Relocation cards."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
          />

          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.capabilities.map((cap, i) => (
              <div
                key={i}
                className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3"
              >
                <div className="text-xs font-bold text-gray-400">
                  Capability Card #{i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={cap.title}
                    onChange={(e) =>
                      handleCapChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Lucide Icon (e.g. HardHat, Globe, Truck)"
                    value={cap.icon}
                    onChange={(e) => handleCapChange(i, "icon", e.target.value)}
                    required
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={cap.description}
                  onChange={(e) =>
                    handleCapChange(i, "description", e.target.value)
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

// 3. ProcessFlowCMS
export function ProcessFlowCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headingPart1: "",
    headingHighlight: "",
    description: "",
    bullets: ["", "", "", ""],
    steps: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["ProcessFlow"];
        if (json.success && sectionData) {
          setFormData({
            headingPart1: sectionData.headingPart1 || "",
            headingHighlight: sectionData.headingHighlight || "",
            description: sectionData.description || "",
            bullets: sectionData.bullets || ["", "", "", ""],
            steps: sectionData.steps || [],
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

  const handleStepChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.steps];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, steps: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Relocation Process...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ProcessFlow", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Relocation Process saved!", { id: toastId });
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
        title="Relocation Advantage & Process Flow"
        description="Manage the relocation bullets checklist and process stage cards."
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
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
          />

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4 bg-gray-50/10">
            <h4 className="text-sm font-bold text-gray-700">
              Checklist Bullet Points
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

          <div className="grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-4 bg-white border border-gray-100 rounded-xl"
              >
                <div className="text-xs font-bold text-gray-400">
                  Process Step #{i + 1}
                </div>
                <InputField
                  label="Title"
                  value={step.title}
                  onChange={(e) => handleStepChange(i, "title", e.target.value)}
                  required
                />
                <InputField
                  label="Description"
                  value={step.desc}
                  onChange={(e) => handleStepChange(i, "desc", e.target.value)}
                  required
                />
                <InputField
                  label="Lucide Icon (e.g. Settings, Truck, Zap)"
                  value={step.icon}
                  onChange={(e) => handleStepChange(i, "icon", e.target.value)}
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
