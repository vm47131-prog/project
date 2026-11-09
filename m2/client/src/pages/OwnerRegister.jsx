import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Utensils,
  UserRound,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Store,
  MapPin,
  Tags,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { registerOwner } from "../services/authService";

export default function OwnerRegister() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    restaurantName: "",
    address: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (Object.values(formData).some((value) => !value.trim())) {
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
      setLoading(true);

      const result = await registerOwner({
        username: formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        restaurantName: formData.restaurantName.trim(),
        address: formData.address.trim(),
        category: formData.category,
      });

      setUser(result.user);
      setRegistered(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#E8DDD3] bg-white py-3 pl-11 pr-4 text-sm text-[#392A22] outline-none transition placeholder:text-[#A99A90] focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

  const labelClass = "mb-2 block text-sm font-semibold text-[#514037]";

  if (registered) {
    return (
      <>
        <Navbar />

        <div className="flex min-h-screen items-center justify-center bg-[#FFF8F1] px-4 py-12">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <CheckCircle
                size={42}
                className="text-orange-600"
              />
            </div>

            <h1 className="text-2xl font-bold text-[#392A22]">
              Registration Successful!
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your restaurant registration has been submitted. Your account is
              currently waiting for admin approval.
            </p>

            <div className="mt-6 rounded-xl bg-orange-50 p-4 text-left">
              <p className="font-semibold text-orange-800">Approval Pending</p>
              <p className="mt-1 text-sm text-orange-700">
                You will be able to manage your restaurant after approval.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-7 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FFF8F1] px-4 py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          {/* LEFT SIDE - BRANDING */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#2C201B] p-8 text-white sm:p-12">
            <div>
              <Link
                to="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
                  <Utensils size={26} />
                </div>

                <span className="text-2xl font-extrabold">
                  Foo<span className="text-orange-400">die</span>
                </span>
              </Link>

              <div className="mt-12">
                <span className="rounded-full border border-orange-400/40 bg-orange-400/10 px-4 py-2 text-xs font-semibold tracking-wider text-orange-300">
                  RESTAURANT PARTNER PROGRAM
                </span>

                <h1 className="mt-7 text-4xl font-extrabold leading-tight sm:text-5xl">
                  Grow your restaurant with{" "}
                  <span className="text-orange-400">Foodie.</span>
                </h1>

                <p className="mt-5 max-w-md leading-7 text-[#D8C9BE]">
                  Bring your delicious food to more customers. Join Foodie and
                  grow your restaurant business.
                </p>
              </div>
            </div>

            <div className="mt-10">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
                alt="Restaurant interior"
                className="h-64 w-full rounded-2xl object-cover opacity-90"
              />

              <div className="mt-6 flex items-center gap-3">
                <Store
                  className="text-orange-400"
                  size={22}
                />
                <p className="text-sm text-[#D8C9BE]">
                  Your restaurant journey starts here.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-[#392A22]">
                Register your restaurant
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your owner account to get started.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* OWNER DETAILS */}
              <section>
                <h3 className="mb-4 flex items-center gap-2 font-bold text-[#392A22]">
                  <UserRound
                    size={19}
                    className="text-orange-500"
                  />
                  Owner Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Owner Username</label>
                    <div className="relative">
                      <UserRound
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className={inputClass}
                        autoComplete="username"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={inputClass}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        inputMode="numeric"
                        maxLength={10}
                        className={inputClass}
                        autoComplete="tel"
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* RESTAURANT DETAILS */}
              <section className="border-t border-[#F0E8E1] pt-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-[#392A22]">
                  <Store
                    size={19}
                    className="text-orange-500"
                  />
                  Restaurant Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Restaurant Name</label>
                    <div className="relative">
                      <Store
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                        placeholder="Enter restaurant name"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Restaurant Address</label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-4 text-gray-400"
                        size={19}
                      />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete restaurant address"
                        rows={3}
                        className={`${inputClass} resize-none`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Food Category</label>
                    <div className="relative">
                      <Tags
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select food category</option>
                        <option value="North Indian">North Indian</option>
                        <option value="South Indian">South Indian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Fast Food">Fast Food</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Multi Cuisine">Multi Cuisine</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* PASSWORD */}
              <section className="border-t border-[#F0E8E1] pt-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-[#392A22]">
                  <Lock
                    size={19}
                    className="text-orange-500"
                  />
                  Create Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 8 characters"
                        minLength={8}
                        autoComplete="new-password"
                        className={`${inputClass} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={19}
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        className={`${inputClass} pr-12`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Registering..." : "Register Restaurant"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:text-orange-700"
              >
                Login
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-gray-400">
              Your registration will be reviewed before you can manage your
              restaurant. No business documents are required at this stage.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
