import { Router } from "express";
import { Exam, Result, Student } from "../models/all";
import { verifyToken, authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { classId, status } = req.query;
    const query: any = {};

    if (classId) query.classId = classId;
    if (status) query.status = status;

    const exams = await Exam.find(query)
      .populate("classId")
      .populate("schedule.subjectId")
      .sort({ "schedule.date": -1 });

    res.json({
      success: true,
      data: exams,
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id)
      .populate("classId")
      .populate("schedule.subjectId");

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.json({
      success: true,
      data: exam,
    });
  })
);

router.post(
  "/",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { name, type, classId, schedule } = req.body;

    const exam = await Exam.create({
      name,
      type,
      classId,
      schedule,
      status: "upcoming",
    });

    res.status(201).json({
      success: true,
      data: exam,
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { name, type, schedule, status } = req.body;

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { name, type, schedule, status },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ success: false, message: "Exam not found" });
    }

    res.json({
      success: true,
      data: exam,
    });
  })
);

router.get(
  "/results/me",
  verifyToken,
  asyncHandler(async (req, res) => {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const results = await Result.find({ studentId: student._id })
      .populate("examId")
      .populate("marks.subjectId")
      .sort({ "examId.schedule.date": -1 });

    res.json({
      success: true,
      data: results,
    });
  })
);

router.get(
  "/results/:studentId",
  verifyToken,
  asyncHandler(async (req, res) => {
    const results = await Result.find({ studentId: req.params.studentId })
      .populate("examId")
      .populate("marks.subjectId")
      .sort({ "examId.schedule.date": -1 });

    res.json({
      success: true,
      data: results,
    });
  })
);

router.post(
  "/results",
  verifyToken,
  authorize("admin", "teacher"),
  asyncHandler(async (req, res) => {
    const { studentId, examId, marks } = req.body;

    const totalMarks = marks.reduce((sum: number, m: any) => sum + m.marks, 0);
    const percentage = (totalMarks / (marks.length * 100)) * 100;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 40) grade = "D";

    const result = await Result.findOneAndUpdate(
      { studentId, examId },
      { studentId, examId, marks, totalMarks, percentage, grade },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

export default router;