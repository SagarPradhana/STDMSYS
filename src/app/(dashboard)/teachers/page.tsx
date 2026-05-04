"use client";

import React, { useState } from "react";
import { 
  Search, Plus, Mail, Phone, GraduationCap, 
  BookOpen, Award, MoreVertical, Edit2, Trash2, 
  Eye, Filter, Download, X, Save, Loader2, 
  Users2, ChevronRight, Calendar, MapPin, 
  CheckCircle2, Clock, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, StatusBadge, UserAvatar } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useDebounce } from "@school-management/utils/hooks";
import toast from "react-hot-toast";
import { 
  useGetTeachersQuery, 
  useCreateTeacherMutation, 
  useUpdateTeacherMutation, 
  useDeleteTeacherMutation,
  useGetAdminStatsQuery
} from "@school-management/store";
import { AddTeacherModal, EditTeacherModal } from "./components/TeacherModals";

interface ModalTeacher {
  _id?: string;
  name: string;
  email: string;
  employeeId: string;
  subjects: string[];
  qualification: string;
  phone?: string;
  status: "active" | "inactive" | "on-leave" | "new";
}

const EMPTY_TEACHER: ModalTeacher = {
  name: "", email: "", employeeId: "", subjects: [], qualification: "", phone: "", status: "active"
};

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Queries
  const { data: teachers = [], isLoading } = useGetTeachersQuery();
  const { data: stats } = useGetAdminStatsQuery();
  
  // Mutations
  const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
  const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
  const [deleteTeacher, { isLoading: isDeleting }] = useDeleteTeacherMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [formData, setFormData] = useState<ModalTeacher>(EMPTY_TEACHER);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    teacher.employeeId?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (teacher.subjects && Array.isArray(teacher.subjects) && teacher.subjects.some(s => 
      typeof s === 'string' && s.toLowerCase().includes(debouncedSearch.toLowerCase())
    ))
  );

  const statCards = [
    { label: "Total Faculty", value: stats?.totalTeachers?.toString() || teachers.length.toString(), trend: "Across all departments", gradient: "linear-gradient(135deg,#667EEA 0%,#764BA2 100%)", positive: true },
    { label: "Active Teachers", value: teachers.filter(t => t.status === "active").length.toString(), trend: "Currently on campus", gradient: "linear-gradient(135deg,#4FACFE 0%,#00F2FE 100%)", positive: true },
    { label: "On Leave", value: teachers.filter(t => t.status === "on-leave").length.toString(), trend: "Returning soon", gradient: "linear-gradient(135deg,#F7971E 0%,#FFD200 100%)", positive: false },
    { label: "Inactive", value: teachers.filter(t => t.status === "inactive").length.toString(), trend: "Archived records", gradient: "linear-gradient(135deg,#F093FB 0%,#F5576C 100%)", positive: false },
  ];

  const handleAdd = () => { setShowAddModal(true); };
  const handleEdit = (t: any) => { setFormData(t); setShowEditModal(true); };
  const handleView = (t: any) => { setSelectedTeacher(t); setShowViewModal(true); };
  const handleDeleteConfirm = (t: any) => { setSelectedTeacher(t); setShowDeleteModal(true); };

  const handleDelete = async () => {
    if (!selectedTeacher?._id) return;
    try {
      await deleteTeacher(selectedTeacher._id).unwrap();
      toast.success(`Teacher removed.`);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to remove teacher");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
      onClick={onClose}
    />
  );

  return (
    <div className="space-y-6 max-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-purple">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty Management</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Manage faculty members, departments and professional records</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Download size={18} /> Export
            </button>
            <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#7C3AED] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Add Teacher
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card group">
            <div className="flex justify-between items-start mb-3">
              <span className="stat-card-label">{card.label}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="premium-table-container">
        <div className="p-4 flex flex-col sm:flex-row items-center gap-3 border-b border-[var(--border)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input type="text" placeholder="Search by name, ID or subject..."
              className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-2 h-9 shrink-0"><Filter size={15} /> Filter</Button>
            <select className="h-9 px-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-secondary)] outline-none cursor-pointer">
              <option>All Departments</option>
              <option>Science</option><option>Arts</option><option>Commerce</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-header">
              <tr>
                <th className="table-th">Faculty Member</th>
                <th className="table-th">Employee ID</th>
                <th className="table-th">Primary Subject</th>
                <th className="table-th">Qualification</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-[var(--border)]">
                    <td className="p-4" colSpan={6}><div className="h-10 bg-[var(--bg-surface-2)] rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <motion.tr key={teacher._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="table-tr">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={teacher.name} size="sm" />
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{teacher.name}</div>
                          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />{teacher.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{teacher.employeeId}</span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                        <span className="text-sm font-medium text-[var(--text-secondary)]">{teacher.subjects && teacher.subjects.length > 0 ? teacher.subjects.join(", ") : "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="table-td text-[var(--text-muted)] text-sm">{teacher.qualification || "—"}</td>
                    <td className="table-td"><StatusBadge status={teacher.status || "active"} /></td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(teacher)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(teacher)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-amber-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteConfirm(teacher)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon"><Users2 size={36} color="#6366F1" /></div>
                      <h3 className="empty-state-title">No faculty found</h3>
                      <p className="empty-state-subtitle">Add your first teacher to get started.</p>
                      <Button onClick={handleAdd} className="gap-2"><Plus size={15} /> Add Teacher</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-[var(--text-muted)]">Displaying <span className="font-medium text-[var(--text-primary)]">{filteredTeachers.length}</span> of {teachers.length} faculty members</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <AddTeacherModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      {showEditModal && (
        <EditTeacherModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          teacher={formData as any} 
        />
      )}

      <AnimatePresence>
        {/* View Modal */}
        {showViewModal && selectedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowViewModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
                <button onClick={() => setShowViewModal(false)} className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"><X className="w-4 h-4" /></button>
                <div className="absolute -bottom-10 left-6">
                  <UserAvatar name={selectedTeacher.name} size="lg" className="ring-4 ring-[var(--bg-surface)]" />
                </div>
              </div>
              <div className="pt-14 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedTeacher.name}</h2>
                  <p className="text-sm text-[var(--text-muted)] font-medium">{selectedTeacher.employeeId}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)]">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Primary Subject</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{selectedTeacher.subjects?.join(", ") || "—"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)]">
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Status</p>
                    <StatusBadge status={selectedTeacher.status || "active"} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><Mail className="w-4 h-4 text-indigo-500" /><span className="text-[var(--text-secondary)]">{selectedTeacher.email}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Phone className="w-4 h-4 text-emerald-500" /><span className="text-[var(--text-secondary)]">{selectedTeacher.phone || "—"}</span></div>
                  <div className="flex items-center gap-3 text-sm"><GraduationCap className="w-4 h-4 text-amber-500" /><span className="text-[var(--text-secondary)]">{selectedTeacher.qualification || "—"}</span></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedTeacher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Remove Faculty Member?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">Are you sure you want to remove <span className="font-semibold text-[var(--text-primary)]">{selectedTeacher.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Remove"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
