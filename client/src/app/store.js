import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";

import { baseApi } from "../api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,

    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});