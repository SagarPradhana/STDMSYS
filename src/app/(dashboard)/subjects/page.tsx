"use client";

import {
  BookOpen,
  Plus,
  Search,
  Users,
  MoreVertical,
  Code,
  FlaskConical,
  Languages,
  Calculator,
  History,
  Palette,
  X,
  Save,
  Hash,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetClassesQuery,
  useGetTeachersQuery
} from "@school-management/store";
import { useState } from "react";

interface ModalSubject {
  _id?: string;
  name: string;
  code: string;
  classId: string;
  teacherId?: string;
  description?: string;
}
const EMPTY_SUB: ModalSubject = { name: "", code: "", classId: "", teacherId: "", description: "" };

export default function SubjectsPage() {
  const { data: subjects = [], isLoading, isError, refetch } = useGetSubjectsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();

  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
  const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<ModalSubject>(EMPTY_SUB);
  const [selectedSub, setSelectedSub] = useState<ModalSubject | null>(null);

  const handleAdd = () => { setFormData(EMPTY_SUB); setShowAddModal(true); };
  const handleEdit = (sub: any) => {
    setFormData({
      ...sub,
      classId: typeof sub.classId === 'object' ? sub.classId?._id : sub.classId,
      teacherId: typeof sub.teacherId === 'object' ? sub.teacherId?._id : sub.teacherId
    });
    setShowEditModal(true);
  };
  const handleDeleteConfirm = (sub: any) => { setSelectedSub(sub); setShowDeleteModal(true); };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.code) {
      toast.error("Name and code are required");
      return;
    }
    try {
      await createSubject(formData).unwrap();
      toast.success(`Subject "${formData.name}" created!`);
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create subject");
    }
  };

  const handleSaveEdit = async () => {
    if (!formData._id) return;
    try {
      await updateSubject({ id: formData._id, body: formData }).unwrap();
      toast.success(`Subject "${formData.name}" updated!`);
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update subject");
    }
  };

  const handleDelete = async () => {
    if (!selectedSub?._id) return;
    try {
      await deleteSubject(selectedSub._id).unwrap();
      toast.success(`Subject "${selectedSub.name}" removed.`);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to remove subject");
    }
  };

  const getSubjectIcon = (name: string) => {
    if (name.toLowerCase().includes("math")) return Calculator;
    if (name.toLowerCase().includes("phys") || name.toLowerCase().includes("science")) return FlaskConical;
    if (name.toLowerCase().includes("hist")) return History;
    if (name.toLowerCase().includes("english") || name.toLowerCase().includes("lit") || name.toLowerCase().includes("language")) return Languages;
    if (name.toLowerCase().includes("computer") || name.toLowerCase().includes("code") || name.toLowerCase().includes("it")) return Code;
    if (name.toLowerCase().includes("art")) return Palette;
    return BookOpen;
  };

  const getSubjectColor = (name: string) => {
    if (name.toLowerCase().includes("math")) return { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", grad: "linear-gradient(135deg,#3B82F6,#60A5FA)" };
    if (name.toLowerCase().includes("phys") || name.toLowerCase().includes("science")) return { bg: "bg-cyan-100 dark:bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", grad: "linear-gradient(135deg,#06B6D4,#22D3EE)" };
    if (name.toLowerCase().includes("hist")) return { bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", grad: "linear-gradient(135deg,#F59E0B,#FCD34D)" };
    if (name.toLowerCase().includes("english") || name.toLowerCase().includes("lit")) return { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", grad: "linear-gradient(135deg,#10B981,#34D399)" };
    if (name.toLowerCase().includes("computer") || name.toLowerCase().includes("it")) return { bg: "bg-indigo-100 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", grad: "linear-gradient(135deg,#6366F1,#818CF8)" };
    if (name.toLowerCase().includes("art")) return { bg: "bg-pink-100 dark:bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", grad: "linear-gradient(135deg,#EC4899,#F472B6)" };
    return { bg: "bg-slate-100 dark:bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", grad: "linear-gradient(135deg,#6366F1,#A78BFA)" };
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  const SubjectFormFields = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { label: "Subject Name", field: "name", type: "text", placeholder: "e.g. Advanced Mathematics", icon: BookOpen },
        { label: "Subject Code", field: "code", type: "text", placeholder: "e.g. MATH-101", icon: Hash },
        { label: "Description", field: "description", type: "text", placeholder: "Brief description", icon: BookOpen },
      ].map(({ label, field, type, placeholder, icon: Icon }) => (
        <div key={field} className={cn("space-y-1.5", field === "description" ? "col-span-full" : "")}>
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</label>
          <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input type={type} placeholder={placeholder}
              value={(formData as any)[field] || ""}
              onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
            />
          </div>
        </div>
      ))}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Assign to Class</label>
        <select value={formData.classId} onChange={e => setFormData(prev => ({ ...prev, classId: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
          <option value="">All Classes</option>
          {classes.map((cls: any) => (
            <option key={cls._id} value={cls._id}>Grade {cls.grade}-{cls.section}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Subject Teacher</label>
        <select value={formData.teacherId} onChange={e => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
          <option value="">Assign Teacher</option>
          {teachers.map((t: any) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-amber">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Subjects & Curriculum</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Manage curriculum, subject codes and class assignments</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#B45309] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all self-start sm:self-auto">
            <Plus size={18} /> Add Subject
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL SUBJECTS", value: subjects.length.toString(), gradient: "linear-gradient(135deg,#667EEA,#764BA2)", positive: true, trend: "Across all classes" },
          { label: "CORE SUBJECTS", value: subjects.filter(s => ["math", "physics", "english", "history"].some(k => s.name.toLowerCase().includes(k))).length.toString(), gradient: "linear-gradient(135deg,#4FACFE,#00F2FE)", positive: true, trend: "Mandatory curriculum" },
          { label: "ELECTIVES", value: Math.max(0, subjects.length - 4).toString(), gradient: "linear-gradient(135deg,#A78BFA,#6366F1)", positive: true, trend: "Optional courses" },
          { label: "UNASSIGNED", value: subjects.filter(s => !s.classId).length.toString(), gradient: "linear-gradient(135deg,#F093FB,#F5576C)", positive: false, trend: "Needs class allocation" },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <span className="stat-card-label">{card.label}</span>
            <div className="stat-card-value mt-2">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 card animate-pulse" />)
        ) : subjects.length > 0 ? (
          subjects.map((sub, index) => {
            const Icon = getSubjectIcon(sub.name);
            const colors = getSubjectColor(sub.name);
            return (
              <motion.div key={sub._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                className="card group p-5">
                <div className="h-1 w-full rounded-t-lg mb-4 -mx-5 -mt-5 px-5 pt-1" style={{ background: colors.grad, marginTop: "-20px", marginLeft: "-20px", width: "calc(100% + 40px)", borderRadius: "16px 16px 0 0", height: "4px" }} />
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg, colors.text)}><Icon size={20} /></div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(sub)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-amber-600 transition-colors" title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteConfirm(sub)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-red-500 transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{sub.name}</h3>
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-mono text-[11px] font-medium text-[var(--text-muted)] bg-[var(--bg-surface-2)] px-2 py-0.5 rounded">{sub.code}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Users size={13} />
                    <span>Class: {typeof sub.classId === "object" && sub.classId !== null ? `${(sub.classId as any).grade}-${(sub.classId as any).section}` : sub.classId || "All"}</span>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">View Details</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center card p-10 border-dashed">
            <div className="max-w-sm mx-auto">
              <div className="empty-state-icon"><BookOpen size={36} color="#6366F1" /></div>
              <h3 className="empty-state-title">No subjects configured</h3>
              <p className="empty-state-subtitle">Add your first subject to start building the curriculum.</p>
              <Button onClick={handleAdd} className="gap-2"><Plus size={15} /> Add Subject</Button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-xl border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Create Subject</h2><p className="text-sm text-[var(--text-muted)]">Add a new subject to the curriculum</p></div>
                <button onClick={() => setShowAddModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6"><SubjectFormFields /></div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <button disabled={isCreating} onClick={handleSaveAdd}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "linear-gradient(135deg,#B45309,#F59E0B)", boxShadow: "0 4px 14px rgba(180,83,9,0.4)" }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Create Subject
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowEditModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-xl border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Edit Subject</h2><p className="text-sm text-[var(--text-muted)]">Update subject information</p></div>
                <button onClick={() => setShowEditModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6"><SubjectFormFields /></div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <button disabled={isUpdating} onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "linear-gradient(135deg,#F7971E,#FFD200)", boxShadow: "0 4px 14px rgba(247,151,30,0.4)" }}>
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Remove Subject</h2>
                <p className="text-sm text-[var(--text-muted)]">Remove <strong className="text-[var(--text-primary)]">{selectedSub.name}</strong> from the curriculum? This cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <button disabled={isDeleting} onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50">
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
