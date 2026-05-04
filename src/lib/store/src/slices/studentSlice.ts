import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Student, PaginatedResponse } from "@school-management/types";

interface StudentState {
  students: Student[];
  selectedStudent: Student | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    classId?: string;
    search?: string;
    status?: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    setSelectedStudent: (state, action: PayloadAction<Student | null>) => {
      state.selectedStudent = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<StudentState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action: PayloadAction<StudentState["filters"]>) => {
      state.filters = action.payload;
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

export const {
  setStudents,
  setSelectedStudent,
  setPagination,
  setFilters,
  setLoading,
  setError,
} = studentSlice.actions;
export default studentSlice.reducer;