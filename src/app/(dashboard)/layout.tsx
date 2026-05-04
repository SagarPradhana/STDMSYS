"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardCheck,
  FileText,
  FileStack,
  CreditCard,
  Calendar,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { cn, getInitials, useTokenExpiry } from "@school-management/utils";
import { useAppDispatch, useAppSelector, logout } from "@school-management/store";

import { AuthGuard } from "@/components/AuthGuard";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/classes", label: "Classes", icon: Building2 },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/assignments", label: "Assignments", icon: FileText },
  { href: "/exams", label: "Exams", icon: FileStack },
  { href: "/fees", label: "Fees", icon: CreditCard },
  { href: "/timetable", label: "Timetable", icon: Calendar },
  { href: "/notices", label: "Notices", icon: Bell },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector(state => state.auth.user);

  useTokenExpiry();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getPageTitle = () => {
    const item = sidebarItems.find(item => pathname.startsWith(item.href));
    return item?.label || "Dashboard";
  };

  return (
    <AuthGuard allowedRole="admin">
      <div className="flex min-h-screen bg-[var(--bg-base)]">
        <aside className={cn(
          "sidebar flex flex-col transition-all duration-300 fixed h-screen z-50 overflow-hidden",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}>
          <div className={cn(
            "sidebar-brand flex items-center gap-3 h-[72px]",
            collapsed ? "justify-center px-0" : "px-5"
          )}>
            <div className="sidebar-logo-circle">
              <span>E</span>
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                <span className="text-white font-semibold text-base">EduFlow</span>
              </motion.div>
            )}
          </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  collapsed ? "justify-center px-0 h-9 w-9 mx-auto" : "h-10",
                  isActive && "active"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
                {isActive && !collapsed && <div className="active-indicator-dot" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 sidebar-bottom flex flex-col gap-0.5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "sidebar-item",
              collapsed ? "justify-center px-0 h-9 w-9 mx-auto" : "h-10"
            )}
          >
            {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "sidebar-item sidebar-logout",
              collapsed ? "justify-center px-0 h-9 w-9 mx-auto" : "h-10"
            )}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>

      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        collapsed ? "ml-[72px]" : "ml-[260px]"
      )}>
        <header className="header px-7 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] leading-none">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={toggleTheme} className="header-btn">
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
            <button className="header-btn-icon relative">
              <Bell className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="notification-badge">3</span>
            </button>
            <Link href="/settings" className="header-avatar">
              {getInitials(user?.name || "Admin")}
            </Link>
          </div>
        </header>

        <div className="flex-1 p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>
    </AuthGuard>
  );
}