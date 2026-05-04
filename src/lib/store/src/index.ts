export { store, useAppDispatch, useAppSelector, type RootState, type AppDispatch } from "./store";
export { apiSlice } from "./apiSlice";

// Auth Slices
export {
  setCredentials,
  setUser,
  logout,
  setLoading as authSetLoading,
  setError as authSetError
} from "./slices/authSlice";

// UI & Notifications
export {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  markNotificationRead,
  clearNotifications
} from "./slices/uiSlice";

// API Services
export * from "./services/studentApi";
export * from "./services/teacherApi";
export * from "./services/classApi";
export * from "./services/subjectApi";
export * from "./services/dashboardApi";
export * from "./services/attendanceApi";
export * from "./services/assignmentApi";
export * from "./services/examApi";
export * from "./services/feeApi";
export * from "./services/noticeApi";
export * from "./services/timetableApi";