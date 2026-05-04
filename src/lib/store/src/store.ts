import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import studentReducer from "./slices/studentSlice";
import teacherReducer from "./slices/teacherSlice";
import classReducer from "./slices/classSlice";
import attendanceReducer from "./slices/attendanceSlice";
import assignmentReducer from "./slices/assignmentSlice";
import examReducer from "./slices/examSlice";
import feeReducer from "./slices/feeSlice";
import noticeReducer from "./slices/noticeSlice";
import uiReducer from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";

import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    student: studentReducer,
    teacher: teacherReducer,
    class: classReducer,
    attendance: attendanceReducer,
    assignment: assignmentReducer,
    exam: examReducer,
    fee: feeReducer,
    notice: noticeReducer,
    ui: uiReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;