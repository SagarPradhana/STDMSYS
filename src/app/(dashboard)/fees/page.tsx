"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
  Download,
  Search,
  Filter,
  CheckCircle2,
  ArrowRight,
  X,
  Save,
  User,
  Hash,
  DollarSign,
  Calendar,
  Loader2
} from "lucide-react";
import {
  Button,
  StatusBadge,
  UserAvatar
} from "@school-management/ui";
import { cn } from "@school-management/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { 
  useGetFeesQuery, 
  useGetFeeSummaryQuery, 
  useCollectFeeMutation,
  useGetStudentsQuery
} from "@school-management/store";

export default function FeesPage() {
  const { data: fees = [], isLoading: isLoadingFees } = useGetFeesQuery();
  const { data: summaryData, isLoading: isLoadingSummary } = useGetFeeSummaryQuery();
  const { data: studentsData } = useGetStudentsQuery({});
  const students = studentsData?.students || [];
  const [collectFee, { isLoading: isCollecting }] = useCollectFeeMutation();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ studentId: "", type: "Tuition Fee", amount: "", dueDate: "" });

  const summary = summaryData || { collected: 0, pending: 0, overdue: 0, trend: [] };

  const handleGenerateInvoice = async () => {
    if (!invoiceForm.studentId || !invoiceForm.amount || !invoiceForm.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await collectFee({
        studentId: invoiceForm.studentId,
        amount: Number(invoiceForm.amount),
        type: invoiceForm.type,
        dueDate: invoiceForm.dueDate
      }).unwrap();
      toast.success("Invoice generated and sent!");
      setShowInvoiceModal(false);
      setInvoiceForm({ studentId: "", type: "Tuition Fee", amount: "", dueDate: "" });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to generate invoice");
    }
  };

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer" onClick={onClose} />
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-teal">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Fee Management</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Track revenue, manage student invoices and monitor payment collection</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Download size={18} /> Download Report
            </button>
            <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#0F766E] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all">
              <Plus size={18} /> Generate Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "COLLECTED", value: `$${summary.collected.toLocaleString()}`, sub: "Total collected this month", gradient: "linear-gradient(135deg,#11998E,#38EF7D)", icon: TrendingUp },
          { label: "PENDING", value: `$${summary.pending.toLocaleString()}`, sub: "Awaiting payment", gradient: "linear-gradient(135deg,#F7971E,#FFD200)", icon: Clock },
          { label: "OVERDUE", value: `$${summary.overdue.toLocaleString()}`, sub: "Requires immediate action", gradient: "linear-gradient(135deg,#F093FB,#F5576C)", icon: AlertCircle },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <div className="flex items-start justify-between mb-3">
              <span className="stat-card-label">{card.label}</span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.gradient }}>
                <card.icon size={16} color="white" />
              </div>
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className="trend-pill neutral mt-1">{card.sub}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="chart-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title">Revenue Collection Trend</h3>
              <select className="text-xs font-bold border border-[var(--border)] bg-[var(--bg-surface-2)] px-3 py-1.5 rounded-lg focus:ring-0 outline-none text-[var(--text-primary)]">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.trend}>
                  <defs>
                    <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} tickFormatter={val => `$${val / 1000}k`} />
                  <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid var(--border)", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", background: "var(--bg-surface)" }} formatter={val => [`$${(val as number).toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="collected" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#feeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="card flex flex-col h-full overflow-hidden min-h-[400px]">
          <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-surface-2)]/30 flex items-center justify-between">
            <h3 className="section-title text-sm">Recent Transactions</h3>
            <button className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoadingFees ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-5 animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-surface-3)]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[var(--bg-surface-3)] rounded w-1/2" />
                    <div className="h-2 bg-[var(--bg-surface-3)] rounded w-1/4" />
                  </div>
                </div>
              ))
            ) : fees.length > 0 ? (
              fees.slice(0, 10).map((fee: any) => (
                <div key={fee._id} className="p-5 hover:bg-[var(--bg-surface-2)] transition-colors border-b border-[var(--border)] last:border-0 group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={fee.studentId?.userId?.name || "Student"} size="xs" />
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">{fee.studentId?.userId?.name || "Student"}</div>
                        <div className="text-[10px] text-[var(--text-muted)] font-medium">{fee.type} • {new Date(fee.dueDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-sm font-black text-[var(--text-primary)]">${fee.amount}</div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <StatusBadge status={fee.status} />
                    <button className="text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors"><ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm text-[var(--text-muted)]">No recent transactions.</div>
            )}
          </div>
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Collections</p>
            <p className="text-lg font-black">${summary.collected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowInvoiceModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Generate Invoice</h2><p className="text-sm text-[var(--text-muted)]">Create a new fee invoice for a student</p></div>
                <button onClick={() => setShowInvoiceModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Select Student</label>
                  <select value={invoiceForm.studentId} onChange={e => setInvoiceForm(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500">
                    <option value="">Select Student</option>
                    {students.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                    ))}
                  </select>
                </div>
                {[
                  { label: "Amount ($)", field: "amount", type: "number", placeholder: "e.g. 1200", icon: DollarSign },
                  { label: "Due Date", field: "dueDate", type: "date", placeholder: "", icon: Calendar },
                ].map(({ label, field, type, placeholder, icon: Icon }) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input type={type} placeholder={placeholder} value={(invoiceForm as any)[field]}
                        onChange={e => setInvoiceForm(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all"
                      />
                    </div>
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Fee Type</label>
                  <select value={invoiceForm.type} onChange={e => setInvoiceForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10">
                    <option>Tuition Fee</option>
                    <option>Exam Fee</option>
                    <option>Library Fee</option>
                    <option>Sports Fee</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>Cancel</Button>
                <button disabled={isCollecting} onClick={handleGenerateInvoice}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px] disabled:opacity-50" style={{ background: "var(--grad-teal)", boxShadow: "0 4px 14px rgba(15,118,110,0.4)" }}>
                  {isCollecting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Generate Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
