"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  BookOpen,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { PageHeader } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useGetTeacherTimetableQuery } from "@school-management/store";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const PERIODS = [
  { time: "08:00 - 08:50", label: "Period 1" },
  { time: "09:00 - 09:50", label: "Period 2" },
  { time: "10:00 - 10:50", label: "Period 3" },
  { time: "10:50 - 11:30", label: "Recess", isBreak: true },
  { time: "11:30 - 12:20", label: "Period 4" },
  { time: "12:30 - 13:20", label: "Period 5" },
  { time: "13:20 - 14:00", label: "Lunch", isBreak: true },
  { time: "14:00 - 14:50", label: "Period 6" },
];

interface TimetableSlot {
  _id: string;
  day: string;
  period: number;
  subjectId: { _id: string; name: string };
  classId: { name: string };
  room: string;
}

export default function TeacherSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { data: timetable = [], isLoading } = useGetTeacherTimetableQuery();

  const getWeekDates = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay() + 1);
    const dates = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const getSlot = (dayIndex: number, periodIndex: number) => {
    const day = DAYS[dayIndex];
    let period = periodIndex;
    if (periodIndex > 2) period += 1;
    if (periodIndex > 5) period += 1;
    return timetable.find((s: TimetableSlot) => s.day === day && s.period === period);
  };

  const getSubjectStyle = (subject: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      "Mathematics": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
      "Physics": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
      "Chemistry": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
      "English": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    };
    return styles[subject] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" };
  };

  const totalPeriods = timetable.length;
  const activeSubjects = new Set(timetable.map((s: TimetableSlot) => s.subjectId?.name)).size;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Schedule" 
        subtitle="Weekly teaching timetable"
      />

      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            const newDate = new Date(currentWeek);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentWeek(newDate);
          }}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-semibold">
          {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
        <button 
          onClick={() => {
            const newDate = new Date(currentWeek);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentWeek(newDate);
          }}
          className="p-2 rounded-lg hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-6 border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Total Periods</span>
          </div>
          <div className="text-3xl font-bold">{totalPeriods}/Week</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Active Subjects</span>
          </div>
          <div className="text-3xl font-bold">{activeSubjects}</div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-6 border"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Working Days</span>
          </div>
          <div className="text-3xl font-bold">Mon - Sat</div>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="p-4 text-left border-b w-32">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Time</span>
                  </th>
                  {DAYS.map((day, i) => {
                    const date = weekDates[i];
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <th key={day} className={cn("p-4 text-center border-b min-w-[150px]", isToday && "bg-primary/5")}>
                        <span className="text-xs font-bold uppercase tracking-widest">{day}</span>
                        <div className={cn("text-xs mt-1", isToday ? "text-primary font-bold" : "text-muted-foreground")}>
                          {date.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pIdx) => (
                  <tr key={period.label} className="hover:bg-muted/20">
                    <td className="p-4 border-b">
                      <p className="text-xs font-medium text-primary">{period.label}</p>
                      <p className="text-xs text-muted-foreground">{period.time}</p>
                    </td>
                    {period.isBreak ? (
                      <td colSpan={DAYS.length} className="p-4 border-b">
                        <div className="w-full py-2 bg-muted/30 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {period.label}
                          </span>
                        </div>
                      </td>
                    ) : (
                      DAYS.map((_, dayIdx) => {
                        const slot = getSlot(dayIdx, pIdx);
                        const style = slot ? getSubjectStyle(slot.subjectId?.name) : null;
                        return (
                          <td key={`${dayIdx}-${pIdx}`} className="p-2 border-b align-top">
                            {slot ? (
                              <div className={cn("p-3 rounded-xl border transition-all hover:shadow-md", style?.bg, style?.border)}>
                                <h4 className={cn("text-sm font-semibold mb-1", style?.text)}>
                                  {slot.subjectId?.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">{slot.classId?.name}</p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  <span>{slot.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[80px] border-2 border-dashed border-muted-200 rounded-xl flex items-center justify-center opacity-30">
                                <span className="text-xs font-medium text-muted-foreground">Free</span>
                              </div>
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}