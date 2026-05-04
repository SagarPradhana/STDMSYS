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
  ChevronLeft,
  ChevronRight,
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
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "absent": return <XCircle className="w-4 h-4 text-red-500" />;
      case "leave": return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mark Attendance" 
        subtitle="Record daily attendance for your classes"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 bg-card border rounded-xl text-sm"
          >
            <option value="">Select a class</option>
            {classes.map((cls: any) => (
              <option key={cls._id} value={cls.classId?._id}>
                {cls.classId?.name} - {cls.section || "Section A"}
              </option>
            ))}
          </select>
        </div>
        
        <div className="min-w-[150px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              const dayIndex = new Date(e.target.value).getDay();
              setSelectedDay(DAYS[dayIndex - 1] || "Monday");
            }}
            className="w-full px-4 py-2.5 bg-card border rounded-xl text-sm"
          />
        </div>

        <div className="min-w-[120px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Day</label>
          <div className="px-4 py-2.5 bg-muted/50 rounded-xl text-sm font-medium">
            {selectedDay}
          </div>
        </div>
      </div>

      {selectedClass ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border overflow-hidden"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              <span className="font-semibold">Student List</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" /> Present
              </span>
              <span className="flex items-center gap-1">
                <XCircle className="w-4 h-4 text-red-500" /> Absent
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-yellow-500" /> Leave
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            </div>
          ) : students?.length > 0 ? (
            <div className="divide-y">
              {students.map((student: any, index: number) => {
                const studentId = student.studentId?._id || student._id;
                const currentStatus = attendance[studentId] || "present";
                
                return (
                  <motion.div 
                    key={studentId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 flex items-center justify-between hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {student.studentId?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="font-medium">{student.studentId?.name || "Student"}</p>
                        <p className="text-xs text-muted-foreground">{student.studentId?.rollNumber || ""}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(["present", "absent", "leave"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(studentId, status)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize",
                            currentStatus === status
                              ? status === "present" ? "bg-green-500 text-white" :
                                status === "absent" ? "bg-red-500 text-white" :
                                "bg-yellow-500 text-white"
                              : "bg-muted hover:bg-muted/80"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No students found for this class</p>
            </div>
          )}

          {students?.length > 0 && (
            <div className="p-4 border-t flex justify-between items-center bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Total: {students.length} students
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
                >
                  Mark All Present
                </Button>
                <Button 
                  onClick={handleSaveAttendance}
                  disabled={isMarking}
                  className="gap-2"
                >
                  {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Attendance
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl border">
          <CalendarClock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Select a class to mark attendance</p>
        </div>
      )}
    </div>
  );
}