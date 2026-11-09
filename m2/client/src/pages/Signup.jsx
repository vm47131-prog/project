import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/authService";
import {
  Utensils,
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
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

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const result = await signupUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      setUser(result.user);
      setSuccess(result.message);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

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
            <h1 className="text-3xl font-bold text-gray-900">
              Create Customer Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign up to discover your favourite food.
            </p>
          </div>

          {/* Error and success messages */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          {/* Signup form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

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

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit phone number"
                  value={formData.phone}
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
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
            >
              Create Customer Account
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Login
            </Link>
          </p>
          <p className="mt-3 text-center text-sm text-gray-600">
            Are you a restaurant owner?{" "}
            <Link
              to="/owner-register"
              className="font-bold text-orange-600 hover:text-orange-700"
            >
              Register your restaurant
            </Link>
          </p>
          <p className="mt-5 text-center text-xs text-gray-400">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
}
