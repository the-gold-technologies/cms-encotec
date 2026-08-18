"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";
import { IconPickerField } from "@/app/components/IconPickerField";

const MAX_CARDS = 6;

interface ValueCard {
  title: string;
  description: string;
  icon: string;
}

const emptyCard = (): ValueCard => ({ title: "", description: "", icon: "" });

const defaultFormData = {
  tagline: "",
  description: "",
  missionTitle: "",
  missionDesc: "",
  visionTitle: "",
  visionDesc: "",
  valuesTitle: "",
  valuesDesc: "",
};

interface MissionVisionValuesCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function MissionVisionValuesCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "MissionVisionValues",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: MissionVisionValuesCMSProps) {
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
  const [valueCards, setValueCards] = useState<ValueCard[]>([emptyCard()]);

  const unpackData = (data: any) => {
    const list = (data.valuesList as any[]) || [];
    setFormData({
      tagline: data.tagline || "",
      description: data.description || "",
      missionTitle: data.missionTitle || "",
      missionDesc: data.missionDesc || "",
      visionTitle: data.visionTitle || "",
      visionDesc: data.visionDesc || "",
      valuesTitle: data.valuesTitle || "",
      valuesDesc: data.valuesDesc || "",
    });
    if (list.length > 0) {
      setValueCards(
        list.slice(0, MAX_CARDS).map((item: any) => ({
          title: item?.title || "",
          description: item?.description || "",
          icon: item?.icon || "",
        }))
      );
    } else {
      setValueCards([emptyCard()]);
    }
  };

  useEffect(() => {
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

  const handleCardChange = (
    index: number,
    field: keyof ValueCard,
    value: string
  ) => {
    setValueCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
  };

  const handleAddCard = () => {
    if (valueCards.length >= MAX_CARDS) {
      toast.error(`Maximum ${MAX_CARDS} cards allowed.`);
      return;
    }
    setValueCards((prev) => [...prev, emptyCard()]);
  };

  const handleDeleteCard = (index: number) => {
    if (valueCards.length <= 1) {
      toast.error("At least 1 value card is required.");
      return;
    }
    setValueCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.description?.trim()) errs.push("Description is required");
    if (!formData.missionTitle?.trim()) errs.push("Mission title is required");
    if (!formData.missionDesc?.trim()) errs.push("Mission description is required");
    if (!formData.visionTitle?.trim()) errs.push("Vision title is required");
    if (!formData.visionDesc?.trim()) errs.push("Vision description is required");
    if (!formData.valuesTitle?.trim()) errs.push("Values title is required");
    if (!formData.valuesDesc?.trim()) errs.push("Values description is required");

    valueCards.forEach((card, i) => {
      if (!card.title?.trim()) errs.push(`Value Card ${i + 1} Title is required`);
      if (!card.description?.trim()) errs.push(`Value Card ${i + 1} Description is required`);
      if (!card.icon?.trim()) errs.push(`Value Card ${i + 1} Icon is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Mission, Vision & Values section...");
    try {
      const payload = {
        ...formData,
        valuesList: valueCards,
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
        toast.success("Mission, Vision & Values saved successfully!", { id: toastId });
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
          title="Mission, Vision & Values Section"
          description="Manage corporate mission, vision statements, and core value cards (up to 6)."
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

                {/* Tag + Description */}
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Section Tag Label"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Our Heart and Soul"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Description Subtitle"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Our purpose is to bridge..."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                {/* Mission + Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-t border-gray-100 pt-6">
                  <div className="flex flex-col gap-4">
                    <InputField
                      label="Mission Title"
                      name="missionTitle"
                      value={formData.missionTitle}
                      onChange={handleChange}
                      placeholder="e.g. Mission"
                      required
                    />
                    <TextAreaField
                      label="Mission Description"
                      name="missionDesc"
                      value={formData.missionDesc}
                      onChange={handleChange}
                      placeholder="Description of the mission..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <InputField
                      label="Vision Title"
                      name="visionTitle"
                      value={formData.visionTitle}
                      onChange={handleChange}
                      placeholder="e.g. Vision"
                      required
                    />
                    <TextAreaField
                      label="Vision Description"
                      name="visionDesc"
                      value={formData.visionDesc}
                      onChange={handleChange}
                      placeholder="Description of the vision..."
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Core Values General */}
                <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                  <InputField
                    label="Values Section Title"
                    name="valuesTitle"
                    value={formData.valuesTitle}
                    onChange={handleChange}
                    placeholder="e.g. Core Values"
                    required
                  />
                  <TextAreaField
                    label="Values Section Description"
                    name="valuesDesc"
                    value={formData.valuesDesc}
                    onChange={handleChange}
                    placeholder="General description of core values..."
                    rows={2}
                    required
                  />
                </div>

                {/* Core Values Cards — Dynamic */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mt-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Core Value Cards&nbsp;
                    <span className="text-blue-400">({valueCards.length}/{MAX_CARDS})</span>
                  </span>
                  {valueCards.length < MAX_CARDS && (
                    <button
                      type="button"
                      onClick={handleAddCard}
                      className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      Add Card
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {valueCards.map((card, i) => (
                    <div
                      key={i}
                      className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group"
                    >
                      {/* Card header */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Card {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteCard(i)}
                          title="Delete card"
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <InputField
                        label="Title"
                        name={`valueTitle${i}`}
                        value={card.title}
                        onChange={(e) => handleCardChange(i, "title", e.target.value)}
                        placeholder="e.g. Accountability"
                        required
                      />
                      <TextAreaField
                        label="Description"
                        name={`valueDesc${i}`}
                        value={card.description}
                        onChange={(e) => handleCardChange(i, "description", e.target.value)}
                        placeholder="Description of value..."
                        rows={3}
                        required
                      />
                      <IconPickerField
                        label="Icon"
                        value={card.icon}
                        onChange={(iconName) => handleCardChange(i, "icon", iconName)}
                        required
                      />
                    </div>
                  ))}
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
