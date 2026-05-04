"use client";

import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Download,
  Trash2,
  Edit2,
  Eye,
  Users2,
  X,
  Save,
  Phone,
  Hash,
  UserCheck,
  Calendar,
  Loader2
} from "lucide-react";
import {
  Button,
  StatusBadge,
  UserAvatar
} from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";

import {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetClassesQuery,
  useGetAdminStatsQuery
} from "@school-management/store";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { useDebounce } from "@school-management/utils/hooks";

import { ModalStudent } from "./types";
import { AddStudentModal } from "./components/AddStudentModal";
import { EditStudentModal } from "./components/EditStudentModal";

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [classFilter, setClassFilter] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Queries
  const { data, isLoading } = useGetStudentsQuery({
    search: debouncedSearch || undefined,
    classId: classFilter || undefined
  });
  const { data: classesData } = useGetClassesQuery();
  const { data: stats } = useGetAdminStatsQuery();

  // Mutations
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();

  const students = data?.students || [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ModalStudent | null>(null);

  const statCards = [
    { label: "TOTAL STUDENTS", value: stats?.totalStudents?.toString() || students.length.toString(), trend: "Real-time count", positive: true, gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)" },
    { label: "ACTIVE", value: students.filter(s => s.status === "active").length.toString(), trend: "Current status", positive: true, gradient: "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)" },
    { label: "CLASSES", value: stats?.classes?.toString() || "0", trend: "Active sections", positive: true, gradient: "linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)" },
    { label: "INACTIVE", value: students.filter(s => s.status !== "active").length.toString(), trend: "Needs review", positive: false, gradient: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)" },
  ];

  const handleAdd = () => { setShowAddModal(true); };
  const handleEdit = (s: any) => {
    setSelectedStudent(s);
    setShowEditModal(true);
  };
  const handleView = (s: any) => { setSelectedStudent(s); setShowViewModal(true); };
  const handleDeleteConfirm = (s: any) => { setSelectedStudent(s); setShowDeleteModal(true); };


  const handleDelete = async () => {
    if (!selectedStudent?._id) return;
    try {
      await deleteStudent(selectedStudent._id).unwrap();
      toast.success(`Student removed.`);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to remove student");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );


  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-indigo">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Students Management</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Manage student records, admissions and academic profiles</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Download size={18} /> Export
            </button>
            <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#4C1D95] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Add Student
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
            <div className={cn("trend-pill", card.positive ? "positive" : "negative")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="premium-table-container">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search by name or roll number..."
                className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className={cn("gap-2 h-10 px-5", showFilters && "bg-[var(--primary)] text-white border-[var(--primary)]")}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={15} /> Filter
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 flex flex-wrap gap-4 items-end">
                  <div className="space-y-1.5 flex-1 min-w-[200px]">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Filter by Class</label>
                    <select
                      value={classFilter}
                      onChange={e => setClassFilter(e.target.value)}
                      className="w-full h-10 px-4 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
                    >
                      <option value="">All Classes</option>
                      {classesData?.map((cls: any) => (
                        <option key={cls._id} value={cls._id}>Class {cls.grade}-{cls.section}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 text-xs"
                    onClick={() => { setClassFilter(""); setShowFilters(false); }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="table-header">
              <tr>
                <th className="table-th">Student</th>
                <th className="table-th">Roll No</th>
                <th className="table-th">Class</th>
                <th className="table-th">Parent</th>
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
              ) : students.length > 0 ? (
                students.map((student, index) => (
                  <motion.tr key={student._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="table-tr">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={student.name} size="sm" />
                        <div>
                          <div className="font-medium text-[var(--text-primary)]">{student.name}</div>
                          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" />{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="font-mono text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded">{student.rollNumber}</span>
                    </td>
                    <td className="table-td text-[var(--text-secondary)]">
                      {typeof student.classId === "object" && student.classId !== null
                        ? `Class ${(student.classId as any).grade}-${(student.classId as any).section}`
                        : (student.classId || "Unassigned")}
                    </td>
                    <td className="table-td text-[var(--text-secondary)]">{student.parentName}</td>
                    <td className="table-td"><StatusBadge status={student.status || "active"} /></td>
                    <td className="table-td">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleView(student)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)] transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleEdit(student)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-amber-600 transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteConfirm(student)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)] hover:text-red-600 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="empty-state">
                      <div className="empty-state-icon"><Users2 size={36} color="#6366F1" /></div>
                      <h3 className="empty-state-title">No students yet</h3>
                      <p className="empty-state-subtitle">Add your first student to get started.</p>
                      <Button onClick={handleAdd} className="gap-2"><Plus size={15} /> Add Student</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-[var(--text-muted)]">Showing <span className="font-medium text-[var(--text-primary)]">{students.length}</span> of <span className="font-medium text-[var(--text-primary)]">{data?.total || students.length}</span> students</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            classesData={classesData || []}
          />
        )}

        {showEditModal && (
          <EditStudentModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            classesData={classesData || []}
            student={selectedStudent}
          />
        )}

        {showViewModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowViewModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="h-24 rounded-t-2xl" style={{ background: "var(--grad-indigo)" }} />
              <div className="px-6 pb-6 -mt-10">
                <div className="flex items-end gap-4 mb-5">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl border-4 border-[var(--bg-surface)]" style={{ background: "var(--grad-primary)" }}>
                    {selectedStudent.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) || "??"}
                  </div>
                  <div className="pb-1">
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{selectedStudent.name}</h2>
                    <p className="text-sm text-[var(--text-muted)]">Roll No: {selectedStudent.rollNumber}</p>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="ml-auto w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Email", value: selectedStudent.email },
                    { label: "Parent", value: selectedStudent.parentName },
                    { label: "Class", value: selectedStudent.classId && typeof selectedStudent.classId === 'object' ? `Class ${selectedStudent.classId?.grade}-${selectedStudent.classId?.section}` : "N/A" },
                    { label: "Status", value: selectedStudent.status || "Active" },
                    { label: "Parent Phone", value: selectedStudent.parentPhone || "N/A" },
                    { label: "DOB", value: selectedStudent.dob || "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[var(--bg-surface-2)] rounded-xl p-3">
                      <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</div>
                      <div className="text-sm font-semibold text-[var(--text-primary)] capitalize">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Remove Student</h2>
                <p className="text-sm text-[var(--text-muted)]">Are you sure you want to remove <strong className="text-[var(--text-primary)]">{selectedStudent.name}</strong>? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <button disabled={isDeleting} onClick={handleDelete} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50">
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Remove Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}