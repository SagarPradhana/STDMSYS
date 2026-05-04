import { apiSlice } from "../apiSlice";
import { Exam } from "@school-management/types";

export const examApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExams: builder.query<Exam[], void>({
      query: () => "/exams",
      transformResponse: (response: { data: Exam[] }) => response.data,
      providesTags: ["Exam"],
    }),
    getExamById: builder.query<Exam, string>({
      query: (id) => `/exams/${id}`,
      transformResponse: (response: { data: Exam }) => response.data,
      providesTags: (result, error, id) => [{ type: "Exam", id }],
    }),
    createExam: builder.mutation<Exam, Partial<Exam>>({
      query: (body) => ({
        url: "/exams",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Exam }) => response.data,
      invalidatesTags: ["Exam"],
    }),
    updateExam: builder.mutation<Exam, { id: string; body: Partial<Exam> }>({
      query: ({ id, body }) => ({
        url: `/exams/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { data: Exam }) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Exam", id }, "Exam"],
    }),
    deleteExam: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/exams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
    }),
    getExamMarks: builder.query<any, { examId: string; classId: string }>({
      query: ({ examId, classId }) => `/exams/${examId}/marks/${classId}`,
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Exam"],
    }),
    submitMarks: builder.mutation<any, { examId: string; classId: string; marks: any[] }>({
      query: ({ examId, classId, marks }) => ({
        url: `/exams/${examId}/marks/${classId}`,
        method: "POST",
        body: { marks },
      }),
      invalidatesTags: ["Exam"],
    }),
  }),
});

export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useGetExamMarksQuery,
  useSubmitMarksMutation,
} = examApi;
