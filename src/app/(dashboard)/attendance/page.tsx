"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import { useGetAttendanceStatsQuery } from "@school-management/store";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AttendancePage() {
  const { data: statsData, isLoading } = useGetAttendanceStatsQuery();
  const [selectedMonth] = useState("April 2026");

  const stats = statsData || {};
  const distribution = stats.distribution || { present: 0, absent: 0, late: 0, excused: 0 };
  const trend = stats.trend || [];
  const total = stats.totalStudents || 1;

  const presentToday = total > 0 ? ((distribution.present / total) * 100).toFixed(1) : "0.0";

  const PIE_DATA = [
    { name: "Present", value: distribution.present, color: "#10B981" },
    { name: "Absent", value: distribution.absent, color: "#EF4444" },
    { name: "Late", value: distribution.late, color: "#F59E0B" },
    { name: "Excused", value: distribution.excused, color: "#3B82F6" },
  ];

  const statCards = [
    {
      label: "PRESENT TODAY",
      value: `${presentToday}%`,
      trend: "Based on total students",
      positive: true,
      gradient: "linear-gradient(180deg, #10B981, #34D399)",
      textGradient: "linear-gradient(180deg, #059669, #10B981)",
    },
    {
      label: "ABSENT",
      value: distribution.absent.toString(),
      trend: "Current day count",
      positive: false,
      gradient: "linear-gradient(180deg, #EF4444, #F87171)",
      textGradient: "linear-gradient(180deg, #DC2626, #EF4444)",
    },
    {
      label: "LATE ARRIVALS",
      value: distribution.late.toString(),
      trend: "Requires monitoring",
      positive: false,
      gradient: "linear-gradient(180deg, #F59E0B, #FCD34D)",
      textGradient: "linear-gradient(180deg, #D97706, #F59E0B)",
    },
  ];

  return (
    <div className="space-y-6 max-w-full">
      <div className="page-header-card header-gradient-indigo">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Attendance Insights</h1>
            <div className="page-header-underline" />
            <p className="page-header-subtitle">Track student presence and analyze attendance patterns</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition-all">
              <Calendar size={18} />
              {selectedMonth}
            </button>
            <Button className="gap-2 h-10 px-5 rounded-xl bg-white text-indigo-700 font-bold">
              <FileText size={18} />
              Detailed Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="stat-card"
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ background: card.gradient }}
            />
            <div className="flex justify-between items-start mb-3 ml-3">
              <span className="stat-card-label">{card.label}</span>
            </div>
            <div className="stat-card-value ml-3" style={{ background: card.textGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {card.value}
            </div>
            <div className={cn("trend-pill ml-3", card.positive ? "positive" : "warning")}>
              {card.trend}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 chart-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">Weekly Attendance Trend</h3>
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-indigo-500" />
                Present
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-red-500" />
                Absent
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>
                  <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#F87171" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-surface-2)' }}
                  contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(99,102,241,0.15)', padding: '10px', backgroundColor: 'var(--bg-surface)' }}
                />
                <Bar dataKey="present" fill="url(#presentGrad)" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="absent" fill="url(#absentGrad)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-5">
          <div className="chart-card p-6">
            <h3 className="section-title mb-5">Today's Distribution</h3>
            <div className="h-44 relative mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PIE_DATA} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-2xl font-extrabold text-[var(--text-primary)] leading-none">{total}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Total</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {PIE_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-[var(--text-secondary)]">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card p-6">
            <h3 className="section-title mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              Attention Needed
            </h3>
            <div className="space-y-2">
              {stats.lowAttendanceClasses?.length > 0 ? stats.lowAttendanceClasses.map((c: any) => (
                <div
                  key={c.class}
                  className={cn(
                    "p-3 rounded-xl flex items-center gap-3",
                    c.status === "critical" ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    c.status === "critical" ? "bg-red-100 text-red-500" : "bg-amber-100 text-amber-500"
                  )}>
                    {c.status === "critical" ? <XCircle size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{c.class}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">Avg: {c.rate}%</div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    c.status === "critical" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {c.status}
                  </span>
                </div>
              )) : (
                <div className="py-8 text-center text-xs text-[var(--text-muted)] italic">
                  No classes currently below target.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}