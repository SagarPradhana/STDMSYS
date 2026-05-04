"use client";

import { useState } from "react";
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
} from "lucide-react";
import { PageHeader, Button } from "@school-management/ui";
import { cn } from "@school-management/utils";
import toast from "react-hot-toast";
import { 
  useGetExamMarksQuery,
  useSubmitMarksMutation,
  useGetTeacherClassesQuery,
  useGetExamsQuery 
} from "@school-management/store";

interface StudentMark {
  studentId: { _id: string; name: string; rollNumber: string };
  marks: number;
  grade: string;
  remarks: string;
}

interface ExamRecord {
  _id: string;
  examId: { name: string; term: string };
  classId: { name: string };
  subject: string;
  marks: StudentMark[];
  totalMarks: number;
  submittedAt: string;
}

export default function TeacherMarksPage() {
  const { data: classes = [] } = useGetTeacherClassesQuery();
  const { data: exams = [] } = useGetExamsQuery();
  const { data: marksData = [], isLoading } = useGetExamMarksQuery(
    { classId: "", examId: "" },
    { skip: true }
  );
  const [submitMarks, { isLoading: isSubmitting }] = useSubmitMarksMutation();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMarks, setEditingMarks] = useState<Record<string, number>>({});
  const [showEntry, setShowEntry] = useState(false);

  const sampleStudents = [
    { _id: "1", name: "Aarav Sharma", rollNumber: "001", marks: 85 },
    { _id: "2", name: "Bhavya Patel", rollNumber: "002", marks: 92 },
    { _id: "3", name: "Charlie Singh", rollNumber: "003", marks: 78 },
    { _id: "4", name: "Diya Verma", rollNumber: "004", marks: 88 },
    { _id: "5", name: "Ethan Kumar", rollNumber: "005", marks: 71 },
  ];

  const filteredStudents = sampleStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.includes(searchTerm)
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

  const stats = [
    { label: "Class Average", value: "78.5%", change: "+2.3%", up: true },
    { label: "Highest Score", value: "95", change: "+5", up: true },
    { label: "Lowest Score", value: "45", change: "-3", up: false },
    { label: "Pass Rate", value: "92%", change: "+1%", up: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Marks" 
        subtitle="Manage and submit student examination marks"
      />

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 bg-card border rounded-xl text-sm"
          >
            <option value="">Select Class</option>
            {classes.map((c: any) => (
              <option key={c._id} value={c.classId?._id}>{c.classId?.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-4 py-2.5 bg-card border rounded-xl text-sm"
          >
            <option value="">Select Exam</option>
            {exams.map((e: any) => (
              <option key={e._id} value={e._id}>{e.name} - {e.term}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Subject</label>
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2.5 bg-card border rounded-xl text-sm"
            placeholder="Subject Name"
          />
        </div>
        <Button variant="outline" onClick={() => setShowEntry(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Enter Marks
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-4 border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              {stat.up ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className={cn("text-xs", stat.up ? "text-green-500" : "text-red-500")}>
              {stat.change} from last exam
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-xl text-sm"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-muted-foreground uppercase">Roll No.</th>
                <th className="p-4 text-left text-xs font-bold text-muted-foreground uppercase">Student Name</th>
                <th className="p-4 text-center text-xs font-bold text-muted-foreground uppercase">Marks</th>
                <th className="p-4 text-center text-xs font-bold text-muted-foreground uppercase">Grade</th>
                <th className="p-4 text-center text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-center text-xs font-bold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStudents.map((student, index) => {
                const grade = getGrade(student.marks);
                return (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30"
                  >
                    <td className="p-4 font-medium">{student.rollNumber}</td>
                    <td className="p-4">{student.name}</td>
                    <td className="p-4 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        student.marks >= 90 ? "bg-green-500/10 text-green-500" :
                        student.marks >= 70 ? "bg-blue-500/10 text-blue-500" :
                        "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {student.marks}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-bold">{grade}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full">
                        Submitted
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marks Entry Modal */}
      {showEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEntry(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Enter Marks</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedClass && selectedExam ? `${selectedClass} - ${selectedExam}` : "Select class and exam first"}
                </p>
              </div>
              <button 
                onClick={() => setShowEntry(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-3">
                {sampleStudents.map((student) => (
                  <div key={student._id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                    <div className="w-20 text-sm font-medium">{student.rollNumber}</div>
                    <div className="flex-1">{student.name}</div>
                    <input
                      type="number"
                      defaultValue={student.marks}
                      onChange={(e) => setEditingMarks(prev => ({ ...prev, [student._id]: parseInt(e.target.value) || 0 }))}
                      className="w-20 px-3 py-2 bg-card border rounded-lg text-center"
                      placeholder="Marks"
                    />
                    <div className="w-12 text-center font-bold">
                      {getGrade(editingMarks[student._id] || student.marks)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEntry(false)}>Cancel</Button>
              <Button className="gap-2" onClick={handleSaveMarks} disabled={isSubmitting}>
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