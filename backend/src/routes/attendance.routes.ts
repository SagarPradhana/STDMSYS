import { Router } from "express";
import { Attendance, Student } from "../models/all";
import {
  verifyToken,
  requireAdmin,
  requireAdminOrTeacher,
  requireStudent,
  requireTeacher,
  checkTeacherClassAccess,
  AuthRequest,
} from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/stats",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's distribution
    const todayRecords = await Attendance.find({
      date: { $gte: today }
    });

    const distribution = {
      present: todayRecords.filter(r => r.status === 'present').length,
      absent: todayRecords.filter(r => r.status === 'absent').length,
      late: todayRecords.filter(r => r.status === 'late').length,
      excused: todayRecords.filter(r => r.status === 'excused').length,
    };

    // Get weekly trend
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const weeklyRecords = await Attendance.find({
      date: { $gte: last7Days }
    });

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend: any[] = [];
    for(let i=0; i<7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      const dayRecords = weeklyRecords.filter(r => {
        const rd = new Date(r.date);
        rd.setHours(0,0,0,0);
        return rd.getTime() === d.getTime();
      });
      trend.unshift({
        name: days[d.getDay()],
        present: dayRecords.filter(r => r.status === 'present').length,
        absent: dayRecords.filter(r => r.status === 'absent').length
      });
    }

    // Get low attendance classes
    const classes = await (await import("../models/all")).Class.find();
    const classStats: any[] = [];
    for(const cls of classes) {
      const clsRecords = weeklyRecords.filter(r => r.classId.toString() === cls._id.toString());
      const present = clsRecords.filter(r => r.status === 'present').length;
      const rate = clsRecords.length > 0 ? Math.round((present / clsRecords.length) * 100) : 100;
      if (rate < 80) {
        classStats.push({
          class: `Grade ${cls.grade}-${cls.section}`,
          rate,
          status: rate < 60 ? "critical" : "warning"
        });
      }
    }

    res.json({
      success: true,
      data: {
        distribution,
        trend,
        totalStudents: await Student.countDocuments(),
        lowAttendanceClasses: classStats
      }
    });
  })
);

router.get(
  "/class/:classId",
  verifyToken,
  requireAdminOrTeacher,
  checkTeacherClassAccess("classId"),
  asyncHandler(async (req: AuthRequest, res) => {
    const { date } = req.query;
    const query: any = { classId: req.params.classId };

    if (date) {
      const targetDate = new Date(date as string);
      targetDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: targetDate,
        $lt: nextDay,
      };
    }

    const records = await Attendance.find(query)
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" },
      })
      .sort({ date: -1 });

    res.json({
      success: true,
      data: records,
    });
  })
);

router.get(
  "/student/me",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { month, year } = req.query;
    const query: any = { studentId: student._id };

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query)
      .populate("classId", "grade section")
      .sort({ date: -1 });

    const summary = {
      present: records.filter((r) => r.status === "present").length,
      absent: records.filter((r) => r.status === "absent").length,
      late: records.filter((r) => r.status === "late").length,
      excused: records.filter((r) => r.status === "excused").length,
      total: records.length,
    };

    res.json({
      success: true,
      data: records,
      summary,
    });
  })
);

router.get(
  "/student/:studentId",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const requestingUser = req.user;
    const targetStudentId = req.params.studentId;

    if (requestingUser.role === "student") {
      const myStudent = await Student.findOne({ userId: requestingUser._id });
      if (!myStudent || myStudent._id.toString() !== targetStudentId) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own attendance.",
        });
      }
    }

    const records = await Attendance.find({ studentId: targetStudentId }).sort({ date: -1 });
    res.json({ success: true, data: records });
  })
);

router.post(
  "/",
  verifyToken,
  requireTeacher,
  checkTeacherClassAccess("classId"),
  asyncHandler(async (req: AuthRequest, res) => {
    const { classId, date, records } = req.body;

    const teacherClasses = req.user.teacher?.classes || [];
    if (!teacherClasses.includes(classId)) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to mark attendance for this class.",
      });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    for (const record of records) {
      await Attendance.findOneAndUpdate(
        { studentId: record.studentId, date: targetDate },
        {
          studentId: record.studentId,
          classId,
          date: targetDate,
          status: record.status,
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      message: "Attendance marked successfully.",
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  requireTeacher,
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    res.json({
      success: true,
      data: record,
    });
  })
);

export default router;