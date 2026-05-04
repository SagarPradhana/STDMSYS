import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { verifyToken, AuthRequest, authorize } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["student", "teacher", "admin"]),
});

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || "default_secret",
    { expiresIn: (process.env.JWT_EXPIRE || "15m") as any }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    { expiresIn: (process.env.JWT_REFRESH_EXPIRE || "7d") as any }
  );

  return { accessToken, refreshToken };
};

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is inactive" });
    }

    const tokens = generateTokens(user._id.toString());

    const response: any = {
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    };

    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id }).populate("classId");
      if (student) {
        response.user.classId = student.classId?._id;
        response.user.rollNumber = student.rollNumber;
      }
    }

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user._id });
      if (teacher) {
        response.user.employeeId = teacher.employeeId;
      }
    }

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(response);
  })
);

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });

    const tokens = generateTokens(user._id.toString());

    res.status(201).json({
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refresh_secret"
      ) as { userId: string };

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "User not found or inactive" });
      }

      const tokens = generateTokens(user._id.toString());

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken: tokens.accessToken });
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  })
);

router.get(
  "/me",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = req.user!;

    const response: any = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    };

    if (user.role === "student") {
      const student = await Student.findOne({ userId: user._id }).populate("classId");
      if (student) {
        response.classId = student.classId?._id;
        response.rollNumber = student.rollNumber;
        response.parentName = student.parentName;
        response.parentPhone = student.parentPhone;
      }
    }

    if (user.role === "teacher") {
      const teacher = await Teacher.findOne({ userId: user._id }).populate(
        "subjects classes"
      );
      if (teacher) {
        response.employeeId = teacher.employeeId;
        response.subjects = teacher.subjects;
        response.classes = teacher.classes;
        response.qualification = teacher.qualification;
      }
    }

    res.json(response);
  })
);

router.post(
  "/logout",
  verifyToken,
  asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  })
);

export default router;