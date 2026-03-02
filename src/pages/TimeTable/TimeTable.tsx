import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import apiClient from "../../services/api";
import LoadingState from "../../components/ui/LoadingState";

interface TimetableEntry {
  id: number;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  subject: { name: string };
  teacher: { name: string };
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [1, 2, 3, 4, 5, 6];
const COLOR_CLASSES = [
  "bg-gradient-to-r from-[#FE7C7C] to-[#E86B6B]",
  "bg-gradient-to-r from-[#79C1BB] to-[#67B5B0]",
  "bg-gradient-to-r from-[#B4CF34] to-[#A3C12F]",
  "bg-gradient-to-r from-[#7FB2F3] to-[#71A8E2]",
  "bg-gradient-to-r from-[#4DB6AC] to-[#3BA9A0]",
  "bg-gradient-to-r from-[#FBAE44] to-[#E39E3D]",
];

export default function TimeTable(): ReactElement {
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [session, setSession] = useState("—");
  const [timetableMap, setTimetableMap] = useState<Record<string, Record<number, TimetableEntry>>>({});
  const [loading, setLoading] = useState(true);

  const fetchTimetable = (term: string) => {
    setLoading(true);
    apiClient.get("/api/student/timetable/classes", { data: { term } })
      .then((res) => {
        if (res.data.success) {
          const { timetable, session: sess } = res.data.data;
          if (sess) setSession(sess);

          // Build lookup map: { day: { period: entry } }
          const map: Record<string, Record<number, TimetableEntry>> = {};
          (timetable || []).forEach((entry: TimetableEntry) => {
            if (!map[entry.day]) map[entry.day] = {};
            map[entry.day][entry.period] = entry;
          });
          setTimetableMap(map);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimetable(selectedTerm);
  }, []);

  const handleTermChange = (term: string) => {
    setSelectedTerm(term);
    fetchTimetable(term);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-xl text-center">Time Table</h1>
      </div>

      <div className="bg-white rounded-t-xl shadow">
        {/* Header */}
        <div className="grid grid-cols-[160px_repeat(6,167px)] items-center text-sm text-gray-700 px-4 py-3 border-b">
          <div className="col-span-2 flex items-center gap-2">
            <CalendarDays size={16} className="text-accent" />
            <span>Time Table</span>
          </div>
          <div className="col-span-3" />
          <div className="text-right">{session}</div>
        </div>

        {/* Term selector row */}
        <div className="px-14 py-2 text-sm text-gray-700 border-b flex items-center justify-between">
          <span>Student Timetable</span>
          <div className="flex gap-2">
            {["Term 1", "Term 2", "Term 3"].map((term) => (
              <button
                key={term}
                onClick={() => handleTermChange(term)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTerm === term
                    ? "bg-accent text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : (
          <div className="overflow-x-auto">
            {/* Column headers */}
            <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-0 text-gray-700 text-sm">
              <div className="bg-white p-3 font-medium">Period</div>
              {PERIODS.map((p) => (
                <div key={p} className="bg-white p-3 text-center font-medium">{p}</div>
              ))}
            </div>

            {/* Rows */}
            <div className="bg-muted">
              {DAYS.map((day, rowIndex) => (
                <div key={day} className="grid grid-cols-[160px_repeat(6,1fr)] gap-0">
                  <div className="bg-white p-4 font-semibold text-blue-700/90 flex items-center">{day}</div>

                  {PERIODS.map((period, colIndex) => {
                    const entry = timetableMap[day]?.[period];
                    const colorClass = COLOR_CLASSES[(rowIndex + colIndex) % COLOR_CLASSES.length];

                    return (
                      <div
                        key={`${day}-${period}`}
                        className={`bg-white ${entry ? colorClass : "bg-gray-50"} h-[164px] rounded-md shadow-inner flex flex-col items-center justify-center text-white text-xs`}
                      >
                        {entry ? (
                          <>
                            <p className="text-sm font-semibold text-center px-1">{entry.subject.name}</p>
                            <p className="opacity-90 mt-1">{entry.startTime}–{entry.endTime}</p>
                            <p className="mt-2 opacity-80 text-center px-1">{entry.teacher.name}</p>
                          </>
                        ) : (
                          <p className="text-gray-300 text-xs">—</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
