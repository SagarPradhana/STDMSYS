import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exam, Result } from "@school-management/types";

interface ExamState {
  exams: Exam[];
  results: Result[];
  upcoming: Exam[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  results: [],
  upcoming: [],
  isLoading: false,
  error: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
    },
    setResults: (state, action: PayloadAction<Result[]>) => {
      state.results = action.payload;
    },
    setUpcoming: (state, action: PayloadAction<Exam[]>) => {
      state.upcoming = action.payload;
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

export const { setExams, setResults, setUpcoming, setLoading, setError } = examSlice.actions;
export default examSlice.reducer;