"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
  BookOpen,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { PageHeader } from "@school-management/ui";

export default function TeacherAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  const performanceData = [
    { subject: "Mathematics", avgScore: 82, trend: 5, students: 42 },
    { subject: "Physics", avgScore: 78, trend: -2, students: 38 },
    { subject: "Chemistry", avgScore: 85, trend: 8, students: 40 },
    { subject: "English", avgScore: 76, trend: 3, students: 42 },
  ];

  const gradeDistribution = [
    { grade: "A+", count: 15, percentage: 12 },
    { grade: "A", count: 28, percentage: 22 },
    { grade: "B+", count: 35, percentage: 28 },
    { grade: "B", count: 25, percentage: 20 },
    { grade: "C", count: 15, percentage: 12 },
    { grade: "D", count: 8, percentage: 6 },
  ];

  const topPerformers = [
    { name: "Aarav Sharma", class: "10-A", score: 98 },
    { name: "Bhavya Patel", class: "10-A", score: 95 },
    { name: "Charlie Singh", class: "9-B", score: 93 },
  ];

  const needsImprovement = [
    { name: "Rahul Verma", class: "8-A", score: 45 },
    { name: "Kiran Shah", class: "10-A", score: 52 },
    { name: "Meera Nair", class: "9-B", score: 58 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader 
          title="Analytics" 
          subtitle="Detailed performance analytics and insights"
        />
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 bg-card border rounded-xl text-sm"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="term">This Term</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Overall Average", value: "82.5%", change: "+3.2%", up: true, icon: BarChart3 },
          { title: "Total Students", value: "156", change: "+12", up: true, icon: Users },
          { title: "Pass Rate", value: "94%", change: "+2%", up: true, icon: TrendingUp },
          { title: "Avg. Attendance", value: "91%", change: "-1%", up: false, icon: Clock },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-5 border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</span>
              <stat.icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className={stat.up ? "text-green-500" : "text-red-500"}>
              {stat.up ? <ArrowUpRight className="w-4 h-4 inline" /> : <ArrowDownRight className="w-4 h-4 inline" />}
              <span className="text-sm ml-1">{stat.change}</span>
            </div>
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
          <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>
          <div className="space-y-4">
            {performanceData.map((subject, index) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{subject.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{subject.avgScore}%</span>
                    <span className={subject.trend > 0 ? "text-green-500 text-sm" : "text-red-500 text-sm"}>
                      {subject.trend > 0 ? "+" : ""}{subject.trend}%
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.avgScore}%` }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ 
                      background: subject.avgScore >= 80 ? "var(--grad-primary)" : 
                                 subject.avgScore >= 60 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
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
          <h3 className="text-lg font-semibold mb-4">Grade Distribution</h3>
          <div className="flex items-center justify-center h-48">
            <div className="grid grid-cols-3 gap-4 w-full">
              {gradeDistribution.map((item, index) => (
                <div key={item.grade} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold"
                    style={{ 
                      background: index < 2 ? "#10B981" : index < 4 ? "#3B82F6" : "#F59E0B"
                    }}
                  >
                    {item.grade}
                  </div>
                  <div className="text-lg font-bold">{item.count}</div>
                  <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl p-6 border"
        >
          <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.map((student, index) => (
              <div key={student.name} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.class}</p>
                </div>
                <div className="text-green-500 font-bold">{student.score}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-xl p-6 border"
        >
          <h3 className="text-lg font-semibold mb-4">Needs Attention</h3>
          <div className="space-y-3">
            {needsImprovement.map((student, index) => (
              <div key={student.name} className="flex items-center gap-4 p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.class}</p>
                </div>
                <div className="text-red-500 font-bold">{student.score}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}