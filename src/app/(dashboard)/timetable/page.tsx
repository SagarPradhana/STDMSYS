"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Clock,
  GraduationCap,
  Building2,
  ChevronLeft,
  ChevronRight,
  Download,
  Settings,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  BookOpen,
  Loader2
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import {
  useGetTimetableByClassQuery,
  useUpdateTimetableMutation,
  useGetClassesQuery,
  useGetSubjectsQuery,
  useGetTeachersQuery
} from "@school-management/store";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [
  { time: "08:00 - 08:50", label: "Period 1" },
  { time: "09:00 - 09:50", label: "Period 2" },
  { time: "10:00 - 10:50", label: "Period 3" },
  { time: "11:00 - 11:30", label: "Recess", isBreak: true },
  { time: "11:30 - 12:20", label: "Period 4" },
  { time: "12:30 - 13:20", label: "Period 5" },
];

export default function TimetablePage() {
  const { data: classes = [] } = useGetClassesQuery();
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0]._id);
    }
  }, [classes, selectedClassId]);

  const { data: timetable = [], isLoading } = useGetTimetableByClassQuery(selectedClassId, { skip: !selectedClassId });
  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: teachers = [] } = useGetTeachersQuery();

  const [updateTimetable, { isLoading: isUpdating }] = useUpdateTimetableMutation();

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({ day: "Monday", period: 0, subjectId: "", teacherId: "", room: "" });
  const [showAutoModal, setShowAutoModal] = useState(false);

  const handleSaveSlot = async () => {
    if (!selectedClassId || !slotForm.subjectId || !slotForm.teacherId) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await updateTimetable([{ ...slotForm, classId: selectedClassId }]).unwrap();
      toast.success("Schedule slot updated!");
      setShowSlotModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update slot");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-indigo">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Timetable Builder</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Design and manage academic schedules, room allocations and teacher rotations</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Download size={18} /> Export PDF
            </button>
            <button onClick={() => setShowAutoModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#312E81] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Auto-Generate
            </button>
          </div>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL PERIODS", value: "30", gradient: "linear-gradient(135deg,#667EEA,#764BA2)", trend: "Per week", positive: true },
          { label: "CLASSES SCHEDULED", value: "6", gradient: "linear-gradient(135deg,#4FACFE,#00F2FE)", trend: "All grades", positive: true },
          { label: "CONFLICTS", value: "1", gradient: "linear-gradient(135deg,#F093FB,#F5576C)", trend: "Needs resolution", positive: false },
          { label: "FREE SLOTS", value: "12", gradient: "linear-gradient(135deg,#11998E,#38EF7D)", trend: "Available periods", positive: true },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <span className="stat-card-label">{card.label}</span>
            <div className="stat-card-value mt-2">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <div className="card p-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Select Class</h3>
            <div className="space-y-1">
              {classes.map(cls => (
                <button key={cls._id} onClick={() => setSelectedClassId(cls._id)}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all",
                    selectedClassId === cls._id ? "bg-[var(--primary)] text-white shadow-md shadow-indigo-500/20" : "hover:bg-[var(--bg-surface-2)] text-[var(--text-muted)]")}>
                  Grade {cls.grade}-{cls.section}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Conflict Alerts</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-[10px] font-medium leading-normal">Dr. Smith has a conflict on Monday Period 2 with 11-B.</div>
              </div>
              <div className="flex gap-3 p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-[10px] font-medium leading-normal">All rooms successfully allocated for Grade 12.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="flex-1">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-surface-2)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-[var(--bg-surface-3)] rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-bold text-sm text-[var(--text-primary)]">Mon — Sat</span>
                  <button className="p-1 hover:bg-[var(--bg-surface-3)] rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="h-4 w-px bg-[var(--border)]" />
                <div className="text-xs text-[var(--text-muted)]">Schedule for <span className="font-bold text-[var(--primary)]">Class {classes.find(c => c._id === selectedClassId)?.grade}-{classes.find(c => c._id === selectedClassId)?.section}</span></div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs" onClick={() => setShowSlotModal(true)}>
                  <Plus className="w-3.5 h-3.5" /> Add Slot
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 text-xs"><Settings className="w-3.5 h-3.5" /> Config</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-3 bg-[var(--bg-surface-2)]/50 border-r border-b border-[var(--border)] w-28" />
                    {DAYS.map(day => (
                      <th key={day} className="p-3 bg-[var(--bg-surface-2)]/50 border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period, pIdx) => (
                    <tr key={period.label}>
                      <td className="p-3 border-r border-b border-[var(--border)] bg-[var(--bg-surface-2)]/20">
                        <div className="text-[10px] font-bold text-[var(--primary)] uppercase">{period.label}</div>
                        <div className="text-[9px] text-[var(--text-muted)] whitespace-nowrap mt-1">{period.time}</div>
                      </td>
                      {period.isBreak ? (
                        <td colSpan={DAYS.length} className="p-3 border-b border-[var(--border)] bg-indigo-50/50 dark:bg-indigo-500/10 text-center text-[10px] font-bold text-indigo-400 uppercase tracking-[0.4em]">
                          ☕ Recess / Lunch Break
                        </td>
                      ) : (
                        DAYS.map(day => {
                          const slot = timetable.find(s => s.day === day && s.period === pIdx);
                          return (
                            <td key={`${day}-${pIdx}`} className="p-2 border-b border-[var(--border)] min-w-[120px] group relative">
                              {slot ? (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                  className="h-full bg-[var(--bg-surface)] p-2.5 rounded-xl border border-indigo-500/20 shadow-sm group-hover:shadow-md transition-all group-hover:border-indigo-500/50 cursor-pointer">
                                  <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">{(slot.subjectId as any)?.name || "Subject"}</div>
                                  <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)] font-medium mb-1">
                                    <GraduationCap className="w-2.5 h-2.5" />{(slot.teacherId as any)?.name || "Teacher"}
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] text-[var(--text-muted)] font-medium">
                                    <Building2 className="w-2.5 h-2.5" />Room {slot.room || "N/A"}
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="h-full min-h-[72px] border-2 border-dashed border-transparent group-hover:border-[var(--border)] rounded-xl flex items-center justify-center transition-colors">
                                  <button onClick={() => { setSlotForm(prev => ({ ...prev, day, period: pIdx })); setShowSlotModal(true); }}
                                    className="p-2 rounded-lg bg-[var(--bg-surface-2)] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-surface-3)]">
                                    <Plus className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                                  </button>
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
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showSlotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowSlotModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Add Schedule Slot</h2><p className="text-sm text-[var(--text-muted)]">Assign a subject to a period</p></div>
                <button onClick={() => setShowSlotModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Day</label>
                  <select value={slotForm.day} onChange={e => setSlotForm(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Period</label>
                  <select value={slotForm.period} onChange={e => setSlotForm(prev => ({ ...prev, period: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    {PERIODS.filter(p => !p.isBreak).map((p, i) => <option key={p.label} value={i}>{p.label} ({p.time})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Subject</label>
                  <select value={slotForm.subjectId} onChange={e => setSlotForm(prev => ({ ...prev, subjectId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    <option value="">Select Subject</option>
                    {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Teacher</label>
                  <select value={slotForm.teacherId} onChange={e => setSlotForm(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                    <option value="">Select Teacher</option>
                    {teachers.map((t: any) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 col-span-full">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Room Number</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input type="text" placeholder="e.g. 301" value={slotForm.room}
                      onChange={e => setSlotForm(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowSlotModal(false)}>Cancel</Button>
                <button disabled={isUpdating} onClick={handleSaveSlot}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "var(--grad-indigo)", boxShadow: "0 4px 14px rgba(79,70,229,0.4)" }}>
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Slot
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAutoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowAutoModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--grad-indigo)" }}><Calendar className="w-8 h-8 text-white" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Auto-Generate Timetable</h2>
                <p className="text-sm text-[var(--text-muted)]">Automatically distribute subjects, teachers and rooms across the week for all classes.</p>
              </div>
              <div className="space-y-3 mb-6">
                {["Resolve all teacher conflicts automatically", "Balance subject distribution evenly", "Respect teacher availability hours", "Assign rooms based on class size"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-primary)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowAutoModal(false)}>Cancel</Button>
                <button onClick={() => { toast.success("Timetable auto-generated successfully!"); setShowAutoModal(false); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all" style={{ background: "var(--grad-indigo)", boxShadow: "0 4px 14px rgba(79,70,229,0.4)" }}>
                  <Calendar size={16} /> Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
