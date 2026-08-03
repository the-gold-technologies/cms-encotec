"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

interface HeadProfile {
  name: string;
  role: string;
  bio: string;
}

const emptyHead = (): HeadProfile => ({ name: "", role: "", bio: "" });

const defaultFormData = {
  tagline: "",
  heading: "",
};

export function SeniorLeadershipCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [headsList, setHeadsList] = useState<HeadProfile[]>([emptyHead()]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.SeniorLeadership) {
          const data = json.data.SeniorLeadership;
          setFormData({
            tagline: data.tagline || "",
            heading: data.heading || "",
          });

          if (Array.isArray(data.heads) && data.heads.length > 0) {
            setHeadsList(
              data.heads.map((item: any) => ({
                name: item?.name || "",
                role: item?.role || "",
                bio: item?.bio || "",
              }))
            );
          } else {
            const legacy: HeadProfile[] = [];
            for (let i = 1; i <= 6; i++) {
              if (data[`leader${i}Name`] || data[`leader${i}Role`]) {
                legacy.push({
                  name: data[`leader${i}Name`] || "",
                  role: data[`leader${i}Role`] || "",
                  bio: data[`leader${i}Bio`] || "",
                });
              }
            }
            setHeadsList(legacy.length > 0 ? legacy : [emptyHead()]);
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

  const handleHeadChange = (index: number, field: keyof HeadProfile, value: string) => {
    setHeadsList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addHead = () => {
    setHeadsList((prev) => [...prev, emptyHead()]);
    toast.success("Added new department head profile");
  };

  const deleteHead = (index: number) => {
    if (headsList.length <= 1) {
      toast.error("At least 1 department head profile is required");
      return;
    }
    setHeadsList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed department head profile");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Senior Leadership Section...");
    try {
      const payload: any = {
        tagline: formData.tagline,
        heading: formData.heading,
        heads: headsList,
      };

      headsList.forEach((head, i) => {
        const num = i + 1;
        if (num <= 6) {
          payload[`leader${num}Name`] = head.name;
          payload[`leader${num}Role`] = head.role;
          payload[`leader${num}Bio`] = head.bio;
        }
      });

      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "SeniorLeadership",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Senior Leadership Section saved successfully!", {
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
        title="Department Heads"
        description="Manage tagline, heading, profiles, and roles of VP leaders and department engineers. Add or remove profiles dynamically."
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
              Department Head Profiles <span className="text-neutral-600 font-semibold">({headsList.length})</span>
            </span>
            <button
              type="button"
              onClick={addHead}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Head Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {headsList.map((head, i) => (
              <div
                key={i}
                className="p-5 bg-gray-50/30 border border-gray-100 rounded-xl flex flex-col gap-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Head profile {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteHead(i)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Delete Head Profile"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <InputField
                  label="Name"
                  name={`leader${i + 1}Name`}
                  value={head.name}
                  onChange={(e) => handleHeadChange(i, "name", e.target.value)}
                  required
                />
                <InputField
                  label="Role"
                  name={`leader${i + 1}Role`}
                  value={head.role}
                  onChange={(e) => handleHeadChange(i, "role", e.target.value)}
                  required
                />
                <TextAreaField
                  label="Short Bio"
                  name={`leader${i + 1}Bio`}
                  value={head.bio}
                  onChange={(e) => handleHeadChange(i, "bio", e.target.value)}
                  rows={3}
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
