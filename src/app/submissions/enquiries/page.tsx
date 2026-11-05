"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import {
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Mail,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Phone,
  Globe,
  Trash2,
} from "lucide-react";
import { InputField } from "@/app/components/InputField";
import toast from "react-hot-toast";
import { getSourcePageLabel } from "@/lib/sourcePage";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  interestedIn: string | null;
  budget: string | null;
  projectGoals: string | null;
  sourcePage: string | null;
  status: string;
  createdAt: string;
}

interface SourcePageOption {
  value: string; // stored path, or "NONE" for enquiries with no page recorded
  label: string;
  count: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const parseProjectGoals = (goals: string | null) => {
  if (!goals)
    return {
      phone: "N/A",
      company: "N/A",
      location: "N/A",
      serviceRequired: "N/A",
      message: "No message content",
    };
  const phoneMatch = goals.match(/Phone:\s*(.*)/i);
  const companyMatch = goals.match(/Company:\s*(.*)/i);
  const locationMatch = goals.match(/Location:\s*(.*)/i);
  const serviceMatch = goals.match(/Service Required:\s*(.*)/i);
  const messageMatch = goals.match(/Message:\s*\n?([\s\S]*)/i);
  return {
    phone: phoneMatch ? phoneMatch[1].trim() : "N/A",
    company: companyMatch ? companyMatch[1].trim() : "N/A",
    location: locationMatch ? locationMatch[1].trim() : "N/A",
    serviceRequired: serviceMatch ? serviceMatch[1].trim() : "N/A",
    message: messageMatch ? messageMatch[1].trim() : goals,
  };
};

const getSourcePageBadgeStyle = (path: string | null) => {
  if (!path) return "bg-gray-50 text-gray-400 border-gray-200";
  if (path === "/") return "bg-blue-50 text-blue-700 border-blue-200/80";
  if (path.startsWith("/contact")) return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
  if (path.startsWith("/services")) return "bg-purple-50 text-purple-700 border-purple-200/80";
  if (path.startsWith("/insights")) return "bg-amber-50 text-amber-700 border-amber-200/80";
  return "bg-gray-100 text-gray-700 border-gray-200";
};

const getSourcePageDotStyle = (path: string | null) => {
  if (!path) return "bg-gray-300";
  if (path === "/") return "bg-blue-500";
  if (path.startsWith("/contact")) return "bg-emerald-500";
  if (path.startsWith("/services")) return "bg-purple-500";
  if (path.startsWith("/insights")) return "bg-amber-500";
  return "bg-gray-400";
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [availablePages, setAvailablePages] = useState<SourcePageOption[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageFilter, setPageFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const pageFilterParam = pageFilter !== "ALL" ? `&pageFilter=${encodeURIComponent(pageFilter)}` : "";
      const res = await fetch(`/api/enquiries?page=${page}&search=${encodeURIComponent(searchQuery)}${pageFilterParam}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
        setPagination(json.pagination);
        if (json.availablePages && Array.isArray(json.availablePages)) {
          setAvailablePages(json.availablePages);
        }
      } else {
        toast.error(json.error || "Failed to fetch enquiries");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, pageFilter]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    const { id } = enquiryToDelete;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/enquiries?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Enquiry deleted successfully");
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry(null);
        }
        setEnquiryToDelete(null);
      } else {
        toast.error(data.error || "Failed to delete enquiry");
      }
    } catch {
      toast.error("Network error deleting enquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedPageLabel =
    pageFilter === "ALL"
      ? "All Pages"
      : availablePages.find((p) => p.value === pageFilter)?.label ??
        getSourcePageLabel(pageFilter === "NONE" ? null : pageFilter);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="Enquiries & Submissions"
        description="View and manage contact form enquiries, project requests, and messages submitted by visitors across website pages."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by name, email, company, service or page..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={<Search className="w-4 h-4 text-gray-400" />}
          containerClassName="flex-1 w-full"
        />

        {/* Custom Source Page Dropdown Filter */}
        <div ref={dropdownRef} className="relative min-w-[240px] w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`w-full px-4 py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs border ${
              isDropdownOpen
                ? "bg-white border-[#a0004f] ring-2 ring-[#a0004f]/15 text-[#0B0F29]"
                : pageFilter !== "ALL"
                ? "bg-pink-50/50 border-[#a0004f]/40 text-[#a0004f]"
                : "bg-gray-50/90 hover:bg-gray-100 border-gray-200/80 text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Globe
                className={`w-4 h-4 shrink-0 ${
                  pageFilter !== "ALL" || isDropdownOpen ? "text-[#a0004f]" : "text-gray-400"
                }`}
              />
              <span className="truncate">
                {selectedPageLabel}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-[#a0004f]" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl shadow-xl shadow-gray-900/10 border border-gray-100 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1 flex items-center justify-between">
                <span>Filter by Source Page</span>
                <span className="text-[10px] font-semibold text-gray-400">
                  {availablePages.length} pages
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto flex flex-col gap-0.5">
                {/* Option: All Pages */}
                <button
                  type="button"
                  onClick={() => {
                    setPageFilter("ALL");
                    setPage(1);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                    pageFilter === "ALL"
                      ? "bg-[#0A0F29] text-white shadow-xs"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className={`w-3.5 h-3.5 ${pageFilter === "ALL" ? "text-white" : "text-gray-400"}`} />
                    <span>All Pages</span>
                  </div>
                  {pageFilter === "ALL" && <Check className="w-3.5 h-3.5 text-white" />}
                </button>

                {/* Dynamic Pages that actually exist in the data */}
                {availablePages.map((opt) => {
                  const isSelected = pageFilter === opt.value;
                  const path = opt.value === "NONE" ? null : opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      title={path ?? undefined}
                      onClick={() => {
                        setPageFilter(opt.value);
                        setPage(1);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-[#0A0F29] text-white shadow-xs"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSelected ? "bg-white" : getSourcePageDotStyle(path)
                          }`}
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-gray-400"}`}>
                          {opt.count}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enquiries Table Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-8">Name & Email</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Source Page</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#a0004f]" />
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400 italic">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((enquiry) => {
                  const parsed = parseProjectGoals(enquiry.projectGoals);
                  const displayCompany = enquiry.budget || parsed.company || "N/A";
                  const sourcePageLabel = getSourcePageLabel(enquiry.sourcePage);
                  const pageBadgeStyle = getSourcePageBadgeStyle(enquiry.sourcePage);

                  return (
                    <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5 pl-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{enquiry.name}</span>
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {enquiry.email}
                          </span>
                          {parsed.phone && parsed.phone !== "N/A" && (
                            <span className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {parsed.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13px] text-gray-700 font-medium">
                        {displayCompany}
                      </td>
                      {/* Source Page Column */}
                      <td className="px-6 py-5">
                        <div
                          title={enquiry.sourcePage ?? "Submitted before page tracking was added"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${pageBadgeStyle}`}
                        >
                          <Globe className="w-3 h-3 shrink-0 opacity-70" />
                          <span className="whitespace-nowrap">{sourcePageLabel}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                          <Tag className="w-3 h-3" />
                          {enquiry.interestedIn || "General Question"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[13px] text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            title="View details"
                            className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#a0004f]/10 hover:text-[#a0004f] transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEnquiryToDelete({ id: enquiry.id, name: enquiry.name })}
                            title="Delete enquiry"
                            className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing page <span className="text-[#0B0F29] font-bold">{page}</span> of <span className="text-[#0B0F29] font-bold">{pagination.totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Details */}
      {selectedEnquiry && (() => {
        const parsed = parseProjectGoals(selectedEnquiry.projectGoals);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] max-w-xl w-full p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-[#0B0F29] uppercase tracking-tight">
                  Enquiry Details
                </h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</span>
                  <span className="font-semibold text-gray-800 break-words">{selectedEnquiry.name}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-gray-800 break-all select-all">{selectedEnquiry.email}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company</span>
                  <span className="font-semibold text-gray-800 break-words">{selectedEnquiry.budget || parsed.company || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</span>
                  <span className="font-semibold text-gray-800 break-words">{parsed.phone}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Source Page</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5 break-words">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{getSourcePageLabel(selectedEnquiry.sourcePage)}</span>
                  </span>
                  {selectedEnquiry.sourcePage && (
                    <span className="text-xs text-gray-400 break-all">{selectedEnquiry.sourcePage}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Required</span>
                  <span className="font-semibold text-gray-800 break-words">{selectedEnquiry.interestedIn || parsed.serviceRequired || "General Question"}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Location</span>
                  <span className="font-semibold text-gray-800 break-all">{parsed.location !== "N/A" ? parsed.location : "Not specified"}</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</span>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words break-all">
                    {parsed.message}
                  </p>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEnquiryToDelete({ id: selectedEnquiry.id, name: selectedEnquiry.name })}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-red-200/80"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Enquiry</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Custom Delete Confirmation Popup Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-black text-[#0B0F29] uppercase tracking-tight">
                  Delete Enquiry
                </h4>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  Are you sure you want to delete the enquiry from{" "}
                  <span className="font-bold text-gray-900">"{enquiryToDelete.name}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEnquiryToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
