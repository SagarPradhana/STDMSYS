"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  Users,
  GraduationCap,
  Building2,
  CreditCard,
  ClipboardCheck,
  Bell,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  Loader2
} from "lucide-react";

import { useGetAdminStatsQuery } from "@school-management/store";
import { cn } from "@school-management/utils";
import { Button } from "@school-management/ui";

const gradPrimary = "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)";
const gradInfo = "linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)";
const gradSecondary = "linear-gradient(135deg, #A78BFA 0%, #6366F1 100%)";
const gradGold = "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)";
const gradSuccess = "linear-gradient(135deg, #11998E 0%, #38EF7D 100%)";
const gradWarning = "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const statCardData = [
    { label: "Total Students", value: stats?.totalStudents || 0, trend: "+12%", positive: true, icon: Users, gradient: gradPrimary },
    { label: "Total Teachers", value: stats?.totalTeachers || 0, trend: "+5%", positive: true, icon: GraduationCap, gradient: gradInfo },
    { label: "Classes", value: stats?.classes || 0, trend: "+3%", positive: true, icon: Building2, gradient: gradSecondary },
    { label: "Fee Collection", value: `$${(stats?.feeCollection || 0).toLocaleString()}`, trend: "+18%", positive: true, icon: CreditCard, gradient: gradGold },
    { label: "Attendance", value: `${stats?.attendanceToday || 0}%`, trend: "+2%", positive: true, icon: ClipboardCheck, gradient: gradSuccess },
    { label: "Active Notices", value: stats?.activeNotices || 0, trend: "Current active", positive: true, icon: Bell, gradient: gradWarning },
  ];

  const enrollmentData = stats?.enrollmentTrend || [];
  const feeData = stats?.feeTrend || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full page-background">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 relative z-10">
        {statCardData.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="stat-card"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="stat-card-label">{card.label}</span>
                <div
                  className="icon-box"
                  style={{ background: card.gradient }}
                >
                  <Icon size={18} color="white" />
                </div>
              </div>
              <div className="stat-card-value">
                {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
              </div>
              <div className={cn("trend-pill", card.positive ? "positive" : "negative")}>
                {card.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {card.trend} vs last month
              </div>
              <div
                className="stat-card-accent"
                style={{ background: card.gradient }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">Student Enrollment</h3>
            <div className="time-filter">
              {["6M", "1Y", "All"].map((pill) => (
                <button
                  key={pill}
                  className={cn(
                    "time-filter-pill",
                    pill === "6M" ? "active" : ""
                  )}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(99,102,241,0.15)', background: 'var(--bg-surface)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#enrollGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title">Fee Collection</h3>
            <div className="time-filter">
              {["6M", "1Y", "All"].map((pill) => (
                <button
                  key={pill}
                  className={cn(
                    "time-filter-pill",
                    pill === "6M" ? "active" : ""
                  )}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData} barGap={4} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="feeCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  cursor={{ fill: 'rgba(99,102,241,0.03)' }}
                  contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(99,102,241,0.15)', background: 'var(--bg-surface)' }}
                />
                <Bar dataKey="collected" fill="url(#feeCollected)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" fill="var(--bg-surface-3)" stroke="var(--border-strong)" strokeDasharray="4 2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-5 mt-3 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Collected
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm border border-dashed border-[var(--border-strong)]" />
              Target
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card-static p-6 relative z-10"
      >
        <h3 className="section-title mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href="/students">
            <Button className="gap-2 h-11 px-5 rounded-xl" style={{ background: gradPrimary, boxShadow: '0 4px 14px rgba(102, 126, 234, 0.45)' }}>
              <Plus size={15} />
              Add Student
            </Button>
          </Link>
          <Link href="/teachers">
            <Button className="gap-2 h-11 px-5 rounded-xl btn-gradient-info">
              <GraduationCap size={15} />
              Add Teacher
            </Button>
          </Link>
          <Link href="/notices">
            <Button className="gap-2 h-11 px-5 rounded-xl btn-gradient-warning">
              <Bell size={15} />
              Post Notice
            </Button>
          </Link>
          <Link href="/reports">
            <Button className="gap-2 h-11 px-5 rounded-xl btn-gradient-gold">
              <FileText size={15} />
              Generate Report
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}