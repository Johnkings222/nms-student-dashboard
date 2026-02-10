import type { ReactElement } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import FrameLogin from "../../assets/Frame_Login.png";
import RoleFrame from "../../assets/Frame 1000003892.png";
import LunarSMS from "../../assets/Logo_Auth.png";
import authService from "../../services/authService";

export default function Login(): ReactElement {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Call the login API
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Login successful - redirect to dashboard
      navigate("/");
    } catch (err: any) {
      // Handle errors
      // Check for backend message first (covers 404, 401, etc.)
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 404) {
        setError("Login endpoint not found. Please check backend URL.");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-transparent">

        {/* Left card */}
        <div className="bg-white rounded-3xl shadow-soft p-10 flex flex-col gap-8">

          <div className="text-center space-y-2">
            <img src={LunarSMS} alt="LUNAR SMS" className="w-30 h-10 mx-auto mb-10" />
            <h2 className="text-2xl font-semibold text-gray-900 uppercase leading-tight">
              Your classroom, just one login away
            </h2>
          </div>

          <div className="flex justify-center">
            <img src={RoleFrame} alt="role options" className="w-64" />
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address/Username</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                disabled={loading}
                required
              />
            </div>

            {/* Password with Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-rose-500">
                  Forgot password
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#13A541] text-white font-semibold hover:bg-[#13A541]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
        </div>

        {/* Right image */}
        <div className="hidden lg:block">
          <img src={FrameLogin} alt="Students collaborating" className="w-full h-full object-cover rounded-[36px]" />
        </div>

      </div>
    </div>
  );
}
