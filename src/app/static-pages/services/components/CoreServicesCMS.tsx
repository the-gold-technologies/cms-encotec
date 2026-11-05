"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  heading: "",
  keyCapabilitiesLabel: "",
  valueDeliveredLabel: "",
  showLessLabel: "",
  viewDetailsLabel: "",
  exploreServiceLabel: "",
  serviceTitle0: "",
  serviceIcon0: "",
  serviceLink0: "",
  serviceOverview0: "",
  serviceCapabilities0: "",
  serviceValue0: "",
  serviceTitle1: "",
  serviceIcon1: "",
  serviceLink1: "",
  serviceOverview1: "",
  serviceCapabilities1: "",
  serviceValue1: "",
  serviceTitle2: "",
  serviceIcon2: "",
  serviceLink2: "",
  serviceOverview2: "",
  serviceCapabilities2: "",
  serviceValue2: "",
  serviceTitle3: "",
  serviceIcon3: "",
  serviceLink3: "",
  serviceOverview3: "",
  serviceCapabilities3: "",
  serviceValue3: "",
  serviceTitle4: "",
  serviceIcon4: "",
  serviceLink4: "",
  serviceOverview4: "",
  serviceCapabilities4: "",
  serviceValue4: "",
  serviceTitle5: "",
  serviceIcon5: "",
  serviceLink5: "",
  serviceOverview5: "",
  serviceCapabilities5: "",
  serviceValue5: ""
};

