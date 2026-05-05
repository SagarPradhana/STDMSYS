"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, GraduationCap, Shield, BookOpen, Users, BarChart3 } from "lucide-react";
import { useAppDispatch, setCredentials } from "@school-management/store";
import { isTokenExpired, cn } from "@school-management/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Left Side - Cinematic School Collage */}
      <motion.div 
        className="hidden lg:block lg:w-[45%] relative overflow-hidden bg-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Collage Background Grid */}
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-2 h-full gap-4 p-4 opacity-40">
            <motion.div 
              className="relative rounded-3xl overflow-hidden h-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <img 
                src="/collage/school-1.png" 
                alt="School architecture" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </motion.div>
            <div className="flex flex-col gap-4 h-full">
              <motion.div 
                className="relative rounded-3xl overflow-hidden flex-1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <img 
                  src="/collage/school-2.png" 
                  alt="Student life" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-slate-900/50 via-transparent to-transparent" />
              </motion.div>
              <motion.div 
                className="relative rounded-3xl overflow-hidden flex-1"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <img 
                  src="/collage/school-3.png" 
                  alt="Modern classroom" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-transparent to-slate-900/80 z-[2]" />
        
        {/* Animated Particles/Icons */}
        <div className="absolute inset-0 z-[3] pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0.1 + Math.random() * 0.2,
                scale: 0.5 + Math.random() * 0.5
              }}
              animate={{
                y: ["-10%", "110%"],
                x: ["0%", (Math.random() > 0.5 ? "20%" : "-20%")],
                rotate: [0, 360]
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: -Math.random() * 20
              }}
            >
              {i % 3 === 0 ? <BookOpen className="text-indigo-300 w-8 h-8" /> : 
               i % 3 === 1 ? <GraduationCap className="text-blue-300 w-10 h-10" /> : 
               <Users className="text-emerald-300 w-6 h-6" />}
            </motion.div>
          ))}
        </div>

        {/* Floating Content Card */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            className="p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center max-w-sm"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-8 mx-auto shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              EduFlow <span className="text-blue-400 font-medium tracking-normal text-2xl block mt-1 italic">Pro</span>
            </h1>
            
            <p className="text-indigo-100/70 text-sm leading-relaxed mb-10">
              The next generation of academic excellence management. Seamlessly connecting educators, students, and administrators.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold uppercase tracking-wider">Secure Access</div>
                  <div className="text-indigo-200/50 text-[10px]">Enterprise-grade security</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default group">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold uppercase tracking-wider">Advanced Analytics</div>
                  <div className="text-indigo-200/50 text-[10px]">Data-driven decisions</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent z-[4]" />
      </motion.div>

      {/* Right Form Panel */}
      <motion.div 
        className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Subtle Background Elements for the right side */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />

        <motion.div 
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <motion.div 
            className="lg:hidden flex items-center gap-3 mb-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">EDUFLOW</span>
              <span className="text-[10px] font-bold text-blue-600 block uppercase tracking-widest leading-none mt-1">Management System</span>
            </div>
          </motion.div>
          
          {/* Form Container with Glassmorphism */}
          <motion.div 
            className="bg-white/70 backdrop-blur-xl border border-slate-200 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Portal</h2>
              <p className="text-slate-500 mt-2 text-sm font-medium">Welcome back! Please enter your credentials to continue.</p>
              <div className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-4" />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                      <Shield className="w-3 h-3 text-rose-600" />
                    </div>
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Email Identity</label>
                <div className="relative group">
                  <input
                    id="email"
                    {...register("email")}
                    type="email"
                    placeholder="name@school.edu"
                    className={`w-full h-14 px-5 text-sm bg-slate-50/50 border rounded-2xl outline-none transition-all duration-300 placeholder:text-slate-400 font-medium group-hover:bg-white ${
                      errors.email
                        ? "border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-600 text-[11px] font-bold mt-2 ml-1 uppercase tracking-tight">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2.5 ml-1">Secret Key</label>
                <div className="relative group">
                  <input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full h-14 px-5 pr-14 text-sm bg-slate-50/50 border rounded-2xl outline-none transition-all duration-300 placeholder:text-slate-400 font-medium group-hover:bg-white ${
                      errors.password
                        ? "border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                        : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white/0 hover:bg-indigo-50 rounded-xl"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-600 text-[11px] font-bold mt-2 ml-1 uppercase tracking-tight">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      {...register("remember")}
                      className="peer w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all opacity-0 absolute"
                    />
                    <div className="w-5 h-5 rounded-lg border-2 border-slate-300 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                      <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5 opacity-0 peer-checked:opacity-100 transition-all" />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Keep me signed in</span>
                </label>
                <a href="#" className="text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">
                  Reset Link
                </a>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-indigo-950 hover:to-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-900/20 disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Initiate Session"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Footer Security Tag */}
          <motion.div 
            className="flex items-center justify-center gap-3 mt-12 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="h-px w-12 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encryption</span>
            </div>
            <div className="h-px w-12 bg-slate-200" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}