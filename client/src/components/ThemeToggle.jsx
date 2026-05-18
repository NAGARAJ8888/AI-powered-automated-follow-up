import { useDispatch, useSelector } from 'react-redux';

import { toggleTheme } from '../features/theme/themeSlice';

const ThemeToggle = ({ className = '' }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const nextLabel = mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';

  const handleToggle = () => {
    dispatch(toggleTheme());
    const newMode = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={nextLabel}
      title={nextLabel}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
        mode === 'dark'
          ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
          : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
      } ${className}`}
    >
      {mode === 'dark' ? (
        // Sun icon
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;

