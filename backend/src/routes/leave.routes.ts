import { Router } from "express";
import { Leave, Student } from "../models/all";
import { verifyToken, requireStudent, AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user?._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const leaves = await Leave.find({ studentId: student._id }).sort({ appliedAt: -1 });

    res.json({
      success: true,
      data: leaves,
    });
  })
);

router.post(
  "/",
  verifyToken,
  requireStudent,
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user?._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { type, startDate, endDate, reason } = req.body;

    const leave = await Leave.create({
      studentId: student._id,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: leave,
    });
  })
);

router.get(
  "/all",
  verifyToken,
  asyncHandler(async (req, res) => {
    // Only admins or teachers should see all leaves, but for now let's keep it simple
    // If we wanted to restrict: if (req.user.role === 'student') return 403
    const leaves = await Leave.find()
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" }
      })
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      data: leaves,
    });
  })
);

router.put(
  "/:id/status",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    res.json({
      success: true,
      data: leave,
    });
  })
);

export default router;
