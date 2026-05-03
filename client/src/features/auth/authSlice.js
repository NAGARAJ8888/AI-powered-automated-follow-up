import { createSlice } from '@reduxjs/toolkit';
import { authAPI } from './authAPI';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authAPI.endpoints.loginUser.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.user = payload.user || payload;
          state.token = payload.token || payload.accessToken;
          state.error = null;
          if (state.token) {
            localStorage.setItem('token', state.token);
          }
        }
      )
      .addMatcher(authAPI.endpoints.loginUser.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error?.data?.message || 'Login failed';
      })
      .addMatcher(
        authAPI.endpoints.registerUser.matchFulfilled,
        (state, { payload }) => {
          state.loading = false;
          state.user = payload.user || payload;
          state.token = payload.token || payload.accessToken;
          state.error = null;
          if (state.token) {
            localStorage.setItem('token', state.token);
          }
        }
      )
      .addMatcher(authAPI.endpoints.registerUser.matchRejected, (state, { error }) => {
        state.loading = false;
        state.error = error?.data?.message || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

