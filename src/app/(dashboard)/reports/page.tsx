"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  Users,
  GraduationCap,
  CreditCard,
  PieChart as PieChartIcon,
  ChevronRight,
  Filter,
  Calendar,
  Search,
  X,
  CheckCircle2
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { useGetAdminStatsQuery } from "@school-management/store";

const savedReports: any[] = [];

export default function ReportsPage() {
  const { data: statsData } = useGetAdminStatsQuery();
  const [loading, setLoading] = useState(true);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderForm, setBuilderForm] = useState({ type: "Academic Performance", format: "PDF", dateRange: "This Month", includeCharts: true });

  const reportCategories = [
    { id: "academic", title: "Academic Performance", description: "Detailed analysis of student grades, class averages and pass rates", icon: GraduationCap, gradient: "linear-gradient(135deg,#667EEA,#764BA2)", stats: "Core Curriculum" },
    { id: "financial", title: "Financial Overview", description: "Revenue collection, pending dues and expense tracking reports", icon: CreditCard, gradient: "linear-gradient(135deg,#11998E,#38EF7D)", stats: `$${(statsData?.feeCollection || 0).toLocaleString()} collected` },
    { id: "attendance", title: "Attendance Analysis", description: "Student and staff attendance patterns, chronic absenteeism reports", icon: TrendingUp, gradient: "linear-gradient(135deg,#F7971E,#FFD200)", stats: `${statsData?.attendanceToday || 0}% avg. rate` },
    { id: "demographic", title: "Student Demographics", description: "Enrollment trends, gender distribution and regional data", icon: Users, gradient: "linear-gradient(135deg,#F093FB,#F5576C)", stats: `${statsData?.totalStudents || 0} students` },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-purple">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Institutional Reports</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Generate comprehensive data insights, performance metrics and financial summaries</p>
          </div>
          <button onClick={() => setShowBuilderModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#7C3AED] font-bold text-sm shadow-lg hover:translate-y-[-2px] transition-all self-start sm:self-auto">
            <BarChart3 size={18} /> Custom Report Builder
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "REPORTS GENERATED", value: "0", gradient: "linear-gradient(135deg,#667EEA,#764BA2)", positive: true, trend: "This academic year" },
          { label: "PENDING REPORTS", value: "0", gradient: "linear-gradient(135deg,#F093FB,#F5576C)", positive: false, trend: "Awaiting approval" },
          { label: "DATA CATEGORIES", value: "4", gradient: "linear-gradient(135deg,#4FACFE,#00F2FE)", positive: true, trend: "Academic, Financial & more" },
          { label: "LAST GENERATED", value: "N/A", gradient: "linear-gradient(135deg,#11998E,#38EF7D)", positive: true, trend: "No recent activity" },
        ].map((card, idx) => (
          <div key={idx} className="stat-card group">
            <span className="stat-card-label">{card.label}</span>
            <div className="stat-card-value mt-2">{card.value}</div>
            <div className={cn("trend-pill", card.positive ? "positive" : "warning")}>{card.trend}</div>
            <div className="stat-card-accent" style={{ background: card.gradient }} />
          </div>
        ))}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {reportCategories.map((cat, index) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
            className="card group cursor-pointer hover:shadow-xl transition-all overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: cat.gradient }} />
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg" style={{ background: cat.gradient }}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base mb-2 text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">{cat.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">{cat.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{cat.stats}</span>
                <button onClick={() => toast.success(`Generating ${cat.title} report...`)}
                  className="text-[10px] font-bold text-[var(--primary)] flex items-center gap-1 hover:gap-2 transition-all">
                  Generate <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Preview */}
        <div className="lg:col-span-2 chart-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Academic Trend 2025-26</h3>
              <p className="text-xs text-[var(--text-muted)]">Average grade distribution across all classes</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors"><TrendingUp className="w-4 h-4 text-[var(--primary)]" /></button>
              <button className="p-2 hover:bg-[var(--bg-surface-2)] rounded-lg transition-colors"><PieChartIcon className="w-4 h-4 text-[var(--text-muted)]" /></button>
            </div>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
            {[65, 78, 45, 89, 72, 60, 82, 55, 95, 68, 75, 84].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-full rounded-t-lg transition-all group-hover:opacity-80" style={{ height: `${val}%`, background: "linear-gradient(180deg,#6366F1,#818CF8)" }} />
                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">M{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Reports */}
        <div className="card flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-surface-2)]/30 flex items-center justify-between">
            <h3 className="section-title text-sm">Recently Generated</h3>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)]" />
              <input type="text" className="pl-6 pr-3 py-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[10px] text-[var(--text-primary)] outline-none" placeholder="Search..." />
            </div>
          </div>
          <div className="flex-1 divide-y divide-[var(--border)] overflow-y-auto">
            {savedReports.length > 0 ? savedReports.map(report => (
              <div key={report.id} className="p-4 hover:bg-[var(--bg-surface-2)] transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-3)] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">{report.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{report.type} • {report.date}</div>
                    </div>
                  </div>
                  <button onClick={() => toast.success(`Downloading ${report.name}...`)}
                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-[var(--primary)] rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[9px] font-medium text-[var(--text-muted)]">Generated by: {report.author}</div>
              </div>
            )) : (
              <div className="p-10 text-center text-xs text-[var(--text-muted)]">No reports generated yet.</div>
            )}
          </div>
          <div className="p-4 bg-[var(--bg-surface-2)] border-t border-[var(--border)]">
            <Button variant="outline" className="w-full text-xs gap-2 h-10"><Filter className="w-3.5 h-3.5" /> Filter Saved Reports</Button>
          </div>
        </div>
      </div>

      {/* Report Builder Modal */}
      <AnimatePresence>
        {showBuilderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowBuilderModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-lg border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Custom Report Builder</h2><p className="text-sm text-[var(--text-muted)]">Configure and generate your custom report</p></div>
                <button onClick={() => setShowBuilderModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Report Type</label>
                    <select value={builderForm.type} onChange={e => setBuilderForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                      <option>Academic Performance</option>
                      <option>Financial Overview</option>
                      <option>Attendance Analysis</option>
                      <option>Student Demographics</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Export Format</label>
                    <select value={builderForm.format} onChange={e => setBuilderForm(prev => ({ ...prev, format: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                      <option>PDF</option><option>Excel</option><option>CSV</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Date Range</label>
                    <select value={builderForm.dateRange} onChange={e => setBuilderForm(prev => ({ ...prev, dateRange: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10">
                      <option>This Month</option><option>Last Quarter</option><option>This Academic Year</option><option>Custom Range</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[var(--bg-surface-2)] rounded-xl">
                  <button onClick={() => setBuilderForm(prev => ({ ...prev, includeCharts: !prev.includeCharts }))}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", builderForm.includeCharts ? "bg-[var(--primary)]" : "bg-[var(--bg-surface-3)]")}>
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", builderForm.includeCharts ? "translate-x-6" : "translate-x-1")} />
                  </button>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">Include Charts & Graphs</div>
                    <div className="text-xs text-[var(--text-muted)]">Add visual representations to the report</div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowBuilderModal(false)}>Cancel</Button>
                <button onClick={() => { toast.success(`${builderForm.type} report being generated as ${builderForm.format}!`); setShowBuilderModal(false); }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px]" style={{ background: "var(--grad-secondary)", boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
                  <BarChart3 size={16} /> Generate Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
