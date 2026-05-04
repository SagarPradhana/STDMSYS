import { Router } from "express";
import { Class } from "../models/Class";
import { Teacher } from "../models/Teacher";
import { verifyToken, authorize } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const classes = await Class.find()
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name" }
      })
      .populate("subjects");

    res.json({
      success: true,
      data: classes.map(c => {
        const cls: any = c.toJSON();
        if (cls.classTeacherId && cls.classTeacherId.userId) {
          cls.classTeacherId.name = cls.classTeacherId.userId.name;
        }
        return cls;
      })
    });
  })
);

router.get(
  "/me",
  verifyToken,
  authorize("teacher"),
  asyncHandler(async (req: any, res) => {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const classes = await Class.find({ _id: { $in: teacher.classes } })
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name" }
      })
      .populate("subjects");

    res.json({
      success: true,
      data: classes.map(c => {
        const cls: any = c.toJSON();
        if (cls.classTeacherId && cls.classTeacherId.userId) {
          cls.classTeacherId.name = cls.classTeacherId.userId.name;
        }
        return cls;
      })
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    const classItem = await Class.findById(req.params.id)
      .populate({
        path: "classTeacherId",
        populate: { path: "userId", select: "name" }
      })
      .populate("subjects");

    if (!classItem) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    const cls: any = classItem.toJSON();
    if (cls.classTeacherId && cls.classTeacherId.userId) {
      cls.classTeacherId.name = cls.classTeacherId.userId.name;
    }

    res.json({
      success: true,
      data: cls
    });
  })
);

router.post(
  "/",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { grade, section, classTeacherId, room, capacity } = req.body;

    const classItem = await Class.create({
      grade,
      section,
      classTeacherId,
      room,
      capacity
    });

    res.status(201).json({
      success: true,
      data: classItem
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { grade, section, classTeacherId, studentCount, room, capacity } = req.body;

    const classItem = await Class.findByIdAndUpdate(req.params.id, {
      grade,
      section,
      classTeacherId,
      studentCount,
      room,
      capacity
    }, { new: true });

    if (!classItem) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.json({
      success: true,
      data: classItem
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const classItem = await Class.findByIdAndDelete(req.params.id);

    if (!classItem) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    res.json({ success: true, message: "Class deleted" });
  })
);

export default router;