"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { uploadFiles } from "@/app/lib/uploadHelpers";

export interface CertItem {
  id?: string;
  title: string;
  subtitle?: string;
  category: string;
  certNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuer?: string;
  accreditation?: string;
  scope?: string;
  desc?: string;
  image?: File | string | null;
}

const defaultFormData = {
  tagline: "QUALITY POLICY & ACCREDITATION",
  heading: "Triple ISO Integrated Management System",
  description: "Certified by Universal Certification Services (UCSPL) and internationally accredited under IAF & KAB standards.",
  certificationsList: [
    {
      id: "iso-9001",
      title: "ISO 9001:2015",
      subtitle: "Quality Management System",
      category: "Quality Assurance",
      certNumber: "UCSPL09802500815",
      issueDate: "28/03/2025",
      expiryDate: "27/03/2028",
      issuer: "Universal Certification Services Private Limited (UCSPL)",
      accreditation: "IAF & KAB (KAB-QC-80)",
      image: "/certificates/iso-9001-certificate.png",
      scope:
        "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
    },
    {
      id: "iso-14001",
      title: "ISO 14001:2015",
      subtitle: "Environmental Management System",
      category: "Environmental Protection",
      certNumber: "UCSPL14612500168",
      issueDate: "28/03/2025",
      expiryDate: "27/03/2028",
      issuer: "Universal Certification Services Private Limited (UCSPL)",
      accreditation: "IAF & KAB (KAB-EC-61)",
      image: "/certificates/iso-14001-certificate.png",
      scope:
        "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
    },
    {
      id: "iso-45001",
      title: "ISO 45001:2018",
      subtitle: "Occupational Health & Safety Management System",
      category: "Workplace Health & Safety",
      certNumber: "UCSPL45612500154",
      issueDate: "28/03/2025",
      expiryDate: "27/03/2028",
      issuer: "Universal Certification Services Private Limited (UCSPL)",
      accreditation: "IAF & KAB (KAB-OC-61)",
      image: "/certificates/iso-45001-certificate.png",
      scope:
        "Designing, Consultancy, Engineering, Erection, Commissioning, Inspection, Testing, Operation and Maintenance of Plant and Machinery in Energy & Infrastructure Sector.",
    },
  ] as CertItem[],
};

