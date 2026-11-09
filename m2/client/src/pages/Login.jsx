import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Utensils, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const from = location.state?.from || "/";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const result = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      setUser(result.user); // Context mein logged-in user save hoga
      navigate(from, { replace: true });
      // Login successful: go to page where user want to go
    } catch (err) {
      setError(err.message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {/* Logo */}
          <Link
            to="/"
            className="mb-6 flex items-center justify-center gap-2"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={24} />
            </span>

            <span className="text-2xl font-extrabold text-gray-900">
              Foo<span className="text-orange-500">die</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>

            <p className="mt-2 text-sm text-gray-500">
              Login to continue your food journey.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div
              role="status"
              className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
            >
              Login
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Sign Up
            </Link>
          </p>

          <p className="mt-5 text-center text-xs text-gray-400">
            Welcome to FoodieHub — delicious food is just a click away.
          </p>
        </div>
      </div>
    </>
  );
}
