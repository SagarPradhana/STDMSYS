import { Router } from "express";
import { Notice } from "../models/all";
import { verifyToken, requireAdminOrTeacher, AuthRequest } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    const query: any = {};

    if (req.user?.role === "student") {
      query.$or = [{ targetRole: "all" }, { targetRole: "student" }];
    } else if (req.user?.role === "teacher") {
      query.$or = [{ targetRole: "all" }, { targetRole: "teacher" }];
    }

    const notices = await Notice.find(query)
      .populate("publishedBy", "name")
      .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: notices,
    });
  })
);

router.post(
  "/",
  verifyToken,
  requireAdminOrTeacher,
  asyncHandler(async (req: AuthRequest, res) => {
    const { title, content, targetRole, priority } = req.body;

    const notice = await Notice.create({
      title,
      content,
      targetRole,
      priority,
      publishedBy: req.user?._id,
    });

    if (req.io) {
      if (targetRole === "all") {
        req.io.to("student").emit("notice", {
          title,
          content,
          timestamp: new Date().toISOString(),
        });
        req.io.to("teacher").emit("notice", {
          title,
          content,
          timestamp: new Date().toISOString(),
        });
      } else {
        req.io.to(targetRole).emit("notice", {
          title,
          content,
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.status(201).json({
      success: true,
      data: notice,
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req: AuthRequest, res) => {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Notice deleted",
    });
  })
);

export default router;