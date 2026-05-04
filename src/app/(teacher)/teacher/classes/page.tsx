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
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import { useGetTeacherClassesQuery } from "@school-management/store";

export default function TeacherClassesPage() {
  const { data: classes = [], isLoading } = useGetTeacherClassesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const filteredClasses = classes.filter(c => 
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border rounded-xl text-sm"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls: any, index: number) => (
            <motion.div
              key={cls._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "bg-card rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg",
                selectedClass === cls._id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedClass(cls._id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--grad-secondary)" }}>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {cls.classId?.name || "Class"}
                </span>
              </div>

              <h3 className="font-semibold text-lg mb-1">{cls.classId?.name || "Class"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cls.section || "Section A"}</p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{cls.studentCount || 40} Students</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{cls.subjectCount || 1} Subject</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">View Details</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No Classes Assigned</h3>
          <p className="text-sm text-muted-foreground">You don't have any classes assigned yet.</p>
        </div>
      )}
    </div>
  );
}