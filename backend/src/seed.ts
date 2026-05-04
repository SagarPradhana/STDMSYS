import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/schooldb";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  phone?: string;
  isActive?: boolean;
}

interface IStudent {
  userId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  rollNumber: string;
  parentName: string;
  parentPhone: string;
  admissionDate: Date;
}

interface ITeacher {
  userId: mongoose.Types.ObjectId;
  employeeId: string;
  subjects: mongoose.Types.ObjectId[];
  classes: mongoose.Types.ObjectId[];
  qualification: string;
  joiningDate: Date;
}

interface IClass {
  grade: number;
  section: string;
  classTeacherId: mongoose.Types.ObjectId;
  studentCount: number;
}

interface ISubject {
  name: string;
  code: string;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
}

interface IAttendance {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "excused";
}

interface IAssignment {
  title: string;
  description: string;
  classId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  dueDate: Date;
  maxMarks: number;
}

interface IExam {
  name: string;
  type: "midterm" | "final" | "unit" | "mock";
  classId: mongoose.Types.ObjectId;
  schedule: { subjectId: mongoose.Types.ObjectId; date: Date; startTime: string; endTime: string; room: string }[];
  status: "upcoming" | "ongoing" | "completed";
}

interface IResult {
  studentId: mongoose.Types.ObjectId;
  examId: mongoose.Types.ObjectId;
  marks: { subjectId: mongoose.Types.ObjectId; marks: number; grade: string }[];
  totalMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
}

interface IFee {
  studentId: mongoose.Types.ObjectId;
  type: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: "paid" | "pending" | "overdue";
}

interface INotice {
  title: string;
  content: string;
  targetRole: "all" | "student" | "teacher";
  priority: "low" | "medium" | "high";
  publishedAt: Date;
  publishedBy: mongoose.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], required: true },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const studentSchema = new mongoose.Schema<IStudent>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  rollNumber: { type: String, required: true },
  parentName: { type: String, required: true },
  parentPhone: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
});

const teacherSchema = new mongoose.Schema<ITeacher>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
  qualification: { type: String },
  joiningDate: { type: Date, default: Date.now },
});

const classSchema = new mongoose.Schema<IClass>({
  grade: { type: Number, required: true },
  section: { type: String, required: true },
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  studentCount: { type: Number, default: 0 },
});

const subjectSchema = new mongoose.Schema<ISubject>({
  name: { type: String, required: true },
  code: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
});

const attendanceSchema = new mongoose.Schema<IAttendance>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent", "late", "excused"], default: "present" },
});

const assignmentSchema = new mongoose.Schema<IAssignment>({
  title: { type: String, required: true },
  description: { type: String },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
  dueDate: { type: Date, required: true },
  maxMarks: { type: Number, default: 100 },
});

const examSchema = new mongoose.Schema<IExam>({
  name: { type: String, required: true },
  type: { type: String, enum: ["midterm", "final", "unit", "mock"], required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  schedule: [{ subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }, date: { type: Date }, startTime: { type: String }, endTime: { type: String }, room: { type: String } }],
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
});

const resultSchema = new mongoose.Schema<IResult>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  marks: [{ subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" }, marks: { type: Number }, grade: { type: String } }],
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, required: true },
  rank: { type: Number },
});

const feeSchema = new mongoose.Schema<IFee>({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ["paid", "pending", "overdue"], default: "pending" },
});

const noticeSchema = new mongoose.Schema<INotice>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  targetRole: { type: String, enum: ["all", "student", "teacher"], default: "all" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  publishedAt: { type: Date, default: Date.now },
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const User = mongoose.model<IUser>("User", userSchema);
const Student = mongoose.model<IStudent>("Student", studentSchema);
const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);
const ClassModel = mongoose.model<IClass>("Class", classSchema);
const Subject = mongoose.model<ISubject>("Subject", subjectSchema);
const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
const Exam = mongoose.model<IExam>("Exam", examSchema);
const Result = mongoose.model<IResult>("Result", resultSchema);
const Fee = mongoose.model<IFee>("Fee", feeSchema);
const Notice = mongoose.model<INotice>("Notice", noticeSchema);

const indianFirstNames = [
  "Aarav", "Aryan", "Aditya", "Vihaan", "Sai", "Krishna", "Arjun", "Reyansh", "Ayaan", "Dhruv",
  "Ananya", "Aadhya", "Saanvi", "Kavya", "Aanya", "Pari", "Myra", "Aria", "Diya", "Priya",
  "Rahul", "Amit", "Vikram", "Sanjay", "Rajesh", "Paresh", "Milap", "Kiran", "Nimesh", "Suresh"
];

