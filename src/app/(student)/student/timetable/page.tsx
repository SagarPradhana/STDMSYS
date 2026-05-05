"use client";
import {
  CalendarClock,
  CheckCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarOff,
} from "lucide-react";
import { useState, useEffect } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PERIODS = [
  { time: "08:00 - 08:50", label: "Period 1" },
  { time: "09:00 - 09:50", label: "Period 2" },
  { time: "10:00 - 10:50", label: "Period 3" },
  { time: "11:00 - 11:30", label: "Recess", isBreak: true },
  { time: "11:30 - 12:20", label: "Period 4" },
  { time: "12:30 - 13:20", label: "Period 5" },
];

interface LocalTimetableSlot {
  _id: string;
  day: string;
  period: number;
  subjectId: { _id: string; name: string };
  teacherId: { userId: { name: string } };
  room: string;
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<LocalTimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/timetable/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setTimetable(json.data);
      }
    } catch (error) {
      console.error("Fetch timetable error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectStyle = (subject: string) => {
    const styles: Record<string, { bg: string, text: string, border: string }> = {
      "Mathematics": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
      "Physics": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      "Chemistry": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      "English": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
      "History": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
      "Computer Science": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
      "Physical Education": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
      "Art": { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
      "Assembly": { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
    };
    return styles[subject] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
  };

  const getSlot = (day: string, periodIdx: number) => {
    // Map UI period index to backend period number
    // Periods: 0, 1, 2, (Break), 3, 4
    let backendPeriod = periodIdx;
    if (periodIdx >= 3) backendPeriod = periodIdx - 1; // Skip break
    
    return timetable.find(s => s.day === day && s.period === backendPeriod);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Class Schedule</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <CalendarClock size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Periods</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">{timetable.length}/Week</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Subjects</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">
              {new Set(timetable.map(s => s.subjectId?._id).filter(Boolean)).size} Core
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Working Days</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">Mon - Sat</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700 -z-10" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-left border-b border-slate-100 w-40">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Time Table</span>
                </th>
                {DAYS.map(day => (
                  <th key={day} className="p-6 text-center border-b border-slate-100 min-w-[160px]">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-800">{day}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period, pIdx) => (
                <tr key={period.label} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 border-b border-slate-100 bg-slate-50/30 group-hover:bg-slate-100/50 transition-colors">
                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">{period.label}</p>
                    <p className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{period.time}</p>
                  </td>
                  {period.isBreak ? (
                    <td colSpan={DAYS.length} className="p-4 border-b border-slate-100">
                      <div className="w-full py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl flex items-center justify-center gap-3 border border-emerald-100/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-700 italic">Recess / Break</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                    </td>
                  ) : (
                    DAYS.map(day => {
                      const slot = getSlot(day, pIdx);
                      const style = slot ? getSubjectStyle(slot.subjectId?.name) : null;
                      return (
                        <td key={`${day}-${pIdx}`} className="p-3 border-b border-slate-100 align-top">
                          {slot ? (
                            <div className={`${style?.bg} ${style?.border} border p-4 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-900/5 cursor-pointer h-full flex flex-col justify-between group/card`}>
                              <div>
                                <h4 className={`text-xs font-black uppercase tracking-tight mb-1 ${style?.text}`}>{slot.subjectId?.name}</h4>
                                <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  {slot.teacherId?.userId?.name}
                                </p>
                              </div>
                              <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md bg-white/50 ${style?.text} border border-white/50 uppercase tracking-tighter`}>Room {slot.room}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full min-h-[100px] border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center opacity-30">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Free</span>
                            </div>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}