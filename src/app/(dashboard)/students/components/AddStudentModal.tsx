import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Users, Mail, Hash, UserCheck, Phone, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@school-management/ui';
import toast from 'react-hot-toast';
import { useCreateStudentMutation } from '@school-management/store';
import { ModalStudent, EMPTY_STUDENT } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classesData: any[];
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, classesData }) => {
  const [formData, setFormData] = useState<ModalStudent>(EMPTY_STUDENT);
  const [createStudent, { isLoading: isCreating }] = useCreateStudentMutation();

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.email || !formData.rollNumber || !formData.classId) {
      toast.error("Name, Email, Roll Number and Class are required");
      return;
    }
    try {
      await createStudent(formData).unwrap();
      toast.success(`Student "${formData.name}" admitted successfully!`);
      // Reset form
      setFormData(EMPTY_STUDENT);
      onClose();
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to admit student");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--border)]" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-[var(--bg-surface)] z-10 flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Admit New Student</h2><p className="text-sm text-[var(--text-muted)]">Fill in the student details below</p></div>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Alex Johnson", icon: Users },
              { label: "Email Address", field: "email", type: "email", placeholder: "student@school.edu", icon: Mail },
              { label: "Initial Password", field: "password", type: "password", placeholder: "Minimum 6 chars", icon: Save },
              { label: "Roll Number", field: "rollNumber", type: "text", placeholder: "e.g. ROL-2026-001", icon: Hash },
              { label: "Parent Name", field: "parentName", type: "text", placeholder: "e.g. Mr. Robert Johnson", icon: UserCheck },
              { label: "Parent Phone", field: "parentPhone", type: "tel", placeholder: "+91 98765 43210", icon: Phone },
              { label: "Date of Birth", field: "dob", type: "date", placeholder: "", icon: Calendar },
            ].map(({ label, field, type, placeholder, icon: Icon }) => (
              <div key={field} className="space-y-1.5">
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
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Class</label>
              <select value={formData.classId || ""} onChange={e => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                <option value="">Select Class</option>
                {classesData?.map((cls: any) => (
                  <option key={cls._id} value={cls._id}>Class {cls.grade}-{cls.section}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Status</label>
              <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on-leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-[var(--bg-surface)] p-6 border-t border-[var(--border)] flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <button disabled={isCreating} onClick={handleSaveAdd} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-button)" }}>
            {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Admit Student
          </button>
        </div>
      </motion.div>
    </div>
  );
};
