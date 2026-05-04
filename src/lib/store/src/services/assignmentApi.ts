import { apiSlice } from "../apiSlice";
import { Assignment } from "@school-management/types";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query<Assignment[], void>({
      query: () => "/assignments",
      transformResponse: (response: { data: Assignment[] }) => response.data,
      providesTags: ["Assignment"],
    }),
    getAssignmentById: builder.query<Assignment, string>({
      query: (id) => `/assignments/${id}`,
      transformResponse: (response: { data: Assignment }) => response.data,
      providesTags: (result, error, id) => [{ type: "Assignment", id }],
    }),
    createAssignment: builder.mutation<Assignment, Partial<Assignment>>({
      query: (body) => ({
        url: "/assignments",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Assignment }) => response.data,
      invalidatesTags: ["Assignment"],
    }),
    updateAssignment: builder.mutation<Assignment, { id: string; body: Partial<Assignment> }>({
      query: ({ id, body }) => ({
        url: `/assignments/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { data: Assignment }) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: "Assignment", id }, "Assignment"],
    }),
    deleteAssignment: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/assignments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = assignmentApi;
