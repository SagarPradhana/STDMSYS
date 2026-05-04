import { apiSlice } from "../apiSlice";
import { Subject } from "@school-management/types";

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => "/subjects",
      transformResponse: (response: { data: Subject[] }) => response.data,
      providesTags: ["Subject"],
    }),
    getSubjectById: builder.query<Subject, string>({
      query: (id) => `/subjects/${id}`,
      transformResponse: (response: { data: Subject }) => response.data,
      providesTags: (result, error, id) => [{ type: "Subject", id }],
    }),
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (body) => ({
        url: "/subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),
    updateSubject: builder.mutation<Subject, { id: string; body: Partial<Subject> }>({
      query: ({ id, body }) => ({
        url: `/subjects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Subject", id }, "Subject"],
    }),
    deleteSubject: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;
