import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Teacher } from "@school-management/types";

interface TeacherState {
  teachers: Teacher[];
  selectedTeacher: Teacher | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeachers: (state, action: PayloadAction<Teacher[]>) => {
      state.teachers = action.payload;
    },
    setSelectedTeacher: (state, action: PayloadAction<Teacher | null>) => {
      state.selectedTeacher = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<TeacherState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
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
  setTeachers,
  setSelectedTeacher,
  setPagination,
  setLoading,
  setError,
} = teacherSlice.actions;
export default teacherSlice.reducer;