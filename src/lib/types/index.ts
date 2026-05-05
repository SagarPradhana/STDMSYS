export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  avatar?: string;
  phone?: string;
  status: "active" | "inactive" | "on-leave" | "new";
  createdAt: string;
}

export interface Student extends User {
  role: "student";
  classId: string;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  admissionDate: string;
}

export interface Teacher extends User {
  role: "teacher";
  employeeId: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  joiningDate: string;
  joinDate?: string;
  experience?: number;
  bio?: string;
  address?: string;
}

export interface Class {
  _id: string;
  grade: number;
  section: string;
  classTeacherId: string;
  studentCount: number;
  subjects: Subject[];
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
}

export interface Attendance {
  _id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface Submission {
  studentId: string;
  submittedAt: string;
  fileUrl?: string;
  marks?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
  maxMarks: number;
  submissions: Submission[];
}

export interface ExamSlot {
  subjectId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Exam {
  _id: string;
  name: string;
  type: "midterm" | "final" | "unit" | "mock";
  classId: string | Class;
  schedule: ExamSlot[];
  status: "upcoming" | "ongoing" | "completed";
}

export interface SubjectMark {
  subjectId: string;
  marks: number;
  grade: string;
}

export interface Result {
  _id: string;
  studentId: string;
  examId: string;
  marks: SubjectMark[];
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

export interface FeeStatus {
  total: number;
  paid: number;
  pending: number;
  status: "paid" | "pending" | "overdue";
}

export interface Fee {
  _id: string;
  studentId: string;
  type: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue";
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  targetRole: "all" | "student" | "teacher";
  priority: "low" | "medium" | "high";
  publishedAt: string;
  publishedBy: string;
}

export interface TimetableSlot {
  _id: string;
  classId: string;
  day: string;
  period: number;
  subjectId: string;
  teacherId: string;
  room: string;
}

export interface Leave {
  _id: string;
  studentId: string;
  type: "sick" | "personal" | "other";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  classes?: number;
  feeCollection?: number;
  feePending?: number;
  feeOverdue?: number;
  attendanceToday?: number;
  activeNotices?: number;
  attendance?: number;
  assignmentsDue?: number;
  upcomingExams?: number;
  pendingGrading?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}