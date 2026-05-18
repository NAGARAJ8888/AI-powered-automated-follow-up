import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';

// Map route paths to human-readable page titles for the top header
const pageTitles = {
  '/dashboard': 'Overview',
  '/dashboard/leads': 'Leads',
  '/dashboard/workflows': 'Workflows',
};

/**
 * DashboardLayout — the persistent shell for all /dashboard/* routes.
 * Renders:  [Sidebar] [TopBar + <Outlet />]
 * The <Outlet /> is replaced by the matched child route (DashboardPage, LeadsPage, etc.)
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const pageTitle = pageTitles[pathname] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar — static on desktop, drawer on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Right-hand content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800 flex-shrink-0">
          {/* Hamburger — only visible on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title — shown in header on all screen sizes */}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100 lg:ml-0 ml-2">{pageTitle}</h1>

          {/* Right side of header — theme toggle + placeholder for future notifications/avatar */}
          <div className="flex items-center gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />

            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>
        </header>

        {/* Main scrollable content — child routes render here */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

