import type { ReactElement } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FrameLogin from "../../assets/Frame_Forgot.png";
import RoleFrame from "../../assets/Frame 1000003847.png";
import LunarSMS from "../../assets/Logo_Auth.png";

export default function ForgotPassword(): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TODO: Uncomment when backend is ready
      // await authService.forgotPassword({ email });

      // TEMPORARY: Mock success for testing
      console.log('Mock: OTP would be sent to:', email);
      alert(`Mock: OTP sent to ${email}\nFor testing, use OTP: 1234`);

      // Store email for next steps
      localStorage.setItem('resetEmail', email);

      // Navigate to OTP entry page
      navigate('/reset-password');
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-6 relative">
      <img
        src={LunarSMS}
        alt="LUNAR SMS"
        className="absolute top-6 left-6 h-10 w-auto object-contain z-50"
      />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 bg-transparent">
        <div className="rounded-3xl p-10 flex flex-col gap-8 relative overflow-hidden">
          <div className="flex items-center justify-center pt-4 w-full">
            <Link to="/login" className="text-sm text-[#13A541] underline">
              Back to Login
            </Link>
          </div>

          <div className="flex flex-col items-center gap-6 mt-8">
            <div className="flex justify-center">
              <img src={RoleFrame} alt="forgot password" className="w-24 h-34 mx-auto" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
            <p className="text-sm text-gray-500">A reset instruction will be sent to you</p>
          </div>

          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#13A541] text-white font-semibold hover:bg-[#13A541]/90 disabled:opacity-50 transition-opacity"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </form>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Link to="/login" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#13A541]">
              <span>←</span>
              <span>Back to login</span>
            </Link>

            <div className="flex gap-2 pt-10">
              <div className="w-12 h-1 bg-[#13A541] rounded"></div>
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <img src={FrameLogin} alt="Students collaborating" className="w-full h-full object-cover rounded-[36px]" />
        </div>
      </div>
    </div>
  );
}
