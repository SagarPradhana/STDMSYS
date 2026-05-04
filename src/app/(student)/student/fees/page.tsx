"use client";
import {
  CreditCard,
  Download,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Loader2,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";

interface FeeRecord {
  _id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
  paidDate?: string;
  transactionId?: string;
}

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/fees/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setFees(json.data);
      }
    } catch (error) {
      console.error("Fetch fees error:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    paid: fees.filter(f => f.status === "paid").reduce((s, f) => s + f.amount, 0),
    pending: fees.filter(f => f.status === "pending" || f.status === "overdue").reduce((s, f) => s + f.amount, 0)
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">Fee Status & Payments</h2>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mt-1.5" />
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm group">
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          Download Receipt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 rounded-[32px] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <TrendingUp className="text-emerald-300 mb-6" size={24} />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Total Paid Amount</p>
            <h3 className="text-3xl font-black tracking-tight italic">₹{stats.paid.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-100">Status: Verified</span>
            </div>
          </div>
          <CreditCard className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
          <ShieldCheck className="text-amber-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Pending</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">₹{stats.pending.toLocaleString()}</h3>
          <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-4 italic">Next due soon</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-emerald-900/5 transition-all">
          <CreditCard className="text-blue-500 mb-6" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Next Payment</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight italic">
            ₹{(fees.find(f => f.status === "pending")?.amount || 0).toLocaleString()}
          </h3>
          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-4">
            {fees.find(f => f.status === "pending")?.type || "None Pending"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">Transaction History</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Full breakdown of fees and payments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fee Description</span></th>
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</span></th>
                <th className="px-8 py-5 text-left"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</span></th>
                <th className="px-8 py-5 text-center"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span></th>
                <th className="px-8 py-5 text-right"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fees.length > 0 ? fees.map((f, i) => (
                <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight">{f.type}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Ref: {f.transactionId || 'N/A'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-600">{new Date(f.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800 tracking-tight italic">₹{f.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${f.status === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"} inline-block w-24 text-center`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {f.status === "paid" ? (
                      <button className="text-emerald-600 hover:text-emerald-700 p-2 rounded-xl hover:bg-emerald-50 transition-all">
                        <ExternalLink size={18} />
                      </button>
                    ) : (
                      <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase tracking-widest">No fee records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}