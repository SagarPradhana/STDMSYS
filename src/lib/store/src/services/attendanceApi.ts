import { apiSlice } from "../apiSlice";
import { Attendance } from "@school-management/types";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<Attendance[], { classId?: string, date?: string }>({
      query: (params) => ({
        url: "/attendance",
        params,
      }),
      transformResponse: (response: { success: boolean, data: Attendance[] }) => response.data,
      providesTags: ["Attendance"],
    }),
    markAttendance: builder.mutation<Attendance, any>({
      query: (body) => ({
        url: "/attendance",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Attendance"],
    }),
    getAttendanceStats: builder.query<any, void>({
      query: () => "/attendance/stats",
      transformResponse: (response: { success: boolean, data: any }) => response.data,
      providesTags: ["Attendance"],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useGetAttendanceStatsQuery,
} = attendanceApi;
