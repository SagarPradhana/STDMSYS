import { Router } from "express";
import { Subject } from "../models/all";
import { verifyToken, authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const subjects = await Subject.find()
      .populate("classId")
      .populate("teacherId");

    res.json({
      success: true,
      data: subjects,
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id)
      .populate("classId")
      .populate("teacherId");

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      data: subject,
    });
  })
);

router.post(
  "/",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { name, code, classId, teacherId } = req.body;

    const subject = await Subject.create({
      name,
      code,
      classId,
      teacherId,
    });

    res.status(201).json({
      success: true,
      data: subject,
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      data: subject,
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  })
);

export default router;
