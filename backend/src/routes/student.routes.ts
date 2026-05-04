import { Router } from "express";
import { z } from "zod";
import { Student } from "../models/all";
import {
  verifyToken,
  requireAdmin,
  requireAdminOrTeacher,
  checkTeacherClassAccess,
  checkStudentOwnsData,
  filterStudentData,
  AuthRequest,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

const studentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  classId: z.string(),
  rollNumber: z.string(),
  parentName: z.string(),
  parentPhone: z.string(),
});

router.get(
  "/",
  verifyToken,
  requireAdminOrTeacher,
  checkTeacherClassAccess("classId"),
  asyncHandler(async (req: AuthRequest, res) => {
    const { page = 1, limit = 10, search, classId } = req.query;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (classId) {
      query.classId = classId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate("userId", "name email avatar phone")
        .populate("classId")
        .skip(skip)
        .limit(Number(limit)),
      Student.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: students.map((s: any) => ({
        _id: s._id,
        name: s.userId?.name,
        email: s.userId?.email,
        phone: s.userId?.phone,
        classId: s.classId,
        rollNumber: s.rollNumber,
        parentName: s.parentName,
        parentPhone: s.parentPhone,
        admissionDate: s.admissionDate,
      })),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  })
);

router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const student = await Student.findOne({ userId: req.user._id })
      .populate("userId", "name email avatar phone")
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  })
);

router.get(
  "/:id",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const studentId = req.params.id;
    const requestingUser = req.user;

    const student = await Student.findById(studentId)
      .populate("userId", "name email avatar phone")
      .populate("classId");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    if (requestingUser.role === "student") {
      const myStudent = await Student.findOne({ userId: requestingUser._id });
      if (!myStudent || myStudent._id.toString() !== studentId) {
        return res.status(403).json({
          success: false,
          message: "You can only view your own profile.",
        });
      }
    }

    res.json({
      success: true,
      data: student,
    });
  })
);

router.post(
  "/",
  verifyToken,
  requireAdmin,
  validate(studentSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, classId, rollNumber, parentName, parentPhone } =
      req.body;

    const existingUser = await import("../models/User").then((m) =>
      m.User.findOne({ email })
    );
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    const { User } = await import("../models/User");
    const user = await User.create({
      name,
      email,
      password,
      role: "student",
    });

    const student = await Student.create({
      userId: user._id,
      classId,
      rollNumber,
      parentName,
      parentPhone,
    });

    res.status(201).json({
      success: true,
      data: student,
    });
  })
);

router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const { name, email, classId, rollNumber, parentName, parentPhone } = req.body;

    if (name || email) {
      const { User } = await import("../models/User");
      await User.findByIdAndUpdate(student.userId, { name, email });
    }

    await Student.findByIdAndUpdate(req.params.id, {
      classId,
      rollNumber,
      parentName,
      parentPhone,
    });

    res.json({
      success: true,
      message: "Student updated successfully.",
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const { User } = await import("../models/User");
    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully.",
    });
  })
);

export default router;