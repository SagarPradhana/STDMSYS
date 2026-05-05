"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CalendarClock,
  BarChart3,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  Clock,
  TrendingUp,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useGetTeacherClassesQuery } from "@school-management/store";

const classGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600", 
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

export default function TeacherClassesPage() {
  const { data: classes = [], isLoading } = useGetTeacherClassesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const filteredClasses = (classes || []).filter(c => 
    c.classId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Classes" 
        subtitle="View and manage your assigned classes"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          />
        </div>
        <Button variant="outline" className="gap-2 px-5 py-3 border-slate-200 hover:bg-slate-50 hover:border-slate-300">
          <Filter className="w-4 h-4" /> 
          <span className="font-medium">Filter</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls: any, index: number) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={cn(
                "group bg-white rounded-2xl border border-slate-200/60 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/30 hover:-translate-y-1.5",
                selectedClass === cls._id && "ring-2 ring-violet-500 shadow-xl"
              )}
              onClick={() => setSelectedClass(cls._id)}
            >
              <div className="relative p-6">
                <div className={cn(
                  "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br",
                  classGradients[index % classGradients.length]
                )} />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-current/20",
                    "bg-gradient-to-br",
                    classGradients[index % classGradients.length]
                  )}>
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-bold",
                    "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200"
                  )}>
                    {cls.classId?.name || "Class"}
                  </span>
                </div>

                <h3 className="font-bold text-xl text-slate-800 mb-1">{cls.classId?.name || "Class"}</h3>
                <p className="text-sm text-slate-500 mb-5">{cls.section || "Section A"}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 rounded-lg bg-violet-50">
                      <Users className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className="font-semibold text-sm">{cls.studentCount || 40}</span>
                    <span className="text-xs text-slate-400">Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 rounded-lg bg-emerald-50">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold text-sm">{cls.subjectCount || 1}</span>
                    <span className="text-xs text-slate-400">Subjects</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last activity: Today</span>
                  </div>
                  <div className={cn(
                    "p-2 rounded-xl bg-slate-100 group-hover:bg-white transition-all",
                    "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  )}>
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60">
          <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <GraduationCap className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">No Classes Assigned</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">You don't have any classes assigned yet. Contact your administrator to assign classes.</p>
        </div>
      )}
    </div>
  );
}