const indianLastNames = [
  "Sharma", "Patel", "Singh", "Kumar", "Joshi", "Mehta", "Shah", "Agarwal", "Gupta", "Verma",
  "Reddy", "Nair", "Das", "Mukherjee", "Iyer", "Bose", "Chatterjee", "Banerjee", "Sinha", "Pillai"
];

const subjectsByGrade: Record<number, { name: string; code: string }[]> = {
  6: [
    { name: "Mathematics", code: "MATH" },
    { name: "Science", code: "SCI" },
    { name: "English", code: "ENG" },
    { name: "Hindi", code: "HIN" },
    { name: "Social Science", code: "SST" },
  ],
  7: [
    { name: "Mathematics", code: "MATH" },
    { name: "Science", code: "SCI" },
    { name: "English", code: "ENG" },
    { name: "Hindi", code: "HIN" },
    { name: "Social Science", code: "SST" },
  ],
  8: [
    { name: "Mathematics", code: "MATH" },
    { name: "Science", code: "SCI" },
    { name: "English", code: "ENG" },
    { name: "Hindi", code: "HIN" },
    { name: "Social Science", code: "SST" },
  ],
};

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(name: string, role: string): string {
  return `${name.toLowerCase().replace(" ", ".")}@dps${role}.edu.in`;
}

