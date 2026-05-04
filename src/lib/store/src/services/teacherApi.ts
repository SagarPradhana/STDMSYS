import { apiSlice } from "../apiSlice";
import { Teacher } from "@school-management/types";

export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<Teacher[], void>({
      query: () => "/teachers",
      transformResponse: (response: { data: Teacher[] }) => response.data,
      providesTags: ["Teacher"],
    }),
    getTeacherById: builder.query<Teacher, string>({
      query: (id) => `/teachers/${id}`,
      transformResponse: (response: { data: Teacher } | Teacher) => 
        (response as any).data ? (response as any).data : response,
      providesTags: (result, error, id) => [{ type: "Teacher", id }],
    }),
    createTeacher: builder.mutation<Teacher, Partial<Teacher>>({
      query: (body) => ({
        url: "/teachers",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teacher"],
    }),
    updateTeacher: builder.mutation<Teacher, { id: string; body: Partial<Teacher> }>({
      query: ({ id, body }) => ({
        url: `/teachers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Teacher", id }, "Teacher"],
    }),
    deleteTeacher: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/teachers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teacher"],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
