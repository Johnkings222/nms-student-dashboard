import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import EmptyImg from "../../assets/Frame 1000003677.png";
import XlsIcon from "../../assets/xls.png";
import CsvIcon from "../../assets/csv.png";
import PdfIcon from "../../assets/pdf (3).png";
import LoadingState from "../../components/ui/LoadingState";
import apiClient from "../../services/api";

interface ExamRow {
  subjectName: string;
  session: string;
  className: string;
  term: string;
  marksObtained: number | string;
}

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

export default function Exams(): ReactElement {
  const [search, setSearch] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedSession, setSelectedSession] = useState("Session");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ExamRow[]>([]);

  const fetchExams = (term: string) => {
    setLoading(true);
    apiClient.get("/api/student/exam", { data: { term } })
      .then((res) => {
        console.log("Exams API response:", res.data);
        if (res.data.success && res.data.data?.subjects?.length > 0) {
          const session = res.data.data.session?.name ?? selectedSession;
          setSelectedSession(session);
          const mapped: ExamRow[] = res.data.data.subjects.flatMap((subj: any) => {
            const exams = subj.exams ?? subj.results ?? [subj];
            return exams.map((e: any) => ({
              subjectName: subj.subjectName ?? subj.name ?? "—",
              session,
              className: subj.className ?? "—",
              term: e.term ?? term,
              marksObtained: e.marksObtained ?? e.totalMarkObtained ?? "—",
            }));
          });
          setRows(mapped);
        } else {
          setRows([]);
        }
      })
      .catch((err) => {
        console.error("Exams API error:", err?.response?.status, err?.response?.data || err?.message);
        setRows([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExams(selectedTerm);
  }, []);

  const handleSearch = () => fetchExams(selectedTerm);

  const filtered = rows.filter(r =>
    search.trim() === "" || r.subjectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-bold">
        Exams
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

          <button onClick={handleSearch} className="h-12 px-6 bg-[#13A541] text-white rounded-lg text-sm font-semibold hover:opacity-90">
            Search
          </button>

          {/* Dropdowns pushed to the right */}
          <div className="flex items-center gap-3 ml-auto">
            <Dropdown
              options={["Term 1", "Term 2", "Term 3"]}
              selected={selectedTerm}
              onChange={(val) => { setSelectedTerm(val); fetchExams(val); }}
            />
            <Dropdown
              options={[selectedSession]}
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

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Table */}
        {!loading && (
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
              {filtered.length > 0 && (
                <tbody>
                  {filtered.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-6 capitalize">{row.subjectName}</td>
                      <td className="py-3 px-6">{row.session}</td>
                      <td className="py-3 px-6">{row.className}</td>
                      <td className="py-3 px-6">{row.term}</td>
                      <td className="py-3 px-6 text-right font-semibold text-[#13A541]">{row.marksObtained}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {filtered.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10">
                <img src={EmptyImg} alt="No result" className="w-64 h-auto" />
                <p className="text-gray-500 text-sm">No result yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
