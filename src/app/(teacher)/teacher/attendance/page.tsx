"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  CalendarClock,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Loader2,
  UserCheck,
  UserX,
  CalendarOff,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetAttendanceQuery, 
  useMarkAttendanceMutation,
  useGetTeacherClassesQuery 
} from "@school-management/store";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherAttendancePage() {
  const { data: classes = [] } = useGetTeacherClassesQuery();
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || "Monday");
  
  const { data: students = [], isLoading } = useGetAttendanceQuery({
    classId: selectedClass,
    date: selectedDate,
  }, { skip: !selectedClass });
  
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();
  
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "leave">>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (students?.length > 0) {
      const initial: Record<string, "present" | "absent" | "leave"> = {};
      students.forEach((s: any) => {
        initial[s.studentId?._id || s._id] = s.status || "present";
      });
      setAttendance(initial);
      setSaved(false);
    }
  }, [students]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) {
      toast.error("Please select a class");
      return;
    }
    
    try {
      await markAttendance({
        classId: selectedClass,
        date: selectedDate,
        records: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      }).unwrap();
      toast.success("Attendance marked successfully!");
      setSaved(true);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to mark attendance");
    }
  };

  const selectedClassName = classes.find((c: any) => c.classId?._id === selectedClass)?.classId?.name;

  const presentCount = Object.values(attendance).filter(s => s === "present").length;
  const absentCount = Object.values(attendance).filter(s => s === "absent").length;
  const leaveCount = Object.values(attendance).filter(s => s === "leave").length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mark Attendance" 
        subtitle="Record daily attendance for your classes"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          >
            <option value="">Select a class</option>
            {classes.map((cls: any) => (
              <option key={cls._id} value={cls.classId?._id}>
                {cls.classId?.name} - {cls.section || "Section A"}
              </option>
            ))}
          </select>
        </div>
        
        <div className="min-w-[160px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              const dayIndex = new Date(e.target.value).getDay();
              setSelectedDay(DAYS[dayIndex - 1] || "Monday");
            }}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>

        <div className="min-w-[140px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Day</label>
          <div className="px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl text-sm font-semibold text-violet-700">
            {selectedDay}
          </div>
        </div>
      </div>

      {selectedClass ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm"
        >
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                <ClipboardCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{selectedClassName}</h3>
                <p className="text-xs text-slate-500">Student Attendance List</p>
              </div>
            </div>
            
            {students?.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">{presentCount}</span>
                  <span className="text-xs text-emerald-500">Present</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50">
                  <UserX className="w-4 h-4 text-rose-600" />
                  <span className="text-sm font-semibold text-rose-700">{absentCount}</span>
                  <span className="text-xs text-rose-500">Absent</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50">
                  <CalendarOff className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">{leaveCount}</span>
                  <span className="text-xs text-amber-500">Leave</span>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
              </div>
              <p className="text-sm text-slate-500">Loading students...</p>
            </div>
          ) : students?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {students.map((student: any, index: number) => {
                const studentId = student.studentId?._id || student._id;
                const currentStatus = attendance[studentId] || "present";
                
                return (
                  <motion.div 
                    key={studentId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white">
                        {student.studentId?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.studentId?.name || "Student"}</p>
                        <p className="text-xs text-slate-500 font-medium">Roll No: {student.studentId?.rollNumber || ""}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {(["present", "absent", "leave"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(studentId, status)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5",
                            currentStatus === status
                              ? status === "present" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25" :
                                status === "absent" ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25" :
                                "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          )}
                        >
                          {status === "present" && <CheckCircle className="w-3.5 h-3.5" />}
                          {status === "absent" && <XCircle className="w-3.5 h-3.5" />}
                          {status === "leave" && <Clock className="w-3.5 h-3.5" />}
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">No Students Found</h3>
              <p className="text-sm text-slate-500">No students are enrolled in this class yet</p>
            </div>
          )}

          {students?.length > 0 && (
            <div className="p-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
              <div className="text-sm text-slate-500">
                <span className="font-bold text-slate-700">{students.length}</span> students in class
                {saved && <span className="ml-2 text-emerald-600 font-medium">• Saved</span>}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const allPresent: Record<string, "present" | "absent" | "leave"> = {};
                    students.forEach((s: any) => {
                      allPresent[s.studentId?._id || s._id] = "present";
                    });
                    setAttendance(allPresent);
                  }}
                  className="gap-2 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark All Present
                </Button>
                <Button 
                  onClick={handleSaveAttendance}
                  disabled={isMarking}
                  className="gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                >
                  {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Attendance
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <CalendarClock className="w-10 h-10 text-violet-400" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">Select a Class</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Choose a class from the dropdown above to start marking attendance</p>
        </div>
      )}
    </div>
  );
}