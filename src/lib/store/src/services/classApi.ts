import { apiSlice } from "../apiSlice";
import { Class } from "@school-management/types";

export const classApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => "/classes",
      transformResponse: (response: { data: Class[] }) => response.data,
      providesTags: ["Class"],
    }),
    getClassById: builder.query<Class, string>({
      query: (id) => `/classes/${id}`,
      transformResponse: (response: { data: Class }) => response.data,
      providesTags: (result, error, id) => [{ type: "Class", id }],
    }),
    createClass: builder.mutation<Class, Partial<Class>>({
      query: (body) => ({
        url: "/classes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Class"],
    }),
    updateClass: builder.mutation<Class, { id: string; body: Partial<Class> }>({
      query: ({ id, body }) => ({
        url: `/classes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Class", id }, "Class"],
    }),
    deleteClass: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Class"],
    }),
    getTeacherClasses: builder.query<Class[], void>({
      query: () => "/classes/me",
      transformResponse: (response: { data: Class[] }) => response.data,
      providesTags: ["Class"],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetTeacherClassesQuery,
} = classApi;
