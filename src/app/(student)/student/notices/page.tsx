"use client";

import { motion } from "framer-motion";
import {
  Pin,
  Megaphone,
  User,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Notice {
  _id: string;
  title: string;
  content: string;
  date: string;
  priority: "low" | "medium" | "high";
  isPinned: boolean;
  postedBy: { name: string };
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/notices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setNotices(json.data);
      }
    } catch (error) {
      console.error("Fetch notices error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notices.filter(n => filter === "all" || n.priority === filter);

  const getPriorityStyle = (p: string) => {
    const styles: Record<string, string> = {
      high: "border-l-rose-500 bg-rose-50/30",
      medium: "border-l-amber-500 bg-amber-50/30",
      low: "border-l-slate-400 bg-slate-50/30"
    };
    return styles[p] || "border-l-slate-400 bg-slate-50/30";
  };

  const getBadgeStyle = (p: string) => {
    const styles: Record<string, string> = {
      high: "bg-rose-100 text-rose-700 border-rose-200",
      medium: "bg-amber-100 text-amber-700 border-amber-200",
      low: "bg-slate-100 text-slate-700 border-slate-200"
    };
    return styles[p] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diff = now.getTime() - posted.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Official Announcements</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {["all", "high", "medium", "low"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {filtered.length > 0 ? filtered.map((notice, i) => (
          <motion.div
            key={notice._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500 border-l-[6px] ${getPriorityStyle(notice.priority)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notice.priority === 'high' ? 'bg-rose-500' : 'bg-emerald-500'} text-white shadow-lg`}>
                  <Megaphone size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{notice.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {notice.isPinned && (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                        <Pin size={10} /> Pinned
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getBadgeStyle(notice.priority)}`}>
                      {notice.priority} Priority
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Posted Date</p>
                <p className="text-xs font-bold text-slate-600">{new Date(notice.date || notice.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed italic mb-8 border-l-2 border-slate-100 pl-4 py-1">
              "{notice.content}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{notice.postedBy?.name || 'School'} Office</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{getTimeAgo(notice.date || notice.createdAt)}</span>
                </div>
              </div>

              <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group/btn">
                Read Full Detail
                <Clock className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-widest">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
}