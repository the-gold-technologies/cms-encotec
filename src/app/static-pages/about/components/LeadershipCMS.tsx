"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

const defaultFormData = {
  heading: "",
  description: "",
  leaderRole0: "",
  leaderName0: "",
  leaderBio0: "",
  leaderRole1: "",
  leaderName1: "",
  leaderBio1: ""
};

interface LeadershipCMSProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function LeadershipCMS({
  sectionId,
  initialData,
  saveUrl = "/api/about",
  responseKey = "Leadership",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: LeadershipCMSProps) {
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
    const unpackData = (data: any) => {
      const list = (data.leaders as any[]) || [];
      setFormData({
        heading: data.heading || "",
        description: data.description || "",
        leaderRole0: list[0]?.role || "",
        leaderName0: list[0]?.name || "",
        leaderBio0: list[0]?.bio || "",
        leaderRole1: list[1]?.role || "",
        leaderName1: list[1]?.name || "",
        leaderBio1: list[1]?.bio || "",
      });
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
    if (!formData.description?.trim()) errs.push("Description is required");

    for (let i = 0; i < 2; i++) {
      if (!(formData as any)[`leaderRole${i}`]?.trim()) errs.push(`Leader ${i + 1} Role is required`);
      if (!(formData as any)[`leaderName${i}`]?.trim()) errs.push(`Leader ${i + 1} Name is required`);
      if (!(formData as any)[`leaderBio${i}`]?.trim()) errs.push(`Leader ${i + 1} Bio is required`);
    }

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Leadership section...");
    try {
      const leaders = Array.from({ length: 2 }).map((_, i) => ({
        role: (formData as any)[`leaderRole${i}`],
        name: (formData as any)[`leaderName${i}`],
        bio: (formData as any)[`leaderBio${i}`],
      }));

      const payload = {
        heading: formData.heading,
        description: formData.description,
        leaders,
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
        toast.success("Leadership saved successfully!", { id: toastId });
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
          title="Leadership Team Section"
          description="Manage leadership cards, photos, bios, and subheadings."
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
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <InputField
                    label="Heading"
                    name="heading"
                    value={formData.heading}
                    onChange={handleChange}
                    placeholder="e.g. Leadership Team"
                    required
                    containerClassName="flex-1"
                  />
                  <InputField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Experienced leaders driving operational..."
                    required
                    containerClassName="flex-1"
                  />
                </div>

                {/* Leader Cards */}
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mt-4">
                  Edit 2 Executive Leadership Profiles
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Executive Profile {i + 1}
                      </span>
                      <InputField
                        label="Role / Title"
                        name={`leaderRole${i}`}
                        value={(formData as any)[`leaderRole${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. Managing Director"
                        required
                      />
                      <InputField
                        label="Name"
                        name={`leaderName${i}`}
                        value={(formData as any)[`leaderName${i}`]}
                        onChange={handleChange}
                        placeholder="e.g. [Name]"
                        required
                      />
                      <TextAreaField
                        label="Biography"
                        name={`leaderBio${i}`}
                        value={(formData as any)[`leaderBio${i}`]}
                        onChange={handleChange}
                        placeholder="Executive bio..."
                        rows={6}
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
