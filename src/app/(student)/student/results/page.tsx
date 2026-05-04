"use client"
import { useState, useEffect } from "react";
import {
  BarChart3,
  Trophy,
  Target,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";

interface ResultData {
  _id: string;
  examId: { name: string; type: string; schedule: { date: string }[] };
  marks: { subjectId: { name: string }; marks: number; grade: string }[];
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ResultData[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/exams/results/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setResults(json.data);
        setSelectedResult(json.data[0]);
      }
    } catch (error) {
      console.error("Fetch results error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "A+": "#059669",
      "A": "#10B981",
      "B+": "#2563EB",
      "B": "#3B82F6",
      "C": "#F59E0B",
      "D": "#EF4444",
      "F": "#DC2626",
    };
    return colors[grade] || "#64748b";
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!selectedResult) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <FileText size={64} className="mb-4 opacity-20" />
        <p className="text-sm font-black uppercase tracking-widest">No results available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Academic Performance</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto max-w-full">
          {results.map((res, i) => (
            <button
              key={i}
              onClick={() => setSelectedResult(res)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedResult._id === res._id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
            >
              {res.examId.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 p-8 rounded-[32px] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <Trophy className="text-emerald-300 mb-6" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Percentage Score</p>
            <h3 className="text-4xl font-black tracking-tight italic">{selectedResult.percentage.toFixed(1)}%</h3>
            <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest mt-2 flex items-center gap-1">
              <TrendingUp size={10} /> Overall Performance
            </p>
          </div>
          <ArrowUpRight className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <Target className="text-amber-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Marks</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">{selectedResult.totalMarks}</h3>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-2">Status: Passed</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <BarChart3 className="text-blue-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Final Grade</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">{selectedResult.grade}</h3>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-2">Scale: 100</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <Trophy className="text-emerald-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Class Rank</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">#{selectedResult.rank || 'N/A'}</h3>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-2">Keep it up!</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">{selectedResult.examId.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Subject-wise Score Breakdown</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Date</p>
            <p className="text-xs font-bold text-slate-800">
              {selectedResult.examId.schedule?.[0]?.date ? new Date(selectedResult.examId.schedule[0].date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Name</span></th>
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score Progress</span></th>
                <th className="px-8 py-5 text-center"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Marks</span></th>
                <th className="px-8 py-5 text-right"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {selectedResult.marks.map((s, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{s.subjectId?.name || 'Subject'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Academic Session 2025-26</p>
                  </td>
                  <td className="px-8 py-6 w-1/3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.marks}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600">{s.marks}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{s.marks}<span className="text-slate-300 text-[10px]">/100</span></p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span
                      className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm"
                      style={{
                        color: getGradeColor(s.grade),
                        borderColor: getGradeColor(s.grade) + '20',
                        backgroundColor: getGradeColor(s.grade) + '05'
                      }}
                    >
                      {s.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}