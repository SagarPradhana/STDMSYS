"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@school-management/utils";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CalendarClock, 
  BarChart3, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin,
  Menu,
  X,
  ArrowRight,
  Award,
  Building2,
  ClipboardCheck,
  FileText,
  Bell,
  Shield,
  Star
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "Complete student lifecycle management with profiles, attendance tracking, and performance history.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: BookOpen,
    title: "Academic Tracking",
    description: "Record grades, generate transcripts, and track student performance across all subjects.",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: CalendarClock,
    title: "Smart Scheduling",
    description: "Automated timetable generation with conflict detection and room allocation.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: FileText,
    title: "Assignment Management",
    description: "Create, distribute, and grade assignments with integrated submission tracking.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Generate comprehensive reports with visual charts and exportable data.",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Shield,
    title: "Secure & Scalable",
    description: "Enterprise-grade security with role-based access control and data encryption.",
    color: "from-indigo-500 to-blue-500"
  }
];

const stats = [
  { value: "50+", label: "Schools" },
  { value: "10K+", label: "Students" },
  { value: "500+", label: "Teachers" },
  { value: "99.9%", label: "Uptime" }
];

const carouselItems = [
  {
    image: "/carousel/campus.png",
    title: "World-Class Infrastructure",
    subtitle: "Modern campuses designed for the next generation of leaders."
  },
  {
    image: "/carousel/innovation.png",
    title: "Innovation in Learning",
    subtitle: "Harnessing technology to empower students and educators alike."
  },
  {
    image: "/carousel/success.png",
    title: "Defining Future Success",
    subtitle: "A proven track record of academic excellence and growth."
  }
];

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Principal, Greenwood High",
    content: "EduFlow transformed how we manage student data. The interface is intuitive and the support is excellent.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "IT Director, Ridgewood Academy",
    content: "The automated scheduling saved us hundreds of hours. Highly recommended for any educational institution.",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Department Head, Westview School",
    content: "Parents love the transparency. Grade access has improved parent-teacher communication significantly.",
    avatar: "ER"
  }
];

function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden rounded-[3rem] shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={carouselItems[current].image} 
            alt={carouselItems[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
          
          <div className="absolute bottom-20 left-10 md:left-20 max-w-2xl text-left">
            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
              {carouselItems[current].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/70 font-medium"
            >
              {carouselItems[current].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-10 right-10 flex gap-3 z-20">
        {carouselItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              current === i ? "w-12 bg-white" : "w-3 bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Navigation Flow Fix: Redirect logged in users
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") router.push("/dashboard");
        else if (user.role === "student") router.push("/student/dashboard");
        else if (user.role === "teacher") router.push("/teacher/dashboard");
      } catch (e) {
        // Silently fail if JSON is invalid
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${scrolled ? "text-slate-900" : "text-white"}`}>EduFlow</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-12">
              {["Features", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 ${
                    scrolled ? "text-slate-600 hover:text-indigo-600" : "text-white/70 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${scrolled ? "text-slate-900" : "text-white"}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? "text-slate-900" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-4 space-y-3">
                {["Features", "About", "Pricing", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block py-2 text-slate-600 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <Link
                  href="/login"
                  className="block py-2 text-slate-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="block py-3 text-center bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.15),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest mb-8">
                  <Star className="w-4 h-4 fill-indigo-400" />
                  The Standard in Modern Education
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8 tracking-tighter">
                  Manage Your School <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
                    With Precision
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10 max-w-xl">
                  Empower your institution with EduFlow. A seamless, high-performance ecosystem designed for administrators, teachers, and students.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link
                    href="/login"
                    className="px-10 py-5 bg-white text-slate-900 text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl shadow-white/10"
                  >
                    Get Started
                  </Link>
                  <button className="flex items-center gap-4 text-white group">
                    <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Watch Demo</span>
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-6 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse" />
                <div className="relative bg-slate-800/50 backdrop-blur-3xl border border-white/10 p-4 rounded-[3rem] shadow-2xl overflow-hidden">
                   <img src="/collage/school-1.png" className="w-full h-auto rounded-[2rem] opacity-80" alt="Dashboard Preview" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Carousel Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Visual Journey</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Experience Excellence</h2>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Carousel />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Impact */}
      <section className="py-32 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="text-center"
              >
                <div className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">{stat.value}</div>
                <div className="text-indigo-100 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <span className="text-indigo-600 text-xs font-black uppercase tracking-widest block mb-4">Voice of Trust</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8 leading-tight">Hear From Our <br /> Global Community</h2>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-500">Joined by 500+ educators</span>
              </div>
            </div>
            <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
              {testimonials.slice(0, 2).map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-10 bg-[#F8FAFC] rounded-[2.5rem] relative"
                >
                  <div className="mb-6 text-indigo-600 font-black text-4xl leading-none">“</div>
                  <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm">{testimonial.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>      {/* Footer */}
      <footer className="bg-slate-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter uppercase">EduFlow</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
                Designing the future of academic management. A global platform for schools that demand perfection.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Platform</h4>
              <ul className="space-y-4">
                {["Features", "Success Stories", "Architecture", "Security"].map(link => (
                  <li key={link}><a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-bold">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Contact</h4>
              <ul className="space-y-4">
                <li className="text-slate-500 text-sm font-bold flex items-center gap-3"><Mail className="w-4 h-4" /> connect@eduflow.pro</li>
                <li className="text-slate-500 text-sm font-bold flex items-center gap-3"><MapPin className="w-4 h-4" /> Silicon Valley, CA</li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} EduFlow Corporation. All Rights Reserved.
            </p>
            <div className="flex gap-8">
              {["Terms", "Privacy", "SLA"].map(link => (
                <a key={link} href="#" className="text-slate-600 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}