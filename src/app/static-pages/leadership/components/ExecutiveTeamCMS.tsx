"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/lib/uploadHelpers";

interface ExecutiveMember {
  name: string;
  role: string;
  bio: string;
  tags: string;
  image?: File | string | null;
}

const emptyExecutive = (): ExecutiveMember => ({
  name: "",
  role: "",
  bio: "",
  tags: "",
  image: "",
});

const defaultFormData = {
  tagline: "",
  heading: "",
};

export function ExecutiveTeamCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [executivesList, setExecutivesList] = useState<ExecutiveMember[]>([
    emptyExecutive(),
  ]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.ExecutiveTeam) {
          const d = json.data.ExecutiveTeam;
          setFormData({
            tagline: d.tagline || "",
            heading: d.heading || "",
          });

          if (Array.isArray(d.executives) && d.executives.length > 0) {
            setExecutivesList(
              d.executives.map((item: any) => ({
                name: item?.name || "",
                role: item?.role || "",
                bio: item?.bio || "",
                tags: item?.tags || "",
                image: item?.image || "",
              }))
            );
          } else {
            // Fallback from legacy exec1..exec3
            const legacy: ExecutiveMember[] = [];
            for (let i = 1; i <= 3; i++) {
              if (d[`exec${i}Name`] || d[`exec${i}Role`]) {
                legacy.push({
                  name: d[`exec${i}Name`] || "",
                  role: d[`exec${i}Role`] || "",
                  bio: d[`exec${i}Bio`] || "",
                  tags: d[`exec${i}Tags`] || "",
                  image: d[`exec${i}Image`] || "",
                });
              }
            }
            setExecutivesList(legacy.length > 0 ? legacy : [emptyExecutive()]);
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

  const handleExecChange = (
    index: number,
    field: keyof ExecutiveMember,
    value: any
  ) => {
    setExecutivesList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addExecutive = () => {
    setExecutivesList((prev) => [...prev, emptyExecutive()]);
    toast.success("Added new executive member card");
  };

  const deleteExecutive = (index: number) => {
    if (executivesList.length <= 1) {
      toast.error("At least 1 executive team member is required");
      return;
    }
    setExecutivesList((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed executive team member");
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Executive Team Section...");
    try {
      const processedExecutives = await Promise.all(
        executivesList.map(async (exec) => {
          let imageUrl = typeof exec.image === "string" ? exec.image : "";
          if (exec.image instanceof File) {
            const uploaded = await uploadFiles([exec.image]);
            if (uploaded[0]) imageUrl = uploaded[0];
          }
          return {
            ...exec,
            image: imageUrl,
          };
        })
      );

      const payload: any = {
        tagline: formData.tagline,
        heading: formData.heading,
        executives: processedExecutives,
      };

      // Keep legacy properties synced for website compatibility
      processedExecutives.forEach((exec, i) => {
        const num = i + 1;
        payload[`exec${num}Name`] = exec.name;
        payload[`exec${num}Role`] = exec.role;
        payload[`exec${num}Bio`] = exec.bio;
        payload[`exec${num}Tags`] = exec.tags;
        payload[`exec${num}Image`] = exec.image;
      });

      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ExecutiveTeam",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Executive Team Section saved successfully!", {
          id: toastId,
        });
        setExecutivesList(processedExecutives);
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
        title="Executive Team"
        description="Manage corporate tagline, heading, biographies, photo uploads (Cloudinary), and tags of executive founders/directors."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-8 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Executive Cards Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Executive Members <span className="text-blue-500 font-semibold">({executivesList.length})</span>
            </span>
            <button
              type="button"
              onClick={addExecutive}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-pink hover:bg-[#a0004f] active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Executive Member</span>
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {executivesList.map((exec, i) => (
              <div
                key={i}
                className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl flex flex-col gap-4 relative group shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                    Executive Member {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExecutive(i)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                    title="Delete Executive Member"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    name={`execName${i}`}
                    value={exec.name}
                    onChange={(e) => handleExecChange(i, "name", e.target.value)}
                    placeholder="e.g. Arun Kumar Sarna"
                    required
                  />
                  <InputField
                    label="Role / Title"
                    name={`execRole${i}`}
                    value={exec.role}
                    onChange={(e) => handleExecChange(i, "role", e.target.value)}
                    placeholder="e.g. Managing Director"
                    required
                  />
                </div>

                <ImagePickerField
                  label="Executive Photo (Upload File or Cloudinary URL)"
                  sublabel={`Executive #${i + 1} Profile Photo`}
                  value={exec.image || null}
                  onChange={(val) => handleExecChange(i, "image", val)}
                />

                <TextAreaField
                  label="Biography"
                  name={`execBio${i}`}
                  value={exec.bio}
                  onChange={(e) => handleExecChange(i, "bio", e.target.value)}
                  rows={4}
                  required
                />
                <InputField
                  label="Expertise Tags (Comma-separated)"
                  name={`execTags${i}`}
                  value={exec.tags}
                  onChange={(e) => handleExecChange(i, "tags", e.target.value)}
                  placeholder="e.g. Strategic Leadership, Business Development"
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
