"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CalendarClock,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  Target,
  MessageSquare,
} from "lucide-react";
import { PageHeader, StatsCard } from "@school-management/ui";
import { useGetTeacherStatsQuery, useGetTeacherTimetableQuery } from "@school-management/store";

const colorGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
];

export default function TeacherDashboardContent() {
  const { data: stats } = useGetTeacherStatsQuery();
  const { data: timetable = [] } = useGetTeacherTimetableQuery();

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "primary" as const,
    },
    {
      title: "Pending Grading",
      value: stats?.pendingGrading || 0,
      icon: FileText,
      color: "warning" as const,
      description: "Assignments",
    },
    {
      title: "Classes Today",
      value: stats?.classesToday || 0,
      icon: CalendarClock,
      color: "success" as const,
      description: "Scheduled",
    },
    {
      title: "Attendance Marked",
      value: stats?.attendanceMarkedToday || 0,
      icon: ClipboardCheck,
      color: "info" as const,
      description: "Today",
    },
  ];

  const todaySchedule = (timetable || []).slice(0, 4).map((slot: any) => ({
    time: slot.period ? `Period ${slot.period}` : "TBD",
    subject: slot.subjectId?.name || slot.subject || "TBD",
    room: slot.room || "TBD",
    status: slot.status || "upcoming",
  }));

  const pendingTasks = (timetable || []).slice(0, 4).map((task: any) => ({
    task: task.subjectId?.name || task.subject || "Class Scheduled",
    deadline: task.day || "Today",
    priority: "medium",
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your teaching activities" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              description={card.description}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                <CalendarClock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Today's Schedule</h3>
            </div>
            <button className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-violet-50">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {todaySchedule.length > 0 ? todaySchedule.map((slot: any, i: number) => (
              <div
                key={i}
                className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  slot.status === 'completed' ? 'bg-emerald-50/80 border border-emerald-200/50' :
                  slot.status === 'current' ? 'bg-violet-50/80 border border-violet-200/50 shadow-md shadow-violet-500/10' :
                  'bg-slate-50/80 border border-slate-200/50 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs ${
                    slot.status === 'completed' ? 'bg-emerald-500 text-white' :
                    slot.status === 'current' ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {slot.time.split(' ')[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{slot.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/60">{slot.room}</span>
                      <span className="capitalize text-slate-500">{slot.status}</span>
                    </div>
                  </div>
                </div>
                {slot.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                {slot.status === 'current' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <CalendarClock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Pending Tasks</h3>
            </div>
            <button className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-amber-50">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? pendingTasks.map((task: any, i: number) => (
              <div 
                key={i} 
                className="group flex items-start gap-4 p-4 rounded-xl bg-slate-50/80 border border-slate-200/50 hover:bg-slate-100/80 transition-all duration-300"
              >
                <div className={`mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  task.priority === 'high' ? 'bg-gradient-to-br from-rose-500 to-pink-600' :
                  task.priority === 'medium' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                  'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{task.task}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">{task.deadline}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-cyan-100 text-cyan-700'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <Target className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No pending tasks</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Class Performance Overview</h3>
          </div>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50">
            Detailed Report
          </button>
        </div>
        {(stats as any)?.classPerformance && (stats as any).classPerformance.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(stats as any).classPerformance.map((cls: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="group p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 hover:border-slate-300/50 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-800 text-lg">{cls.className}</span>
                    <p className="text-xs text-slate-500">{cls.subject}</p>
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    cls.trend?.startsWith('+') 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {cls.trend}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-extrabold bg-gradient-to-br from-violet-600 to-purple-700 bg-clip-text text-transparent">
                    {cls.avgScore}%
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3.5 h-3.5" />
                    <span>{cls.studentCount} Students</span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: cls.avgScore }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Award className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>No class performance data available</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}