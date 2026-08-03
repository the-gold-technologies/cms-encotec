"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";

interface LeaderProfile {
  role: string;
  name: string;
  bio: string;
}

const emptyLeader = (): LeaderProfile => ({ role: "", name: "", bio: "" });

const defaultFormData = {
  heading: "",
  description: "",
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
  const [leadersList, setLeadersList] = useState<LeaderProfile[]>([emptyLeader()]);

  useEffect(() => {
    const unpackData = (data: any) => {
      setFormData({
        heading: data.heading || "",
        description: data.description || "",
      });

      const list = (data.leaders as any[]) || [];
      if (Array.isArray(list) && list.length > 0) {
        setLeadersList(
          list.map((item: any) => ({
            role: item?.role || "",
            name: item?.name || "",
            bio: item?.bio || "",
          }))
        );
      } else {
        // Fallback from legacy leaderRole0..1
        const legacy: LeaderProfile[] = [];
        for (let i = 0; i < 2; i++) {
          if (data[`leaderName${i}`] || data[`leaderRole${i}`]) {
            legacy.push({
              role: data[`leaderRole${i}`] || "",
              name: data[`leaderName${i}`] || "",
              bio: data[`leaderBio${i}`] || "",
            });
          }
        }
        setLeadersList(legacy.length > 0 ? legacy : [emptyLeader()]);
      }
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

  const handleLeaderChange = (index: number, field: keyof LeaderProfile, value: string) => {
    setLeadersList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addLeader = () => {
    setLeadersList((prev) => [...prev, emptyLeader()]);
    toast.success("Added new leader profile card");
  };

  const deleteLeader = (index: number) => {
    if (leadersList.length <= 1) {
      toast.error("At least 1 leadership profile card is required");
      return;
    }
    setLeadersList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed leader profile card");
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.heading?.trim()) errs.push("Heading is required");
    if (!formData.description?.trim()) errs.push("Description is required");

    leadersList.forEach((leader, i) => {
      if (!leader.role?.trim()) errs.push(`Leader ${i + 1} Role is required`);
      if (!leader.name?.trim()) errs.push(`Leader ${i + 1} Name is required`);
      if (!leader.bio?.trim()) errs.push(`Leader ${i + 1} Bio is required`);
    });

    if (errs.length > 0) {
      errs.forEach((msg) => toast.error(msg));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Leadership section...");
    try {
      const payload: any = {
        heading: formData.heading,
        description: formData.description,
        leaders: leadersList,
      };

      // Keep legacy properties synced
      leadersList.forEach((leader, i) => {
        if (i < 2) {
          payload[`leaderRole${i}`] = leader.role;
          payload[`leaderName${i}`] = leader.name;
          payload[`leaderBio${i}`] = leader.bio;
        }
      });

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
          description="Manage leadership cards, photos, bios, and subheadings. Add or delete executive profiles dynamically."
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

                {/* Leader Cards Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-4">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Executive Leadership Profiles <span className="text-blue-500 font-semibold">({leadersList.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={addLeader}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Leader Profile</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {leadersList.map((leader, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col gap-4 shadow-sm relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                          Executive Profile {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteLeader(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Leader Profile"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Role / Title"
                        name={`leaderRole${i}`}
                        value={leader.role}
                        onChange={(e) => handleLeaderChange(i, "role", e.target.value)}
                        placeholder="e.g. Managing Director"
                        required
                      />
                      <InputField
                        label="Name"
                        name={`leaderName${i}`}
                        value={leader.name}
                        onChange={(e) => handleLeaderChange(i, "name", e.target.value)}
                        placeholder="e.g. [Name]"
                        required
                      />
                      <TextAreaField
                        label="Biography"
                        name={`leaderBio${i}`}
                        value={leader.bio}
                        onChange={(e) => handleLeaderChange(i, "bio", e.target.value)}
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
