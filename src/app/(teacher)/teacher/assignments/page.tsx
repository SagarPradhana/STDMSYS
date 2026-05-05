"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  Send,
  ArrowRight,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetAssignmentsQuery, 
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetTeacherClassesQuery 
} from "@school-management/store";

interface TeacherAssignment {
  _id: string;
  title: string;
  description: string;
  classId: { _id: string; name: string };
  subject: string;
  dueDate: string;
  totalMarks: number;
  status: "active" | "closed" | "draft";
  submissions: number;
  totalStudents: number;
}

const EMPTY_ASSIGNMENT = {
  title: "",
  description: "",
  classId: "",
  subject: "",
  dueDate: "",
  totalMarks: 100,
  status: "active" as const,
};

const statusColors = {
  active: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white",
  closed: "bg-gradient-to-r from-slate-400 to-slate-500 text-white",
  draft: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
};

const statusBadge = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function TeacherAssignmentsPage() {
  const { data: assignments = [], isLoading } = useGetAssignmentsQuery();
  const { data: classes = [] } = useGetTeacherClassesQuery();
  
  const [createAssignment, { isLoading: isCreating }] = useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();
  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY_ASSIGNMENT);

  const filteredAssignments = (assignments || []).filter((a: any) => {
    const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({ ...EMPTY_ASSIGNMENT, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] });
    setShowAddModal(true);
  };

  const handleEdit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      classId: assignment.classId?._id,
      subject: assignment.subject,
      dueDate: assignment.dueDate?.split("T")[0],
      totalMarks: assignment.totalMarks,
      status: assignment.status,
    });
    setShowEditModal(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.title || !formData.classId || !formData.subject) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await createAssignment(formData).unwrap();
      toast.success("Assignment created!");
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create");
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedAssignment?._id) return;
    try {
      await updateAssignment({ id: selectedAssignment._id, body: formData }).unwrap();
      toast.success("Assignment updated!");
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssignment(id).unwrap();
      toast.success("Assignment deleted!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Assignments" 
        subtitle="Create and manage assignments for your classes"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search assignments by title or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <Button 
            onClick={handleAdd} 
            className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
          >
            <Plus className="w-4 h-4" /> 
            <span className="font-semibold">Add Assignment</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment: any, index: number) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group bg-white rounded-2xl p-5 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      statusBadge[assignment.status as keyof typeof statusBadge]
                    )}>
                      {assignment.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-violet-500" />
                      {assignment.classId?.name}
                      <span className="text-slate-300">•</span>
                      {assignment.subject}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-violet-700 transition-colors">{assignment.title}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 max-w-xl">{assignment.description}</p>
                </div>

                <div className="flex items-center gap-6 lg:border-l lg:border-slate-200 lg:pl-6">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-slate-800">{assignment.submissions || 0}/{assignment.totalStudents || 0}</div>
                    <div className="text-xs text-slate-500 font-medium">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-violet-600">{assignment.totalMarks}</div>
                    <div className="text-xs text-slate-500 font-medium">Marks</div>
                  </div>
                  <div className="text-center min-w-[100px]">
                    <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(assignment.dueDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">Due Date</div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(assignment)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(assignment._id)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">No Assignments Found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">Create your first assignment to get started</p>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Create Assignment
          </Button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200/60 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Add New Assignment</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all h-28 resize-none"
                  placeholder="Assignment description and instructions..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Class <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, classId: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  >
                    <option value="">Select class</option>
                    {classes.map((c: any) => (
                      <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Subject <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    placeholder="e.g. Mathematics"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, totalMarks: parseInt(e.target.value) || 100 }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 gap-2 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                onClick={handleSaveAdd} 
                disabled={isCreating}
              >
                {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Assignment
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl w-full max-w-lg p-6 border border-slate-200/60 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <Edit2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Edit Assignment</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Title <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all h-28 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Class <span className="text-rose-500">*</span></label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, classId: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  >
                    <option value="">Select class</option>
                    {classes.map((c: any) => (
                      <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 border-slate-200 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 gap-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25"
                onClick={handleSaveEdit} 
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}