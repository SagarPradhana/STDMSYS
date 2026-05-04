import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@school-management/utils";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
  {
    variants: {
      status: {
        present: "bg-emerald-50 text-emerald-600 border-emerald-200",
        absent: "bg-rose-50 text-rose-600 border-rose-200",
        late: "bg-amber-50 text-amber-600 border-amber-200",
        excused: "bg-blue-50 text-blue-600 border-blue-200",
        paid: "bg-emerald-50 text-emerald-600 border-emerald-200",
        pending: "bg-amber-50 text-amber-600 border-amber-200",
        overdue: "bg-rose-50 text-rose-600 border-rose-200",
        submitted: "bg-blue-50 text-blue-600 border-blue-200",
        graded: "bg-emerald-50 text-emerald-600 border-emerald-200",
        pending_grading: "bg-amber-50 text-amber-600 border-amber-200",
        approved: "bg-emerald-50 text-emerald-600 border-emerald-200",
        rejected: "bg-rose-50 text-rose-600 border-rose-200",
        upcoming: "bg-indigo-50 text-indigo-600 border-indigo-200",
        ongoing: "bg-emerald-50 text-emerald-600 border-emerald-200",
        completed: "bg-slate-50 text-slate-600 border-slate-200",
        active: "bg-emerald-50 text-emerald-600 border-emerald-200",
        inactive: "bg-rose-50 text-rose-600 border-rose-200",
        "on-leave": "bg-amber-50 text-amber-600 border-amber-200",
        new: "bg-violet-50 text-violet-600 border-violet-200",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
);

interface StatusBadgeProps
  extends VariantProps<typeof statusVariants> {
  className?: string;
}

const statusLabels: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
  submitted: "Submitted",
  graded: "Graded",
  pending_grading: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
  new: "New",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusVariants({ status }), className)}>
      {statusLabels[status || "pending"]}
    </span>
  );
}