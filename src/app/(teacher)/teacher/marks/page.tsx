"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Eye,
  Save,
  Loader2,
  TrendingUp,
  TrendingDown,
  Clock,
  FileCheck,
  Award,
  Target,
  Users,
  FileText,
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetExamMarksQuery,
  useSubmitMarksMutation,
  useGetTeacherClassesQuery,
  useGetExamsQuery,
  useGetStudentsByClassQuery 
} from "@school-management/store";

const statGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

export default function TeacherMarksPage() {
  const { data: classes = [] } = useGetTeacherClassesQuery();
  const { data: exams = [] } = useGetExamsQuery();
  const [submitMarks, { isLoading: isSubmitting }] = useSubmitMarksMutation();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMarks, setEditingMarks] = useState<Record<string, number>>({});
  const [showEntry, setShowEntry] = useState(false);

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudentsByClassQuery(
    selectedClass,
    { skip: !selectedClass }
  );

  const { data: marksData, isLoading: isLoadingMarks } = useGetExamMarksQuery(
    { classId: selectedClass, examId: selectedExam },
    { skip: !selectedClass || !selectedExam }
  );

  const students = (studentsData || []).map((student: any) => ({
    _id: student._id,
    name: student.name,
    rollNumber: student.rollNumber,
  }));

  const marksMap = (marksData || []).reduce((acc: any, m: any) => {
    acc[m.studentId?._id || m.studentId] = m.marks;
    return acc;
  }, {});

  const filteredStudents = students.filter((s: any) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.includes(searchTerm)
  );

  const handleSaveMarks = async () => {
    if (!selectedClass || !selectedExam) {
      toast.error("Please select class and exam");
      return;
    }
    try {
      await submitMarks({
        classId: selectedClass,
        examId: selectedExam,
        subject: selectedSubject,
        marks: Object.entries(editingMarks).map(([studentId, marks]) => ({
          studentId,
          marks,
        })),
      }).unwrap();
      toast.success("Marks submitted successfully!");
      setShowEntry(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to submit marks");
    }
  };

  const getGrade = (marks: number, total: number = 100) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 40) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-gradient-to-r from-emerald-500 to-teal-600 text-white";
    if (grade.startsWith("B")) return "bg-gradient-to-r from-cyan-500 to-blue-600 text-white";
    if (grade === "C") return "bg-gradient-to-r from-amber-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-rose-500 to-pink-600 text-white";
  };

  const allMarks = Object.values(marksMap) as number[];
  const avgMarks = allMarks.length > 0 
    ? (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(1)
    : "0";
  const highestMarks = allMarks.length > 0 ? Math.max(...allMarks) : 0;
  const lowestMarks = allMarks.length > 0 ? Math.min(...allMarks) : 0;
  const passCount = allMarks.filter(m => m >= 40).length;
  const passRate = allMarks.length > 0 
    ? ((passCount / allMarks.length) * 100).toFixed(0)
    : "0";

  const stats = [
    { label: "Class Average", value: `${avgMarks}%`, change: "", up: true, icon: Target },
    { label: "Highest Score", value: `${highestMarks}`, change: "", up: true, icon: Award },
    { label: "Lowest Score", value: `${lowestMarks}`, change: "", up: false, icon: TrendingDown },
    { label: "Pass Rate", value: `${passRate}%`, change: "", up: true, icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Marks" 
        subtitle="Manage and submit student examination marks"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          >
            <option value="">Select Class</option>
            {classes.map((c: any) => (
              <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          >
            <option value="">Select Exam</option>
            {exams.map((e: any) => (
              <option key={e._id} value={e._id}>{e.name} - {e.term}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Subject</label>
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            placeholder="Subject Name"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowEntry(true)} 
          className="gap-2 px-5 py-3 border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"
          disabled={!selectedClass}
        >
          <Plus className="w-4 h-4" /> 
          <span className="font-semibold">Enter Marks</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
                "p-2 rounded-xl bg-gradient-to-br shadow-sm",
                statGradients[index]
              )}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            />
          </div>
          <Button 
            variant="outline" 
            className="gap-2 border-slate-200 hover:bg-slate-50"
          >
            <Download className="w-4 h-4" /> 
            <span className="font-medium">Export</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No.</th>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Marks</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingStudents || isLoadingMarks ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-violet-600" />
                  </td>
                </tr>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student: any, index: number) => {
                  const marks = marksMap[student._id] || 0;
                  const grade = getGrade(marks);
                  return (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-700">{student.rollNumber}</td>
                      <td className="p-4 font-medium text-slate-800">{student.name}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-4 py-2 rounded-xl text-sm font-bold",
                          marks >= 90 ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" :
                          marks >= 70 ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" :
                          marks > 0 ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white" :
                          "bg-slate-100 text-slate-400"
                        )}>
                          {marks || "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-700 bg-clip-text text-transparent">
                          {marks > 0 ? grade : "-"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {marks >= 40 ? (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                            Passed
                          </span>
                        ) : marks > 0 ? (
                          <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
                            Failed
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-600 hover:text-violet-600 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-600 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">No Students Found</h3>
                    <p className="text-sm text-slate-500">Select a class to view students</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {showEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowEntry(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-slate-200/60 shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Enter Marks</h2>
                  <p className="text-xs text-slate-500">
                    {selectedClass && selectedExam ? `Entering marks for selected class` : "Select class and exam first"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEntry(false)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-3">
              {filteredStudents.map((student: any) => (
                <motion.div 
                  key={student._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 bg-slate-50/80 border border-slate-200/50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="w-16 text-sm font-bold text-slate-700">{student.rollNumber}</div>
                  <div className="flex-1 font-semibold text-slate-800">{student.name}</div>
                  <input
                    type="number"
                    defaultValue={marksMap[student._id] || ""}
                    onChange={(e) => setEditingMarks((prev: any) => ({ ...prev, [student._id]: parseInt(e.target.value) || 0 }))}
                    className="w-24 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    placeholder="/100"
                  />
                  <div className={cn(
                    "w-14 py-2 px-3 text-center font-bold rounded-xl text-white",
                    getGradeColor(getGrade(editingMarks[student._id] || marksMap[student._id] || 0))
                  )}>
                    {getGrade(editingMarks[student._id] || marksMap[student._id] || 0)}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <Button 
                variant="outline" 
                onClick={() => setShowEntry(false)}
                className="py-3 px-5 border-slate-200 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                className="py-3 px-5 gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25"
                onClick={handleSaveMarks} 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" /> Submit Marks
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}