"use client";

import { useState, useEffect } from "react";
import { fetchWithCache, clearCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";
import { uploadFiles } from "@/lib/uploadHelpers";
import { ImagePickerField } from "@/components/ImagePickerField";
import { Plus, Trash2 } from "lucide-react";

// 1. EngineeringHeroCMS
export function EngineeringHeroCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const [formData, setFormData] = useState({
    label: "",
    headline: "",
    description: "",
    floatingStats: ["", "", ""],
    backgroundImage: "",
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["EngineeringHero"];
        if (json.success && sectionData) {
          const loaded = {
            label: sectionData.label || "",
            headline: sectionData.headline || "",
            description: sectionData.description || "",
            floatingStats: sectionData.floatingStats || ["", "", ""],
            backgroundImage: sectionData.backgroundImage || "",
          };
          setFormData(loaded);
          if (loaded.backgroundImage) setSelectedImage(loaded.backgroundImage);
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

  const handleStatChange = (index: number, val: string) => {
    setFormData((prev) => {
      const stats = [...prev.floatingStats];
      stats[index] = val;
      return { ...prev, floatingStats: stats };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Engineering Hero...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        backgroundImage: imgUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "EngineeringHero", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Engineering Hero saved!", { id: toastId });
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
        title="Engineering Hero Section"
        description="Manage the Hero label, split titles, descriptions and backgrounds."
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
          <InputField
            label="Headline"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-700">
              Floating Badge Stats
            </h4>
            {formData.floatingStats.map((stat, i) => (
              <InputField
                key={i}
                label={`Stat ${i + 1}`}
                value={stat}
                onChange={(e) => handleStatChange(i, e.target.value)}
                placeholder="e.g. 500+ Projects Engineered"
              />
            ))}
          </div>

          <ImagePickerField
            label="Background Image"
            value={selectedImage}
            onChange={(val) => setSelectedImage(val as File)}
            containerClassName="w-full"
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

// 2. OverviewSectionCMS
export function OverviewSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const [formData, setFormData] = useState({
    tagline: "",
    heading: "",
    paragraphs: ["", ""],
    quote: "",
    image: "",
    badgeTitle: "",
    badgeValue: "",
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["OverviewSection"];
        if (json.success && sectionData) {
          const loaded = {
            tagline: sectionData.tagline || "",
            heading: sectionData.heading || "",
            paragraphs: sectionData.paragraphs || ["", ""],
            quote: sectionData.quote || "",
            image: sectionData.image || "",
            badgeTitle: sectionData.badgeTitle || "",
            badgeValue: sectionData.badgeValue || "",
          };
          setFormData(loaded);
          if (loaded.image) setSelectedImage(loaded.image);
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

  const handleParagraphChange = (index: number, val: string) => {
    setFormData((prev) => {
      const paras = [...prev.paragraphs];
      paras[index] = val;
      return { ...prev, paragraphs: paras };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Overview Section...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        image: imgUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "OverviewSection", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Overview saved!", { id: toastId });
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
        title="Overview Section"
        description="Manage the introductory heading, descriptions, blockquotes, side images, and highlight design badges."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
          <InputField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
          />

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-700">Paragraphs</h4>
            {formData.paragraphs.map((p, i) => (
              <TextAreaField
                key={i}
                label={`Paragraph ${i + 1}`}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                rows={3}
                required
              />
            ))}
          </div>

          <TextAreaField
            label="Quote Statement"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            required
            rows={2}
          />

          <div className="flex flex-col md:flex-row gap-6">
            <InputField
              label="Badge Title"
              name="badgeTitle"
              value={formData.badgeTitle}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
            <InputField
              label="Badge Value"
              name="badgeValue"
              value={formData.badgeValue}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
          </div>

          <ImagePickerField
            label="Side Image"
            value={selectedImage}
            onChange={(val) => setSelectedImage(val as File)}
            containerClassName="w-full"
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

// 3. CapabilitiesSectionCMS
export function CapabilitiesSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tagline: "",
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
            tagline: sectionData.tagline || "",
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

  const handleCardChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const caps = [...prev.capabilities];
      caps[index] = { ...caps[index], [field]: val };
      return { ...prev, capabilities: caps };
    });
  };

  const handleCardImageUpload = async (index: number, file: File) => {
    const toastId = toast.loading("Uploading card image...");
    try {
      const urls = await uploadFiles([file]);
      if (urls[0]) {
        handleCardChange(index, "image", urls[0]);
        toast.success("Image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error.", { id: toastId });
    }
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
        clearCache(saveUrl);
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
        title="Key Capabilities"
        description="Manage page capabilities cards, details, and visual badges."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
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
            <h4 className="text-sm font-bold text-gray-700">
              Capabilities List
            </h4>
            {formData.capabilities.map((cap, i) => (
              <div
                key={i}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 flex flex-col gap-4"
              >
                <div className="text-xs font-bold text-gray-400 uppercase">
                  Capability Card #{i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={cap.title}
                    onChange={(e) =>
                      handleCardChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Lucide Icon (e.g. Target, Zap)"
                    value={cap.icon}
                    onChange={(e) =>
                      handleCardChange(i, "icon", e.target.value)
                    }
                    required
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={cap.description}
                  onChange={(e) =>
                    handleCardChange(i, "description", e.target.value)
                  }
                  required
                  rows={2}
                />

                <ImagePickerField
                  label="Card Image"
                  value={cap.image}
                  onChange={(val) => handleCardImageUpload(i, val as File)}
                  containerClassName="w-full"
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

// 4. ProcessSectionCMS
export function ProcessSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tagline: "",
    heading: "",
    description: "",
    steps: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["ProcessSection"];
        if (json.success && sectionData) {
          setFormData({
            tagline: sectionData.tagline || "",
            heading: sectionData.heading || "",
            description: sectionData.description || "",
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

  const handleStepChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const steps = [...prev.steps];
      steps[index] = { ...steps[index], [field]: val };
      return { ...prev, steps };
    });
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: "",
          icon: "Search",
          description: "",
          image: "",
        },
      ],
    }));
    toast.success("Added new step card");
  };

  const deleteStep = (index: number) => {
    if (formData.steps.length <= 1) {
      toast.error("At least 1 step card is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index),
    }));
    toast.success("Removed step card");
  };

  const handleStepImageUpload = async (index: number, file: File) => {
    const toastId = toast.loading("Uploading step image...");
    try {
      const urls = await uploadFiles([file]);
      if (urls[0]) {
        handleStepChange(index, "image", urls[0]);
        toast.success("Image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error.", { id: toastId });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Process Steps...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ProcessSection", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Process steps saved!", { id: toastId });
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
        title="Engineering Methodology Steps"
        description="Manage workflow steps, captions, and details. Add or delete step cards dynamically."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
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
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-700">Steps List ({formData.steps.length})</h4>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Plus size={14} /> Add Step Card
              </button>
            </div>
            {formData.steps.map((step, i) => (
              <div
                key={i}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    Step #{i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteStep(i)}
                    title="Delete Step"
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={step.title}
                    onChange={(e) =>
                      handleStepChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Lucide Icon (e.g. Search, Settings)"
                    value={step.icon}
                    onChange={(e) =>
                      handleStepChange(i, "icon", e.target.value)
                    }
                    required
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={step.description}
                  onChange={(e) =>
                    handleStepChange(i, "description", e.target.value)
                  }
                  required
                  rows={2}
                />

                <ImagePickerField
                  label="Step Image"
                  value={step.image}
                  onChange={(val) => handleStepImageUpload(i, val as File)}
                  containerClassName="w-full"
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

// 5. StatsSectionCMS
export function StatsSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    stats: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["StatsSection"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            stats: sectionData.stats || [],
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

  const handleStatChange = (index: number, field: string, val: any) => {
    setFormData((prev) => {
      const items = [...prev.stats];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, stats: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Impact Stats...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "StatsSection", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Stats saved!", { id: toastId });
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
        title="Impact Statistics"
        description="Manage the key dynamic counter statistics and descriptions."
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            {formData.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-xl"
              >
                <div className="text-xs font-bold text-gray-400">
                  Stat Card #{i + 1}
                </div>
                <div className="grid grid-cols-[3fr_1fr] gap-3">
                  <InputField
                    label="Value"
                    type="number"
                    value={stat.value}
                    onChange={(e) =>
                      handleStatChange(i, "value", parseFloat(e.target.value))
                    }
                    required
                  />
                  <InputField
                    label="Suffix"
                    value={stat.suffix}
                    onChange={(e) =>
                      handleStatChange(i, "suffix", e.target.value)
                    }
                    placeholder="+, %"
                    required
                  />
                </div>
                <InputField
                  label="Label Description"
                  value={stat.label}
                  onChange={(e) => handleStatChange(i, "label", e.target.value)}
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

// 6. FeaturedProjectSectionCMS
export function FeaturedProjectSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | string>("");

  const [formData, setFormData] = useState({
    tagline: "",
    heading: "",
    projectTitle: "",
    projectDescription: "",
    projectImage: "",
    metrics: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["FeaturedProjectSection"];
        if (json.success && sectionData) {
          setFormData({
            tagline: sectionData.tagline || "",
            heading: sectionData.heading || "",
            projectTitle: sectionData.projectTitle || "",
            projectDescription: sectionData.projectDescription || "",
            projectImage: sectionData.projectImage || "",
            metrics: sectionData.metrics || [],
          });
          if (sectionData.projectImage)
            setSelectedImage(sectionData.projectImage);
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

  const handleMetricChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.metrics];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, metrics: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Featured Project...");
    try {
      const uploadedUrls = await uploadFiles([selectedImage]);
      const imgUrl =
        selectedImage instanceof File ? uploadedUrls[0] || "" : selectedImage;

      const payload = {
        ...formData,
        projectImage: imgUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "FeaturedProjectSection",
          content: payload,
        }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Featured project saved!", { id: toastId });
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
        title="Featured Project Case Study"
        description="Manage the case study project, metrics, and cover photography."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
          <InputField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
          />

          <div className="border border-gray-100 p-4 rounded-xl flex flex-col gap-4 bg-gray-50/10">
            <InputField
              label="Project Title"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
            />
            <TextAreaField
              label="Project Description"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-4 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            <h4 className="text-sm font-bold text-gray-700">
              Project Key Metrics
            </h4>
            {formData.metrics.map((metric, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b last:border-0 border-gray-100"
              >
                <InputField
                  label="Value (e.g. 1,320 MW)"
                  value={metric.value}
                  onChange={(e) =>
                    handleMetricChange(i, "value", e.target.value)
                  }
                  required
                />
                <InputField
                  label="Label (e.g. Total Capacity)"
                  value={metric.label}
                  onChange={(e) =>
                    handleMetricChange(i, "label", e.target.value)
                  }
                  required
                />
                <InputField
                  label="Lucide Icon (e.g. Zap, Target)"
                  value={metric.icon}
                  onChange={(e) =>
                    handleMetricChange(i, "icon", e.target.value)
                  }
                  required
                />
              </div>
            ))}
          </div>

          <ImagePickerField
            label="Project Image"
            value={selectedImage}
            onChange={(val) => setSelectedImage(val as File)}
            containerClassName="w-full"
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

// 7. ValueSectionCMS
export function ValueSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tagline: "",
    heading: "",
    description: "",
    values: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["ValueSection"];
        if (json.success && sectionData) {
          setFormData({
            tagline: sectionData.tagline || "",
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            values: sectionData.values || [],
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

  const handleValueChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.values];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, values: items };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Value Statements...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ValueSection", content: formData }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Values saved!", { id: toastId });
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
        title="Engineering Value Statements"
        description="Manage core client value statements and compliance labels."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
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
            <h4 className="text-sm font-bold text-gray-700">
              Value Statements
            </h4>
            {formData.values.map((v, i) => (
              <div
                key={i}
                className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3"
              >
                <div className="text-xs font-bold text-gray-400">
                  Statement Card #{i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={v.title}
                    onChange={(e) =>
                      handleValueChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Lucide Icon (e.g. ShieldCheck, Target)"
                    value={v.icon}
                    onChange={(e) =>
                      handleValueChange(i, "icon", e.target.value)
                    }
                    required
                  />
                </div>
                <TextAreaField
                  label="Description Text"
                  value={v.description}
                  onChange={(e) =>
                    handleValueChange(i, "description", e.target.value)
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

// 8. RelatedServicesSectionCMS
export function RelatedServicesSectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tagline: "",
    heading: "",
    services: [] as any[],
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["RelatedServicesSection"];
        if (json.success && sectionData) {
          setFormData({
            tagline: sectionData.tagline || "",
            heading: sectionData.heading || "",
            services: sectionData.services || [],
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

  const handleServiceChange = (index: number, field: string, val: string) => {
    setFormData((prev) => {
      const items = [...prev.services];
      items[index] = { ...items[index], [field]: val };
      return { ...prev, services: items };
    });
  };

  const handleServiceImageUpload = async (index: number, file: File) => {
    const toastId = toast.loading("Uploading related service cover...");
    try {
      const urls = await uploadFiles([file]);
      if (urls[0]) {
        handleServiceChange(index, "image", urls[0]);
        toast.success("Image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error.", { id: toastId });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Related Services...");
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "RelatedServicesSection",
          content: formData,
        }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("Related services saved!", { id: toastId });
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
        title="Explore Related Services"
        description="Manage bottom related services shortcut cards, links, and cover shots."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="Tagline label"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            required
          />
          <InputField
            label="Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col gap-6 border border-gray-100 p-6 rounded-2xl bg-gray-50/20">
            <h4 className="text-sm font-bold text-gray-700">Services Cards</h4>
            {formData.services.map((ser, i) => (
              <div
                key={i}
                className="border-b last:border-0 border-gray-100 pb-4 last:pb-0 flex flex-col gap-3"
              >
                <div className="text-xs font-bold text-gray-400">
                  Card #{i + 1}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={ser.title}
                    onChange={(e) =>
                      handleServiceChange(i, "title", e.target.value)
                    }
                    required
                  />
                  <InputField
                    label="Link (e.g. /services/project-management)"
                    value={ser.link}
                    onChange={(e) =>
                      handleServiceChange(i, "link", e.target.value)
                    }
                    required
                  />
                </div>
                <TextAreaField
                  label="Description"
                  value={ser.description}
                  onChange={(e) =>
                    handleServiceChange(i, "description", e.target.value)
                  }
                  required
                  rows={2}
                />

                <div className="flex items-center gap-4">
                  <ImagePickerField
                    label="Service Image"
                    value={ser.image}
                    onChange={(val) => handleServiceImageUpload(i, val as File)}
                    containerClassName="w-full"
                  />
                </div>
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

// 9. CTASectionCMS
export function CTASectionCMS({ saveUrl }: { saveUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    primaryBtnLabel: "",
    primaryBtnUrl: "",
    secondaryBtnLabel: "",
    secondaryBtnUrl: "",
    ctaLabel: "", // Fallback
    ctaUrl: "", // Fallback
  });

  useEffect(() => {
    fetchWithCache(saveUrl)
      .then((json) => {
        const sectionData = json.data?.["CTASection"];
        if (json.success && sectionData) {
          setFormData({
            heading: sectionData.heading || "",
            description: sectionData.description || "",
            primaryBtnLabel:
              sectionData.primaryBtnLabel || sectionData.ctaLabel || "",
            primaryBtnUrl:
              sectionData.primaryBtnUrl || sectionData.ctaUrl || "",
            secondaryBtnLabel: sectionData.secondaryBtnLabel || "",
            secondaryBtnUrl: sectionData.secondaryBtnUrl || "",
            ctaLabel: sectionData.ctaLabel || "",
            ctaUrl: sectionData.ctaUrl || "",
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
    const toastId = toast.loading("Saving CTA Section...");
    try {
      // Replicate ctaLabel/ctaUrl dynamically to cover both structures
      const payload = {
        ...formData,
        ctaLabel: formData.primaryBtnLabel || formData.ctaLabel,
        ctaUrl: formData.primaryBtnUrl || formData.ctaUrl,
      };

      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "CTASection", content: payload }),
      });
      const json = await res.json();
      if (json.success) {
        clearCache(saveUrl);
        toast.success("CTA saved successfully!", { id: toastId });
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
        title="Closing CTA Section"
        description="Manage the headline, description, primary and secondary call-to-action button labels and redirect links."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-6">
          <InputField
            label="CTA Heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Description / Subtitle"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
          />

          <div className="flex flex-col md:flex-row gap-6 border-t border-gray-100 pt-6">
            <InputField
              label="Primary CTA Label"
              name="primaryBtnLabel"
              value={formData.primaryBtnLabel}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
            <InputField
              label="Primary CTA Redirect URL"
              name="primaryBtnUrl"
              value={formData.primaryBtnUrl}
              onChange={handleChange}
              required
              containerClassName="flex-1"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <InputField
              label="Secondary CTA Label"
              name="secondaryBtnLabel"
              value={formData.secondaryBtnLabel}
              onChange={handleChange}
              containerClassName="flex-1"
            />
            <InputField
              label="Secondary CTA Redirect URL"
              name="secondaryBtnUrl"
              value={formData.secondaryBtnUrl}
              onChange={handleChange}
              containerClassName="flex-1"
            />
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
