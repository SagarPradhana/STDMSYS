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
  ArrowLeft,
  ArrowRight,
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

interface LocalTimetableSlot {
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
    return timetable.find((s: any) => s.day === day && s.period === period);
  };

  const getSubjectStyle = (subject: string, index: number) => {
    const gradients = [
      "from-violet-500 to-purple-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-cyan-500 to-blue-600",
      "from-rose-500 to-pink-600",
      "from-indigo-500 to-blue-600",
    ];
    const gradient = gradients[index % gradients.length];
    return gradient;
  };

  const totalPeriods = timetable.length;
  const activeSubjects = new Set(timetable.map((s: any) => s.subjectId?.name)).size;

  const statCards = [
    { label: "Total Periods", value: `${totalPeriods}/Week`, icon: CalendarClock, gradient: "from-violet-500 to-purple-600" },
    { label: "Active Subjects", value: `${activeSubjects}`, icon: BookOpen, gradient: "from-emerald-500 to-teal-600" },
    { label: "Working Days", value: "Mon - Sat", icon: Clock, gradient: "from-cyan-500 to-blue-600" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Schedule" 
        subtitle="Weekly teaching timetable"
      />

      <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentWeek(newDate);
            }}
            className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <CalendarClock className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {weekDates[0].toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <p className="text-xs text-slate-500">Week {Math.ceil(weekDates[0].getDate() / 7)}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const newDate = new Date(currentWeek);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentWeek(newDate);
            }}
            className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group bg-white rounded-2xl p-5 border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={cn(
                "p-2.5 rounded-xl bg-gradient-to-br shadow-sm transition-transform group-hover:scale-110",
                stat.gradient
              )}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="p-4 text-left border-b w-36">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</span>
                  </th>
                  {DAYS.map((day, i) => {
                    const date = weekDates[i];
                    const isToday = date.toDateString() === new Date().toDateString();
                    return (
                      <th key={day} className={cn(
                        "p-4 text-center border-b min-w-[160px]", 
                        isToday && "bg-violet-50/80 border-l border-r border-violet-200"
                      )}>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{day}</span>
                        <div className={cn(
                          "text-xs mt-1.5 font-bold",
                          isToday ? "text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full inline-block" : "text-slate-500"
                        )}>
                          {date.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PERIODS.map((period, pIdx) => (
                  <tr key={period.label} className="hover:bg-slate-50/50">
                    <td className="p-4 border-b">
                      <p className="text-sm font-bold text-violet-700">{period.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{period.time}</p>
                    </td>
                    {period.isBreak ? (
                      <td colSpan={DAYS.length} className="p-4 border-b">
                        <div className="w-full py-3 bg-slate-100/80 rounded-xl flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {period.label}
                          </span>
                        </div>
                      </td>
                    ) : (
                      DAYS.map((_, dayIdx) => {
                        const slot = getSlot(dayIdx, pIdx);
                        const gradient = slot ? getSubjectStyle((slot as any).subjectId?.name, dayIdx) : null;
                        return (
                          <td key={`${dayIdx}-${pIdx}`} className="p-2 border-b align-top">
                            {slot ? (
                              <div className={cn(
                                "group p-4 rounded-2xl border transition-all hover:shadow-lg",
                                "bg-gradient-to-br shadow-sm hover:shadow-md",
                                gradient
                              )}>
                                <h4 className="text-sm font-bold text-white mb-1.5">
                                  {(slot as any).subjectId?.name}
                                </h4>
                                <p className="text-xs text-white/80 font-medium">{(slot as any).classId?.name}</p>
                                <div className="flex items-center gap-1.5 mt-3 text-xs text-white/70">
                                  <MapPin className="w-3 h-3" />
                                  <span className="font-semibold">{slot.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full min-h-[100px] border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center">
                                <span className="text-xs font-medium text-slate-300">Free</span>
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