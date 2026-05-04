import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Class } from "@school-management/types";

interface ClassState {
  classes: Class[];
  selectedClass: Class | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  isLoading: false,
  error: null,
};

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    setClasses: (state, action: PayloadAction<Class[]>) => {
      state.classes = action.payload;
    },
    setSelectedClass: (state, action: PayloadAction<Class | null>) => {
      state.selectedClass = action.payload;
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

export const { setClasses, setSelectedClass, setLoading, setError } =
  classSlice.actions;
export default classSlice.reducer;