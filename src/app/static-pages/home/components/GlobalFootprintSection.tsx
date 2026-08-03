"use client";

import { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import { Plus, Trash2, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { TextAreaField } from "@/components/TextAreaField";
import { SectionHeader } from "@/components/SectionHeader";

interface LocationItem {
  name: string;
  coordinates: [number, number];
  region: string;
  address: string;
  suite: string;
  phone: string;
}

interface StatItem {
  value: string;
  label: string;
}

const defaultFormData = {
  tagline: "",
  heading: "",
  description: "",
  stats: [
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ],
  locations: [
    {
      name: "",
      coordinates: [77.39, 28.58],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [32.86, 39.93],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [50.58, 26.07],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [55.27, 25.2],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [106.84, -6.21],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [105.83, 21.03],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [13.4, 52.52],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [39.2, -6.79],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [116.4, 39.9],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [15.98, 45.81],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [80.3, 26.47],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [77.55, 28.13],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [79.91, 27.88],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [83.95, 24.65],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [32.86, 39.93],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
    {
      name: "",
      coordinates: [50.58, 26.07],
      region: "",
      address: "",
      suite: "",
      phone: "",
    },
  ],
};

const mergeDefaults = (data: any) => {
  const merged = { ...defaultFormData, ...data };
  if (!merged.stats || !Array.isArray(merged.stats)) {
    merged.stats = defaultFormData.stats.map((s) => ({ ...s }));
  } else {
    const arr = [...merged.stats];
    while (arr.length < 5) {
      const def = defaultFormData.stats[arr.length] || { value: "", label: "" };
      arr.push({ ...def });
    }
    merged.stats = arr;
  }
  if (!merged.locations || !Array.isArray(merged.locations)) {
    merged.locations = defaultFormData.locations.map((l) => ({ ...l }));
  }
  return merged;
};

interface GlobalFootprintSectionProps {
  sectionId?: string;
  initialData?: Record<string, unknown>;
  saveUrl?: string;
  responseKey?: string;
  onSave?: (data: Record<string, unknown>) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function GlobalFootprintSection({
  sectionId,
  initialData,
  saveUrl = "/api/home",
  responseKey = "GlobalFootprintSection",
  onSave,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: GlobalFootprintSectionProps) {
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

  // For adding a new location
  const [newLoc, setNewLoc] = useState({
    name: "",
    coordinatesStr: "77.39, 28.58",
    region: "India",
    address: "",
    suite: "",
    phone: "",
  });

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
  }, [initialData, saveUrl, responseKey]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (
    index: number,
    key: keyof StatItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const updated = prev.stats.map((s, idx) =>
        idx === index ? { ...s, [key]: value } : s,
      );
      return { ...prev, stats: updated };
    });
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [...prev.stats, { value: "", label: "" }],
    }));
    toast.success("Added new footprint stat card");
  };

  const deleteStat = (index: number) => {
    if (formData.stats.length <= 1) {
      toast.error("At least 1 footprint stat card is required");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
    toast.success("Removed stat card");
  };

  const handleLocationFieldChange = (
    index: number,
    key: keyof LocationItem,
    value: any,
  ) => {
    setFormData((prev) => {
      const updated = prev.locations.map((loc, idx) =>
        idx === index ? { ...loc, [key]: value } : loc,
      );
      return { ...prev, locations: updated };
    });
  };

  const handleLocationCoordinatesChange = (index: number, valStr: string) => {
    const parts = valStr.split(",").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      handleLocationFieldChange(index, "coordinates", [parts[0], parts[1]]);
    }
  };

  const addLocation = () => {
    const coordsParts = newLoc.coordinatesStr
      .split(",")
      .map((p) => parseFloat(p.trim()));
    if (
      coordsParts.length !== 2 ||
      isNaN(coordsParts[0]) ||
      isNaN(coordsParts[1])
    ) {
      toast.error(
        "Invalid coordinates. Use format: longitude, latitude (e.g. 77.39, 28.58)",
      );
      return;
    }
    if (!newLoc.name.trim() || !newLoc.address.trim()) {
      toast.error("Name and Address fields are required");
      return;
    }

    const createdLoc: LocationItem = {
      name: newLoc.name.trim(),
      coordinates: [coordsParts[0], coordsParts[1]],
      region: newLoc.region,
      address: newLoc.address.trim(),
      suite: newLoc.suite.trim(),
      phone: newLoc.phone.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, createdLoc],
    }));

    setNewLoc({
      name: "",
      coordinatesStr: "77.39, 28.58",
      region: "India",
      address: "",
      suite: "",
      phone: "",
    });
    toast.success("Location added successfully!");
  };

  const removeLocation = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSave = async () => {
    const errs: string[] = [];
    if (!formData.tagline?.trim()) errs.push("Tagline is required");
    if (!formData.heading?.trim()) errs.push("Heading is required");

    if (errs.length > 0) {
      errs.forEach((m) => toast.error(m));
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving Global Footprint section...");
    try {
      const body = sectionId
        ? { id: sectionId, content: formData }
        : {
            section: responseKey ?? "GlobalFootprintSection",
            content: formData,
          };

      const res = await fetch(sectionId ? `/api/sections` : saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Global Presence section saved successfully!", {
          id: toastId,
        });
        if (onSave) onSave(formData as unknown as Record<string, unknown>);
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
          title="Global Presence Map & Locations Section"
          description="Manage Encotec's locations markers, coordinates, and footprint statistics."
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
              {/* Heading Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/20 border border-gray-100 p-6 rounded-2xl">
                <InputField
                  label="Tagline Label"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Global Presence"
                  required
                />
                <InputField
                  label="Section Title"
                  name="heading"
                  value={formData.heading}
                  onChange={handleChange}
                  placeholder="e.g. Connected Intelligence"
                  required
                />
                <TextAreaField
                  label="Section Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your global footprint..."
                  containerClassName="col-span-2"
                  rows={2}
                />
              </div>

              {/* Statistics Grid */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Footprint Statistics{" "}
                    <span className="text-emerald-600 font-semibold">
                      ({formData.stats.length} Items)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={addStat}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Footprint Stat</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {formData.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 p-4 rounded-2xl bg-gray-50/20 flex flex-col gap-3 relative group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                          Stat {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteStat(i)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                          title="Delete Stat Card"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <InputField
                        label="Value"
                        value={stat.value}
                        onChange={(e) =>
                          handleStatChange(i, "value", e.target.value)
                        }
                        placeholder="e.g. 14+"
                        required
                      />
                      <InputField
                        label="Label"
                        value={stat.label}
                        onChange={(e) =>
                          handleStatChange(i, "label", e.target.value)
                        }
                        placeholder="e.g. India Locations"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Locations Table */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                  Map Location Markers list
                </h4>
                <div className="overflow-x-auto border border-gray-100 rounded-2xl bg-gray-50/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-100/40 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="p-4 px-6">Name</th>
                        <th className="p-4">Region</th>
                        <th className="p-4">Coordinates (Lng, Lat)</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Suite</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.locations.map((loc, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-100/60 hover:bg-gray-50/30"
                        >
                          <td className="p-4 px-6 font-semibold text-gray-900">
                            <input
                              type="text"
                              value={loc.name}
                              onChange={(e) =>
                                handleLocationFieldChange(
                                  i,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border-0 font-semibold text-gray-900 outline-none focus:ring-1 focus:ring-[#a0004f] rounded px-1.5 py-1"
                            />
                          </td>
                          <td className="p-4">
                            <select
                              value={loc.region}
                              onChange={(e) =>
                                handleLocationFieldChange(
                                  i,
                                  "region",
                                  e.target.value,
                                )
                              }
                              className="bg-transparent border-0 outline-none focus:ring-1 focus:ring-[#a0004f] rounded py-1 cursor-pointer"
                            >
                              <option value="India">India</option>
                              <option value="International">
                                International
                              </option>
                            </select>
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={
                                loc.coordinates
                                  ? loc.coordinates.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                handleLocationCoordinatesChange(
                                  i,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border-0 outline-none font-mono focus:ring-1 focus:ring-[#a0004f] rounded px-1.5 py-1 text-gray-500"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={loc.address}
                              onChange={(e) =>
                                handleLocationFieldChange(
                                  i,
                                  "address",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border-0 outline-none focus:ring-1 focus:ring-[#a0004f] rounded px-1.5 py-1 text-gray-600"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={loc.suite}
                              onChange={(e) =>
                                handleLocationFieldChange(
                                  i,
                                  "suite",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border-0 outline-none focus:ring-1 focus:ring-[#a0004f] rounded px-1.5 py-1 text-gray-600"
                            />
                          </td>
                          <td className="p-4">
                            <input
                              type="text"
                              value={loc.phone}
                              onChange={(e) =>
                                handleLocationFieldChange(
                                  i,
                                  "phone",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-transparent border-0 outline-none focus:ring-1 focus:ring-[#a0004f] rounded px-1.5 py-1 font-mono text-gray-500"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeLocation(i)}
                              className="text-red-500 hover:text-red-600 p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add New Location Form */}
              <div className="bg-gray-50/20 border border-gray-100 p-6 rounded-2xl flex flex-col gap-4">
                <h5 className="text-[11px] font-bold text-[#a0004f] uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  Add New Location Marker
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField
                    label="Location Name"
                    value={newLoc.name}
                    onChange={(e) =>
                      setNewLoc((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g. Turkey"
                  />
                  <div className="flex flex-col gap-1.5 px-0.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-4">
                      Region
                    </label>
                    <select
                      value={newLoc.region}
                      onChange={(e) =>
                        setNewLoc((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:outline-none focus:border-[#a0004f] focus:ring-1 focus:ring-[#a0004f] outline-none text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="India">India</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <InputField
                    label="Coordinates (Lng, Lat)"
                    value={newLoc.coordinatesStr}
                    onChange={(e) =>
                      setNewLoc((prev) => ({
                        ...prev,
                        coordinatesStr: e.target.value,
                      }))
                    }
                    placeholder="e.g. 32.86, 39.93"
                    tooltip="Use format: longitude, latitude. Lng is first, Lat is second."
                  />
                  <InputField
                    label="Address"
                    value={newLoc.address}
                    onChange={(e) =>
                      setNewLoc((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="e.g. Celikler Energy Project"
                  />
                  <InputField
                    label="Suite / State"
                    value={newLoc.suite}
                    onChange={(e) =>
                      setNewLoc((prev) => ({ ...prev, suite: e.target.value }))
                    }
                    placeholder="e.g. Ankara, Turkey"
                  />
                  <InputField
                    label="Phone Number"
                    value={newLoc.phone}
                    onChange={(e) =>
                      setNewLoc((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="e.g. +90 312 555 0100"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={addLocation}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Location
                  </button>
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
