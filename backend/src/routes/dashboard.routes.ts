import { Router } from "express";
import { User, Student, Teacher, Class, Fee, Attendance, Notice, Result, Assignment } from "../models/all";
import { verifyToken, authorize, AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/admin",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const [totalStudents, totalTeachers, classes, fees] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Class.find().populate("classTeacherId"),
      Fee.find(),
    ]);

    const totalFee = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidFee = fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
    const overdueFee = fees.filter((f) => f.status === "overdue").length;

    const notices = await Notice.find().sort({ publishedAt: -1 }).limit(5);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    });

    const presentCount = todayAttendance.filter((a) => a.status === "present").length;
    const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

    const enrollmentTrend = await Student.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedEnrollment = enrollmentTrend.map(item => ({
      month: months[item._id - 1],
      students: item.count,
    }));

    const feeTrend = await Fee.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: { $month: "$paidDate" },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const formattedFees = feeTrend.map(item => ({
      month: months[item._id - 1],
      collected: item.amount,
      target: 50000, // Static target for now
    }));

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTeachers,
        classes: classes.length,
        feeCollection: paidFee,
        feePending: totalFee - paidFee,
        feeOverdue: overdueFee,
        attendanceToday: attendancePercent,
        activeNotices: notices.length,
        recentNotices: notices,
        enrollmentTrend: formattedEnrollment.length > 0 ? formattedEnrollment : [{ month: "Current", students: totalStudents }],
        feeTrend: formattedFees.length > 0 ? formattedFees : [{ month: "Current", collected: paidFee, target: 50000 }],
      }
    });
  })
);

router.get(
  "/teacher",
  verifyToken,
  authorize("teacher"),
  asyncHandler(async (req: AuthRequest, res) => {
    const teacher = await Teacher.findOne({ userId: req.user?._id });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const students = await Student.find({ classId: { $in: teacher.classes } });
    const totalStudents = students.length;

    const assignments = await Assignment.find({
      teacherId: teacher._id,
    });

    const pendingGrading = assignments.filter((a) => 
      (a.submissions || []).some((s) => s.status === "submitted")
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
      classId: { $in: teacher.classes },
    });

    res.json({
      totalStudents,
      classesToday: teacher.classes.length,
      pendingGrading,
      attendanceMarkedToday: attendance.length,
    });
  })
);

router.get(
  "/student",
  verifyToken,
  authorize("student"),
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user?._id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignments = await Assignment.find({ classId: student.classId });
    const dueAssignments = assignments.filter((a) => new Date(a.dueDate) > new Date());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      studentId: student._id,
      date: { $gte: today, $lt: tomorrow },
    });

    const present = attendance.filter((a) => a.status === "present").length;
    const allAttendance = await Attendance.find({ studentId: student._id });
    const presentTotal = allAttendance.filter(a => a.status === 'present').length;
    const attendancePercent = allAttendance.length > 0 ? Math.round((presentTotal / allAttendance.length) * 100) : 0;

    const exams = await Exam.find({ classId: student.classId, status: "upcoming" });
    const notices = await Notice.find({ 
      $or: [{ targetRole: "all" }, { targetRole: "student" }] 
    }).sort({ publishedAt: -1 }).limit(5);

    const pendingFees = await Fee.find({ studentId: student._id, status: { $ne: "paid" } });

    res.json({
      success: true,
      data: {
        attendance: attendancePercent,
        assignmentsDue: dueAssignments.length,
        upcomingExams: exams.length,
        feeStatus: pendingFees.length > 0 ? "pending" : "paid",
        recentNotices: notices,
        upcomingAssignments: dueAssignments.slice(0, 3)
      }
    });
  })
);

export default router;