import { useState } from "react";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../features/auth/authApi";
import { setCredentials, toggleModalType } from "../features/auth/authSlice";

const LoginForm = ({ onSuccess }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ RTK Query mutation
  const [loginUser, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email,
        password,
      }).unwrap();

      console.log("LOGIN RESPONSE:", res);

      // ✅ Save user + token
      dispatch(setCredentials(res));

      // ✅ Close modal
      onSuccess();

    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Sign in to your account
      </h2>

      {/* ✅ RTK Query Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
          {error?.data?.message || "Login failed"}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email address
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded-xl relative block w-full px-5 py-4 border border-gray-300"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-4 px-4 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => dispatch(toggleModalType())}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Create new account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;