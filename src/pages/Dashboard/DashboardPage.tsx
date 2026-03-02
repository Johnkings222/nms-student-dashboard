import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import apiClient from "../../services/api";

const CLASS_COLORS = ["#B8C54A", "#6B9EFF", "#FF9999", "#FFA94D", "#FB8791", "#5DCCCC", "#B4CF34", "#FBAE44"];

interface DashboardStats {
  attendance: {
    presentThisMonth: number;
    absentThisMonth: number;
    totalSessionPresent: number;
  };
  academics: {
    testsTakenThisSession: number;
  };
  session: {
    id: number;
    name: string;
  };
}

interface TodayClass {
  subject: string;
  time: string;
  color: string;
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);

  useEffect(() => {
    apiClient.get("/api/student/")
      .then((res) => {
        if (res.data.success) setStats(res.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
    apiClient.get("/api/student/timetable/classes", { data: { term: "Term 1" } })
      .then((res) => {
        if (res.data.success) {
          const timetable: any[] = res.data.data?.timetable || [];
          const todays = timetable
            .filter((e) => e.day === todayName)
            .sort((a, b) => a.period - b.period)
            .map((e, i) => ({
              subject: e.subject?.name ?? "—",
              time: `${e.startTime}–${e.endTime}`,
              color: CLASS_COLORS[i % CLASS_COLORS.length],
            }));
          setTodayClasses(todays);
        }
      })
      .catch(() => {});
  }, []);

  const sessionLabel = stats?.session?.name ?? "—";

  const statsCards = [
    { title: "ABSENCE", value: stats?.attendance.absentThisMonth ?? "—", subtitle: "This month", color: "#fb8791" },
    { title: "PRESENT", value: stats?.attendance.presentThisMonth ?? "—", subtitle: "This month", color: "#6a8bf6" },
    { title: "SESSION PRESENT TOTAL", value: stats?.attendance.totalSessionPresent ?? "—", subtitle: sessionLabel, color: "#9FA1D8" },
    { title: "TEST TAKEN THIS SESSION", value: stats?.academics.testsTakenThisSession ?? "—", subtitle: sessionLabel, color: "#9FA1D8" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = currentDate.getDate();

  return (
    <div className="space-y-6">
      {/* Top Stats Cards - 4 in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="text-white shadow-lg w-full"
            style={{
              backgroundColor: card.color,
              minWidth: "250px",
              height: "172px",
              borderRadius: "7px"
            }}
          >
            {/* Title at top */}
            <div className="px-6 pt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide">{card.title}</h3>
            </div>

            {/* Icon and Value in middle - horizontally aligned */}
            <div className="px-6 py-4 flex items-center justify-between">
              <CalendarIcon size={44} strokeWidth={1.5} className="flex-shrink-0" />
              <p className="text-6xl font-extrabold leading-none">{card.value}</p>
            </div>

            {/* Subtitle at bottom */}
            <div className="px-6 pb-5">
              <p className="text-xs text-white/90">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Today Classes + Calendar */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Today Classes */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg font-bold mb-6 text-gray-800">Today Classes</h2>
          {todayClasses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No classes scheduled for today.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-4 justify-items-center">
              {todayClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="text-white flex flex-col justify-center items-center text-center w-full"
                  style={{
                    backgroundColor: classItem.color,
                    maxWidth: "152px",
                    minWidth: "120px",
                    height: "125px",
                    padding: "16px",
                    borderRadius: "0"
                  }}
                >
                  <p className="font-bold text-sm md:text-lg mb-2 line-clamp-2">{classItem.subject}</p>
                  <p className="text-xs md:text-sm font-normal">{classItem.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div
          className="shadow-lg text-white mx-auto xl:mx-0 xl:flex-shrink-0"
          style={{
            backgroundColor: "#13A541",
            width: "100%",
            maxWidth: "462px",
            minWidth: "280px",
            height: "381px",
            borderRadius: "8px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgba(255, 255, 255, 0.2)",
            padding: "16px",
            opacity: 1
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                )
              }
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <h3 className="font-bold text-lg">{formatMonthYear(currentDate)}</h3>
              <p className="text-sm text-white/80">
                {currentDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                )
              }
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-xs font-semibold text-white/80 mb-2">
                {day}
              </div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === today;

              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-full text-sm ${
                    isToday
                      ? "bg-white text-green font-bold"
                      : "hover:bg-white/10 cursor-pointer"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
