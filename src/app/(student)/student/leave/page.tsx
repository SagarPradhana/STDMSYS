"use client"
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronRight,
  FileText,
  Loader2,
  CalendarOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface LeaveRequest {
  _id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  appliedAt: string;
}

export default function LeavePage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "Personal Leave",
    startDate: "",
    endDate: "",
    reason: "",
    urgency: "Normal"
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setLeaves(json.data);
      }
    } catch (error) {
      console.error("Fetch leaves error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Leave application submitted successfully!");
        setShowModal(false);
        setFormData({
          type: "Personal Leave",
          startDate: "",
          endDate: "",
          reason: "",
          urgency: "Normal"
        });
        fetchLeaves();
      } else {
        toast.error(json.message || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Submit leave error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter(l => l.status === "pending").length,
    approved: leaves.filter(l => l.status === "approved").length
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
      pending: "bg-amber-50 text-amber-600 border-amber-100",
      rejected: "bg-rose-50 text-rose-600 border-rose-100"
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
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
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Leave Requests</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform" />
          Apply New Leave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Requests</p>
            <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter">{stats.total}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Pending Review</p>
            <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter">{stats.pending}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Approved Leaves</p>
            <h3 className="text-4xl font-black text-slate-800 italic tracking-tighter">{stats.approved}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Application History</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status of all previous requests</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leave Type</span></th>
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration</span></th>
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason</span></th>
                <th className="px-8 py-5 text-center"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span></th>
                <th className="px-8 py-5 text-right"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewed By</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {leaves.length > 0 ? leaves.map((l, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{l.type}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Ref: LEV-{l._id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600">
                      {new Date(l.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(l.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase mt-1 italic">
                      {Math.ceil((new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / 86400000) + 1} Days
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xs italic">"{l.reason}"</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(l.status)} inline-block w-24 text-center`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{l.reviewedBy || <span className="text-slate-200">Pending Review</span>}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <CalendarOff size={48} className="mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">No leave requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 w-full max-w-xl shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Request Leave</h2>
                    <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
                  </div>
                  <button type="button" onClick={() => setShowModal(false)} className="p-3 rounded-full hover:bg-slate-50 text-slate-400 transition-colors">
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Leave Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none appearance-none cursor-pointer"
                      >
                        <option>Personal Leave</option>
                        <option>Medical Leave</option>
                        <option>Casual Leave</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Urgency</label>
                      <div className="flex gap-2">
                        {["High", "Normal"].map(u => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setFormData({ ...formData, urgency: u })}
                            className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.urgency === u ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">From Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                        <input
                          type="date"
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">To Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-500" size={18} />
                        <input
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Reason for Leave</label>
                    <div className="relative">
                      <FileText className="absolute left-6 top-6 text-slate-300" size={18} />
                      <textarea
                        required
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none min-h-[120px]"
                        placeholder="Please describe the reason for your absence..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : "Submit Request"} <ChevronRight size={14} />
                  </button>
                </div>
              </form>

              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}