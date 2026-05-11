import { baseApi } from "../../api/baseApi";

export const leadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: () => "/leads",

      // Granular entity-level tags:
      //   { type: "Lead", id: _id }  — for per-lead invalidation (e.g. update single lead)
      //   { type: "Lead", id: "LIST" } — sentinel invalidated whenever the list changes
      providesTags: (result) => {
        const leads = result?.leads ?? (Array.isArray(result) ? result : []);
        return [
          ...leads.map(({ _id }) => ({ type: "Lead", id: _id })),
          { type: "Lead", id: "LIST" },
        ];
      },

      // Reduce stale cache lifetime from the 60 s default so navigating back
      // to /leads re-fetches sooner (refetchOnMountOrArgChange handles this too)
      keepUnusedDataFor: 30,
    }),

    createLead: builder.mutation({
      query: (data) => ({
        url: "/leads",
        method: "POST",
        body: data,
      }),
      // A new lead was added — invalidate the full list
      invalidatesTags: [{ type: "Lead", id: "LIST" }],
    }),

    respondLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}/respond`,
        method: "PUT",
      }),
      // Invalidate both the specific lead and the list so the table row updates
      invalidatesTags: (result, error, id) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
      ],
    }),

    pauseLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}/pause`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
      ],
    }),

    resumeLead: builder.mutation({
      query: (id) => ({
        url: `/leads/${id}/resume`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Lead", id },
        { type: "Lead", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useCreateLeadMutation,
  useRespondLeadMutation,
  usePauseLeadMutation,
  useResumeLeadMutation,
} = leadApi;