interface CoreServicesCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CoreServicesCMS({
  sectionId,
  initialData,
  saveUrl = "/api/services",
  responseKey = "CoreServices",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: CoreServicesCMSProps) {
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
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});

  const toggleCard = (idx: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  useEffect(() => {
    const unpackData = (data: any) => {
      const list = (data.services as any[]) || [];
      const updated: any = {
        heading: data.heading || "",
        keyCapabilitiesLabel: data.keyCapabilitiesLabel || "",
        valueDeliveredLabel: data.valueDeliveredLabel || "",
        showLessLabel: data.showLessLabel || "",
        viewDetailsLabel: data.viewDetailsLabel || "",
        exploreServiceLabel: data.exploreServiceLabel || "",
      };
      for (let i = 0; i < 6; i++) {
        const item = list[i] || {};
        updated[`serviceTitle${i}`] = item.title || "";
        updated[`serviceIcon${i}`] = item.icon || "";
        updated[`serviceLink${i}`] = item.link || "";
        updated[`serviceOverview${i}`] = item.overview || "";
        updated[`serviceCapabilities${i}`] = (item.capabilities || []).join("\n");
        updated[`serviceValue${i}`] = (item.value || []).join("\n");
      }
      setFormData(updated);
    };

    if (initialData) {
      unpackData(initialData);
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey ? json.data?.[responseKey] : json.data;
          if (json.success && sectionData) {
            unpackData(sectionData);
          }
        })
        .catch(console.error);
    }
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.keyCapabilitiesLabel?.trim()) errs.push("Key Capabilities label is required");
    if (!formData.valueDeliveredLabel?.trim()) errs.push("Value Delivered label is required");
    if (!formData.showLessLabel?.trim()) errs.push("Show Less label is required");
    if (!formData.viewDetailsLabel?.trim()) errs.push("View Details label is required");
    if (!formData.exploreServiceLabel?.trim()) errs.push("Explore Service label is required");

    for (let i = 0; i < 6; i++) {
      if (!(formData as any)[`serviceTitle${i}`]?.trim()) errs.push(`Service Card ${i + 1} Title is required`);
      if (!(formData as any)[`serviceIcon${i}`]?.trim()) errs.push(`Service Card ${i + 1} Icon is required`);
      if (!(formData as any)[`serviceOverview${i}`]?.trim()) errs.push(`Service Card ${i + 1} Overview is required`);
      if (!(formData as any)[`serviceCapabilities${i}`]?.trim()) errs.push(`Service Card ${i + 1} Capabilities list is required`);
      if (!(formData as any)[`serviceValue${i}`]?.trim()) errs.push(`Service Card ${i + 1} Value list is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Core Services section...");
    try {
      const services = Array.from({ length: 6 }).map((_, i) => ({
        title: (formData as any)[`serviceTitle${i}`].trim(),
        icon: (formData as any)[`serviceIcon${i}`].trim(),
        link: (formData as any)[`serviceLink${i}`].trim(),
        overview: (formData as any)[`serviceOverview${i}`].trim(),
        capabilities: (formData as any)[`serviceCapabilities${i}`]
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0),
        value: (formData as any)[`serviceValue${i}`]
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0),
      }));

      const payload = {
        heading: formData.heading,
        keyCapabilitiesLabel: formData.keyCapabilitiesLabel,
        valueDeliveredLabel: formData.valueDeliveredLabel,
        showLessLabel: formData.showLessLabel,
        viewDetailsLabel: formData.viewDetailsLabel,
        exploreServiceLabel: formData.exploreServiceLabel,
        services,
      };

      const body = sectionId
        ? { id: sectionId, content: payload }
        : { section: responseKey, content: payload };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Core Services saved successfully!", { id: toastId });
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
          title="Core Services Section"
          description="Manage corporate service list, icons, routes, capabilities, and target values."
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
              <div className="flex flex-col gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl w-full">
                <InputField
                  label="Section Main Heading"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Core Services"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <InputField
                    label="Key Capabilities Label"
                    name="keyCapabilitiesLabel"
                    value={formData.keyCapabilitiesLabel}
                    onChange={handleChange}
                    placeholder="e.g. Key Capabilities"
                    required
                  />
                  <InputField
                    label="Value Delivered Label"
                    name="valueDeliveredLabel"
                    value={formData.valueDeliveredLabel}
                    onChange={handleChange}
                    placeholder="e.g. Value Delivered"
                    required
                  />
                  <InputField
                    label="Show Less Label"
                    name="showLessLabel"
                    value={formData.showLessLabel}
                    onChange={handleChange}
                    placeholder="e.g. Show Less"
                    required
                  />
                  <InputField
                    label="View Details Label"
                    name="viewDetailsLabel"
                    value={formData.viewDetailsLabel}
                    onChange={handleChange}
                    placeholder="e.g. View Details"
                    required
                  />
                  <InputField
                    label="Explore Service Label"
                    name="exploreServiceLabel"
                    value={formData.exploreServiceLabel}
                    onChange={handleChange}
                    placeholder="e.g. Explore Service"
                    required
                  />
                </div>

                {/* Service Cards list */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4 animate-pulse">
                  Edit 6 Core Service Cards (Click Details to toggle details dropdowns on site)
                </span>
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const isExpanded = !!expandedCards[i];
                    const title = (formData as any)[`serviceTitle${i}`];
                    return (
                      <div
                        key={i}
                        className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleCard(i)}
                          className="w-full p-4 px-5 bg-gray-50/70 hover:bg-gray-100/70 transition-colors flex items-center justify-between cursor-pointer text-left select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider shrink-0">
                              Core Service {i + 1}
                            </span>
                            {title && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span className="text-xs font-semibold text-gray-800 truncate">
                                  {title}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-gray-500">
                            <span className="text-xs font-medium text-gray-400 hidden sm:inline">
                              {isExpanded ? "Collapse" : "Expand"}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                                isExpanded ? "rotate-180 text-gray-700" : "rotate-0"
                              }`}
                            />
                          </div>
                        </button>

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-6 border-t border-gray-100 flex flex-col gap-4 bg-white">
                              <InputField
                                label="Service Title"
                                name={`serviceTitle${i}`}
                                value={(formData as any)[`serviceTitle${i}`]}
                                onChange={handleChange}
                                placeholder="e.g. Asset Stewardship (O&M)"
                                required
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                  label="Lucide Icon"
                                  name={`serviceIcon${i}`}
                                  value={(formData as any)[`serviceIcon${i}`]}
                                  onChange={handleChange}
                                  placeholder="e.g. Target"
                                  required
                                />
                                <InputField
                                  label="Redirection Route Link"
                                  name={`serviceLink${i}`}
                                  value={(formData as any)[`serviceLink${i}`]}
                                  onChange={handleChange}
                                  placeholder="e.g. /services/power-generation"
                                />
                              </div>
                              <TextAreaField
                                label="Card Overview Description"
                                name={`serviceOverview${i}`}
                                value={(formData as any)[`serviceOverview${i}`]}
                                onChange={handleChange}
                                placeholder="Overview of the service..."
                                rows={2}
                                required
                              />
                              <TextAreaField
                                label="Key Capabilities (One item per line)"
                                name={`serviceCapabilities${i}`}
                                value={(formData as any)[`serviceCapabilities${i}`]}
                                onChange={handleChange}
                                placeholder="Feasibility Studies&#10;Strategic Sourcing&#10;Financial Assessments"
                                rows={3}
                                required
                              />
                              <TextAreaField
                                label="Value Delivered (One item per line)"
                                name={`serviceValue${i}`}
                                value={(formData as any)[`serviceValue${i}`]}
                                onChange={handleChange}
                                placeholder="Technically sound planning&#10;Viable project returns"
                                rows={3}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
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
