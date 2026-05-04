import { Router } from "express";
import { Assignment, Submission, Student } from "../models/all";
import { verifyToken, requireTeacher, requireStudent, AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const { classId, status, subjectId } = req.query;
    const query: any = {};

    if (classId) query.classId = classId;
    if (subjectId) query.subjectId = subjectId;

    if (req.user?.role === "teacher") {
      query.teacherId = req.user._id;
    }

    if (req.user?.role === "student") {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) query.classId = student.classId;
    }

    const assignments = await Assignment.find(query)
      .populate("subjectId")
      .populate("teacherId")
      .sort({ dueDate: -1 });

    let data: any[] = assignments;
    if (req.user?.role === "student") {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        const submissions = await Submission.find({ studentId: student._id });
        data = assignments.map(a => {
          const submission = submissions.find(s => s.assignmentId.toString() === a._id.toString());
          const assignmentObj = a.toObject();
          return {
            ...assignmentObj,
            submissionStatus: submission ? submission.status : (new Date() > new Date(a.dueDate) ? "overdue" : "pending"),
            marks: submission?.marks,
            feedback: submission?.feedback,
            submittedAt: submission?.submittedAt
          };
        });
      }
    }

    res.json({
      success: true,
      data,
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id)
      .populate("subjectId")
      .populate("teacherId")
      .populate({
        path: "submissions",
        populate: { path: "studentId", populate: { path: "userId" } },
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  })
);

router.post(
  "/",
  verifyToken,
  requireTeacher,
  asyncHandler(async (req: AuthRequest, res) => {
    const { title, description, classId, subjectId, dueDate, maxMarks } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      classId,
      subjectId,
      teacherId: req.user?._id,
      dueDate: new Date(dueDate),
      maxMarks,
    });

    res.status(201).json({
      success: true,
      data: assignment,
    });
  })
);

router.put(
  "/:id/grade/:studentId",
  verifyToken,
  requireTeacher,
  asyncHandler(async (req: AuthRequest, res) => {
    const { marks, feedback } = req.body;

    const submission = await Submission.findOneAndUpdate(
      { assignmentId: req.params.id, studentId: req.params.studentId },
      { marks, feedback, status: "graded" },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    if (req.io) {
      req.io.to(`student-${req.params.studentId}`).emit("assignment-graded", {
        assignmentTitle: req.body.assignmentTitle || "Assignment",
        marks,
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  })
);

router.post(
  "/:id/submit",
  verifyToken,
  requireStudent,
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user?._id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const isLate = new Date() > new Date(assignment.dueDate);
    
    await Submission.findOneAndUpdate(
      { assignmentId: req.params.id, studentId: student._id },
      {
        assignmentId: req.params.id,
        studentId: student._id,
        status: isLate ? "late" : "submitted",
        submittedAt: new Date(),
      },
      { upsert: true }
    );

    res.json({
      success: true,
      message: "Assignment submitted",
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    await Submission.deleteMany({ assignmentId: req.params.id });

    res.json({
      success: true,
      message: "Assignment deleted",
    });
  })
);

export default router;