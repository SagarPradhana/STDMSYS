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
    { label: "Full Name", value: formData.name, icon: User, editable: true },
    { label: "Email", value: formData.email, icon: Mail, editable: true },
    { label: "Phone", value: formData.phone, icon: Phone, editable: true },
    { label: "Qualification", value: formData.qualification, icon: BookOpen, editable: true },
    { label: "Experience", value: `${formData.experience} years`, icon: Clock, editable: false },
    { label: "Join Date", value: formData.joinDate ? new Date(formData.joinDate).toLocaleDateString() : "N/A", icon: Calendar, editable: false },
    { label: "Address", value: formData.address, icon: MapPin, editable: true },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" subtitle="Your personal information" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
          <div className="bg-card rounded-xl border p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto" style={{ background: "var(--grad-secondary)" }}>
                {formData.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "T"}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold">{formData.name || "Teacher"}</h3>
            <p className="text-muted-foreground">{formData.qualification || "Educator"}</p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.email || "email@school.edu"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.phone || "+1 234 567 8900"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{formData.address || "Address not set"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button className="gap-2" onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infoFields.map((field) => (
                <div key={field.label}>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <field.icon className="w-3 h-3" />
                    {field.label}
                  </label>
                  {isEditing && field.editable ? (
                    <input
                      type={field.label === "Phone" ? "tel" : field.label === "Email" ? "email" : "text"}
                      value={formData[field.label.toLowerCase() as keyof ProfileData] as string || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.label.toLowerCase()]: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-muted/30 rounded-xl text-sm">
                      {field.value || "Not set"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-muted border rounded-xl text-sm h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            )}

            {!isEditing && formData.bio && (
              <div className="mt-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Bio
                </label>
                <div className="px-4 py-2.5 bg-muted/30 rounded-xl text-sm">
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
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Subjects Teaching</h3>
        <div className="flex flex-wrap gap-2">
          {formData.subjects?.length > 0 ? (
            formData.subjects.map((subject, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {subject}
              </span>
            ))
          ) : (
            <p className="text-muted-foreground">No subjects assigned</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}