import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import classRoutes from "./routes/class.routes";
import attendanceRoutes from "./routes/attendance.routes";
import assignmentRoutes from "./routes/assignment.routes";
import examRoutes from "./routes/exam.routes";
import feeRoutes from "./routes/fee.routes";
import noticeRoutes from "./routes/notice.routes";
import timetableRoutes from "./routes/timetable.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import subjectRoutes from "./routes/subject.routes";
import leaveRoutes from "./routes/leave.routes";

dotenv.config();

import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available in routes
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "*", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Check database connection before processing routes
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection is not established. Please check if your IP is whitelisted in MongoDB Atlas or if the local database is running.",
    });
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/leaves", leaveRoutes);

app.use(errorHandler);

const startServer = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/schooldb";
  
  // Start the HTTP server first so the frontend can connect
  if (!httpServer.listening) {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error instanceof Error ? error.message : error);
    console.log("Tip: Ensure your IP is whitelisted in MongoDB Atlas or use a local MongoDB instance.");
  }
};

startServer();

export default app;