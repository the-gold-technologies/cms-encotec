"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  Briefcase,
  Phone,
  FileText,
  Trash2,
  Eye,
  MapPin,
  Building2,
  ChevronDown,
  Download,
  X,
  FileSearch,
  ExternalLink,
} from "lucide-react";
import { InputField } from "@/app/components/InputField";
import toast from "react-hot-toast";

interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  department: string | null;
  jobLocation: string | null;
  experience: string | null;
  coverLetter: string | null;
  resumeName: string | null;
  resumeUrl: string | null;
  resumeBase64?: string | null;
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  Pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  Reviewing: {
    label: "Under Review",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  Shortlisted: {
    label: "Shortlisted",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  Contacted: {
    label: "Contacted",
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  Rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [previewResumeApp, setPreviewResumeApp] = useState<JobApplication | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const statusParam = statusFilter !== "ALL" ? `&status=${statusFilter}` : "";
      const res = await fetch(
        `/api/job-applications?page=${page}&search=${encodeURIComponent(searchQuery)}${statusParam}`,
      );
      const json = await res.json();
      if (json.success) {
        setApplications(json.data);
        setPagination(json.pagination);
      } else {
        toast.error(json.error || "Failed to fetch applications");
      }
    } catch {
      toast.error("Network error fetching applications");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, statusFilter]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      const res = await fetch("/api/job-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        let msg = `Status updated to ${newStatus}`;
        if (json.candidateEmailSent) {
          if (newStatus === "Shortlisted") {
            msg = `Candidate shortlisted! Acceptance email sent to ${selectedApp?.email || "candidate"}`;
          } else if (newStatus === "Rejected") {
            msg = `Candidate rejected. Rejection email sent to ${selectedApp?.email || "candidate"}`;
          } else if (newStatus === "Contacted") {
            msg = `Status updated! Notification email sent to ${selectedApp?.email || "candidate"}`;
          }
        }
        toast.success(msg, { id: toastId, duration: 4500 });
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: newStatus } : app,
          ),
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        toast.error(json.error || "Failed to update status", { id: toastId });
      }
    } catch {
      toast.error("Error updating status", { id: toastId });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job application?")) return;
    try {
      const res = await fetch(`/api/job-applications?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Application deleted successfully");
        if (selectedApp?.id === id) setSelectedApp(null);
        fetchApplications();
      } else {
        toast.error(json.error || "Delete failed");
      }
    } catch {
      toast.error("Network error deleting application");
    }
  };

  // Helper to trigger resume download
  const handleDownloadResume = (app: JobApplication) => {
    if (app.resumeBase64) {
      try {
        const base64Clean = app.resumeBase64.replace(/^data:[^;]+;base64,/, "");
        const byteCharacters = atob(base64Clean);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = app.resumeName || `${app.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded ${app.resumeName || "Resume"}`);
        return;
      } catch (e) {
        const link = document.createElement("a");
        link.href = app.resumeBase64;
        link.download = app.resumeName || `${app.name.replace(/\s+/g, "_")}_Resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Downloaded ${app.resumeName || "Resume"}`);
        return;
      }
    } else if (app.resumeUrl) {
      window.open(app.resumeUrl, "_blank");
    } else {
      toast.error("Resume file content is not available for this entry.");
    }
  };

  // Helper to construct blob URL for in-app preview
  const previewBlobUrl = useMemo(() => {
    if (!previewResumeApp) return null;
    if (previewResumeApp.resumeBase64) {
      try {
        const base64Clean = previewResumeApp.resumeBase64.replace(/^data:[^;]+;base64,/, "");
        const byteCharacters = atob(base64Clean);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        return URL.createObjectURL(blob);
      } catch (e) {
        return previewResumeApp.resumeBase64;
      }
    }
    if (previewResumeApp.resumeUrl) return previewResumeApp.resumeUrl;
    return null;
  }, [previewResumeApp]);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="Job Applications & Resumes"
        description="Review candidate applications submitted through the Careers portal, preview applicant resumes directly inside CMS, and manage automated email status notifications."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by candidate name, email, job title, department..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          containerClassName="flex-1 w-full"
        />

        <div className="flex items-center gap-2 flex-wrap self-stretch lg:self-auto shrink-0">
          {["ALL", "Pending", "Reviewing", "Shortlisted", "Contacted", "Rejected"].map(
            (status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPage(1);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0A0F29] text-white shadow-md shadow-gray-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "ALL" ? "All" : status}
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <th className="py-4 px-6 pl-8 w-[270px]">Candidate Info</th>
                <th className="py-4 px-6 w-[230px]">Position & Dept</th>
                <th className="py-4 px-6 w-[170px]">Experience / Location</th>
                <th className="py-4 px-6 w-[200px]">Resume Actions</th>
                <th className="py-4 px-6 w-[140px]">Status</th>
                <th className="py-4 px-6 w-[120px]">Applied Date</th>
                <th className="py-4 px-6 pr-8 text-right w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#a0004f] mx-auto" />
                    <p className="text-gray-400 text-xs mt-2 font-medium">Loading applications...</p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold">No job applications found</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Candidate submissions via the Careers page will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const statusInfo =
                    STATUS_CONFIG[app.status] || STATUS_CONFIG.Pending;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* Candidate Column */}
                      <td className="py-4 px-6 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-pink-50 text-brand-pink border border-pink-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                            {app.name ? app.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 group-hover:text-brand-pink transition-colors truncate">
                              {app.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">{app.email}</span>
                            </div>
                            {app.phone && (
                              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>{app.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Position & Dept Column */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900 leading-snug">
                          {app.jobTitle || "General Application"}
                        </div>
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold">
                            <Building2 className="w-3 h-3" />
                            {app.department || "General"}
                          </span>
                        </div>
                      </td>

                      {/* Experience / Location Column */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800 text-xs">
                          {app.experience || "Not specified"}
                        </div>
                        {app.jobLocation ? (
                          <div className="text-gray-400 text-[11px] flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                            <span className="truncate">{app.jobLocation}</span>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-[11px] mt-1">India / Global</div>
                        )}
                      </td>

                      {/* Resume Preview & Download Options Column */}
                      <td
                        className="py-4 px-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {app.resumeName ? (
                          <div className="flex items-center gap-1.5">
                            {/* In-App CMS Preview Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewResumeApp(app);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-brand-pink text-brand-pink hover:text-white text-xs font-semibold transition-all border border-pink-200 cursor-pointer shadow-2xs"
                              title="Preview Resume on CMS"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            {/* Direct Download Button */}
                            <button
                              type="button"
                              onClick={() => handleDownloadResume(app)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all border border-gray-200 cursor-pointer shadow-2xs"
                              title="Download Resume PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No attachment</span>
                        )}
                      </td>

                      {/* Status Dropdown Badge */}
                      <td
                        className="py-4 px-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block">
                          <select
                            value={app.status}
                            disabled={isUpdatingStatus}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value)
                            }
                            className={`appearance-none text-xs font-bold pl-3 pr-7 py-1.5 rounded-full border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border} cursor-pointer outline-none transition-all shadow-2xs hover:shadow-xs disabled:opacity-60`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewing">Under Review</option>
                            <option value="Shortlisted">Shortlisted (Send Email)</option>
                            <option value="Contacted">Contacted (Send Email)</option>
                            <option value="Rejected">Rejected (Send Email)</option>
                          </select>
                          <ChevronDown className="w-3 h-3 text-current absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Applied Date Column */}
                      <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>
                            {new Date(app.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td
                        className="py-4 px-6 pr-8 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-gray-50/40">
            <span className="text-xs text-gray-500 font-medium">
              Showing page <strong>{pagination.page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> ({pagination.total} total applicants)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* In-App CMS Interactive Resume Viewer Modal */}
      {previewResumeApp && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 px-6 bg-[#0A0F29] text-white flex items-center justify-between border-b-2 border-brand-pink shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {previewResumeApp.resumeName || "Resume Document"}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Candidate: <span className="text-pink-300 font-semibold">{previewResumeApp.name}</span> • Position: <span className="text-gray-200">{previewResumeApp.jobTitle || "General Application"}</span>
                  </p>
                </div>
              </div>

              {/* Top Controls */}
              <div className="flex items-center gap-2">
                {/* Download Button */}
                <button
                  onClick={() => handleDownloadResume(previewResumeApp)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-pink hover:bg-[#80003f] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>

                {/* Open in New Tab Button if URL exists */}
                {previewBlobUrl && (
                  <a
                    href={previewBlobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    title="Open Fullscreen in New Window"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Fullscreen
                  </a>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setPreviewResumeApp(null)}
                  className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* In-App PDF Viewer Body */}
            <div className="flex-1 bg-gray-100 p-2 overflow-hidden flex items-center justify-center">
              {previewBlobUrl ? (
                <iframe
                  src={previewBlobUrl}
                  title="Resume In-App PDF Viewer"
                  className="w-full h-full rounded-2xl bg-white border border-gray-200 shadow-inner"
                />
              ) : (
                <div className="text-center p-8 bg-white rounded-3xl border border-gray-200 shadow-xs max-w-md">
                  <FileSearch className="w-12 h-12 text-brand-pink mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    {previewResumeApp.resumeName || "Resume Document"}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    Resume content is not available for preview.
                  </p>
                  <button
                    onClick={() => handleDownloadResume(previewResumeApp)}
                    className="px-5 py-2.5 bg-[#0A0F29] text-white font-bold text-xs rounded-xl hover:bg-black transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Details Slide-Over / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 bg-[#0A0F29] text-white flex items-center justify-between relative overflow-hidden border-b-2 border-brand-pink">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {selectedApp.name ? selectedApp.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div>
                  <h3 className="font-bold text-xl leading-tight text-white">
                    {selectedApp.name}
                  </h3>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Position:{" "}
                    <span className="text-pink-300 font-semibold">
                      {selectedApp.jobTitle || "General Application"}
                    </span>{" "}
                    <span className="text-gray-400">({selectedApp.department || "General"})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-gray-700">
              {/* Quick Contact & Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${selectedApp.email}?subject=Regarding your application for ${selectedApp.jobTitle || "Encotec"}`}
                  className="flex items-center justify-center gap-2 p-3.5 bg-pink-50 text-brand-pink rounded-2xl font-bold hover:bg-pink-100 transition-colors cursor-pointer border border-pink-100"
                >
                  <Mail className="w-4 h-4" /> Email Candidate
                </a>
                {selectedApp.phone ? (
                  <a
                    href={`tel:${selectedApp.phone}`}
                    className="flex items-center justify-center gap-2 p-3.5 bg-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200"
                  >
                    <Phone className="w-4 h-4" /> Call: {selectedApp.phone}
                  </a>
                ) : (
                  <div className="flex items-center justify-center p-3.5 bg-gray-50 text-gray-400 rounded-2xl text-xs">
                    No phone provided
                  </div>
                )}
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50/80 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Email Address
                  </span>
                  <span className="text-gray-900 font-semibold text-sm break-all">
                    {selectedApp.email}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Phone Number
                  </span>
                  <span className="text-gray-900 font-semibold text-sm">
                    {selectedApp.phone || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Location Preference
                  </span>
                  <span className="text-gray-900 font-medium">
                    {selectedApp.jobLocation || "India / Global"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Experience / Role
                  </span>
                  <span className="text-gray-900 font-medium">
                    {selectedApp.experience || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Applied Date
                  </span>
                  <span className="text-gray-900 font-medium">
                    {new Date(selectedApp.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Attached Resume Actions
                  </span>
                  {selectedApp.resumeName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewResumeApp(selectedApp);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-pink text-white rounded-lg text-xs font-bold hover:bg-[#80003f] transition-colors cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview on CMS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadResume(selectedApp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">None attached</span>
                  )}
                </div>
              </div>

              {/* Cover Letter / Message */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Cover Note / Message from Candidate
                </h4>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl whitespace-pre-wrap leading-relaxed text-gray-800 font-sans">
                  {selectedApp.coverLetter || "No cover note provided."}
                </div>
              </div>

              {/* Status Selector in Modal */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="font-bold text-xs text-gray-800 block">
                    Update Candidate Review Status:
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Changing to Shortlisted or Rejected automatically emails the candidate.
                  </span>
                </div>
                <select
                  value={selectedApp.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) =>
                    handleStatusChange(selectedApp.id, e.target.value)
                  }
                  className="px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white outline-none cursor-pointer shadow-2xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewing">Under Review</option>
                  <option value="Shortlisted">Shortlisted (Send Email)</option>
                  <option value="Contacted">Contacted (Send Email)</option>
                  <option value="Rejected">Rejected (Send Email)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedApp.id)}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold px-3.5 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Application
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2.5 bg-[#0A0F29] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
