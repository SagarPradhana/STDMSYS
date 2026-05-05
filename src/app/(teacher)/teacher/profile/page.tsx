"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Clock,
  GraduationCap,
  Camera,
  Save,
  Loader2,
  Edit3,
  X,
  Briefcase,
  Check,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { useGetTeacherProfileQuery, useUpdateTeacherProfileMutation } from "@school-management/store";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  experience: number;
  joinDate: string;
  address: string;
  bio: string;
}

export default function TeacherProfilePage() {
  const { data: profile, isLoading } = useGetTeacherProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateTeacherProfileMutation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    subjects: [],
    experience: 0,
    joinDate: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        qualification: profile.qualification || "",
        subjects: profile.subjects || [],
        experience: profile.experience || 0,
        joinDate: profile.joinDate?.split("T")[0] || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  const infoFields = [
    { label: "Full Name", value: formData.name, key: "name", icon: User, editable: true },
    { label: "Email", value: formData.email, key: "email", icon: Mail, editable: true },
    { label: "Phone", value: formData.phone, key: "phone", icon: Phone, editable: true },
    { label: "Qualification", value: formData.qualification, key: "qualification", icon: BookOpen, editable: true },
    { label: "Experience", value: `${formData.experience} years`, key: "experience", icon: Briefcase, editable: false },
    { label: "Join Date", value: formData.joinDate ? new Date(formData.joinDate).toLocaleDateString() : "N/A", key: "joinDate", icon: Calendar, editable: false },
    { label: "Address", value: formData.address, key: "address", icon: MapPin, editable: true },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Your personal information" />
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profile" 
        subtitle={isEditing ? "Edit your personal information" : "Your personal information"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 text-center shadow-sm">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-xl" style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)" }}>
                {formData.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "T"}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:from-violet-600 hover:to-purple-700 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{formData.name || "Teacher"}</h3>
            <p className="text-sm text-slate-500 font-medium">{formData.qualification || "Educator"}</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="p-2 rounded-lg bg-violet-100">
                  <Mail className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{formData.email || "email@school.edu"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{formData.phone || "+1 234 567 8900"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="p-2 rounded-lg bg-amber-100">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{formData.address || "Address not set"}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Profile Completion</span>
                <span className="text-xs font-bold text-emerald-600">75%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-to-r from-violet-500 to-purple-600 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              </div>
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="gap-2 border-slate-200 hover:bg-slate-50"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    onClick={handleSave} 
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {infoFields.map((field) => (
                <div key={field.label}>
                  {field.icon && (
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <field.icon className="w-3.5 h-3.5" />
                      {field.label}
                    </label>
                  )}
                  {!field.icon && (
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
                      {field.label}
                    </label>
                  )}
                  {isEditing && field.editable ? (
                    <input
                      type={field.label === "Phone" ? "tel" : field.label === "Email" ? "email" : "text"}
                      value={formData[field.key as keyof ProfileData] as string || ""}
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50/80 rounded-xl text-sm font-semibold text-slate-700">
                      {field.value || "Not set"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all h-28 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}

            {!isEditing && formData.bio && (
              <div className="mt-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Bio
                </label>
                <div className="px-4 py-3 bg-slate-50/80 rounded-xl text-sm font-medium text-slate-600 leading-relaxed">
                  {formData.bio}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Subjects Teaching</h3>
          <span className="ml-auto px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold">
            {formData.subjects?.length || 0} Assigned
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {formData.subjects?.length > 0 ? (
            formData.subjects.map((subject, index) => (
              <span 
                key={index}
                className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md"
              >
                {subject}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500 p-4">No subjects assigned yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}