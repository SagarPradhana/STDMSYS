import { apiSlice } from "../apiSlice";

export interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  classes: number;
  feeCollection: number;
  feePending: number;
  feeOverdue: number;
  attendanceToday: number;
  activeNotices: number;
  enrollmentTrend: { month: string; students: number }[];
  feeTrend: { month: string; collected: number; target: number }[];
}

export interface TeacherStats {
  totalStudents: number;
  classesToday: number;
  pendingGrading: number;
  attendanceMarkedToday: number;
}

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => "/dashboard/admin",
      transformResponse: (response: { data: AdminStats }) => response.data,
    }),
    getTeacherStats: builder.query<TeacherStats, void>({
      query: () => "/dashboard/teacher",
      transformResponse: (response: { data: TeacherStats } | TeacherStats) => 
        (response as any).data ? (response as any).data : response,
    }),
  }),
});

export const { useGetAdminStatsQuery, useGetTeacherStatsQuery } = dashboardApi;
