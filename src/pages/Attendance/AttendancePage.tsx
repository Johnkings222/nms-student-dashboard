import { useState, useEffect } from "react";
import LoadingState from "../../components/ui/LoadingState";
import apiClient from "../../services/api";
import authService from "../../services/authService";

interface AttendanceRecord {
  id: number;
  date: string;
  week: number;
  status: "present" | "absent" | "late";
  class: { id: number; name: string };
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user?.id) {
      setError("Unable to load attendance. Please log in again.");
      setLoading(false);
      return;
    }
    apiClient.get(`/api/teacher/student/${user.id}`)
      .then((res) => {
        if (res.data.success) setRecords(res.data.data.records || []);
        else setError("Failed to load attendance records.");
      })
      .catch(() => setError("Failed to load attendance records."))
      .finally(() => setLoading(false));
  }, []);

  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const statusStyle = (status: string) => {
    if (status === "present") return "bg-green-100 text-green-700";
    if (status === "absent") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-xl text-center font-semibold">Attendance</h1>
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-[#13A541]">{attendanceRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Attendance Rate</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{present}</p>
              <p className="text-xs text-gray-500 mt-1">Present</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{absent}</p>
              <p className="text-xs text-gray-500 mt-1">Absent</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{late}</p>
              <p className="text-xs text-gray-500 mt-1">Late</p>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {records.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                No attendance records found.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#13A541] text-white" style={{ fontWeight: 700, fontSize: "14px" }}>
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Class</th>
                    <th className="py-3 px-6 text-left">Week</th>
                    <th className="py-3 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-6">
                        {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                      <td className="py-3 px-6">{r.class?.name ?? "—"}</td>
                      <td className="py-3 px-6">Week {r.week}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyle(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
