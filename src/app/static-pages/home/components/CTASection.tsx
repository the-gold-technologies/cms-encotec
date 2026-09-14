"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { CloudUpload, Link, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";
import { uploadFiles } from "@/app/lib/uploadHelpers";

type CertificateItem = {
  src: File | string;
  alt: string;
  description: string;
};

const defaultFormData = {
  tagline: "",
  headingPart1: "",
  headingHighlight: "",
  description: "",
  primaryBtnLabel: "",
  primaryBtnUrl: "",
  secondaryBtnLabel: "",
  secondaryBtnUrl: "",
  footerNote: "",
  copyright: "",
};

const mergeDefaults = (data: any) => {
  return { ...defaultFormData, ...data };
};

interface CTASectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function CTASection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "CTASection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: CTASectionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (val: any) => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(typeof val === "function" ? val(internalIsOpen) : val);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [footerContent, setFooterContent] = useState<Record<string, unknown>>(
    {},
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(mergeDefaults(initialData));
    } else {
      fetchWithCache(saveUrl)
        .then((json) => {
          const sectionData = responseKey
            ? json.data?.[responseKey]
            : json.data;
          if (json.success && sectionData) {
            setFormData(mergeDefaults(sectionData));
          }
        })
        .catch(console.error);
    }

    fetchWithCache("/api/home")
      .then((json) => {
        const footerSection = json.data?.FooterCMS as
          | Record<string, unknown>
          | undefined;
        if (!footerSection) return;

        setFooterContent(footerSection);
        const loadedCertificates = Array.isArray(footerSection.certificates)
          ? footerSection.certificates
              .filter(
                (item): item is Record<string, unknown> =>
                  typeof item === "object" && item !== null,
              )
              .map((item) => ({
                src: typeof item.src === "string" ? item.src : "",
                alt: typeof item.alt === "string" ? item.alt : "",
                description:
                  typeof item.description === "string" ? item.description : "",
              }))
          : [];
        setCertificates(loadedCertificates);
      })
      .catch(console.error);
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificateChange = (
    index: number,
    field: keyof CertificateItem,
    value: CertificateItem[typeof field],
  ) => {
    setCertificates((previous) => {
      const next = [...previous];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addCertificate = () => {
    setCertificates((previous) => [
      ...previous,
      { src: "", alt: "", description: "" },
    ]);
  };

  const removeCertificate = (index: number) => {
    setCertificates((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleSave = async () => {
    const errors: string[] = [];
    if (!formData.tagline?.trim()) errors.push("Tagline is required");
    if (!formData.headingPart1?.trim())
      errors.push("Heading Part 1 is required");
    certificates.forEach((certificate, index) => {
      if (!certificate.src)
        errors.push(`Certificate ${index + 1} image is required`);
      if (!certificate.alt.trim())
        errors.push(`Certificate ${index + 1} alt text is required`);
      if (!certificate.description.trim())
        errors.push(`Certificate ${index + 1} description is required`);
    });

    if (errors.length > 0) {
      errors.forEach((message) => toast.error(message));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving CTA and certificates...");
    try {
      const updatedCertificates = await Promise.all(
        certificates.map(async (certificate) => ({
          ...certificate,
          src:
            certificate.src instanceof File
              ? (await uploadFiles([certificate.src]))[0] || ""
              : certificate.src,
        })),
      );
      const content = { ...footerContent, certificates: updatedCertificates };

      const ctaBody = sectionId
        ? { id: sectionId, content: formData }
        : { section: responseKey ?? "CTASection", content: formData };
      const ctaResponse = await fetch(sectionId ? "/api/sections" : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctaBody),
      });
      const ctaJson = await ctaResponse.json();
      if (!ctaJson.success) {
        toast.error(ctaJson.error || "CTA save failed.", { id: toastId });
        return;
      }

      const footerResponse = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "FooterCMS", content }),
      });
      const footerJson = await footerResponse.json();
      if (!footerJson.success) {
        toast.error(footerJson.error || "Certificate save failed.", {
          id: toastId,
        });
        return;
      }

      setFooterContent(content);
      setCertificates(updatedCertificates);
      toast.success("CTA and certificates saved successfully!", {
        id: toastId,
      });
      if (onSave) onSave(formData as unknown as Record<string, unknown>);
    } catch {
      toast.error("Network error.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4 transition-all">
        <SectionHeader
          title="Bottom CTA & Footer Section"
          description="Manage Encotec's bottom call-to-action text, custom redirect buttons, note, and copyright footer text."
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
              {/* Copy Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Partner With Us"
                  required
                />
                <InputField
                  label="Heading Part 1 (Regular)"
                  name="headingPart1"
                  value={formData.headingPart1}
                  onChange={handleChange}
                  placeholder="e.g. Experience Global"
                  required
                />
                <InputField
                  label="Heading Highlight (Gradient)"
                  name="headingHighlight"
                  value={formData.headingHighlight}
                  onChange={handleChange}
                  placeholder="e.g. Engineering Excellence."
                  required
                  containerClassName="col-span-2"
                />
                <TextAreaField
                  label="Description Paragraph"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. From India to Turkey..."
                  containerClassName="col-span-2"
                  rows={2}
                />
              </div>

              {/* Action Buttons Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Link className="w-3.5 h-3.5 text-[#a0004f]" />
                    Primary Action Button (Pink Filled)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="primaryBtnLabel"
                    value={formData.primaryBtnLabel}
                    onChange={handleChange}
                    placeholder="e.g. Start Your Project"
                  />
                  <InputField
                    label="Button Redirect Route"
                    name="primaryBtnUrl"
                    value={formData.primaryBtnUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
                </div>

                <div className="border border-gray-50 bg-gray-50/20 rounded-2xl p-5 flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <Link className="w-3.5 h-3.5 text-[#a0004f]" />
                    Secondary Action Button (Outline)
                  </h4>
                  <InputField
                    label="Button Label"
                    name="secondaryBtnLabel"
                    value={formData.secondaryBtnLabel}
                    onChange={handleChange}
                    placeholder="e.g. Talk to an Expert"
                  />
                  <InputField
                    label="Button Redirect Route"
                    name="secondaryBtnUrl"
                    value={formData.secondaryBtnUrl}
                    onChange={handleChange}
                    placeholder="e.g. /contact"
                  />
                </div>
              </div>

              {/* Footer configurations */}
              <div className="grid grid-cols-1 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <TextAreaField
                  label="Footer Disclaimer / Note"
                  name="footerNote"
                  value={formData.footerNote}
                  onChange={handleChange}
                  placeholder="e.g. Looking for precision and reliability?..."
                  rows={2}
                />
                <InputField
                  label="Copyright Text"
                  name="copyright"
                  value={formData.copyright}
                  onChange={handleChange}
                  placeholder="e.g. © 2026 Encotec Engineering."
                />
              </div>

              {/* Footer Certificates */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Footer Certificates
                  </h4>
                  <button
                    type="button"
                    onClick={addCertificate}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-pink hover:text-[#a0004f]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Certificate
                  </button>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50/20 p-6">
                  {certificates.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                      No certificates configured.
                    </p>
                  ) : (
                    certificates.map((certificate, index) => {
                      const preview =
                        certificate.src instanceof File
                          ? URL.createObjectURL(certificate.src)
                          : certificate.src;

                      return (
                        <div
                          key={index}
                          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              Certificate #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeCertificate(index)}
                              className="rounded-xl bg-red-50 p-2 text-red-500 hover:bg-red-100"
                              title="Remove certificate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[120px_1fr]">
                            <label className="flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500">
                              {preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={preview}
                                  alt="Certificate preview"
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <CloudUpload className="h-7 w-7 text-gray-400" />
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file)
                                    handleCertificateChange(index, "src", file);
                                }}
                              />
                            </label>

                            <div className="grid grid-cols-1 gap-4">
                              <InputField
                                label="Alt Text"
                                value={certificate.alt}
                                onChange={(event) =>
                                  handleCertificateChange(
                                    index,
                                    "alt",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g. ISO 9001 certification"
                                required
                              />
                              <InputField
                                label="Description"
                                value={certificate.description}
                                onChange={(event) =>
                                  handleCertificateChange(
                                    index,
                                    "description",
                                    event.target.value,
                                  )
                                }
                                placeholder="e.g. ISO 9001:2015"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-50">
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
