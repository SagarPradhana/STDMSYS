"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useTokenExpiry } from "@school-management/utils";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useTokenExpiry();

  return (
    <AuthGuard allowedRole="teacher">
      {children}
    </AuthGuard>
  );
}