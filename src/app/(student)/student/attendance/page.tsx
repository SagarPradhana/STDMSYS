"use client";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Loader2,
  CalendarOff,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AttendanceRecord {
  _id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remark?: string;
}

interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/attendance/student/me?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setRecords(json.data);
        setSummary(json.summary);
      }
    } catch (error) {
      console.error("Fetch attendance error:", error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = summary && summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : "0.0";

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      present: "bg-emerald-50 text-emerald-600 border-emerald-100",
      absent: "bg-rose-50 text-rose-600 border-rose-100",
      late: "bg-amber-50 text-amber-600 border-amber-100",
      excused: "bg-blue-50 text-blue-600 border-blue-100"
    };
    return styles[status] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  if (loading && !records.length) {
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
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Attendance Record</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })} {selectedYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Overall Attendance</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-5xl font-black text-slate-800 tracking-tighter">{percentage}%</span>
                <span className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-tighter">
                  {Number(percentage) > 85 ? "Excellent!" : Number(percentage) > 75 ? "Good" : "Warning"}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                  <p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Present</p>
                  <p className="text-xl font-black text-slate-800">{summary?.present || 0}</p>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
                  <p className="text-[9px] font-black text-rose-600 uppercase mb-1">Absent</p>
                  <p className="text-xl font-black text-slate-800">{summary?.absent || 0}</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
          </div>

          <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-4">Leave Info</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 italic">"Maintain 75% attendance to be eligible for final examinations."</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Medical Leaves</p>
                      <p className="text-lg font-black">{summary?.excused || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Late Arrivals</p>
                      <p className="text-lg font-black">{summary?.late || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Attendance History</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed Log for selected month</p>
            </div>
            {loading ? <Loader2 size={24} className="text-emerald-500 animate-spin" /> : <CheckCircle className="text-emerald-500" size={24} />}
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date & Day</span></th>
                  <th className="px-8 py-5 text-center"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span></th>
                  <th className="px-8 py-5 text-right"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Remarks</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.length > 0 ? records.map((r, i) => (
                  <tr key={i} className="group hover:bg-emerald-50/20 transition-all">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800 tracking-tight">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                        {new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(r.status)} inline-block w-28 text-center`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-xs font-medium text-slate-500 italic">
                        {r.remark || <span className="text-slate-300 not-italic uppercase font-black text-[9px] tracking-widest">—</span>}
                      </p>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center">
                        <CalendarOff size={48} className="mb-4 opacity-20" />
                        <p className="text-xs font-black uppercase tracking-widest">No attendance records found for this month</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}