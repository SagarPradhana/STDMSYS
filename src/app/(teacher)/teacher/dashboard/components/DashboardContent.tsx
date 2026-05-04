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
} from "lucide-react";
import { PageHeader, StatsCard } from "@school-management/ui";
import { useGetTeacherStatsQuery } from "@school-management/store";

export default function TeacherDashboardContent() {
  const { data: stats } = useGetTeacherStatsQuery();

  const statsCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "info",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Pending Grading",
      value: stats?.pendingGrading || 0,
      icon: FileText,
      color: "warning",
      trend: "Assignments",
      trendUp: true,
    },
    {
      title: "Classes Today",
      value: stats?.classesToday || 0,
      icon: CalendarClock,
      color: "success",
      trend: "Scheduled",
      trendUp: true,
    },
    {
      title: "Attendance Marked",
      value: stats?.attendanceMarkedToday || 0,
      icon: ClipboardCheck,
      color: "success",
      trend: "Today",
      trendUp: true,
    },
  ];

  const todaySchedule = [
    { time: "09:00 AM", subject: "Mathematics - Class 10-A", room: "Room 101", status: "completed" },
    { time: "10:30 AM", subject: "Mathematics - Class 9-B", room: "Room 102", status: "current" },
    { time: "01:00 PM", subject: "Mathematics - Class 10-A (Lab)", room: "Lab 1", status: "upcoming" },
    { time: "02:30 PM", subject: "Mathematics - Class 8-A", room: "Room 103", status: "upcoming" },
  ];

  const pendingTasks = [
    { task: "Mark attendance for Class 10-A", deadline: "Today, 09:00 AM", priority: "high" },
    { task: "Submit exam marks for Class 9-B", deadline: "Tomorrow", priority: "medium" },
    { task: "Review assignment submissions", deadline: "Jan 25, 2024", priority: "low" },
    { task: "Prepare quiz for Class 8-A", deadline: "Jan 28, 2024", priority: "medium" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your teaching activities" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color as any}
              description={card.trend}
              changeType={card.trendUp ? "positive" : "neutral"}
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Schedule</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${slot.status === 'completed' ? 'bg-green-500/10' :
                    slot.status === 'current' ? 'bg-primary/10' :
                      'bg-muted/50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${slot.status === 'completed' ? 'bg-green-500' :
                      slot.status === 'current' ? 'bg-primary animate-pulse' :
                        'bg-gray-300'
                    }`} />
                  <div>
                    <p className="font-medium text-sm">{slot.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock className="w-3 h-3" />
                      <span>{slot.time}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{slot.room}</span>
                    </div>
                  </div>
                </div>
                {slot.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                {slot.status === 'current' && <div className="px-2 py-1 bg-primary text-white text-xs rounded-full">Now</div>}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl p-6 border"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Tasks</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.task}</p>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {task.deadline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card rounded-xl p-6 border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Class Performance Overview</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { class: "Class 10-A", avgScore: "87%", students: 42, trend: "+5%" },
            { class: "Class 9-B", avgScore: "82%", students: 38, trend: "+3%" },
            { class: "Class 8-A", avgScore: "79%", students: 40, trend: "+8%" },
          ].map((cls, i) => (
            <div key={i} className="p-4 rounded-xl bg-muted/50 border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{cls.class}</span>
                <span className={`text-xs flex items-center gap-1 ${cls.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {cls.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {cls.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-primary">{cls.avgScore}</div>
              <p className="text-xs text-muted mt-1">{cls.students} Students</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}