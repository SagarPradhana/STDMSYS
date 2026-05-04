"use client";

import { motion } from "framer-motion";
import {
  FileText,
  BookOpen,
  Download,
  Upload,
  Clock,
  Search,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  subjectId: { name: string; code: string };
  teacherId: { userId: { name: string } };
  dueDate: string;
  maxMarks: number;
  submissionStatus: "pending" | "submitted" | "graded" | "overdue" | "late";
  marks?: number;
  feedback?: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/assignments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setAssignments(json.data);
      }
    } catch (error) {
      console.error("Fetch assignments error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/assignments/${id}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Assignment submitted successfully!");
        fetchAssignments();
      } else {
        toast.error(json.message || "Failed to submit assignment");
      }
    } catch (error) {
      toast.error("Failed to submit assignment");
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (filter === "all") return true;
    if (filter === "pending") return a.submissionStatus === "pending";
    if (filter === "submitted") return a.submissionStatus === "submitted" || a.submissionStatus === "late";
    return a.submissionStatus === filter;
  });

  const stats = [
    { label: "Pending", value: assignments.filter(a => a.submissionStatus === "pending").length, color: "amber" },
    { label: "Submitted", value: assignments.filter(a => a.submissionStatus === "submitted" || a.submissionStatus === "late").length, color: "blue" },
    { label: "Graded", value: assignments.filter(a => a.submissionStatus === "graded").length, color: "emerald" },
    { label: "Overdue", value: assignments.filter(a => a.submissionStatus === "overdue").length, color: "red" },
  ];

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      submitted: "bg-blue-100 text-blue-700 border-blue-200",
      late: "bg-orange-100 text-orange-700 border-orange-200",
      graded: "bg-emerald-100 text-emerald-700 border-emerald-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[status] || "bg-slate-100 text-slate-700 border-slate-200";
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
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Course Assignments</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto max-w-full">
          {["all", "pending", "submitted", "graded", "overdue"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
            <h3 className={`text-3xl font-black text-${stat.color}-600 tracking-tight`}>{stat.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssignments.length > 0 ? filteredAssignments.map((assignment, index) => (
          <motion.div
            key={assignment._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-emerald-500 to-teal-700">
                  <BookOpen size={24} />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(assignment.submissionStatus)}`}>
                  {assignment.submissionStatus}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">{assignment.title}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 mb-4">{assignment.subjectId?.name} • {assignment.teacherId?.userId?.name}</p>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 leading-relaxed italic">"{assignment.description}"</p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock size={12} className="text-amber-500" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Max Marks: {assignment.maxMarks}</div>
                </div>

                {assignment.submissionStatus === "graded" ? (
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Grade</p>
                    <p className="text-xl font-black text-emerald-600">{assignment.marks}<span className="text-slate-300 text-xs">/{assignment.maxMarks}</span></p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {assignment.submissionStatus === "pending" || assignment.submissionStatus === "overdue" ? (
                      <button
                        onClick={() => handleSubmit(assignment._id)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                      >
                        <Upload size={14} /> Submit
                      </button>
                    ) : (
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Waiting for grade</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute -right-4 -top-4 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
          </motion.div>
        )) : (
          <div className="col-span-full py-20 bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">No assignments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
