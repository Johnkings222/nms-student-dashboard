import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import EmptyImg from "../../assets/Frame 1000003677.png";
import XlsIcon from "../../assets/xls.png";
import CsvIcon from "../../assets/csv.png";
import PdfIcon from "../../assets/pdf (3).png";

function Dropdown({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="h-12 px-4 border border-gray-300 rounded-lg text-sm bg-white flex items-center gap-2 min-w-[120px] justify-between focus:outline-none focus:ring-2 focus:ring-[#13A541]"
      >
        <span>{selected}</span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map(opt => (
            <li
              key={opt}
              onMouseDown={() => { onChange(opt); setOpen(false); }}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-[#13A541] hover:text-white transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ClassTest(): ReactElement {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedSession, setSelectedSession] = useState("2023/2024");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-bold">
        Class Test
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow p-6">
        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "244px", height: "48px", borderRadius: "26px", borderWidth: "1px", opacity: 1 }}
              className="pl-10 pr-4 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#13A541]"
            />
          </div>

          <button className="h-12 px-6 bg-[#13A541] text-white rounded-lg text-sm font-semibold hover:opacity-90">
            Search
          </button>

          {/* Dropdowns pushed to the right */}
          <div className="flex items-center gap-3 ml-auto">
            <Dropdown
              options={["Class", "J.S.S.1", "J.S.S.2", "J.S.S.3"]}
              selected={selectedClass}
              onChange={setSelectedClass}
            />
            <Dropdown
              options={["Term 1", "Term 2", "Term 3"]}
              selected={selectedTerm}
              onChange={setSelectedTerm}
            />
            <Dropdown
              options={["2023/2024", "2024/2025", "2025/2026"]}
              selected={selectedSession}
              onChange={setSelectedSession}
            />
          </div>

          {/* Download Icons */}
          <div className="flex items-center gap-8">
            <button title="Download XLS">
              <img src={XlsIcon} alt="XLS" className="w-8 h-8 object-contain" />
            </button>
            <button title="Download CSV">
              <img src={CsvIcon} alt="CSV" className="w-8 h-8 object-contain" />
            </button>
            <button title="Download PDF">
              <img src={PdfIcon} alt="PDF" className="w-8 h-8 object-contain" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl overflow-hidden border border-gray-200 flex flex-col" style={{ minHeight: "calc(100vh - 380px)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#13A541] text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "14px", lineHeight: "151%", letterSpacing: "0%" }}>
                <th className="py-3 px-6 text-left">Subject</th>
                <th className="py-3 px-6 text-left">Session</th>
                <th className="py-3 px-6 text-left">Class</th>
                <th className="py-3 px-6 text-left">Term</th>
                <th className="py-3 px-6 text-right">Obtained Mark</th>
              </tr>
            </thead>
          </table>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
            <img src={EmptyImg} alt="No result" className="w-64 h-auto" />
            <p className="text-gray-500 text-sm">No result yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
