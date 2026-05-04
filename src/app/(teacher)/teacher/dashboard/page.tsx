"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  BarChart3,
  TrendingUp,
  CalendarClock,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn, getInitials, useTokenExpiry } from "@school-management/utils";
import { PageHeader, StatsCard } from "@school-management/ui";
import DashboardContent from "./components/DashboardContent";
import TeacherClassesPage from "../classes/page";
import TeacherAttendancePage from "../attendance/page";
import TeacherAssignmentsPage from "../assignments/page";
import TeacherMarksPage from "../marks/page";
import TeacherAnalyticsPage from "../analytics/page";
import TeacherSchedulePage from "../schedule/page";
import TeacherNoticesPage from "../notices/page";
import TeacherProfilePage from "../profile/page";

const sidebarItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "My Classes", icon: Users },
  { href: "/teacher/attendance", label: "Mark Attendance", icon: ClipboardCheck },
  { href: "/teacher/assignments", label: "Assignments", icon: FileText },
  { href: "/teacher/marks", label: "Exam Marks", icon: BarChart3 },
  { href: "/teacher/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/teacher/schedule", label: "My Schedule", icon: CalendarClock },
  { href: "/teacher/notices", label: "Notices", icon: Bell },
  { href: "/teacher/profile", label: "Profile", icon: User },
];

export default function TeacherDashboardPage() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useTokenExpiry();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser({ name: "Teacher", role: "teacher" });
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
      <aside
        className={cn(
          "flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] fixed h-screen z-50 overflow-hidden",
          collapsed ? "w-20" : "w-64"
        )}
        style={{ background: "linear-gradient(180deg, #0D9488 0%, #14B8A6 100%)" }}
      >
        <div className={cn(
          "flex items-center gap-3 py-6 px-4 border-b border-white/10 mb-2",
          collapsed ? "justify-center px-0" : ""
        )}>
          <div className="sidebar-logo-box shrink-0 bg-teal-600">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <span className="text-white font-extrabold text-lg block tracking-tight">EDUFLOW</span>
              <span className="text-white/45 text-[10px] font-bold uppercase tracking-widest leading-none">Teacher Portal</span>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-2 flex flex-col gap-0.5 overflow-y-auto py-2 scrollbar-hide">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all",
                  collapsed ? "justify-center" : "",
                  isActive && "bg-white/20 text-white"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-white/10 flex flex-col gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all",
              collapsed ? "justify-center" : ""
            )}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <><ChevronLeft className="w-5 h-5" /><span className="text-sm font-medium">Collapse</span></>}
          </button>

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all",
              collapsed ? "justify-center" : ""
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      <main className={cn(
        "flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        collapsed ? "ml-20" : "ml-64"
      )}>
        <header className="header px-7 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-extrabold text-[#1E1B4B] tracking-tight leading-none">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#7C6FAE] font-medium mt-1">
              Welcome, {user?.name || 'Teacher'}!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="header-btn relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-gradient-to-br from-[#F093FB] to-[#F5576C] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <Link href="/teacher/profile" className="header-avatar">
              {getInitials(user?.name || "Teacher")}
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {pathname === "/teacher/dashboard" && <DashboardContent />}
              {pathname === "/teacher/classes" && <TeacherClassesPage />}
              {pathname === "/teacher/attendance" && <TeacherAttendancePage />}
              {pathname === "/teacher/assignments" && <TeacherAssignmentsPage />}
              {pathname === "/teacher/marks" && <TeacherMarksPage />}
              {pathname === "/teacher/analytics" && <TeacherAnalyticsPage />}
              {pathname === "/teacher/schedule" && <TeacherSchedulePage />}
              {pathname === "/teacher/notices" && <TeacherNoticesPage />}
              {pathname === "/teacher/profile" && <TeacherProfilePage />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}