"use client";
import { getInitials } from "@/lib/utils/src";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  ShieldAlert,
  Heart,
  Droplets,
  CreditCard,
  Hash,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  class: string;
  rollNo: string;
  gender: string;
  bloodGroup: string;
  father: string;
  mother: string;
  emergency: string;
  attendance?: number;
  gpa?: string;
}

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        const s = json.data;
        setStudent({
          name: s.userId?.name || "N/A",
          email: s.userId?.email || "N/A",
          phone: s.userId?.phone || "N/A",
          dob: s.dob || "N/A",
          address: s.address || "N/A",
          class: s.classId ? `${s.classId.grade}-${s.classId.section}` : "N/A",
          rollNo: s.rollNumber || "N/A",
          gender: s.gender || "N/A",
          bloodGroup: s.bloodGroup || "N/A",
          father: s.parentName || "N/A",
          mother: "N/A", // Not in model yet
          emergency: s.parentPhone || "N/A",
          attendance: 0, // Should fetch from attendance API
          gpa: "N/A"
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const InfoField = ({ icon: Icon, label, value, colorClass = "text-emerald-500" }: { icon: any; label: string; value: string; colorClass?: string }) => (
    <div className="group flex items-start gap-4 p-4 rounded-[24px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
      <div className={`w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon size={18} className={colorClass} />
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-bold text-slate-800 tracking-tight">{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Student Profile</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
        >
          {isEditing ? "Save Changes" : "Update Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative group">
            <div className="h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 flex justify-center">
                <div className="w-32 h-32 rounded-[40px] bg-slate-900 p-1 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[38px] bg-emerald-500 flex items-center justify-center text-white text-4xl font-black italic border-4 border-white/20">
                    {getInitials(student.name)}
                  </div>
                </div>
              </div>
              <div className="text-center mt-6">
                <h3 className="text-xl font-black text-slate-800 italic tracking-tight uppercase">{student.name}</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">{student.class} Division</p>
                <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 mt-4">
                  <Hash size={12} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: {student.rollNo}</span>
                </div>
              </div>

              <div className="mt-10 space-y-4 pt-8 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Status</p>
                  <span className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck size={10} /> Active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100 text-center">
                    <p className="text-xs font-black text-slate-800">N/A</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Attendance</p>
                  </div>
                  <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100 text-center">
                    <p className="text-xs font-black text-slate-800">N/A</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Overall GPA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight mb-8">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField icon={Mail} label="Institutional Email" value={student.email} colorClass="text-blue-500" />
              <InfoField icon={Phone} label="Primary Contact" value={student.phone} colorClass="text-emerald-500" />
              <InfoField icon={Calendar} label="Date of Birth" value={student.dob} colorClass="text-rose-500" />
              <InfoField icon={MapPin} label="Residential Address" value={student.address} colorClass="text-amber-500" />
              <InfoField icon={User} label="Gender Identification" value={student.gender} colorClass="text-indigo-500" />
              <InfoField icon={Droplets} label="Blood Group" value={student.bloodGroup} colorClass="text-rose-600" />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight mb-8">Guardian Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField icon={Heart} label="Father's Full Name" value={student.father} colorClass="text-emerald-600" />
              <InfoField icon={Heart} label="Mother's Full Name" value={student.mother} colorClass="text-emerald-600" />
              <InfoField icon={ShieldAlert} label="Emergency Contact" value={student.emergency} colorClass="text-rose-500" />
              <InfoField icon={Phone} label="Guardian Contact" value={student.emergency} colorClass="text-slate-400" />
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight mb-8">Academic Registration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField icon={GraduationCap} label="Standard/Grade" value={student.class} colorClass="text-teal-600" />
              <InfoField icon={Hash} label="Roll Number" value={student.rollNo} colorClass="text-slate-800" />
              <InfoField icon={CreditCard} label="Registration ID" value="REG-2025" colorClass="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}