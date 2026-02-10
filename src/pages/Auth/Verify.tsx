import type { ReactElement } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import FrameLogin from "../../assets/Frame_Forgot.png";
import RoleFrame from "../../assets/Frame 1000003847 (1).png";
import LunarSMS from "../../assets/Logo_Auth.png";
import authService from "../../services/authService";

export default function Verify(): ReactElement {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get email and OTP from localStorage
  const email = localStorage.getItem('resetEmail');
  const otp = localStorage.getItem('resetOTP');

  // Redirect if no email or OTP
  if (!email || !otp) {
    navigate('/forgot-password');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Uncomment when backend is ready
      // await authService.resetPassword({
      //   email: email!,
      //   otp: otp!,
      //   newPassword: formData.password,
      // });

      // TEMPORARY: Mock success for testing
      console.log('Mock: Password would be reset for:', email);
      console.log('Mock: OTP used:', otp);
      console.log('Mock: New password set');

      // Clear localStorage
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetOTP');

      alert("Password reset successful! (Mock mode - backend not implemented yet)");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-6 relative">
      {/* Logo */}
      <img
        src={LunarSMS}
        alt="LUNAR SMS"
        className="absolute top-6 left-6 h-10 w-auto object-contain z-50"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-transparent">
        {/* Left card */}
        <div className="rounded-3xl p-10 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex items-center justify-center pt-4 w-full">
            <Link to="/login" className="text-sm text-[#13A541] underline">
              Back to Login
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center gap-6 mt-5">
            <div className="flex justify-center">
              <img src={RoleFrame} alt="verify" className="w-24 h-34 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Verify Account</h1>
            <p className="text-sm text-gray-500">Enter the code sent to your email and create a new password</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#13A541]"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#13A541]"
                  disabled={loading}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#13A541] text-white font-semibold hover:bg-[#13A541]/90 disabled:opacity-50 transition-opacity"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Reset Password"}
            </button>
          </form>

          <div className="flex items-center justify-center pt-4 w-full">
            <span className="text-sm">Didn't receive the code? </span>
            <Link to="/forgot-password" className="text-sm text-[#13A541] underline ml-1">
              Click to resend
            </Link>
          </div>

          {/* Back to login */}
          <div className="flex flex-col items-center gap-4 mt-8">
            <Link to="/login" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#13A541]">
              <span>←</span>
              <span>Back to login</span>
            </Link>

            <div className="flex gap-2 pt-10">
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-[#13A541] rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block">
          <img src={FrameLogin} alt="Students collaborating" className="w-full h-full object-cover rounded-[36px]" />
        </div>
      </div>
    </div>
  );
}
