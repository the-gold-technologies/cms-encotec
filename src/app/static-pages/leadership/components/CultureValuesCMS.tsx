"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

interface ValuePillar {
  title: string;
  description: string;
}

const emptyValue = (): ValuePillar => ({ title: "", description: "" });

const defaultFormData = {
  tagline: "",
  heading: "",
};

export function CultureValuesCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [valuesList, setValuesList] = useState<ValuePillar[]>([emptyValue()]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.CultureValues) {
          const data = json.data.CultureValues;
          setFormData({
            tagline: data.tagline || "",
            heading: data.heading || "",
          });

          if (Array.isArray(data.values) && data.values.length > 0) {
            setValuesList(
              data.values.map((item: any) => ({
                title: item?.title || "",
                description: item?.description || item?.desc || "",
              }))
            );
          } else {
            const legacy: ValuePillar[] = [];
            for (let i = 1; i <= 4; i++) {
              if (data[`value${i}Title`] || data[`value${i}Desc`]) {
                legacy.push({
                  title: data[`value${i}Title`] || "",
                  description: data[`value${i}Desc`] || "",
                });
              }
            }
            setValuesList(legacy.length > 0 ? legacy : [emptyValue()]);
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleValueChange = (index: number, field: keyof ValuePillar, value: string) => {
    setValuesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addValue = () => {
    setValuesList((prev) => [...prev, emptyValue()]);
    toast.success("Added new culture value pillar");
  };

  const deleteValue = (index: number) => {
    if (valuesList.length <= 1) {
      toast.error("At least 1 culture value pillar is required");
      return;
    }
    setValuesList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed culture value pillar");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Culture & Values Section...");
    try {
      const payload: any = {
        tagline: formData.tagline,
        heading: formData.heading,
        values: valuesList,
      };

      valuesList.forEach((val, i) => {
        const num = i + 1;
        if (num <= 4) {
          payload[`value${num}Title`] = val.title;
          payload[`value${num}Desc`] = val.description;
        }
      });

      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CultureValues",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Culture & Values Section saved successfully!", {
          id: toastId,
        });
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
        title="Culture & Core Values"
        description="Manage the tagline, heading, titles and description snippets of culture pillars. Add or remove pillars dynamically."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <InputField
              label="Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Culture Value Pillars <span className="text-neutral-600 font-semibold">({valuesList.length})</span>
            </span>
            <button
              type="button"
              onClick={addValue}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Value Pillar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valuesList.map((val, i) => (
              <div
                key={i}
                className="p-5 bg-gray-50/20 border border-gray-100 rounded-xl flex flex-col gap-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Value pillar {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteValue(i)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Delete Value Pillar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <InputField
                  label="Pillar Title"
                  name={`value${i + 1}Title`}
                  value={val.title}
                  onChange={(e) => handleValueChange(i, "title", e.target.value)}
                  required
                />
                <TextAreaField
                  label="Pillar Description"
                  name={`value${i + 1}Desc`}
                  value={val.description}
                  onChange={(e) => handleValueChange(i, "description", e.target.value)}
                  rows={2}
                  required
                />
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
