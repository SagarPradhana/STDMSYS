"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarClock,
  FileText,
  BarChart3,
  CheckCircle,
  CreditCard,
  Bell,
  CalendarOff,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
} from "lucide-react";
import { cn, getInitials } from "@school-management/utils";
import { useTokenExpiry } from "@school-management/utils";

const sidebarItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/timetable", label: "Timetable", icon: CalendarClock },
  { href: "/student/assignments", label: "Assignments", icon: FileText },
  { href: "/student/results", label: "Results & Grades", icon: BarChart3 },
  { href: "/student/attendance", label: "Attendance", icon: CheckCircle },
  { href: "/student/fees", label: "Fee Status", icon: CreditCard },
  { href: "/student/notices", label: "Notices", icon: Bell },
  { href: "/student/leave", label: "Leave Application", icon: CalendarOff },
  { href: "/student/profile", label: "Profile", icon: User },
];

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  
  useTokenExpiry();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser({ name: "Student", role: "student" });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const getPageTitle = () => {
    const item = sidebarItems.find(item => pathname.startsWith(item.href));
    return item?.label || "Dashboard";
  };

  return (
    <div className="flex min-h-screen page-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] fixed h-screen z-50 overflow-hidden shadow-2xl",
          collapsed ? "w-20" : "w-64"
        )}
        style={{ background: "linear-gradient(180deg, #065F46 0%, #064E3B 100%)" }}
      >
        <div className={cn(
          "flex items-center gap-3 py-6 px-4 border-b border-white/10 mb-2",
          collapsed ? "justify-center px-0" : ""
        )}>
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/20 shrink-0">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <span className="text-white font-extrabold text-lg block tracking-tight leading-none">EDUFLOW</span>
              <span className="text-white/45 text-[10px] font-bold uppercase tracking-widest leading-none mt-1">Student Portal</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto py-4 scrollbar-hide">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                  collapsed ? "justify-center" : "",
                  isActive 
                    ? "bg-white/15 text-white shadow-lg border border-white/10" 
                    : "text-emerald-100/60 hover:text-white hover:bg-white/5"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-emerald-300/50"
                )} />
                {!collapsed && (
                  <span className="whitespace-nowrap text-sm font-semibold tracking-tight">{item.label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="activePill"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 flex flex-col gap-1 bg-black/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-emerald-100/60 hover:text-white hover:bg-white/5 transition-all group",
              collapsed ? "justify-center" : ""
            )}
          >
            {collapsed ? <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" /> : <><ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" /><span className="text-sm font-bold">Collapse</span></>}
          </button>

          <button 
            onClick={handleLogout} 
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl text-red-300/70 hover:text-red-200 hover:bg-red-500/10 transition-all",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-bold">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        collapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 bg-[var(--bg-surface)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-sm shadow-emerald-900/5">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight leading-none uppercase italic">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-[#7C6FAE] font-bold uppercase tracking-widest">
                Welcome back, {user?.name || 'Student'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-[#1E1B4B]">{user?.name}</span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Student ID: DPS-2024-001</span>
            </div>

            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border)] text-[#7C6FAE] hover:text-emerald-600 hover:bg-emerald-50 transition-all relative group shadow-sm">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#F5576C] to-[#F093FB] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-lg shadow-pink-500/20">
                3
              </span>
            </button>

            <Link href="/student/profile" className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/30 ring-2 ring-white hover:scale-105 transition-transform active:scale-95">
              {getInitials(user?.name || "Student")}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
