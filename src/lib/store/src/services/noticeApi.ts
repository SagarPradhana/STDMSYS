import { apiSlice } from "../apiSlice";

export const noticeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<any[], void>({
      query: () => "/notices",
      transformResponse: (response: { success: boolean, data: any[] }) => response.data,
      providesTags: ["Notice"],
    }),
    createNotice: builder.mutation<any, any>({
      query: (body) => ({
        url: "/notices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notice"],
    }),
    deleteNotice: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/notices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notice"],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi;
