"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Shield } from "lucide-react";
import { useAppDispatch, setCredentials } from "@school-management/store";
import { isTokenExpired } from "@school-management/utils";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") {
          router.push("/dashboard");
        } else if (user.role === "student") {
          router.push("/student/dashboard");
        } else if (user.role === "teacher") {
          router.push("/teacher/dashboard");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      }
    }
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          remember: data.remember ?? false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("user", JSON.stringify(result.user));
      if (result.refreshToken) {
        localStorage.setItem("refreshToken", result.refreshToken);
      }

      dispatch(setCredentials({
        user: result.user,
        token: result.accessToken,
        refreshToken: result.refreshToken
      }));

      if (result.user.role === "admin") {
        router.push("/dashboard");
      } else if (result.user.role === "student") {
        router.push("/student/dashboard");
      } else if (result.user.role === "teacher") {
        router.push("/teacher/dashboard");
      } else {
        throw new Error("Invalid role");
      }
    } catch (err: unknown) {
      let message = "Login failed";
      if (err instanceof TypeError && err.message.includes("fetch")) {
        message = "Unable to connect to server. Please ensure the backend is running on port 5000.";
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_40%)]" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
            <GraduationCap className="w-7 h-7 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide mb-2">EduFlow</h1>
          <p className="text-sm text-slate-400 mb-10">School Management System</p>

          <div className="space-y-4 w-full max-w-xs">
            {[
              { title: "Attendance Tracking", desc: "Monitor daily attendance and generate reports" },
              { title: "Grade Management", desc: "Record and analyze student performance" },
              { title: "Communication Hub", desc: "Connect teachers, students, and parents" },
            ].map((item) => (
              <div key={item.title} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/8">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-white/90 font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 mt-12">© {new Date().getFullYear()} EduFlow. All rights reserved.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-lg font-bold text-slate-900">EduFlow</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                id="email"
                {...register("email")}
                type="email"
                placeholder="name@school.edu"
                className={`w-full h-11 px-3.5 text-sm bg-white border rounded-lg outline-none transition-colors placeholder:text-slate-400 ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full h-11 px-3.5 pr-10 text-sm bg-white border rounded-lg outline-none transition-colors placeholder:text-slate-400 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-8 text-slate-400">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-xs">Secure login • Protected by authentication system</span>
          </div>
        </div>
      </div>
    </div>
  );
}
