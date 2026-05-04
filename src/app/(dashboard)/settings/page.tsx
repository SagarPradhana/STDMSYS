"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  CreditCard,
  Lock,
  ChevronRight,
  Building2,
  Trash2,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Camera
} from "lucide-react";
import { Button, UserAvatar } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useAppSelector } from "@school-management/store";
import toast from "react-hot-toast";

const settingTabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "profile", label: "My Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "school", label: "School Identity", icon: Building2 },
  { id: "billing", label: "Subscription", icon: CreditCard },
];

export default function SettingsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("general");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showPwdOld, setShowPwdOld] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [pwdForm, setPwdForm] = useState({ old: "", newPwd: "", confirm: "" });
  const [notifications, setNotifications] = useState({ push: true, email: true, sms: false, weekly: true });
  const [profileForm, setProfileForm] = useState({ 
    name: user?.name || "Administrator", 
    email: user?.email || "admin@school.edu", 
    phone: (user as any)?.phone || "+91 00000 00000" 
  });

  const ModalBackdrop = ({ onClose }: { onClose: () => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
  );

  return (
    <div className="space-y-6 max-w-full">
      {/* Page Header */}
      <div className="page-header-card header-gradient-indigo">
        <div className="absolute right-[-40px] top-[-60px] w-[200px] h-[200px] rounded-full bg-white/06 pointer-events-none" />
        <div className="absolute right-[60px] top-[20px] w-[120px] h-[120px] rounded-full bg-white/04 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Settings & Configuration</h1>
          <div className="page-header-underline" />
          <p className="page-header-subtitle">Manage your personal preferences, security settings and global school configurations</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 space-y-1">
          {settingTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeTab === tab.id ? "bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/20" : "text-[var(--text-muted)] hover:bg-[var(--bg-surface-2)]")}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeSettingTab" className="ml-auto"><ChevronRight className="w-4 h-4" /></motion.div>
              )}
            </button>
          ))}

          <div className="mt-6 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
            <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">Danger Zone</h4>
            <Button variant="outline" className="w-full text-xs text-red-600 hover:bg-red-600 hover:text-white border-red-200 dark:border-red-500/30 h-10 gap-2"
              onClick={() => setShowResetModal(true)}>
              <Trash2 className="w-3.5 h-3.5" /> Reset System Data
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-5">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} className="space-y-5">

            {/* Profile / General section */}
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <div className="relative group">
                  <UserAvatar name="Admin" size="lg" className="w-24 h-24 text-2xl shadow-xl" />
                  <button className="absolute bottom-0 right-0 p-2 bg-[var(--primary)] text-white rounded-full shadow-lg hover:scale-110 transition-transform" title="Change photo">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-[var(--primary)]">{profileForm.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{user?.role?.charAt(0).toUpperCase() + (user?.role?.slice(1) || "")} • School Management</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => { toast.success("Profile saved successfully!"); }}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white transition-all hover:translate-y-[-1px]" style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-button)" }}>
                      <Save size={14} /> Save Changes
                    </button>
                    <Button size="sm" variant="outline" className="h-9 px-5">Cancel</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-[var(--border)]">
                {[
                  { label: "Full Name", field: "name", type: "text" },
                  { label: "Email Address", field: "email", type: "email" },
                  { label: "Contact Number", field: "phone", type: "tel" },
                ].map(({ label, field, type }) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</label>
                    <input type={type} value={(profileForm as any)[field]}
                      onChange={e => setProfileForm(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full px-4 py-3 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] outline-none transition-all" />
                  </div>
                ))}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Organization ID</label>
                  <input type="text" defaultValue="DPS-2026-ADM1" disabled
                    className="w-full px-4 py-3 bg-[var(--bg-surface-3)]/50 border border-[var(--border)] rounded-xl text-sm text-[var(--text-muted)] font-mono cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* System Preferences */}
            <div className="card overflow-hidden">
              <div className="p-5 border-b border-[var(--border)] bg-[var(--bg-surface-2)]/30">
                <h3 className="section-title text-sm">System Preferences</h3>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {/* Language */}
                <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Globe className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">System Language</div>
                      <div className="text-xs text-[var(--text-muted)]">Set the default interface language</div>
                    </div>
                  </div>
                  <select className="text-xs font-bold bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-4 py-2 outline-none text-[var(--text-primary)] focus:border-indigo-500">
                    <option>English (US)</option><option>Hindi</option><option>Spanish</option><option>French</option>
                  </select>
                </div>

                {/* Push Notifications */}
                <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Bell className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">Push Notifications</div>
                      <div className="text-xs text-[var(--text-muted)]">Receive real-time system alerts</div>
                    </div>
                  </div>
                  <button onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", notifications.push ? "bg-[var(--primary)]" : "bg-[var(--bg-surface-3)]")}>
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", notifications.push ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                {/* Email Notifications */}
                <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Bell className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">Email Notifications</div>
                      <div className="text-xs text-[var(--text-muted)]">Receive weekly digest and updates via email</div>
                    </div>
                  </div>
                  <button onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                    className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors", notifications.email ? "bg-[var(--primary)]" : "bg-[var(--bg-surface-3)]")}>
                    <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", notifications.email ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                {/* 2FA */}
                <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Lock className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">Two-Factor Authentication</div>
                      <div className="text-xs text-[var(--text-muted)]">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="text-[10px] font-black uppercase tracking-widest h-8 px-4 border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30"
                    onClick={() => toast.success("2FA setup initiated! Check your email.")}>
                    Enable 2FA
                  </Button>
                </div>

                {/* Change Password */}
                <div className="p-5 flex items-center justify-between hover:bg-[var(--bg-surface-2)]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Shield className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">Change Password</div>
                      <div className="text-xs text-[var(--text-muted)]">Update your account password</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 px-4 text-xs font-bold" onClick={() => setShowPasswordModal(true)}>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowPasswordModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)]" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div><h2 className="text-lg font-bold text-[var(--text-primary)]">Change Password</h2><p className="text-sm text-[var(--text-muted)]">Enter your current and new password</p></div>
                <button onClick={() => setShowPasswordModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[var(--bg-surface-2)] hover:bg-[var(--bg-surface-3)] transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { label: "Current Password", field: "old", show: showPwdOld, toggle: () => setShowPwdOld(p => !p) },
                  { label: "New Password", field: "newPwd", show: showPwdNew, toggle: () => setShowPwdNew(p => !p) },
                  { label: "Confirm New Password", field: "confirm", show: showPwdNew, toggle: () => setShowPwdNew(p => !p) },
                ].map(({ label, field, show, toggle }) => (
                  <div key={field} className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input type={show ? "text" : "password"} value={(pwdForm as any)[field]}
                        onChange={e => setPwdForm(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-surface-2)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" />
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <button onClick={() => {
                  if (!pwdForm.old || !pwdForm.newPwd) { toast.error("Please fill all fields"); return; }
                  if (pwdForm.newPwd !== pwdForm.confirm) { toast.error("New passwords don't match!"); return; }
                  toast.success("Password changed successfully!"); setShowPasswordModal(false);
                }} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all" style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-button)" }}>
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <ModalBackdrop onClose={() => setShowResetModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border)] p-6" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Reset System Data</h2>
                <p className="text-sm text-[var(--text-muted)]">This will permanently delete all school data including students, teachers, classes, and records. This <strong className="text-red-500">cannot be undone</strong>.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowResetModal(false)}>Cancel</Button>
                <button onClick={() => { toast.error("Reset requires super admin authorization."); setShowResetModal(false); }}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-red-500 hover:bg-red-600 transition-all">
                  <Trash2 size={16} /> Reset All Data
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
