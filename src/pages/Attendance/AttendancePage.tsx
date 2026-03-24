import { useState, useEffect } from "react";
import LoadingState from "../../components/ui/LoadingState";
import apiClient from "../../services/api";

interface AttendanceStats {
  presentThisMonth: number;
  absentThisMonth: number;
  totalSessionPresent: number;
}

export default function AttendancePage() {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [sessionName, setSessionName] = useState("—");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("/api/student/")
      .then((res) => {
        if (res.data.success) {
          setStats(res.data.data.attendance);
          setSessionName(res.data.data.session?.name ?? "—");
        } else {
          setError("Failed to load attendance data.");
        }
      })
      .catch(() => setError("Failed to load attendance data."))
      .finally(() => setLoading(false));
  }, []);

  const present = stats?.presentThisMonth ?? 0;
  const absent = stats?.absentThisMonth ?? 0;
  const total = present + absent;
  const sessionTotal = stats?.totalSessionPresent ?? 0;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-xl text-center font-semibold">Attendance</h1>
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* Attendance Rate - Large Card */}
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <div className="relative inline-flex items-center justify-center w-36 h-36">
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="#13A541" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${attendanceRate * 3.267} 326.7`}
                />
              </svg>
              <span className="absolute text-3xl font-bold text-[#13A541]">{attendanceRate}%</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">Attendance Rate This Month</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{present}</p>
              <p className="text-xs text-gray-500 mt-2">Present This Month</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-3xl font-bold text-red-500">{absent}</p>
              <p className="text-xs text-gray-500 mt-2">Absent This Month</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-3xl font-bold text-gray-700">{total}</p>
              <p className="text-xs text-gray-500 mt-2">Total Days This Month</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-3xl font-bold text-[#13A541]">{sessionTotal}</p>
              <p className="text-xs text-gray-500 mt-2">Session Total ({sessionName})</p>
            </div>
          </div>

          {/* Visual breakdown */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">This Month Breakdown</h2>
            <div className="space-y-3">
              {/* Present bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Present</span>
                  <span className="font-medium text-green-600">{present} days</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: total > 0 ? `${(present / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
              {/* Absent bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Absent</span>
                  <span className="font-medium text-red-500">{absent} days</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-red-400 h-3 rounded-full transition-all"
                    style={{ width: total > 0 ? `${(absent / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
