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
} from "lucide-react";
import { PageHeader, Button, Modal } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetAssignmentsQuery, 
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetTeacherClassesQuery 
} from "@school-management/store";

interface Assignment {
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
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY_ASSIGNMENT);

  const filteredAssignments = assignments.filter((a: Assignment) => {
    const matchesSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAdd = () => {
    setFormData({ ...EMPTY_ASSIGNMENT, dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] });
    setShowAddModal(true);
  };

  const handleEdit = (assignment: Assignment) => {
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-card border rounded-xl text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Assignment
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredAssignments.length > 0 ? (
        <div className="space-y-4">
          {filteredAssignments.map((assignment: Assignment, index: number) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-6 border hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      assignment.status === "active" && "bg-green-500/10 text-green-500",
                      assignment.status === "closed" && "bg-gray-500/10 text-gray-500",
                      assignment.status === "draft" && "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {assignment.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {assignment.classId?.name} • {assignment.subject}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{assignment.description}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{assignment.submissions || 0}/{assignment.totalStudents || 0}</div>
                    <div className="text-xs text-muted-foreground">Submissions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{assignment.totalMarks}</div>
                    <div className="text-xs text-muted-foreground">Marks</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Due Date</div>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEdit(assignment)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(assignment._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-red-500"
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
        <div className="text-center py-12 bg-card rounded-xl border">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No assignments found</p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card rounded-2xl w-full max-w-lg p-6 border"
          >
            <h2 className="text-lg font-bold mb-4">Add New Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm h-24"
                  placeholder="Assignment description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  >
                    <option value="">Select class</option>
                    {classes.map((c: any) => (
                      <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                    placeholder="Subject"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 100 }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
              <Button className="flex-1 gap-2" onClick={handleSaveAdd} disabled={isCreating}>
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card rounded-2xl w-full max-w-lg p-6 border"
          >
            <h2 className="text-lg font-bold mb-4">Edit Assignment</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Class *</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  >
                    <option value="">Select class</option>
                    {classes.map((c: any) => (
                      <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button className="flex-1 gap-2" onClick={handleSaveEdit} disabled={isUpdating}>
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