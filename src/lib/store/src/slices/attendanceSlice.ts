import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attendance } from "@school-management/types";

interface AttendanceState {
  records: Attendance[];
  todaySummary: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  monthlyStats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  todaySummary: { present: 0, absent: 0, late: 0, excused: 0 },
  monthlyStats: { present: 0, absent: 0, late: 0, excused: 0, total: 0 },
  isLoading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<Attendance[]>) => {
      state.records = action.payload;
    },
    setTodaySummary: (
      state,
      action: PayloadAction<AttendanceState["todaySummary"]>
    ) => {
      state.todaySummary = action.payload;
    },
    setMonthlyStats: (
      state,
      action: PayloadAction<AttendanceState["monthlyStats"]>
    ) => {
      state.monthlyStats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setRecords, setTodaySummary, setMonthlyStats, setLoading, setError } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;