import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User";
import { Teacher } from "../models/Teacher";
import { verifyToken, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

const teacherSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  employeeId: z.string(),
  qualification: z.string(),
  subjects: z.array(z.string()).optional(),
  classes: z.array(z.string()).optional(),
});

router.get(
  "/",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .populate("userId", "name email avatar phone")
        .populate("subjects")
        .populate("classes")
        .skip(skip)
        .limit(Number(limit)),
      Teacher.countDocuments(query),
    ]);

    res.json({
      data: teachers.map((t: any) => ({
        _id: t._id,
        name: t.userId?.name,
        email: t.userId?.email,
        employeeId: t.employeeId,
        qualification: t.qualification,
        subjects: t.subjects,
        classes: t.classes,
        joiningDate: t.joiningDate,
      })),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id)
      .populate("userId", "name email avatar phone")
      .populate("subjects")
      .populate("classes");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      success: true,
      data: teacher
    });
  })
);

router.post(
  "/",
  verifyToken,
  authorize("admin"),
  validate(teacherSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, employeeId, qualification, subjects, classes } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "teacher",
    });

    const teacher = await Teacher.create({
      userId: user._id,
      employeeId,
      qualification,
      subjects: subjects || [],
      classes: classes || [],
    });

    res.status(201).json({
      success: true,
      data: teacher
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const { name, email, qualification, subjects, classes, employeeId, status } = req.body;

    if (name || email) {
      await User.findByIdAndUpdate(teacher.userId, { name, email });
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, {
      qualification,
      subjects,
      classes,
      employeeId,
      status
    }, { new: true });

    res.json({ success: true, message: "Teacher updated", data: updatedTeacher });
  })
);

router.delete(
  "/:id",
  verifyToken,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Teacher deleted" });
  })
);

export default router;