"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  FileText,
  BarChart3,
  CheckCircle,
  CreditCard,
  Bell,
  CalendarOff,
  BookOpen,
  ChevronRight,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardData {
  attendance: number;
  assignmentsDue: number;
  upcomingExams: number;
  feeStatus: string;
  recentNotices: any[];
  upcomingAssignments: any[];
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/dashboard/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const stats = [
    { title: "Attendance", value: `${data?.attendance || 0}%`, icon: CheckCircle, color: "emerald", trend: "Current Session", grad: "from-emerald-50 to-teal-50" },
    { title: "Avg Grade", value: "A-", icon: BarChart3, color: "indigo", trend: "Top 10% of class", grad: "from-indigo-50 to-blue-50" },
    { title: "Assignments", value: `${data?.assignmentsDue || 0} Pending`, icon: FileText, color: "amber", trend: "Action Required", grad: "from-amber-50 to-orange-50" },
    { title: "Upcoming Exams", value: `${data?.upcomingExams || 0}`, icon: BookOpen, color: "purple", trend: "Prepare Well", grad: "from-purple-50 to-fuchsia-50" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 p-8 text-white shadow-2xl shadow-emerald-900/20"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Academic Performance</h2>
          <p className="text-emerald-100/80 font-medium max-w-lg leading-relaxed">
            Welcome back! You have {data?.assignmentsDue} pending assignments and your current attendance stands at {data?.attendance}%. Keep up the good work!
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-wider">Fee Status: {data?.feeStatus?.toUpperCase()}</span>
            </div>
            <div className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Rank: Top 5 in Class</span>
            </div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl" />
        <BookOpen className="absolute right-12 bottom-0 translate-y-1/4 w-48 h-48 text-white/5 -rotate-12" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`group p-6 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 relative overflow-hidden`}
          >
            <div className="relative z-10 flex flex-col gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-100 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.title}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`text-[10px] font-bold text-${stat.color}-600 bg-${stat.color}-50 px-2 py-0.5 rounded-full`}>{stat.trend}</span>
              </div>
            </div>
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 text-${stat.color}-50 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Recent Notices</h3>
              <div className="w-10 h-1 bg-emerald-500 rounded-full mt-1" />
            </div>
            <Link href="/student/notices" className="text-xs font-bold text-emerald-600 hover:underline uppercase tracking-widest">View All</Link>
          </div>

          <div className="space-y-4">
            {data?.recentNotices?.length ? (
              data.recentNotices.map((notice, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group/item">
                  <div className={`w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-black text-xs`}>
                    {notice.priority[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm group-hover/item:text-emerald-700 transition-colors">{notice.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {new Date(notice.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-emerald-400 group-hover/item:translate-x-1 transition-all" />
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-10 text-xs font-bold uppercase">No recent notices</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-lg font-black uppercase italic tracking-tight mb-8">Upcoming Deadlines</h3>

            <div className="space-y-6 flex-1">
              {data?.upcomingAssignments?.length ? (
                data.upcomingAssignments.map((assignment, i) => (
                  <div key={i} className="flex gap-4 group/event">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex flex-col items-center justify-center group-hover/event:bg-indigo-500/30 transition-colors">
                        <span className="text-[10px] font-black uppercase text-indigo-300 leading-none mb-0.5">
                          {new Date(assignment.dueDate).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black leading-none">
                          {new Date(assignment.dueDate).getDate()}
                        </span>
                      </div>
                      {i !== data.upcomingAssignments.length - 1 && <div className="w-0.5 h-full bg-white/10 my-1" />}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-sm tracking-tight">{assignment.title}</h4>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mt-1">
                        {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-indigo-300/50 py-10 text-[10px] font-black uppercase tracking-widest">All caught up!</p>
              )}
            </div>

            <Link href="/student/assignments" className="mt-8 w-full py-4 bg-white text-indigo-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-lg shadow-indigo-500/20 text-center">
              View Assignments
            </Link>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}