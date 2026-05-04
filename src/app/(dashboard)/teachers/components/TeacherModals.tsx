"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@school-management/ui";
import { Save, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { 
  useCreateTeacherMutation, 
  useUpdateTeacherMutation,
  useGetSubjectsQuery 
} from "@school-management/store";

interface ModalTeacher {
  _id?: string;
  name: string;
  email: string;
  employeeId: string;
  password?: string;
  phone: string;
  qualification: string;
  subjects: string[];
  experience: number;
  joinDate: string;
  address: string;
}

const EMPTY_TEACHER: ModalTeacher = {
  name: "",
  email: "",
  employeeId: "",
  password: "",
  phone: "",
  qualification: "",
  subjects: [],
  experience: 0,
  joinDate: "",
  address: "",
};

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTeacherModal({ isOpen, onClose }: AddTeacherModalProps) {
  const [formData, setFormData] = useState<ModalTeacher>(EMPTY_TEACHER);
  const { data: subjects = [] } = useGetSubjectsQuery();
  const [createTeacher, { isLoading }] = useCreateTeacherMutation();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.employeeId) {
      toast.error("Please fill all required fields (Name, Email, ID, Phone, Password)");
      return;
    }
    try {
      await createTeacher(formData).unwrap();
      toast.success("Teacher added successfully!");
      onClose();
      setFormData(EMPTY_TEACHER);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to add teacher");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Teacher" size="lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter full name"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@school.edu"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Initial Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Employee ID *</label>
          <input
            type="text"
            value={formData.employeeId}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
            placeholder="EMP-2026-001"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Qualification</label>
          <input
            type="text"
            value={formData.qualification}
            onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
            placeholder="M.Sc, B.Ed"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Experience (Years)</label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Join Date</label>
          <input
            type="date"
            value={formData.joinDate}
            onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Subjects</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s: any) => (
              <button
                key={s._id}
                type="button"
                onClick={() => {
                  const newSubjects = formData.subjects.includes(s._id)
                    ? formData.subjects.filter((id: string) => id !== s._id)
                    : [...formData.subjects, s._id];
                  setFormData(prev => ({ ...prev, subjects: newSubjects }));
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  formData.subjects.includes(s._id)
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-[var(--bg-surface-2)] text-[var(--text-muted)] border-[var(--border)] hover:border-indigo-500"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Full address"
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: "var(--grad-secondary)" }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Add Teacher
        </button>
      </div>
    </Modal>
  );
}

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: ModalTeacher | null;
}

export function EditTeacherModal({ isOpen, onClose, teacher }: EditTeacherModalProps) {
  const [formData, setFormData] = useState<ModalTeacher>(teacher || EMPTY_TEACHER);
  const { data: subjects = [] } = useGetSubjectsQuery();
  const [updateTeacher, { isLoading }] = useUpdateTeacherMutation();

  useState(() => {
    if (teacher) {
      setFormData(teacher);
    }
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !teacher?._id) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await updateTeacher({ id: teacher._id, body: formData }).unwrap();
      toast.success("Teacher updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update teacher");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Teacher" size="lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Qualification</label>
          <input
            type="text"
            value={formData.qualification}
            onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Experience (Years)</label>
          <input
            type="number"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Join Date</label>
          <input
            type="date"
            value={formData.joinDate?.split('T')[0] || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
          style={{ background: "var(--grad-secondary)" }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
        </button>
      </div>
    </Modal>
  );
}