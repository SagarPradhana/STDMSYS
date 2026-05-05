import { apiSlice } from "../apiSlice";
import { Student } from "@school-management/types";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<{ students: Student[], total: number }, { page?: number, limit?: number, search?: string, classId?: string }>({
      query: (params) => ({
        url: "/students",
        params,
      }),
      transformResponse: (response: { success: boolean, data: Student[], total: number }) => ({
        students: response.data,
        total: response.total,
      }),
      providesTags: ["Student"],
    }),
    getStudentsByClass: builder.query<Student[], string>({
      query: (classId) => `/students?classId=${classId}&limit=100`,
      transformResponse: (response: { success: boolean, data: Student[] }) => response.data,
      providesTags: ["Student"],
    }),
    getStudentById: builder.query<Student, string>({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: "Student", id }],
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Student"],
    }),
    updateStudent: builder.mutation<Student, { id: string; body: Partial<Student> }>({
      query: ({ id, body }) => ({
        url: `/students/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Student", id }, "Student"],
    }),
    deleteStudent: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentsByClassQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentApi;
