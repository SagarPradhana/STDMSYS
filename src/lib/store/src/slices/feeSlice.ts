import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Fee } from "@school-management/types";

interface FeeState {
  fees: Fee[];
  summary: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  overdue: Fee[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FeeState = {
  fees: [],
  summary: { total: 0, paid: 0, pending: 0, overdue: 0 },
  overdue: [],
  isLoading: false,
  error: null,
};

const feeSlice = createSlice({
  name: "fee",
  initialState,
  reducers: {
    setFees: (state, action: PayloadAction<Fee[]>) => {
      state.fees = action.payload;
    },
    setSummary: (state, action: PayloadAction<FeeState["summary"]>) => {
      state.summary = action.payload;
    },
    setOverdue: (state, action: PayloadAction<Fee[]>) => {
      state.overdue = action.payload;
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

export const { setFees, setSummary, setOverdue, setLoading, setError } =
  feeSlice.actions;
export default feeSlice.reducer;