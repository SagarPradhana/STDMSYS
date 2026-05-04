import { apiSlice } from "../apiSlice";
import { TimetableSlot } from "@school-management/types";

export const timetableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimetableByClass: builder.query<TimetableSlot[], string>({
      query: (classId) => `/timetable/${classId}`,
      transformResponse: (response: { success: boolean, data: TimetableSlot[] }) => response.data,
      providesTags: (result, error, classId) => [{ type: "Class", id: classId }, "Class"],
    }),
    updateTimetable: builder.mutation<{ success: boolean; message: string }, Partial<TimetableSlot>[]>({
      query: (body) => ({
        url: "/timetable",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
  }),
});

export const {
  useGetTimetableByClassQuery,
  useUpdateTimetableMutation,
} = timetableApi;
