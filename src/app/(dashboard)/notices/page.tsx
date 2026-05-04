"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Pin,
  Megaphone,
  Trash2,
  Edit2,
  ArrowRight,
  X,
  Save,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation
} from "@school-management/store";
import { useDebounce } from "@school-management/utils/hooks";

interface NoticeForm {
  title: string;
  content: string;
  targetRole: string;
  priority: "high" | "medium" | "low";
}

const EMPTY_NOTICE: NoticeForm = { title: "", content: "", targetRole: "all", priority: "medium" };

export default function NoticesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  // Queries
  const { data: notices = [], isLoading } = useGetNoticesQuery();
  
  // Mutations
  const [createNotice, { isLoading: isCreating }] = useCreateNoticeMutation();
  const [deleteNotice, { isLoading: isDeleting }] = useDeleteNoticeMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState<NoticeForm>(EMPTY_NOTICE);
  const [deletingNotice, setDeletingNotice] = useState<any>(null);

  const filtered = notices.filter((n: any) =>
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (n.content && n.content.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const handleAdd = () => { setFormData(EMPTY_NOTICE); setShowAddModal(true); };
  const handleDeleteConfirm = (n: any) => { setDeletingNotice(n); setShowDeleteModal(true); };

  const handleSaveAdd = async () => {
    if (!formData.title || !formData.content) { 
      toast.error("Title and content are required"); 
      return; 
    }
    try {
      await createNotice(formData).unwrap();
      toast.success("Notice posted successfully!");
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to post notice");
    }
  };

  const handleDelete = async () => {
    if (!deletingNotice?._id) return;
    try {
      await deleteNotice(deletingNotice._id).unwrap();
      toast.success("Notice removed.");
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to remove notice");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  const NoticeFormFields = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Notice Title</label>
        <input type="text" placeholder="e.g. Annual Sports Meet 2026" value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-all" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Content</label>
        <textarea rows={4} placeholder="Write the notice content here..." value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-all resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Target Audience</label>
          <select value={formData.targetRole} onChange={e => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500">
            <option value="all">All</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Priority</label>
          <select value={formData.priority} onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
            className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-purple">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Notice Board</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Broadcast important announcements and updates to students, teachers and staff</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#7C3AED] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all self-start sm:self-auto">
            <Plus size={18} /> Post Notice
          </button>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL NOTICES", value: notices.length.toString(), gradient: "linear-gradient(135deg,#7C3AED,#A855F7)", positive: true, trend: "All active announcements" },
          { label: "HIGH PRIORITY", value: notices.filter((n: any) => n.priority === "high").length.toString(), gradient: "linear-gradient(135deg,#F093FB,#F5576C)", positive: false, trend: "Requires attention" },
          { label: "TARGET: ALL", value: notices.filter((n: any) => n.targetRole === "all").length.toString(), gradient: "linear-gradient(135deg,#F7971E,#FFD200)", positive: true, trend: "Global notices" },
          { label: "RECENT", value: notices.slice(0, 5).length.toString(), gradient: "linear-gradient(135deg,#4FACFE,#00F2FE)", positive: true, trend: "Latest posts" },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <span className="stat-card-label">{card.label}</span>
            <div className="stat-card-value mt-2">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search announcements..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-10 px-5"><Filter className="w-4 h-4" /> Category</Button>
          <Button variant="outline" className="gap-2 h-10 px-5"><Calendar className="w-4 h-4" /> Date Range</Button>
        </div>
      </div>

      {/* Notice Cards */}
      <div className="grid grid-cols-1 gap-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 card animate-pulse rounded-2xl" />)
        ) : filtered.length > 0 ? (
          filtered.map((notice: any, index: number) => (
            <motion.div key={notice._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
              className={cn("card group relative overflow-hidden border-l-4",
                notice.priority === "high" ? "border-l-rose-500" : notice.priority === "medium" ? "border-l-amber-500" : "border-l-indigo-500")}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                      notice.priority === "high" ? "bg-rose-50 text-rose-600" : notice.priority === "medium" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600")}>
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{notice.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] font-medium mt-0.5">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {notice.publishedBy?.name || "Admin"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(notice.publishedAt || Date.now()).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="bg-[var(--bg-surface-3)] px-2 py-0.5 rounded text-[10px] font-bold uppercase">{notice.targetRole}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDeleteConfirm(notice)} className="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg text-[var(--text-muted)] hover:text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-2">{notice.content}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Priority:</span>
                    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                      notice.priority === "high" ? "bg-rose-100 text-rose-600" : notice.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600")}>
                      {notice.priority}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:gap-2 transition-all">
                    Read Full Notice <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="empty-state">
            <Bell size={48} className="text-[var(--text-muted)] mb-4" />
            <h3 className="text-lg font-bold">No Notices Found</h3>
            <p className="text-sm text-[var(--text-muted)]">Post a notice to see it here.</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowAddModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[70] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-[var(--bg-surface)] z-10 flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Post New Notice</h2><p className="text-sm text-[var(--text-muted)]">Create an announcement for the notice board</p></div>
                <button onClick={() => setShowAddModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6"><NoticeFormFields /></div>
              <div className="sticky bottom-0 bg-[var(--bg-surface)] p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <button disabled={isCreating} onClick={handleSaveAdd} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "var(--grad-secondary)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Post Notice
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showDeleteModal && deletingNotice && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[70] bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Remove Notice</h2>
                <p className="text-sm text-[var(--text-muted)]">Remove <strong className="text-[var(--text-primary)]">"{deletingNotice.title}"</strong> from the board?</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                <button disabled={isDeleting} onClick={handleDelete} className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50">
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
