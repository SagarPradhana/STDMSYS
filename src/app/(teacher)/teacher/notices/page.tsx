"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Calendar,
  User,
  FileText,
  Pin,
  Clock,
  ChevronRight,
  X,
  Mail,
  AlertCircle,
  Star,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useGetNoticesQuery } from "@school-management/store";

interface Notice {
  _id: string;
  title: string;
  content: string;
  postedBy: { name: string };
  category: "general" | "exam" | "assignment" | "event" | "holiday";
  priority: "high" | "medium" | "low";
  createdAt: string;
  attachments?: { name: string; url: string }[];
  targetClasses?: string[];
}

const categoryStyles = {
  general: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200", gradient: "from-slate-500 to-slate-600" },
  exam: { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-200", gradient: "from-rose-500 to-pink-600" },
  assignment: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-500 to-orange-600" },
  event: { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-200", gradient: "from-violet-500 to-purple-600" },
  holiday: { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", gradient: "from-emerald-500 to-teal-600" },
};

const priorityStyles = {
  high: { bg: "bg-gradient-to-r from-rose-500 to-pink-600", text: "text-white" },
  medium: { bg: "bg-gradient-to-r from-amber-500 to-orange-600", text: "text-white" },
  low: { bg: "bg-gradient-to-r from-emerald-500 to-teal-600", text: "text-white" },
};

export default function TeacherNoticesPage() {
  const { data: notices = [], isLoading } = useGetNoticesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filteredNotices = (notices || []).filter((n: Notice) => {
    const matchesSearch = n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || n.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notices" 
        subtitle="School announcements and updates"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notices by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        >
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="exam">Exam</option>
          <option value="assignment">Assignment</option>
          <option value="event">Event</option>
          <option value="holiday">Holiday</option>
        </select>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice: Notice, index: number) => {
              const catStyle = categoryStyles[notice.category as keyof typeof categoryStyles] || categoryStyles.general;
              const priStyle = priorityStyles[notice.priority as keyof typeof priorityStyles];
              
              return (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  onClick={() => setSelectedNotice(notice)}
                  className={cn(
                    "group bg-white rounded-2xl p-5 border border-slate-200/60 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-1",
                    selectedNotice?._id === notice._id && "ring-2 ring-violet-500 shadow-xl"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-3">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5", catStyle.bg, catStyle.text, "border", catStyle.border)}>
                          {notice.category}
                        </span>
                        {notice.priority === "high" && (
                          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1", priStyle.bg, priStyle.text)}>
                            <AlertCircle className="w-3 h-3" /> HIGH
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-violet-700 transition-colors">{notice.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mt-2">{notice.content}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-violet-100 flex items-center justify-center transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-600" />
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span>{notice.postedBy?.name || "Admin"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(notice.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    {notice.attachments && notice.attachments.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
              <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
                <Bell className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">No Notices Found</h3>
              <p className="text-sm text-slate-500">No notices match your search criteria</p>
            </div>
          )}
        </div>

        {selectedNotice && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-96 bg-white rounded-2xl border border-slate-200/60 p-6 h-fit sticky top-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Notice Details</h3>
              </div>
              <button 
                onClick={() => setSelectedNotice(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Title</label>
                <p className="font-bold text-slate-800">{selectedNotice.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Posted By</label>
                  <p className="font-semibold text-slate-700">{selectedNotice.postedBy?.name || "Admin"}</p>
                </div>
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Date</label>
                  <p className="font-semibold text-slate-700">{new Date(selectedNotice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Content</label>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{selectedNotice.content}</p>
              </div>
              
              {selectedNotice.attachments && selectedNotice.attachments.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Attachments</label>
                  <div className="space-y-2">
                    {selectedNotice.attachments.map((att, i) => (
                      <a 
                        key={i} 
                        href={att.url} 
                        className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-sm hover:bg-violet-50 hover:border-violet-200 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-violet-100 group-hover:bg-violet-200">
                          <FileText className="w-4 h-4 text-violet-600" />
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-violet-700">{att.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full mt-2 py-3 border-slate-200 hover:bg-slate-50"
                onClick={() => setSelectedNotice(null)}
              >
                Close Details
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}