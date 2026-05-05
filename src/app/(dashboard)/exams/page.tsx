"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileStack, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight,
  CheckCircle2,
  Filter,
  Search,
  ClipboardList,
  X,
  Save,
  BookOpen,
  Loader2
} from "lucide-react";
import { 
  Button, 
  StatusBadge 
} from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetExamsQuery, 
  useCreateExamMutation,
  useGetClassesQuery
} from "@school-management/store";

export default function ExamsPage() {
  const { data: exams = [], isLoading } = useGetExamsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [examForm, setExamForm] = useState({ name: "", type: "final", classId: "", startDate: "", endDate: "", subjects: "1" });

  const getExamTypeGrad = (type: string) => {
    switch (type.toLowerCase()) {
      case "final": return "linear-gradient(135deg,#EF4444,#F87171)";
      case "midterm": return "linear-gradient(135deg,#6366F1,#818CF8)";
      case "unit": return "linear-gradient(135deg,#10B981,#34D399)";
      case "mock": return "linear-gradient(135deg,#F59E0B,#FCD34D)";
      default: return "linear-gradient(135deg,#6366F1,#818CF8)";
    }
  };

  const handleScheduleExam = async () => {
    if (!examForm.name || !examForm.classId || !examForm.startDate || !examForm.endDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createExam({
        name: examForm.name,
        type: examForm.type as any,
        classId: examForm.classId,
        schedule: []
      }).unwrap();
      toast.success(`"${examForm.name}" scheduled successfully!`);
      setShowScheduleModal(false);
      setExamForm({ name: "", type: "final", classId: "", startDate: "", endDate: "", subjects: "1" });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to schedule exam");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  const stats = {
    upcoming: exams.filter(e => e.status === "upcoming").length,
    ongoing: exams.filter(e => e.status === "ongoing").length,
    completed: exams.filter(e => e.status === "completed").length,
    pendingGrading: 0
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-amber">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Examinations & Results</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Schedule academic assessments and analyze institutional performance metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Calendar size={18} /> Academic Year 2026
            </button>
            <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#B45309] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Schedule Exam
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "UPCOMING", value: stats.upcoming.toString().padStart(2, '0'), color: "blue", sub: "Scheduled for next 30 days" },
          { label: "ONGOING", value: stats.ongoing.toString().padStart(2, '0'), color: "emerald", sub: "Active examinations" },
          { label: "PENDING GRADING", value: stats.pendingGrading.toString().padStart(2, '0'), color: "amber", sub: "Results to be published" },
          { label: "COMPLETED", value: stats.completed.toString().padStart(2, '0'), color: "indigo", sub: "This academic session" }
        ].map((stat, i) => (
          <div key={i} className={cn(
            "bg-white border rounded-[16px] p-6 relative overflow-hidden shadow-lg",
            stat.color === "blue" ? "border-[#BFDBFE] shadow-blue-500/[0.04]" :
            stat.color === "emerald" ? "border-[#BBF7D0] shadow-emerald-500/[0.04]" :
            stat.color === "amber" ? "border-[#FED7AA] shadow-amber-500/[0.04]" : "border-[#DDD6FE] shadow-indigo-500/[0.04]"
          )}>
            <div className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              stat.color === "blue" ? "bg-gradient-to-b from-[#3B82F6] to-[#60A5FA]" :
              stat.color === "emerald" ? "bg-gradient-to-b from-[#10B981] to-[#34D399]" :
              stat.color === "amber" ? "bg-gradient-to-b from-[#F59E0B] to-[#FCD34D]" : "bg-gradient-to-b from-[#6366F1] to-[#818CF8]"
            )} />
            <span className={cn(
              "text-[10px] font-bold tracking-widest uppercase",
              stat.color === "blue" ? "text-[#1D4ED8]" :
              stat.color === "emerald" ? "text-[#059669]" :
              stat.color === "amber" ? "text-[#D97706]" : "text-[#4F46E5]"
            )}>{stat.label}</span>
            <div className={cn(
              "text-[36px] font-extrabold my-1 tracking-tight",
              stat.color === "blue" ? "text-[#1E3A8A]" :
              stat.color === "emerald" ? "text-[#064E3B]" :
              stat.color === "amber" ? "text-[#78350F]" : "text-[#1E1B4B]"
            )}>{stat.value}</div>
            <div className={cn(
              "text-[12px] font-medium",
              stat.color === "blue" ? "text-[#3B82F6]" :
              stat.color === "emerald" ? "text-[#10B981]" :
              stat.color === "amber" ? "text-[#F59E0B]" : "text-[#818CF8]"
            )}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Examination Schedule Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#1E1B4B]">Examination Schedule</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C6FAE]" />
              <input 
                type="text" 
                placeholder="Search exams..." 
                className="w-full pl-11 pr-4 py-2.5 bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl text-sm focus:border-[#F59E0B] focus:ring-4 focus:ring-[#F59E0B]/5 outline-none transition-all placeholder:text-[#7C6FAE]/50" 
              />
            </div>
            <button className="p-2.5 bg-[#FEF3C7] text-[#D97706] border border-[#FED7AA] rounded-xl hover:bg-[#FDE68A] transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#EDE9FE] rounded-[20px] overflow-hidden shadow-lg shadow-indigo-500/[0.04]">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[100px] border-b border-[#F3F0FF] animate-pulse bg-[#FAFBFF]" />
            ))
          ) : exams.length > 0 ? (
            exams.map((exam, index) => (
              <motion.div
                key={exam._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="p-[18px_24px] border-b border-[#F3F0FF] last:border-0 flex items-center gap-5 hover:bg-[#FAFBFF] transition-colors cursor-default"
              >
                <div 
                  className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg"
                  style={{ background: getExamTypeGrad(exam.type) }}
                >
                  <ClipboardList size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-bold text-[15px] text-[#1E1B4B]">{exam.name}</h4>
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                      exam.type === "final" ? "bg-[#FEE2E2] text-[#DC2626]" :
                      exam.type === "midterm" ? "bg-[#EDE9FE] text-[#6366F1]" :
                      exam.type === "unit" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                    )}>
                      {exam.type}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#7C6FAE] font-medium">
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-[#EDE9FE]" /> 
                      {exam.classId && typeof exam.classId === 'object' ? `Grade ${exam.classId.grade}-${exam.classId.section}` : "Class N/A"}
                    </span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#EDE9FE]" /> 
                      {exam.schedule?.[0]?.date ? new Date(exam.schedule[0].date).toLocaleDateString() : "TBD"}
                    </span>
                    <span className="flex items-center gap-1.5"><ClipboardList size={14} className="text-[#EDE9FE]" /> {exam.schedule?.length || 0} Subjects</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className={cn(
                    "text-[13px] font-bold flex items-center gap-2",
                    exam.status === "ongoing" ? "text-[#10B981]" : 
                    exam.status === "upcoming" ? "text-[#3B82F6]" : "text-[#7C6FAE]"
                  )}>
                    {exam.status === "ongoing" && (
                      <div className="relative flex h-2 w-2">
                        <div className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                        <div className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                      </div>
                    )}
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-[#F3F0FF] text-[#6366F1] border border-[#EDE9FE] font-bold text-[13px] hover:bg-gradient-to-br hover:from-[#6366F1] hover:to-[#818CF8] hover:text-white hover:border-transparent hover:shadow-lg transition-all">
                      View Schedule
                    </button>
                    <button className="text-[13px] font-bold text-[#7C6FAE] hover:text-[#6366F1] transition-colors pr-2">Manage</button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <ClipboardList size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-20" />
              <p className="text-[var(--text-muted)]">No examinations scheduled yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Exam Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowScheduleModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Schedule Exam</h2><p className="text-sm text-[var(--text-muted)]">Set up a new examination</p></div>
                <button onClick={() => setShowScheduleModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Exam Name</label>
                  <input type="text" placeholder="e.g. Final Term Examination" value={examForm.name} onChange={e => setExamForm(p => ({...p, name: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Exam Type</label>
                  <select value={examForm.type} onChange={e => setExamForm(p => ({...p, type: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-amber-500">
                    <option value="final">Final</option>
                    <option value="midterm">Midterm</option>
                    <option value="unit">Unit</option>
                    <option value="mock">Mock</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Grade</label>
                  <select value={examForm.classId} onChange={e => setExamForm(p => ({...p, classId: e.target.value}))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-amber-500">
                    <option value="">Select Grade</option>
                    {classes.map((cls: any) => (
                      <option key={cls._id} value={cls._id}>Grade {cls.grade}-{cls.section}</option>
                    ))}
                  </select>
                </div>
                {[{label:"Start Date",field:"startDate"},{label:"End Date",field:"endDate"}].map(({label,field})=>(
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</label>
                    <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input type="date" value={(examForm as any)[field]} onChange={e => setExamForm(p => ({...p,[field]:e.target.value}))}
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 outline-none" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                <button disabled={isCreating} onClick={handleScheduleExam}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{background:"var(--grad-amber)",boxShadow:"0 4px 14px rgba(180,83,9,0.4)"}}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Schedule Exam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
