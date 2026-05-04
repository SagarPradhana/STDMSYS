import { Router } from "express";
import { Timetable, Student } from "../models/all";
import { verifyToken } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req: any, res) => {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const timetable = await Timetable.find({ classId: student.classId })
      .populate("subjectId")
      .populate("teacherId")
      .sort({ period: 1 });

    res.json({
      success: true,
      data: timetable,
    });
  })
);

router.get(
  "/:classId",
  verifyToken,
  asyncHandler(async (req, res) => {
    const timetable = await Timetable.find({ classId: req.params.classId })
      .populate("subjectId")
      .populate("teacherId")
      .sort({ period: 1 });

    res.json({
      success: true,
      data: timetable,
    });
  })
);

router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const slots = Array.isArray(req.body) ? req.body : [req.body];

    for (const slot of slots) {
      await Timetable.findOneAndUpdate(
        { classId: slot.classId, day: slot.day, period: slot.period },
        slot,
        { upsert: true }
      );
    }

    res.json({ 
      success: true,
      message: "Timetable updated successfully" 
    });
  })
);

export default router;