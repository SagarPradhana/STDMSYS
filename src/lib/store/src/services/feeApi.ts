import { apiSlice } from "../apiSlice";

export const feeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFees: builder.query<any[], void>({
      query: () => "/fees",
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["Fee"],
    }),
    getFeeSummary: builder.query<any, void>({
      query: () => "/fees/summary",
      transformResponse: (response: { data: any }) => response.data,
      providesTags: ["Fee"],
    }),
    collectFee: builder.mutation<any, { studentId: string, amount: number, type: string, dueDate: string }>({
      query: (body) => ({
        url: "/fees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Fee"],
    }),
  }),
});

export const {
  useGetFeesQuery,
  useGetFeeSummaryQuery,
  useCollectFeeMutation,
} = feeApi;
