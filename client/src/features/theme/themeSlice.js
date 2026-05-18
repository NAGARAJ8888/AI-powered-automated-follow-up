import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'themePreference';

const getSystemPref = () => {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  } catch {
    return false;
  }
};

const getInitialMode = () => {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (stored === 'dark' || stored === 'light') return stored;
  return getSystemPref() ? 'dark' : 'light';
};

const initialState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const mode = action.payload;
      if (mode !== 'dark' && mode !== 'light') return;
      state.mode = mode;
      window.localStorage.setItem(STORAGE_KEY, mode);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, state.mode);
    },
    // Used on app load if class already set from main.jsx
    initThemeFromStorageOrSystem: (state) => {
      state.mode = getInitialMode();
    },
  },
});

export const { setTheme, toggleTheme, initThemeFromStorageOrSystem } = themeSlice.actions;
export default themeSlice.reducer;

