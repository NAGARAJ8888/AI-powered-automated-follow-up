import { baseApi } from "../../api/baseApi";

export const workflowApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkflows: builder.query({
      query: () => "/workflows",
      providesTags: ["Workflow"],
    }),

    createWorkflow: builder.mutation({
      query: (data) => ({
        url: "/workflows",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["Workflow"],
    }),

    deleteWorkflow: builder.mutation({
      query: (id) => ({
        url: `/workflows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workflow"],
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useCreateWorkflowMutation,
  useDeleteWorkflowMutation,
} = workflowApi;

