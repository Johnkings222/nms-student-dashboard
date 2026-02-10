import type { ReactElement } from "react";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FrameLogin from "../../assets/Frame_Forgot.png";
import RoleFrame from "../../assets/Frame 10000038471.png";
import LunarSMS from "../../assets/Logo_Auth.png";

export default function ResetPassword(): ReactElement | null {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Check if email exists in localStorage, if not redirect to forgot password
  const email = localStorage.getItem('resetEmail');

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      setError("Please enter the complete 4-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // TEMPORARY: Mock OTP validation for testing
      if (otpCode !== "1234") {
        setError("Invalid OTP. For testing, use: 1234");
        setLoading(false);
        return;
      }

      console.log('Mock: OTP validated successfully');

      // Store the OTP and navigate
      localStorage.setItem('resetOTP', otpCode);

      // Navigate to verify page to enter new password
      navigate('/verify');
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
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

          <div className="flex flex-col items-center gap-6 mt-5">
            <div className="flex justify-center">
              <img src={RoleFrame} alt="reset password" className="w-24 h-34 mx-auto" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">Enter OTP</h1>
            <p className="text-sm text-gray-500">
              We sent a 4-digit code to {email}
            </p>
          </div>

          <form className="space-y-6 mt-2" onSubmit={handleOtpSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-center gap-10">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-12 rounded-lg border border-gray-300 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#13A541]"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-[#13A541] text-white font-semibold hover:bg-[#13A541]/90 disabled:opacity-50 transition-opacity"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

          <div className="flex items-center justify-center pt-4 w-full">
            <span className="text-sm">Didn't receive the code? </span>
            <Link to="/forgot-password" className="text-sm text-[#13A541] underline ml-1">
              Click to resend
            </Link>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <Link to="/login" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#13A541]">
              <span>←</span>
              <span>Back to login</span>
            </Link>

            <div className="flex gap-2 pt-10">
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
              <div className="w-12 h-1 bg-[#13A541] rounded"></div>
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
