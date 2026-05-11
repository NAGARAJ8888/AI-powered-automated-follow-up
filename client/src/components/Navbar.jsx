import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// setShowRegisterModal now exists in authSlice
import { logout, setShowLoginModal, setShowRegisterModal } from '../features/auth/authSlice';

const Navbar = () => {
  // auth.user and auth.token match the renamed state keys in authSlice
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              FollowUp AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!token && (
              <>
                <button
                  onClick={() => dispatch(setShowLoginModal(true))}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
                {/* user.name comes from Redux state, which is rehydrated from localStorage */}
                <span className="text-gray-700">Hi, {user?.name || 'User'}</span>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
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
