"use client";

import { useState, useMemo } from "react";
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
  Award,
  Target,
  AlertTriangle,
  Medal,
  UserCheck,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { 
  useGetTeacherStatsQuery,
  useGetTeacherClassesQuery,
  useGetExamMarksQuery 
} from "@school-management/store";

const statGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-orange-600",
];

export default function TeacherAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");
  const { data: stats } = useGetTeacherStatsQuery();
  const { data: classes = [] } = useGetTeacherClassesQuery();

  const { data: marksData, isLoading } = useGetExamMarksQuery(
    { classId: "", examId: "" },
    { skip: true }
  );

  const analytics = useMemo(() => {
    const allMarks = marksData || [];
    if (allMarks.length === 0) {
      return {
        avgScore: 0,
        totalStudents: 0,
        passRate: 0,
        highestScore: 0,
        lowestScore: 0,
        gradeDist: {},
        topStudents: [],
        bottomStudents: [],
      };
    }

    const marks = allMarks.map((m: any) => m.marks).filter((m: number) => m != null);
    const passed = marks.filter((m: number) => m >= 40);
    
    const gradeDist: Record<string, number> = {};
    marks.forEach((m: number) => {
      const grade = getGrade(m);
      gradeDist[grade] = (gradeDist[grade] || 0) + 1;
    });

    const sortedByMarks = [...allMarks].sort((a: any, b: any) => b.marks - a.marks);
    const topStudents = sortedByMarks.slice(0, 3).map((s: any) => ({
      name: s.studentId?.name || "Unknown",
      class: s.classId?.name || "N/A",
      score: s.marks,
    }));
    
    const bottomStudents = sortedByMarks.slice(-3).reverse().map((s: any) => ({
      name: s.studentId?.name || "Unknown", 
      class: s.classId?.name || "N/A",
      score: s.marks,
    }));

    return {
      avgScore: marks.length > 0 ? (marks.reduce((a: number, b: number) => a + b, 0) / marks.length).toFixed(1) : 0,
      totalStudents: allMarks.length,
      passRate: marks.length > 0 ? ((passed.length / marks.length) * 100).toFixed(0) : 0,
      highestScore: marks.length > 0 ? Math.max(...marks) : 0,
      lowestScore: marks.length > 0 ? Math.min(...marks) : 0,
      gradeDist,
      topStudents,
      bottomStudents,
    };
  }, [marksData]);

  function getGrade(marks: number) {
    const pct = (marks / 100) * 100;
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B+";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    if (pct >= 40) return "D";
    return "F";
  }

  const gradeDistribution = [
    { grade: "A+", count: analytics.gradeDist["A+"] || 0, gradient: "from-emerald-500 to-teal-600" },
    { grade: "A", count: analytics.gradeDist["A"] || 0, gradient: "from-cyan-500 to-blue-600" },
    { grade: "B+", count: analytics.gradeDist["B+"] || 0, gradient: "from-violet-500 to-purple-600" },
    { grade: "B", count: analytics.gradeDist["B"] || 0, gradient: "from-indigo-500 to-blue-600" },
    { grade: "C", count: analytics.gradeDist["C"] || 0, gradient: "from-amber-500 to-orange-600" },
    { grade: "D/F", count: (analytics.gradeDist["D"] || 0) + (analytics.gradeDist["F"] || 0), gradient: "from-rose-500 to-pink-600" },
  ];

  const statCards = [
    { title: "Overall Average", value: `${analytics.avgScore}%`, change: "", up: true, icon: BarChart3 },
    { title: "Total Students", value: `${analytics.totalStudents || stats?.totalStudents || 0}`, change: "", up: true, icon: Users },
    { title: "Pass Rate", value: `${analytics.passRate}%`, change: "", up: true, icon: TrendingUp },
    { title: "Highest Score", value: `${analytics.highestScore}`, change: "", up: true, icon: Award },
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
          className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="term">This Term</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group bg-white rounded-2xl p-5 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.title}</span>
              <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-sm", statGradients[index])}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">My Classes</h3>
          </div>
          <div className="space-y-4">
            {(classes || []).length > 0 ? classes.map((cls: any, index: number) => (
              <div key={cls._id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700">{cls.classId?.name}</span>
                  <span className="font-bold text-slate-800">{cls.studentCount || 0} students</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                  />
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No classes assigned</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Grade Distribution</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 w-full">
              {gradeDistribution.map((item, index) => (
                <motion.div 
                  key={item.grade}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="text-center"
                >
                  <div 
                    className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-extrabold text-lg shadow-lg", item.gradient)}
                  >
                    {item.grade}
                  </div>
                  <div className="text-xl font-bold text-slate-800">{item.count}</div>
                  <div className="text-xs text-slate-500 font-medium">Students</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <Medal className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {analytics.topStudents.length > 0 ? analytics.topStudents.map((student: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-xl border border-slate-100"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white",
                  index === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500" :
                  index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400" :
                  "bg-gradient-to-br from-amber-600 to-orange-700"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-emerald-600">{student.score}</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <Medal className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No data available</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Needs Attention</h3>
          </div>
          <div className="space-y-3">
            {analytics.bottomStudents.length > 0 ? analytics.bottomStudents.map((student: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50/30 rounded-xl border border-rose-100"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{student.class}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-rose-600">{student.score}</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-8 text-slate-500">
                <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>All students performing well</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}