import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, Student, Teacher, Class, Class as ClassModel } from "../models/all";

export interface AuthRequest extends Request {
  user?: any;
  studentId?: string;
  teacherId?: string;
  io?: any;
}

interface JWTPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const secret = process.env.JWT_SECRET || "default_secret";

    const decoded = jwt.verify(token, secret) as JWTPayload;

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is suspended. Contact administrator.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} role cannot access this resource.`,
      });
    }

    next();
  };
};

export const requireRole = authorizeRoles;
export const authorize = authorizeRoles;

export const checkStudentOwnsData = (resourceUserIdParam: string = "id") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== "student") {
        return next();
      }

      const requestedId = req.params[resourceUserIdParam];
      const student = await Student.findOne({ userId: req.user._id });

      if (!student) {
        return res.status(403).json({
          success: false,
          message: "Student profile not found.",
        });
      }

      if (requestedId && requestedId !== student._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can only access your own data.",
        });
      }

      req.studentId = student._id.toString();
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
  };
};

export const checkTeacherClassAccess = (classIdParam: string = "classId") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== "teacher") {
        return next();
      }

      const classId = req.params[classIdParam] || req.body.classId;

      if (!classId) {
        return next();
      }

      const teacher = await Teacher.findOne({ userId: req.user._id });

      if (!teacher) {
        return res.status(403).json({
          success: false,
          message: "Teacher profile not found.",
        });
      }

      const assignedClasses = teacher.classes.map((id: mongoose.Types.ObjectId) => 
        id.toString()
      );

      if (!assignedClasses.includes(classId)) {
        return res.status(403).json({
          success: false,
          message: `You are not assigned to this class. Your assigned classes: ${assignedClasses.length}`,
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
  };
};

export const checkTeacherSubjectAccess = (subjectIdParam: string = "subjectId") => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user.role !== "teacher") {
        return next();
      }

      const subjectId = req.params[subjectIdParam] || req.body.subjectId;

      if (!subjectId) {
        return next();
      }

      const teacher = await Teacher.findOne({ userId: req.user._id }).populate("subjects");

      if (!teacher) {
        return res.status(403).json({
          success: false,
          message: "Teacher profile not found.",
        });
      }

      const assignedSubjectIds = (teacher.subjects as any[]).map((s: any) => 
        s._id?.toString() || s.toString()
      );

      if (!assignedSubjectIds.includes(subjectId)) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this subject.",
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
  };
};

export const requireAdmin = authorizeRoles("admin");
export const requireTeacher = authorizeRoles("teacher");
export const requireStudent = authorizeRoles("student");
export const requireAdminOrTeacher = authorizeRoles("admin", "teacher");

export const filterStudentData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== "student") {
      return next();
    }

    const student = await Student.findOne({ userId: req.user._id });

    if (student) {
      req.studentId = student._id.toString();

      if (req.query.studentId) {
        if (req.query.studentId !== student._id.toString()) {
          return res.status(403).json({
            success: false,
            message: "You can only view your own data.",
          });
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const logAccess = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userRole = req.user?.role || "anonymous";
  const userId = req.user?._id || "unknown";

  console.log(`[${timestamp}] ${method} ${url} | User: ${userId} (${userRole})`);

  next();
};