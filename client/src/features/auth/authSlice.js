import { createSlice } from "@reduxjs/toolkit";

// Restore session on page refresh — token and user are persisted in localStorage
const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  // User object returned by login/register API: { _id, name, email, token }
  user: userInfoFromStorage,
  // JWT token extracted from user object — read by baseApi prepareHeaders
  token: userInfoFromStorage?.token || null,

  loading: false,
  error: null,

  // Modal visibility flags — both can never be true at the same time
  showLoginModal: false,
  showRegisterModal: false,
  // "login" | "register" — drives which form AuthModal renders
  currentModalType: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Called after successful login or register — persists user + token
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    // Clears session completely
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },

    // Clears any error message (e.g., before a retry)
    clearError: (state) => {
      state.error = null;
    },

    // Open login modal
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
      if (action.payload) {
        state.showRegisterModal = false;
        state.currentModalType = "login";
      }
    },

    // Open register modal
    setShowRegisterModal: (state, action) => {
      state.showRegisterModal = action.payload;
      if (action.payload) {
        state.showLoginModal = false;
        state.currentModalType = "register";
      }
    },

    // Close all modals at once (Escape key, overlay click, on success)
    closeAllModals: (state) => {
      state.showLoginModal = false;
      state.showRegisterModal = false;
    },

    // Explicitly switch modal type (e.g., "login" | "register")
    setCurrentModalType: (state, action) => {
      state.currentModalType = action.payload;
      state.showLoginModal = action.payload === "login";
      state.showRegisterModal = action.payload === "register";
    },

    // Toggle between login ↔ register inside the modal
    toggleModalType: (state) => {
      const next = state.currentModalType === "login" ? "register" : "login";
      state.currentModalType = next;
      state.showLoginModal = next === "login";
      state.showRegisterModal = next === "register";
    },
  },
});

export const {
  setCredentials,
  logout,
  clearError,
  setShowLoginModal,
  setShowRegisterModal,
  closeAllModals,
  setCurrentModalType,
  toggleModalType,
} = authSlice.actions;

export default authSlice.reducer;