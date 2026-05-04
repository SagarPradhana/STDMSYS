"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Filter,
  Check,
  Target,
  Goal,
  X,
  Save,
  GraduationCap,
  Loader2
} from "lucide-react";
import {
  Button,
  StatusBadge
} from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetAssignmentsQuery, 
  useCreateAssignmentMutation,
  useGetClassesQuery,
  useGetSubjectsQuery
} from "@school-management/store";

export default function AssignmentsPage() {
  const { data: assignments = [], isLoading: isLoadingAssignments } = useGetAssignmentsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: subjects = [] } = useGetSubjectsQuery();
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ title: "", description: "", subjectId: "", classId: "", dueDate: "", maxMarks: "100" });

  const getSubjectGrad = (subjectName: string) => {
    switch (subjectName) {
      case "Mathematics": return "linear-gradient(135deg,#667EEA,#764BA2)";
      case "Physics": return "linear-gradient(135deg,#4FACFE,#00F2FE)";
      case "History": return "linear-gradient(135deg,#F7971E,#FFD200)";
      case "Computer Science": return "linear-gradient(135deg,#11998E,#38EF7D)";
      default: return "linear-gradient(135deg,#6366F1,#818CF8)";
    }
  };

  const handleCreateAssignment = async () => {
    if (!assignForm.title || !assignForm.classId || !assignForm.subjectId || !assignForm.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await createAssignment({
        ...assignForm,
        maxMarks: Number(assignForm.maxMarks)
      }).unwrap();
      toast.success(`Assignment "${assignForm.title}" created!`);
      setShowAddModal(false);
      setAssignForm({ title: "", description: "", subjectId: "", classId: "", dueDate: "", maxMarks: "100" });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create assignment");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  const stats = {
    pendingGrading: assignments.reduce((sum: number, a: any) => sum + (a.submissions?.filter((s: any) => s.status === 'submitted').length || 0), 0),
    completionRate: assignments.length > 0 ? Math.round(assignments.reduce((sum: number, a: any) => sum + ((a.submissions?.length || 0) / 50 * 100), 0) / assignments.length) : 0, // 50 is dummy student count per class
    activeCount: assignments.length
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-purple">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Assignments & Coursework</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Create, track and evaluate student assignments across all grades</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Download size={18} /> Download All
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#7C3AED] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Create Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[20px] p-7 text-white relative overflow-hidden shadow-xl shadow-indigo-600/30 group">
          <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 rounded-full bg-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm"><FileText size={24} /></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">PENDING GRADING</span>
            </div>
            <div className="text-[48px] font-black leading-none mb-2 tracking-tighter italic">{stats.pendingGrading}</div>
            <p className="text-white/80 text-[13px] font-medium mb-8">Submissions awaiting review in the queue</p>
            <div className="flex items-center justify-between pt-5 border-t border-white/10">
              <div className="px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white/60">TARGET: 48H</div>
              <button className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-bold uppercase tracking-wider transition-colors">MANAGE QUEUE →</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#CCFBF1] rounded-[20px] p-7 shadow-lg shadow-emerald-500/[0.04]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-[#10B981]"><Check size={16} strokeWidth={3} /></div>
            <span className="text-[10px] font-bold text-[#059669] tracking-widest uppercase">COMPLETION RATE</span>
          </div>
          <div className="text-[36px] font-extrabold text-[#064E3B] leading-none mb-6 tracking-tight">{stats.completionRate}%</div>
          <div className="space-y-3">
            <div className="w-full bg-[#D1FAE5] h-2 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${stats.completionRate}%` }} transition={{ duration: 1 }} className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full rounded-full" />
            </div>
            <div className="flex justify-between text-[11px] font-bold text-[#059669]"><span>ACTIVE TERM</span><span>+3.2% vs LAST TERM</span></div>
          </div>
        </div>

        <div className="bg-white border border-[#EDE9FE] rounded-[20px] p-7 shadow-lg shadow-indigo-500/[0.04]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-[#6366F1]"><Goal size={16} strokeWidth={3} /></div>
            <span className="text-[10px] font-bold text-[#6366F1] tracking-widest uppercase">ACTIVE ASSIGNMENTS</span>
          </div>
          <div className="text-[36px] font-extrabold text-[#1E1B4B] leading-none mb-6 tracking-tight">{stats.activeCount}</div>
          <div className="flex items-center gap-4">
             <div className="text-[11px] font-bold text-[#7C6FAE] uppercase tracking-wider">Across all departments</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#1E1B4B]">Current Coursework</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C6FAE]" />
              <input type="text" placeholder="Search assignments..." className="w-full pl-11 pr-4 py-2.5 bg-[#F8F7FF] border border-[#EDE9FE] rounded-xl text-sm focus:border-[#818CF8] outline-none" />
            </div>
            <button className="p-2.5 bg-[#F3F0FF] text-[#6366F1] border border-[#EDE9FE] rounded-xl hover:bg-[#EDE9FE]"><Filter size={20} /></button>
          </div>
        </div>

        <div className="bg-white border border-[#EDE9FE] rounded-[20px] overflow-hidden shadow-lg shadow-indigo-500/[0.04]">
          {isLoadingAssignments ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[90px] border-b border-[#F3F0FF] animate-pulse bg-[#FAFBFF]" />
            ))
          ) : assignments.length > 0 ? (
            assignments.map((asm: any, index) => (
              <motion.div
                key={asm._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-[18px_24px] border-b border-[#F3F0FF] last:border-0 flex items-center gap-5 group hover:bg-[#F8F7FF] hover:border-l-[3px] hover:border-[#6366F1] transition-all cursor-default"
              >
                <div
                  className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg"
                  style={{ background: getSubjectGrad(asm.subjectId?.name) }}
                >
                  <BookOpen size={20} />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-[15px] text-[#1E1B4B] mb-1.5 group-hover:text-[#6366F1] transition-colors">{asm.title}</h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F3F0FF] text-[#6366F1] text-[11px] font-bold">
                      <BookOpen size={12} /> {asm.subjectId?.name || "Subject"}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#7C3AED] text-[11px] font-bold">
                      <Users size={12} /> {asm.classId?.grade ? `Grade ${asm.classId.grade}-${asm.classId.section}` : "Class"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#D97706]">
                      <Calendar size={13} /> Due: {new Date(asm.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 pr-2">
                  <div className="text-right min-w-[100px]">
                    <div className="text-[15px] font-black text-[#1E1B4B] leading-none mb-1">
                      {asm.submissions?.length || 0} <span className="text-[#7C6FAE] font-bold">/ {asm.maxMarks} Marks</span>
                    </div>
                    <div className="text-[10px] font-bold text-[#7C6FAE] uppercase tracking-wider mb-2">SUBMISSIONS</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-[#F3F0FF] text-[#6366F1] border border-[#EDE9FE] font-bold text-[13px] hover:bg-indigo-600 hover:text-white transition-all">Grading</button>
                    <button className="p-2 text-[#7C6FAE] hover:text-[#1E1B4B]"><MoreVertical size={20} /></button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <FileText size={40} className="mx-auto text-[var(--text-muted)] mb-4 opacity-20" />
              <p className="text-[var(--text-muted)]">No assignments found.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Create Assignment</h2><p className="text-sm text-[var(--text-muted)]">Assign coursework to a class</p></div>
                <button onClick={() => setShowAddModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Assignment Title</label>
                  <input type="text" placeholder="e.g. Advanced Algebra Set A" value={assignForm.title} onChange={e => setAssignForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm focus:border-purple-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Subject</label>
                  <select value={assignForm.subjectId} onChange={e => setAssignForm(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none">
                    <option value="">Select Subject</option>
                    {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Class</label>
                  <select value={assignForm.classId} onChange={e => setAssignForm(p => ({ ...p, classId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none">
                    <option value="">Select Class</option>
                    {classes.map((c: any) => <option key={c._id} value={c._id}>Grade {c.grade}-{c.section}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Due Date</label>
                  <input type="date" value={assignForm.dueDate} onChange={e => setAssignForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Max Marks</label>
                  <input type="number" value={assignForm.maxMarks} onChange={e => setAssignForm(p => ({ ...p, maxMarks: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm outline-none" />
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <button disabled={isCreating} onClick={handleCreateAssignment}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50" style={{ background: "var(--grad-secondary)" }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Create Assignment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
