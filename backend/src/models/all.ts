import mongoose, { Document, Schema } from "mongoose";

export { User, IUser } from "./User";
export { Student, IStudent } from "./Student";
export { Teacher, ITeacher } from "./Teacher";
export { Class, IClass } from "./Class";

export interface ISubject extends Document {
  name: string;
  code: string;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
});

export const Subject = mongoose.model<ISubject>("Subject", subjectSchema);

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
}

const attendanceSchema = new Schema<IAttendance>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused"],
    default: "present",
  },
});

attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);

export interface IAssignment extends Document {
  title: string;
  description: string;
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  dueDate: Date;
  maxMarks: number;
  submissions?: ISubmission[];
}

const assignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, default: 100 },
});

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  submittedAt: Date;
  fileUrl?: string;
  marks?: number;
  feedback?: string;
  status: "submitted" | "graded" | "late";
}

const submissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  submittedAt: { type: Date, default: Date.now },
  fileUrl: { type: String },
  marks: { type: Number },
  feedback: { type: String },
  status: {
    type: String,
    enum: ["submitted", "graded", "late"],
    default: "submitted",
  },
});

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

export const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);

export interface IExam extends Document {
  name: string;
  type: "midterm" | "final" | "unit" | "mock";
  classId: mongoose.Types.ObjectId;
  schedule: {
    subjectId: mongoose.Types.ObjectId;
    date: Date;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  status: "upcoming" | "ongoing" | "completed";
}

const examSchema = new Schema<IExam>({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["midterm", "final", "unit", "mock"],
    required: true,
  },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  schedule: [
    {
      subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
      date: { type: Date },
      startTime: { type: String },
      endTime: { type: String },
      room: { type: String },
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed"],
    default: "upcoming",
  },
});

export const Exam = mongoose.model<IExam>("Exam", examSchema);

export interface IResult extends Document {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  marks: {
    subjectId: mongoose.Types.ObjectId;
    marks: number;
    grade: string;
  }[];
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

const resultSchema = new Schema<IResult>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
  marks: [
    {
      subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
      marks: { type: Number },
      grade: { type: String },
    },
  ],
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  rank: { type: Number },
});

resultSchema.index({ studentId: 1, examId: 1 }, { unique: true });

export const Result = mongoose.model<IResult>("Result", resultSchema);

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "paid" | "pending" | "overdue";
}

const feeSchema = new Schema<IFee>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: {
    type: String,
    enum: ["paid", "pending", "overdue"],
    default: "pending",
  },
});

export const Fee = mongoose.model<IFee>("Fee", feeSchema);

export interface INotice extends Document {
  title: string;
  content: string;
  targetRole: "all" | "student" | "teacher";
  priority: "low" | "medium" | "high";
  publishedAt: Date;
  publishedBy: mongoose.Types.ObjectId;
}

const noticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRole: {
    type: String,
    enum: ["all", "student", "teacher"],
    default: "all",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  publishedAt: { type: Date, default: Date.now },
  publishedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Notice = mongoose.model<INotice>("Notice", noticeSchema);

export interface ITimetable extends Document {
  classId: mongoose.Types.ObjectId;
  day: string;
  period: number;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  room: string;
}

const timetableSchema = new Schema<ITimetable>({
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
  room: { type: String },
});

timetableSchema.index({ classId: 1, day: 1, period: 1 }, { unique: true });

export const Timetable = mongoose.model<ITimetable>("Timetable", timetableSchema);

export interface ILeave extends Document {
  studentId: mongoose.Types.ObjectId;
  type: "sick" | "personal" | "other";
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: Date;
}

const leaveSchema = new Schema<ILeave>({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  type: {
    type: String,
    enum: ["sick", "personal", "other"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

export const Leave = mongoose.model<ILeave>("Leave", leaveSchema);