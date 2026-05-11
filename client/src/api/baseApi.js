import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",

  prepareHeaders: (headers, { getState }) => {
    // auth.token matches the renamed state key in authSlice
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Lead", "Workflow"],
  // Automatically refetch when the browser window regains focus
  // or when the network reconnects (requires setupListeners in main.jsx)
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});