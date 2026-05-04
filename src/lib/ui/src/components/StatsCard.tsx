import * as React from "react";
import { cn } from "@school-management/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon?: LucideIcon;
  color?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon: Icon,
  color = "primary",
  className,
}: StatsCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-success"
      : changeType === "negative"
      ? "text-danger"
      : "text-muted";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{title}</span>
        {Icon && (
          <Icon className={cn("h-5 w-5", `text-${color}`)} />
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {value}
        </span>
        {change !== undefined && (
          <span className={cn("text-sm", changeColor)}>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
        {description && (
          <span className="text-sm text-muted">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}