export function CertificationsGridCMS() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchWithCache("/api/certifications")
      .then((json) => {
        if (json.success && json.data?.CertificationsGrid) {
          const fetched = json.data.CertificationsGrid;
          setFormData({
            tagline: fetched.tagline || defaultFormData.tagline,
            heading: fetched.heading || defaultFormData.heading,
            description: fetched.description || defaultFormData.description,
            certificationsList:
              fetched.certificationsList && fetched.certificationsList.length > 0
                ? fetched.certificationsList
                : defaultFormData.certificationsList,
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleCertChange = (
    index: number,
    field: keyof CertItem,
    value: any
  ) => {
    setFormData((prev) => {
      const updatedList = [...prev.certificationsList];
      updatedList[index] = { ...updatedList[index], [field]: value };
      return { ...prev, certificationsList: updatedList };
    });
  };

  const addCert = () => {
    setFormData((prev) => ({
      ...prev,
      certificationsList: [
        ...prev.certificationsList,
        {
          id: `cert-${Date.now()}`,
          title: "",
          subtitle: "",
          category: "",
          certNumber: "",
          issueDate: "",
          expiryDate: "",
          issuer: "Universal Certification Services Private Limited (UCSPL)",
          accreditation: "IAF & KAB",
          scope: "",
          image: null,
        },
      ],
    }));
    toast.success("Added new certificate template");
  };

  const removeCert = (index: number) => {
    if (formData.certificationsList.length <= 1) {
      toast.error("At least one certificate document is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      certificationsList: prev.certificationsList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving Certificates & Uploading Images...");
    try {
      // Process Cloudinary uploads for any File objects in image fields
      const updatedList = await Promise.all(
        formData.certificationsList.map(async (cert) => {
          let imageUrl = typeof cert.image === "string" ? cert.image : "";
          if (cert.image instanceof File) {
            const uploadedUrls = await uploadFiles([cert.image]);
            if (uploadedUrls && uploadedUrls[0]) {
              imageUrl = uploadedUrls[0];
            }
          }
          return {
            ...cert,
            image: imageUrl,
          };
        })
      );

      const finalPayload = {
        tagline: formData.tagline,
        heading: formData.heading,
        description: formData.description,
        certificationsList: updatedList,
      };

      const res = await fetch("/api/certifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CertificationsGrid",
          content: finalPayload,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFormData((prev) => ({ ...prev, certificationsList: updatedList }));
        toast.success("Certificates section saved successfully!", {
          id: toastId,
        });
      } else {
        toast.error(json.error || "Save failed.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload/Save failed.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
      <SectionHeader
        title="Official Certificates & Accreditation CMS"
        description="Manage dynamic ISO certificates, uploaded document images (Cloudinary), validity dates, and scope details."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Section Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
              required
            />
            <InputField
              label="Section Heading"
              name="heading"
              value={formData.heading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, heading: e.target.value }))
              }
              required
            />
          </div>

          <TextAreaField
            label="Section Subtitle / Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={2}
          />

          <div className="flex justify-between items-center border-t border-gray-100 pt-6">
            <span className="text-sm font-semibold text-gray-700">
              Certificates List ({formData.certificationsList.length})
            </span>
            <button
              type="button"
              onClick={addCert}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus size={14} /> Add New Certificate
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {formData.certificationsList.map((cert, idx) => (
              <div
                key={idx}
                className="p-6 border border-gray-200 rounded-2xl flex flex-col gap-5 bg-gray-50/40 relative shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Certificate #{idx + 1}: {cert.title || "Untitled Certificate"}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCert(idx)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Certificate"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>

                {/* Cloudinary Image Picker */}
                <ImagePickerField
                  label={`Certificate Document Image (Cloudinary)`}
                  sublabel="Full Vertical Scanned Certificate Image"
                  value={cert.image || null}
                  onChange={(val) => handleCertChange(idx, "image", val)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Title (e.g. ISO 9001:2015)"
                    value={cert.title}
                    onChange={(e) => handleCertChange(idx, "title", e.target.value)}
                    required
                  />
                  <InputField
                    label="Category (e.g. Quality Assurance)"
                    value={cert.category}
                    onChange={(e) => handleCertChange(idx, "category", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField
                    label="Certificate Number"
                    value={cert.certNumber || ""}
                    onChange={(e) => handleCertChange(idx, "certNumber", e.target.value)}
                    placeholder="e.g. UCSPL09802500815"
                  />
                  <InputField
                    label="Issue Date"
                    value={cert.issueDate || ""}
                    onChange={(e) => handleCertChange(idx, "issueDate", e.target.value)}
                    placeholder="e.g. 28/03/2025"
                  />
                  <InputField
                    label="Expiry Date"
                    value={cert.expiryDate || ""}
                    onChange={(e) => handleCertChange(idx, "expiryDate", e.target.value)}
                    placeholder="e.g. 27/03/2028"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Issuing Agency"
                    value={cert.issuer || ""}
                    onChange={(e) => handleCertChange(idx, "issuer", e.target.value)}
                    placeholder="e.g. Universal Certification Services Private Limited"
                  />
                  <InputField
                    label="Accreditation (e.g. IAF & KAB)"
                    value={cert.accreditation || ""}
                    onChange={(e) => handleCertChange(idx, "accreditation", e.target.value)}
                    placeholder="e.g. IAF & KAB (KAB-QC-80)"
                  />
                </div>

                <TextAreaField
                  label="Registration Scope"
                  value={cert.scope || cert.desc || ""}
                  onChange={(e) => handleCertChange(idx, "scope", e.target.value)}
                  placeholder="Scope of engineering & management services..."
                  rows={2}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
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