function generatePhone(): string {
  return `+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  await Student.deleteMany({});
  await Teacher.deleteMany({});
  await ClassModel.deleteMany({});
  await Subject.deleteMany({});
  await Attendance.deleteMany({});
  await Assignment.deleteMany({});
  await Exam.deleteMany({});
  await Result.deleteMany({});
  await Fee.deleteMany({});
  await Notice.deleteMany({});

  console.log("Cleared existing data");

  const hashedPassword = await bcrypt.hash("admin123", 12);

  const adminUser = await User.create({
    name: "Principal Sharma",
    email: "principal@dpsadmin.edu.in",
    password: hashedPassword,
    role: "admin",
    phone: "+919876543210",
  });
  console.log("Created admin");

  const teacherData = [
    { name: "Rajesh Kumar Mehta", qualification: "M.Sc., B.Ed.", subjects: [] as mongoose.Types.ObjectId[], classes: [] as mongoose.Types.ObjectId[] },
    { name: "Sunita Devi Agarwal", qualification: "M.A., B.Ed.", subjects: [] as mongoose.Types.ObjectId[], classes: [] as mongoose.Types.ObjectId[] },
    { name: "Anil Kumar Sharma", qualification: "M.Sc., B.Ed.", subjects: [] as mongoose.Types.ObjectId[], classes: [] as mongoose.Types.ObjectId[] },
    { name: "Priya Rani Patel", qualification: "M.Com., B.Ed.", subjects: [] as mongoose.Types.ObjectId[], classes: [] as mongoose.Types.ObjectId[] },
    { name: "Mahendra Singh Chauhan", qualification: "M.A., B.Ed.", subjects: [] as mongoose.Types.ObjectId[], classes: [] as mongoose.Types.ObjectId[] },
  ];

  const teachers: any = [];
  for (let i = 0; i < teacherData.length; i++) {
    const td = teacherData[i];
    const user = await User.create({
      name: td.name,
      email: generateEmail(td.name, "teacher"),
      password: hashedPassword,
      role: "teacher",
      phone: generatePhone(),
    });
    const teacher: any = await Teacher.create({
      userId: user._id,
      employeeId: `DPS/TC/${2020 + i}/001`,
      subjects: [],
      classes: [],
      qualification: td.qualification,
      joiningDate: new Date(2020 + Math.floor(Math.random() * 3), 4, 1),
    });
    teachers.push(teacher);
    console.log(`Created teacher: ${td.name}`);
  }

  const classData = [
    { grade: 6, section: "A" },
    { grade: 7, section: "A" },
    { grade: 8, section: "A" },
  ];

  const classIds: mongoose.Types.ObjectId[] = [];
  for (let i = 0; i < classData.length; i++) {
    const cd = classData[i];
    const cls = await ClassModel.create({
      grade: cd.grade,
      section: cd.section,
      classTeacherId: teachers[i]._id,
      studentCount: 0,
    });
    classIds.push(cls._id);
    await Teacher.findByIdAndUpdate(teachers[i]._id, { classes: [cls._id] });
    console.log(`Created class: Grade ${cd.grade}-${cd.section}`);
  }

  const subjectIds: mongoose.Types.ObjectId[] = [];
  for (let i = 0; i < classData.length; i++) {
    const grade = classData[i].grade;
    const clsId = classIds[i];
    for (const sub of subjectsByGrade[grade]) {
      const teacherIdx = i % teachers.length;
      const subject = await Subject.create({
        name: sub.name,
        code: sub.code,
        classId: clsId,
        teacherId: teachers[teacherIdx]._id,
      });
      subjectIds.push(subject._id);
      await Teacher.findByIdAndUpdate(teachers[teacherIdx]._id, {
        $push: { subjects: subject._id }
      });
    }
    console.log(`Created subjects for Grade ${grade}`);
  }

  const studentNames = [
    { first: "Aarav", last: "Sharma" },
    { first: "Ananya", last: "Patel" },
    { first: "Aditya", last: "Singh" },
    { first: "Aadhya", last: "Kumar" },
    { first: "Vihaan", last: "Joshi" },
    { first: "Saanvi", last: "Mehta" },
    { first: "Arjun", last: "Shah" },
    { first: "Kavya", last: "Agarwal" },
    { first: "Reyansh", last: "Gupta" },
    { first: "Aanya", last: "Verma" },
    { first: "Sai", last: "Reddy" },
    { first: "Pari", last: "Nair" },
    { first: "Krishna", last: "Das" },
    { first: "Myra", last: "Mukherjee" },
    { first: "Arjun", last: "Iyer" },
    { first: "Diya", last: "Bose" },
    { first: "Ayaan", last: "Chatterjee" },
    { first: "Priya", last: "Banerjee" },
    { first: "Dhruv", last: "Sinha" },
    { first: "Aria", last: "Pillai" },
    { first: "Rahul", last: "Sharma" },
    { first: "Sneha", last: "Patel" },
    { first: "Vikram", last: "Singh" },
    { first: "Neha", last: "Kumar" },
    { first: "Amit", last: "Joshi" },
    { first: "Pooja", last: "Mehta" },
    { first: "Raj", last: "Shah" },
    { first: "Rani", last: "Agarwal" },
    { first: "Vivek", last: "Gupta" },
    { first: "Anita", last: "Verma" },
  ];

  const studentIds: mongoose.Types.ObjectId[] = [];
  for (let i = 0; i < studentNames.length; i++) {
    const sn = studentNames[i];
    const classIdx = Math.floor(i / 10);
    const user = await User.create({
      name: `${sn.first} ${sn.last}`,
      email: generateEmail(`${sn.first}${sn.last}`, "student"),
      password: hashedPassword,
      role: "student",
      phone: generatePhone(),
    });
    const student = await Student.create({
      userId: user._id,
      classId: classIds[classIdx],
      rollNumber: `${classData[classIdx].grade}${classData[classIdx].section}${String(i + 1).padStart(2, "0")}`,
      parentName: `${sn.last} ${randomElement(["Sir", "Madam"])}`,
      parentPhone: generatePhone(),
      admissionDate: new Date(2024, 3, 1),
    });
    studentIds.push(student._id);
    await ClassModel.findByIdAndUpdate(classIds[classIdx], {
      $inc: { studentCount: 1 }
    });
  }
  console.log("Created 30 students across 3 classes");

  const today = new Date();
  for (let d = 0; d < 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    for (let i = 0; i < studentIds.length; i++) {
      const classIdx = Math.floor(i / 10);
      const statuses: ("present" | "absent" | "late" | "excused")[] = ["present", "present", "present", "present", "present", "present", "late", "absent"];
      await Attendance.create({
        studentId: studentIds[i],
        classId: classIds[classIdx],
        date,
        status: randomElement(statuses),
      });
    }
  }
  console.log("Created attendance records for last 7 days");

  const assignments = [
    { title: "Chapter 1 Exercises", description: "Complete all questions from Exercise 1.1 to 1.5" },
    { title: "Science Project", description: "Prepare a model of water cycle" },
    { title: "Essay Writing", description: "Write an essay on 'My School' in 500 words" },
    { title: "Math Quiz", description: "Solve the worksheet on algebraic expressions" },
    { title: "History Chart", description: "Create a timeline of Indian freedom struggle" },
  ];
  for (let i = 0; i < assignments.length; i++) {
    const assign = assignments[i];
    const classIdx = i % classIds.length;
    await Assignment.create({
      title: assign.title,
      description: assign.description,
      classId: classIds[classIdx],
      subjectId: subjectIds[classIdx * 5 + (i % 5)],
      teacherId: teachers[classIdx]._id,
      dueDate: new Date(today.getTime() + (7 - i) * 24 * 60 * 60 * 1000),
      maxMarks: 20,
    });
  }
  console.log("Created 5 assignments");

  const exam = await Exam.create({
    name: "Periodic Test 1",
    type: "unit",
    classId: classIds[0],
    schedule: [
      { subjectId: subjectIds[0], date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), startTime: "09:00", endTime: "11:00", room: " room 101" },
      { subjectId: subjectIds[1], date: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000), startTime: "09:00", endTime: "11:00", room: " room 102" },
      { subjectId: subjectIds[2], date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), startTime: "09:00", endTime: "11:00", room: " room 103" },
    ],
    status: "upcoming",
  });
  console.log("Created 1 exam");

  for (let i = 0; i < studentIds.length; i++) {
    const marks: { subjectId: mongoose.Types.ObjectId; marks: number; grade: string }[] = [];
    let total = 0;
    for (let j = 0; j < 3; j++) {
      const score = Math.floor(Math.random() * 40 + 60);
      total += score;
      let grade = "F";
      if (score >= 90) grade = "A+";
      else if (score >= 80) grade = "A";
      else if (score >= 70) grade = "B+";
      else if (score >= 60) grade = "B";
      else if (score >= 50) grade = "C";
      else if (score >= 40) grade = "D";
      marks.push({ subjectId: subjectIds[j], marks: score, grade });
    }
    await Result.create({
      studentId: studentIds[i],
      examId: exam._id,
      marks,
      totalMarks: total,
      percentage: Math.round((total / 120) * 100),
      grade: total >= 90 ? "A+" : total >= 80 ? "A" : total >= 70 ? "B+" : total >= 60 ? "B" : total >= 50 ? "C" : "F",
      rank: i + 1,
    });
  }
  console.log("Created results for all students");

  const feeTypes = [
    { type: "Tuition Fee", amount: 25000 },
    { type: "Annual Charges", amount: 5000 },
    { type: "Books & Material", amount: 3000 },
    { type: "Transport Fee", amount: 8000 },
  ];
  for (let i = 0; i < studentIds.length; i++) {
    for (const ft of feeTypes) {
      const isPaid = Math.random() > 0.3;
      await Fee.create({
        studentId: studentIds[i],
        type: ft.type,
        amount: ft.amount,
        dueDate: new Date(2024, 3, 31),
        paidDate: isPaid ? new Date(2024, 2, 15) : undefined,
        status: isPaid ? "paid" : ft.type === "Transport Fee" ? "pending" : "overdue",
      });
    }
  }
  console.log("Created fee records");

  const notices = [
    { title: "Annual Day Celebration", content: "Annual Day will be celebrated on 15th December. All students must participate.", priority: "high", targetRole: "all" as const },
    { title: "Winter Break", content: "Winter break will be from 25th December to 5th January.", priority: "medium", targetRole: "all" as const },
    { title: "Parent-Teacher Meeting", content: "PTM scheduled for 20th December. All parents are requested to attend.", priority: "high", targetRole: "student" as const },
    { title: "Exam Schedule", content: "Final exams will begin from 1st February 2025.", priority: "medium", targetRole: "student" as const },
    { title: "Staff Development Program", content: "Teaching staff to attend workshop on 10th December.", priority: "low", targetRole: "teacher" as const },
  ];
  for (const notice of notices) {
    await Notice.create({
      title: notice.title,
      content: notice.content,
      targetRole: notice.targetRole,
      priority: notice.priority,
      publishedAt: new Date(),
      publishedBy: adminUser._id,
    });
  }
  console.log("Created 5 notices");

  console.log("\n=== SEED COMPLETE ===");
  console.log("\nLogin Credentials:");
  console.log("Admin: principal@dpsadmin.edu.in / admin123");
  console.log("Teacher: teacheremail@... / admin123 (any teacher)");
  console.log("Student: studentname@... / admin123 (any student)");
  
  await mongoose.disconnect();
}

seed().catch(console.error);