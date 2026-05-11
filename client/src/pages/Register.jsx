import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// useRegisterMutation is the correct hook name (was useRegisterUserMutation)
import { useRegisterMutation } from '../features/auth/authAPI';
import { setCredentials, clearError } from '../features/auth/authSlice';

// Note: This page is currently a dead route — App.jsx redirects /register → /
// Auth is handled via the AuthModal. Keep this file for future standalone use.
const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // isLoading and error come from the mutation hook, not Redux state
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const res = await registerUser({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-gray-600">Join FollowUp AI today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
            {error?.data?.message || 'Registration failed'}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <button type="button" onClick={() => navigate('/login')}
            className="flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
            ← Back to Login
          </button>
          <button type="button" onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-700 underline">
            Cancel
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
            <input id="name" name="name" type="text" required value={name} onChange={onChange}
              className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              placeholder="Enter your full name" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input id="email" name="email" type="email" required value={email} onChange={onChange}
              className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input id="password" name="password" type="password" required minLength={6} value={password} onChange={onChange}
              className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              placeholder="Create a password (min 6 chars)" />
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
