import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import LeadsPage from '../pages/LeadsPage';
import WorkflowsPage from '../pages/WorkflowsPage';
import PrivateRoute from '../components/PrivateRoute';
import AuthModal from '../components/AuthModal';

/**
 * AppRoutes — single source of truth for all application routes.
 *
 * Route tree:
 *   /                      → Landing (public)
 *   /login                 → Redirect to / (auth via modal)
 *   /register              → Redirect to / (auth via modal)
 *   /dashboard             → PrivateRoute → DashboardLayout
 *     index                → DashboardPage  (Overview)
 *     leads                → LeadsPage
 *     workflows            → WorkflowsPage
 *   *                      → Landing
 */
const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />

        {/* Protected dashboard routes
            PrivateRoute checks auth.token — redirects to "/" if not authenticated.
            DashboardLayout provides the persistent sidebar shell.
            Child routes swap out via <Outlet /> inside DashboardLayout. */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>

      {/* Global auth modal — rendered outside Routes so it overlays any page */}
      <AuthModal />
    </>
  );
};

export default AppRoutes;
