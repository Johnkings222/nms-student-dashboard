import type { ReactElement } from "react";
import { CalendarDays } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = [1, 2, 3, 4, 5, 6];
const colorClasses = [
  "bg-gradient-to-r from-[#FE7C7C] to-[#E86B6B]",
  "bg-gradient-to-r from-[#79C1BB] to-[#67B5B0]",
  "bg-gradient-to-r from-[#B4CF34] to-[#A3C12F]",
  "bg-gradient-to-r from-[#7FB2F3] to-[#71A8E2]",
  "bg-gradient-to-r from-[#4DB6AC] to-[#3BA9A0]",
  "bg-gradient-to-r from-[#FBAE44] to-[#E39E3D]",
];

export default function TimeTable(): ReactElement {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-xl shadow p-5">
        <h1 className="text-xl text-center">Time Table</h1>
      </div>

      <div className="bg-white rounded-t-xl shadow">
        {/* Header aligned with fixed grid below (reference) */}
        <div className="grid grid-cols-[160px_repeat(6,167px)] items-center text-sm text-gray-700 px-4 py-3 border-b">
          <div className="col-span-2 flex items-center gap-2">
            <CalendarDays size={16} className="text-accent" />
            <span>Time Table</span>
          </div>
          <div className="col-span-3" />
          <div className="text-right">2024/2025</div>
        </div>
        <div className="px-14 py-2 text-sm text-gray-700 border-b flex items-center justify-between">
          <span>Student Name</span>
          <span>Term 2</span>
        </div>

        {/* Scroll container keeps reference widths without overflow */}
        <div className="overflow-x-auto">
          {/* Column headers */}
          <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-0 bg-muted text-gray-700 text-sm">
            <div className="bg-white p-3 font-medium">Period</div>
            {periods.map((p) => (
              <div key={p} className="bg-white p-3 text-center font-medium">{p}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="bg-muted">
            {days.map((day, rowIndex) => (
              <div key={day} className="grid grid-cols-[160px_repeat(6,1fr)] gap-0">
                <div className="bg-white p-4 font-semibold text-blue-700/90 flex items-center">{day}</div>

                {periods.map((p, colIndex) => (
                  <div
                    key={`${day}-${p}`}
                    className={`bg-white ${colorClasses[(rowIndex + colIndex) % colorClasses.length]} h-[164px] rounded-md shadow-inner flex flex-col items-center justify-center text-white text-xs`}
                  >
                    <p className="text-sm font-semibold">English Language</p>
                    <p className="opacity-90 mt-1">08:00-09:00</p>
                    <p className="mt-2">J.S.S {((rowIndex + colIndex) % 3) + 1}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
