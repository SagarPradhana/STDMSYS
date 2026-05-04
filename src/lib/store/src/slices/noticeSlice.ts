import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notice } from "@school-management/types";

interface NoticeState {
  notices: Notice[];
  unread: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NoticeState = {
  notices: [],
  unread: 0,
  isLoading: false,
  error: null,
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    setNotices: (state, action: PayloadAction<Notice[]>) => {
      state.notices = action.payload;
      state.unread = action.payload.filter((n) => n.priority === "high").length;
    },
    setUnread: (state, action: PayloadAction<number>) => {
      state.unread = action.payload;
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

export const { setNotices, setUnread, setLoading, setError } =
  noticeSlice.actions;
export default noticeSlice.reducer;