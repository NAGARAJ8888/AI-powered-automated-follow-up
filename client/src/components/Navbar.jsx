import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, setShowLoginModal, setShowRegisterModal } from '../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg dark:bg-slate-900 dark:border-b dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              FollowUp AI
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle className="hidden sm:inline-flex" />

            {!token && (
              <>
                <button
                  onClick={() => dispatch(setShowLoginModal(true))}
                  className="text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => dispatch(setShowRegisterModal(true))}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Get Started
                </button>
              </>
            )}

            {token && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-slate-200">Hi, {user?.name || 'User'}</span>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

