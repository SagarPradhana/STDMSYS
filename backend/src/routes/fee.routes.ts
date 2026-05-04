import { Router } from "express";
import { Fee, Student } from "../models/all";
import { verifyToken } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/error.middleware";

const router = Router();

router.get(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const fees = await Fee.find()
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "name" }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: fees,
    });
  })
);

router.get(
  "/summary",
  verifyToken,
  asyncHandler(async (req, res) => {
    const fees = await Fee.find();
    
    const summary = {
      collected: fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0),
      pending: fees.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0),
      overdue: fees.filter(f => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0),
      // Mock trend for now
      trend: [
        { month: "Jan", collected: 45000 },
        { month: "Feb", collected: 52000 },
        { month: "Mar", collected: 48000 },
        { month: "Apr", collected: 61000 },
        { month: "May", collected: 55000 },
        { month: "Jun", collected: 68000 },
      ]
    };

    res.json({
      success: true,
      data: summary,
    });
  })
);

router.get(
  "/student/me",
  verifyToken,
  asyncHandler(async (req: any, res) => {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const fees = await Fee.find({ studentId: student._id }).sort({
      dueDate: -1,
    });

    res.json({
      success: true,
      data: fees,
    });
  })
);

router.get(
  "/student/:studentId",
  verifyToken,
  asyncHandler(async (req, res) => {
    const fees = await Fee.find({ studentId: req.params.studentId }).sort({
      dueDate: -1,
    });

    res.json({
      success: true,
      data: fees,
    });
  })
);

router.post(
  "/",
  verifyToken,
  asyncHandler(async (req, res) => {
    const { studentId, type, amount, dueDate } = req.body;

    const fee = await Fee.create({
      studentId,
      type,
      amount,
      dueDate: new Date(dueDate),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: fee,
    });
  })
);

router.put(
  "/:id/pay",
  verifyToken,
  asyncHandler(async (req, res) => {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      { status: "paid", paidDate: new Date() },
      { new: true }
    );

    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }

    res.json({
      success: true,
      data: fee,
    });
  })
);

router.delete(
  "/:id",
  verifyToken,
  asyncHandler(async (req, res) => {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Fee deleted" });
  })
);

export default router;