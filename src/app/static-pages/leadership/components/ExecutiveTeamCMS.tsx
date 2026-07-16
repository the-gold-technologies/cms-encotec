"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";

const defaultFormData = {
  tagline: "Executive Leadership",
  heading: "Visionaries Driving Our Mission",
  exec1Name: "Arun Kumar Sarna",
  exec1Role: "Managing Director",
  exec1Bio: "Brings extensive leadership experience in engineering, project execution, and energy infrastructure development. With a deep understanding of large-scale power and industrial projects, has been instrumental in shaping the strategic direction of Encotec. Under this leadership, the organization has expanded its capabilities across engineering, project management, and operations, establishing a strong presence in both domestic and international markets. Focuses on driving long-term value creation through operational excellence, technical innovation, and strong client partnerships.",
  exec1Tags: "Strategic Leadership, Business Development, Energy Infrastructure",
  exec2Name: "Rajan Saxena",
  exec2Role: "Director – Operations",
  exec2Bio: "Leads operational delivery across multiple projects, ensuring efficient execution, adherence to quality standards, and optimal resource utilization across thermal, renewable, and transmission projects. With significant experience in operation and maintenance of power plants, substations, and infrastructure systems, plays a key role in maintaining performance, reliability, and safety across all sites. This expertise ensures that projects are executed with precision while meeting both technical and commercial objectives.",
  exec2Tags: "Operations Management, Plant Commissioning, Asset Optimization"
};

export function ExecutiveTeamCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/leadership")
      .then((json) => {
        if (json.success && json.data?.ExecutiveTeam) {
          setFormData({ ...defaultFormData, ...json.data.ExecutiveTeam });
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

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Executive Team Section...");
    try {
      const res = await fetch("/api/leadership", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "ExecutiveTeam",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Executive Team Section saved successfully!", {
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
        title="Executive Team"
        description="Manage corporate tagline, heading, details, biographies, and tags of the primary corporate founders/directors."
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
          {/* Executive 1 */}
          <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl flex flex-col gap-4">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Executive 1 (Managing Director)
            </span>
            <InputField
              label="Name"
              name="exec1Name"
              value={formData.exec1Name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Role / Title"
              name="exec1Role"
              value={formData.exec1Role}
              onChange={handleChange}
              required
            />
            <TextAreaField
              label="Biography"
              name="exec1Bio"
              value={formData.exec1Bio}
              onChange={handleChange}
              rows={4}
              required
            />
            <InputField
              label="Expertise Tags (Comma-separated)"
              name="exec1Tags"
              value={formData.exec1Tags}
              onChange={handleChange}
            />
          </div>

          {/* Executive 2 */}
          <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl flex flex-col gap-4">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              Executive 2 (Operations Director)
            </span>
            <InputField
              label="Name"
              name="exec2Name"
              value={formData.exec2Name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Role / Title"
              name="exec2Role"
              value={formData.exec2Role}
              onChange={handleChange}
              required
            />
            <TextAreaField
              label="Biography"
              name="exec2Bio"
              value={formData.exec2Bio}
              onChange={handleChange}
              rows={4}
              required
            />
            <InputField
              label="Expertise Tags (Comma-separated)"
              name="exec2Tags"
              value={formData.exec2Tags}
              onChange={handleChange}
            />
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
