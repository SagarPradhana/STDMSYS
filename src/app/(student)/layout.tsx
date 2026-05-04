"use client";

import { useTokenExpiry } from "@school-management/utils";

import { AuthGuard } from "@/components/AuthGuard";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useTokenExpiry();

  return (
    <AuthGuard allowedRole="student">
      {children}
    </AuthGuard>
  );
}