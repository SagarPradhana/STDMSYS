import * as React from "react";
import { cn } from "@school-management/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon?: LucideIcon;
  color?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
  showTrend?: boolean;
}

const colorGradients = {
  primary: "from-violet-500 to-purple-600",
  success: "from-emerald-500 to-teal-600",
  warning: "from-amber-500 to-orange-600",
  danger: "from-rose-500 to-pink-600",
  info: "from-cyan-500 to-blue-600",
};

const colorBgGradients = {
  primary: "bg-violet-50",
  success: "bg-emerald-50",
  warning: "bg-amber-50",
  danger: "bg-rose-50",
  info: "bg-cyan-50",
};

const colorDotGradients = {
  primary: "bg-violet-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-cyan-500",
};

const colorTextColors = {
  primary: "text-violet-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger: "text-rose-600",
  info: "text-cyan-600",
};

const colorHoverGradients = {
  primary: "hover:from-violet-600 hover:to-purple-700",
  success: "hover:from-emerald-600 hover:to-teal-700",
  warning: "hover:from-amber-600 hover:to-orange-700",
  danger: "hover:from-rose-600 hover:to-pink-700",
  info: "hover:from-cyan-600 hover:to-blue-700",
};

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon: Icon,
  color = "primary",
  className,
  showTrend = true,
}: StatsCardProps) {
  const gradient = colorGradients[color] || colorGradients.primary;
  const bgGradient = colorBgGradients[color] || colorBgGradients.primary;
  const dotColor = colorDotGradients[color] || colorDotGradients.primary;
  const textColor = colorTextColors[color] || colorTextColors.primary;
  const hoverGradient = colorHoverGradients[color] || colorHoverGradients.primary;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <div className={cn("absolute right-0 top-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 bg-gradient-to-br", gradient)} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">{title}</span>
          {Icon && (
            <div className={cn("p-2 rounded-xl bg-gradient-to-br shadow-sm transition-all duration-300 group-hover:scale-110", gradient, hoverGradient)}>
              <Icon className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-800">
            {value}
          </span>
          {change !== undefined && showTrend && (
            <span className={cn("flex items-center text-sm font-semibold", changeType === "positive" ? "text-emerald-600" : changeType === "negative" ? "text-rose-600" : "text-slate-400")}>
              {changeType === "positive" && <TrendingUp className="h-3.5 w-3.5 mr-0.5" />}
              {changeType === "negative" && <TrendingDown className="h-3.5 w-3.5 mr-0.5" />}
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          )}
        </div>
        
        {(description || change === undefined) && (
          <div className="mt-2">
            {description && (
              <span className="text-xs font-medium text-slate-400">
                {description}
              </span>
            )}
            {change === undefined && !description && (
              <div className="flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />
                <span className={cn("text-xs font-medium", textColor)}>
                  Active
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={cn("absolute bottom-0 left-0 right-0 h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r", gradient)} />
    </div>
  );
}