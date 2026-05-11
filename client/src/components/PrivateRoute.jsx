import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { token } = useSelector((state) => state.auth);

  // Redirect to "/" not "/login" — App.jsx redirects /login → / anyway,
  // avoiding a double redirect. The AuthModal will open for login.
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;

