import { useState, useEffect, useRef } from "react";
import { Calendar, MessageCircle } from "lucide-react";
import EmptyStateImg from "../../assets/undraw_open_note_cgre 1.png";
import LoadingState from "../../components/ui/LoadingState";
import apiClient from "../../services/api";

interface Assignment {
  id: number;
  title: string;
  description: string;
  submissionDate: string;
  classId: number;
  subject: { id: number; name: string };
  teacher: { id: number; name: string };
}

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignmentDate, setAssignmentDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    apiClient.get("/api/student/assignment/student/")
      .then((res) => {
        if (res.data.success) setAssignments(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignmentDate
    ? assignments.filter((a) => {
        const date = new Date(a.submissionDate).toLocaleDateString("en-GB");
        return date === assignmentDate;
      })
    : assignments;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      const [year, month, day] = val.split("-");
      setAssignmentDate(`${day}/${month}/${year}`);
    } else {
      setAssignmentDate("");
    }
  };

  const handleCalendarClick = () => dateInputRef.current?.showPicker();

  const formatSubmissionDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h1 className="text-xl text-center font-semibold">Assignment</h1>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div>
            <label
              className="block text-gray-700 mb-2"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "14px", lineHeight: "151%", letterSpacing: "0%" }}
            >
              Assignment Date
            </label>
            <div className="relative">
              <input
                type="text"
                value={assignmentDate}
                readOnly
                placeholder="DD/MM/YYYY"
                onClick={handleCalendarClick}
                className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                style={{ width: "213px", height: "56px", borderRadius: "6px", borderWidth: "1px", paddingLeft: "16px", paddingRight: "40px" }}
              />
              <input
                ref={dateInputRef}
                type="date"
                onChange={handleDateChange}
                className="absolute opacity-0 pointer-events-none"
                style={{ width: 0, height: 0 }}
              />
              <Calendar
                size={20}
                onClick={handleCalendarClick}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={() => setAssignmentDate("")}
            style={{ backgroundColor: "#13A541", height: "56px" }}
            className="px-8 text-white rounded-md hover:opacity-90 transition-opacity font-medium"
          >
            {assignmentDate ? "Clear" : "Search"}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingState />}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center text-center text-gray-500">
            <img src={EmptyStateImg} alt="No assignments" className="w-72 h-auto mb-4" loading="lazy" />
            <p>No record yet</p>
          </div>
        </div>
      )}

      {/* Assignments List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-base font-medium text-gray-700">All</h2>

          {filtered.map((assignment) => {
            const dateParts = formatSubmissionDate(assignment.submissionDate).split(" ");
            const day = dateParts[0];
            const monthYear = dateParts.slice(1).join(" ");

            return (
              <div key={assignment.id} className="bg-white rounded-xl shadow">
                {/* Assignment Header */}
                <div className="bg-gray-50 px-6 py-4 rounded-t-xl">
                  <div className="flex flex-wrap items-center justify-between" style={{ gap: "5rem" }}>

                    {/* Teacher Info */}
                    <div
                      className="flex items-center gap-3 px-3"
                      style={{ width: "186px", height: "72px", borderRadius: "4px", backgroundColor: "#F3FEF7" }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600 font-semibold text-sm">
                        {assignment.teacher.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          {assignment.teacher.name}
                        </p>
                        <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          Teacher
                        </p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div
                      className="flex items-center gap-2 px-3"
                      style={{ width: "186px", height: "72px", borderRadius: "4px", backgroundColor: "#E9EFFF" }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          {assignment.subject.name}
                        </p>
                        <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          Subject
                        </p>
                      </div>
                    </div>

                    {/* Class */}
                    <div
                      className="flex items-center gap-2 px-3"
                      style={{ width: "186px", height: "72px", borderRadius: "4px", backgroundColor: "#FFF5EF" }}
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          Class
                        </p>
                        <p className="text-gray-500" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          ID {assignment.classId}
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div
                      className="flex items-center gap-2 px-3"
                      style={{ width: "186px", height: "72px", borderRadius: "4px", backgroundColor: "#E6E6E6" }}
                    >
                      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                        <Calendar size={20} className="text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          {day}
                        </p>
                        <p className="text-gray-500 truncate" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "12px", lineHeight: "151%" }}>
                          {monthYear}
                        </p>
                      </div>
                    </div>

                    {/* Comment Button */}
                    <div className="ml-auto">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                        <MessageCircle size={18} className="text-gray-600" />
                        <span className="text-sm text-gray-700">Add comment</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assignment Content */}
                <div className="p-6">
                  <h3 className="font-semibold text-base mb-3 text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{assignment.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
