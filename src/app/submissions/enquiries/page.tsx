"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/app/components/PageHeader";
import { Search, Loader2, ChevronLeft, ChevronRight, Mail, Calendar, User, Tag, MessageSquare, Phone } from "lucide-react";
import { InputField } from "@/app/components/InputField";
import toast from "react-hot-toast";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  interestedIn: string | null;
  budget: string | null;
  projectGoals: string | null;
  status: string;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const parseProjectGoals = (goals: string | null) => {
  if (!goals) return { phone: "N/A", company: "N/A", message: "No message content" };
  const phoneMatch = goals.match(/Phone:\s*(.*)/i);
  const companyMatch = goals.match(/Company:\s*(.*)/i);
  const messageMatch = goals.match(/Message:\s*\n?([\s\S]*)/i);
  return {
    phone: phoneMatch ? phoneMatch[1].trim() : "N/A",
    company: companyMatch ? companyMatch[1].trim() : "N/A",
    message: messageMatch ? messageMatch[1].trim() : goals,
  };
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/enquiries?page=${page}&search=${searchQuery}`);
      const json = await res.json();
      if (json.success) {
        setEnquiries(json.data);
        setPagination(json.pagination);
      } else {
        toast.error(json.error || "Failed to fetch enquiries");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <PageHeader
        title="Enquiries & Submissions"
        description="View and manage contact form enquiries, project requests, and general messages submitted by visitors on your website."
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <InputField
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          icon={<Search className="w-4 h-4" />}
          containerClassName="flex-1 w-full"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-8">Name & Email</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subject</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest pr-8 text-right">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#a0004f]" />
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 italic">No enquiries found.</td>
                </tr>
              ) : (
                enquiries.map((enquiry) => {
                  const parsed = parseProjectGoals(enquiry.projectGoals);
                  const displayCompany = enquiry.budget || parsed.company || "N/A";
                  return (
                    <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5 pl-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {enquiry.name}
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
                         <button 
                           onClick={() => setSelectedEnquiry(enquiry)}
                           title="View message"
                           className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-[#a0004f]/10 hover:text-[#a0004f] transition-all"
                         >
                           <MessageSquare className="w-4 h-4" />
                         </button>
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
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEnquiry && (() => {
        const parsed = parseProjectGoals(selectedEnquiry.projectGoals);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200 relative">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-black text-[#0B0F29] uppercase tracking-tight">
                  Enquiry Details
                </h3>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</span>
                  <span className="font-semibold text-gray-800">{selectedEnquiry.name}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-gray-800">{selectedEnquiry.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company</span>
                  <span className="font-semibold text-gray-800">{selectedEnquiry.budget || parsed.company || "N/A"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</span>
                  <span className="font-semibold text-gray-800">{parsed.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subject</span>
                  <span className="font-semibold text-gray-800 capitalize">{selectedEnquiry.interestedIn || "General Question"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</span>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {parsed.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
