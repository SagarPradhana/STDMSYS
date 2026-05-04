"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  MoreVertical,
  LayoutGrid,
  List,
  School,
  X,
  Save,
  GraduationCap,
  Users,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { 
  useGetClassesQuery, 
  useCreateClassMutation, 
  useUpdateClassMutation, 
  useDeleteClassMutation,
  useGetTeachersQuery,
  useGetAdminStatsQuery
} from "@school-management/store";
import toast from "react-hot-toast";

interface ClassForm {
  _id?: string;
  grade: number;
  section: string;
  classTeacherId: string;
  room?: string;
  capacity?: number;
}

const EMPTY_CLASS: ClassForm = { grade: 10, section: "A", classTeacherId: "", room: "", capacity: 40 };

export default function ClassesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Queries
  const { data: classes = [], isLoading } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  const { data: stats } = useGetAdminStatsQuery();
  
  // Mutations
  const [createClass, { isLoading: isCreating }] = useCreateClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass, { isLoading: isDeleting }] = useDeleteClassMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<ClassForm>(EMPTY_CLASS);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const handleSaveAdd = async () => {
    try {
      await createClass(formData).unwrap();
      toast.success(`Class Grade ${formData.grade}-${formData.section} created!`);
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create class");
    }
  };

  const handleSaveEdit = async () => {
    if (!formData._id) return;
    try {
      await updateClass({ id: formData._id, body: formData }).unwrap();
      toast.success(`Class Grade ${formData.grade}-${formData.section} updated!`);
      setShowManageModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update class");
    }
  };

  const handleDelete = async () => {
    if (!selectedClass?._id) return;
    try {
      await deleteClass(selectedClass._id).unwrap();
      toast.success(`Class removed.`);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to remove class");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  const ClassFormFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Grade</label>
        <input type="number" placeholder="e.g. 10" value={formData.grade}
          onChange={e => setFormData(prev => ({ ...prev, grade: parseInt(e.target.value) || 0 }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-all" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Section</label>
        <input type="text" placeholder="e.g. A" value={formData.section}
          onChange={e => setFormData(prev => ({ ...prev, section: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-all" />
      </div>
      <div className="space-y-1.5 col-span-full">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Class Teacher</label>
        <select value={formData.classTeacherId || ""} 
          onChange={e => setFormData(prev => ({ ...prev, classTeacherId: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-all">
          <option value="">Select Teacher</option>
          {teachers.map((t: any) => (
            <option key={t._id} value={t._id}>{t.name} ({t.employeeId})</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Room Number</label>
        <input type="text" placeholder="e.g. 301" value={formData.room}
          onChange={e => setFormData(prev => ({ ...prev, room: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-all" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Capacity</label>
        <input type="number" placeholder="e.g. 40" value={formData.capacity}
          onChange={e => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-all" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-teal">
        <div className="absolute right-[-30px] top-[-50px] w-[180px] h-[180px] rounded-full bg-white/07 pointer-events-none" />
        <div className="absolute right-[80px] top-[30px] w-[100px] h-[100px] rounded-full bg-white/05 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Class Management</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Organize school structure, assign teachers and manage rooms</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white/15 border border-white/25 backdrop-blur-md p-1 rounded-xl">
              <button onClick={() => setViewMode("grid")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-teal-600" : "text-white/60 hover:text-white")}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode("list")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-teal-600" : "text-white/60 hover:text-white")}>
                <List size={18} />
              </button>
            </div>
            <button onClick={() => { setFormData(EMPTY_CLASS); setShowAddModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-teal-700 font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Create Class
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL CLASSES", value: stats?.classes?.toString() || classes.length.toString(), gradient: "linear-gradient(135deg,#0F766E,#14B8A6)", positive: true, trend: "All grades" },
          { label: "TOTAL STUDENTS", value: stats?.totalStudents?.toString() || classes.reduce((s, c) => s + (c.studentCount || 0), 0).toString(), gradient: "linear-gradient(135deg,#667EEA,#764BA2)", positive: true, trend: "Enrolled" },
          { label: "AVG CLASS SIZE", value: classes.length ? Math.round(classes.reduce((s, c) => s + (c.studentCount || 0), 0) / classes.length).toString() : "0", gradient: "linear-gradient(135deg,#4FACFE,#00F2FE)", positive: true, trend: "Per class" },
          { label: "UNASSIGNED", value: classes.filter(c => !c.classTeacherId).length.toString(), gradient: "linear-gradient(135deg,#F093FB,#F5576C)", positive: false, trend: "Needs teacher" },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <span className="stat-card-label">{card.label}</span>
            <div className="stat-card-value mt-2">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 card animate-pulse" />)
        ) : classes.length > 0 ? (
          classes.map((cls: any, index) => (
            <motion.div key={cls._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
              className="card group overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 to-teal-400" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Grade {cls.grade}-{cls.section}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => { setFormData({ ...cls, classTeacherId: typeof cls.classTeacherId === 'object' ? cls.classTeacherId?._id : cls.classTeacherId }); setShowManageModal(true); }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-amber-600 transition-colors" title="Edit">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => { setSelectedClass(cls); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-xs font-semibold">
                    {cls.classTeacherId && typeof cls.classTeacherId === 'object' ? cls.classTeacherId.name?.[0] : "?"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-secondary)]">
                      {cls.classTeacherId && typeof cls.classTeacherId === 'object' ? cls.classTeacherId.name : "Unassigned"}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Class Teacher</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
                  <div>
                    <div className="text-base font-semibold text-[var(--text-primary)]">{cls.studentCount || 0}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Students</div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[var(--text-primary)]">{cls.subjects?.length || 0}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Subjects</div>
                  </div>
                  <div>
                    <div className="text-base font-semibold text-[var(--text-primary)]">{cls.room || `R-${cls.grade}0${index + 1}`}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Room</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => { setSelectedClass(cls); setShowDetailsModal(true); }}>Details</Button>
                  <Button size="sm" className="flex-1 h-8" onClick={() => { setFormData({ ...cls, classTeacherId: typeof cls.classTeacherId === 'object' ? cls.classTeacherId?._id : cls.classTeacherId }); setShowManageModal(true); }}>Manage</Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="empty-state border border-teal-200 dark:border-teal-500/20">
              <div className="empty-state-icon" style={{ background: "linear-gradient(135deg,#CCFBF1,#99F6E4)" }}>
                <School size={48} color="#0D9488" />
              </div>
              <h3 className="empty-state-title" style={{ color: "#134E4A" }}>No Classes Configured Yet</h3>
              <p className="empty-state-subtitle" style={{ color: "#5EEAD4" }}>Create your first class to start organizing your school structure</p>
              <button onClick={() => { setFormData(EMPTY_CLASS); setShowAddModal(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background: "linear-gradient(135deg,#0F766E,#14B8A6)", boxShadow: "0 6px 20px rgba(13,148,136,0.4)" }}>
                <School size={18} /> Create First Class
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {/* Add Class Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[80] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Create New Class</h2><p className="text-sm text-[var(--text-muted)]">Configure a new class section</p></div>
                <button onClick={() => setShowAddModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6"><ClassFormFields /></div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <button disabled={isCreating} onClick={handleSaveAdd}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "var(--grad-teal)", boxShadow: "0 4px 14px rgba(15,118,110,0.4)" }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Create Class
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedClass && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDetailsModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[80] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="h-20 rounded-t-2xl" style={{ background: "var(--grad-teal)" }} />
              <div className="px-6 pb-6 -mt-8">
                <div className="flex items-end gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xl border-4 border-[var(--bg-surface)]" style={{ background: "var(--grad-teal)" }}>
                    {selectedClass.grade}-{selectedClass.section}
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Grade {selectedClass.grade}-{selectedClass.section}</h2>
                    <p className="text-sm text-[var(--text-muted)]">Class Details</p>
                  </div>
                  <button onClick={() => setShowDetailsModal(false)} className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Students", value: selectedClass.studentCount || 0 },
                    { label: "Subjects", value: selectedClass.subjects?.length || 0 },
                    { label: "Class Teacher", value: selectedClass.classTeacherId && typeof selectedClass.classTeacherId === 'object' ? selectedClass.classTeacherId.name : "Unassigned" },
                    { label: "Room", value: selectedClass.room || "N/A" },
                    { label: "Capacity", value: selectedClass.capacity || "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[var(--bg-surface-2)] rounded-xl p-3">
                      <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Manage Modal */}
        {showManageModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowManageModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[80] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Manage Class</h2><p className="text-sm text-[var(--text-muted)]">Edit class configuration</p></div>
                <button onClick={() => setShowManageModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6">
                <ClassFormFields />
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowManageModal(false)}>Cancel</Button>
                <button disabled={isUpdating} onClick={handleSaveEdit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "linear-gradient(135deg,#F7971E,#FFD200)", boxShadow: "0 4px 14px rgba(247,151,30,0.4)" }}>
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedClass && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[80] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Remove Class</h2>
                <p className="text-sm text-[var(--text-muted)]">Are you sure you want to remove <strong className="text-[var(--text-primary)]">Grade {selectedClass.grade}-{selectedClass.section}</strong>? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <button disabled={isDeleting} onClick={handleDelete} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50">
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Remove Class
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}