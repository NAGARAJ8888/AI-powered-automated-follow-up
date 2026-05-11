import { useState } from 'react';
import { useDispatch } from 'react-redux';
// useRegisterMutation is the correct hook name (was useRegisterUserMutation)
import { useRegisterMutation } from '../features/auth/authAPI';
import { setCredentials, clearError, toggleModalType } from '../features/auth/authSlice';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  // RTK Query gives us isLoading and error directly from the mutation hook
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const res = await registerUser({ name, email, password }).unwrap();
      // Persist user + token after successful registration
      dispatch(setCredentials(res));
      onSuccess();
    } catch (err) {
      // Error is surfaced via RTK Query's `error` from the mutation hook
      console.error('Registration failed:', err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Create your account
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
          {error?.data?.message || 'Registration failed'}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={name}
            onChange={onChange}
            className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={onChange}
            className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={onChange}
            className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:border-transparent transition duration-200"
            placeholder="Create a password (min 6 chars)"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center mt-6">
        <span className="text-gray-600">Already have an account? </span>
        <button
          onClick={() => dispatch(toggleModalType())}
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
