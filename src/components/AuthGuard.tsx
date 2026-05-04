"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loading } from "@school-management/ui";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRole: "admin" | "student" | "teacher";
}

export function AuthGuard({ children, allowedRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      
      // If user role doesn't match the required role for this portal
      if (user.role !== allowedRole) {
        // Redirect to their correct portal
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "student") {
          router.push("/student/dashboard");
        } else if (user.role === "teacher") {
          router.push("/teacher/dashboard");
        } else {
          router.push("/login");
        }
        return;
      }

      setIsAuthorized(true);
    } catch {
      router.push("/login");
    }
  }, [router, allowedRole, pathname]);

  if (!isAuthorized) {
    return <Loading fullPage />;
  }

  return <>{children}</>;
}
