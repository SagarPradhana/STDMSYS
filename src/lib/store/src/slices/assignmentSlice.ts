import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Assignment, Submission } from "@school-management/types";

interface AssignmentState {
  assignments: Assignment[];
  submissions: Submission[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AssignmentState = {
  assignments: [],
  submissions: [],
  isLoading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
    setSubmissions: (state, action: PayloadAction<Submission[]>) => {
      state.submissions = action.payload;
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

export const { setAssignments, setSubmissions, setLoading, setError } =
  assignmentSlice.actions;
export default assignmentSlice.reducer;