import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import authService from "../../services/authService";
import apiClient from "../../services/api";
import SchoolLogo from "../../assets/School_Logo.png";
import FrameUser from "../../assets/Frame_User.png";
import PdfIcon from "../../assets/pdf (3).png";
import { useSession } from "../../contexts/SessionContext";
import LoadingState from "../../components/ui/LoadingState";
import { printReportCard } from "../../utils/printReportCard";

interface SubjectResult {
  id: number;
  subjectId: number;
  testScore: number;
  examScore: number;
  totalScore: number;
  grade: string;
  remark: string;
  subject: { name: string };
  class?: { id: number; name: string };
}

interface OverallResult {
  totalSubjects: number;
  totalScore: number;
  average: number;
  position: number | null;
}

interface PsyData {
  skills: Record<string, { comment: string; rating: number }>;
  behaviours: Record<string, { comment: string; rating: number }>;
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

// Map API skill/behaviour keys to display names
const SKILL_LABELS: Record<string, string> = {
  handwriting: "Handwriting",
  fluency: "Fluency",
  lab_tools: "Handling of lab tools & workshop equipment",
  gymnastics: "Gymnastics",
};

const BEHAVIOUR_LABELS: Record<string, string> = {
  attentiveness: "Attentiveness",
  mental_alertness: "Mental alertness",
  participation: "Participation in class/sch activities",
  attendance: "Class attendance",
  adjustment: "Adjustment",
  honesty: "Honesty",
  neatness: "Neatness/Turnout",
  politeness: "Politeness/Respect",
  relationship: "Relationship with staff",
  self_control: "Self control",
};

export default function ReportCard(): ReactElement {
  const { term: globalTerm, session: globalSession, allSessions } = useSession();
  const currentUser = authService.getCurrentUser();
  const studentName = currentUser?.name || `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || "—";
  const studentClass = currentUser?.class?.name || currentUser?.className || "";

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);

  // Report data
  const [subjects, setSubjects] = useState<SubjectResult[]>([]);
  const [overall, setOverall] = useState<OverallResult | null>(null);
  const [psyData, setPsyData] = useState<PsyData | null>(null);
  const [className, setClassName] = useState("");
  const [noInClass, setNoInClass] = useState<number | null>(null);
  const nmsNumber = currentUser?.nmsNumber || currentUser?.nms_number || "N/A";

  useEffect(() => {
    if (globalTerm && !selectedTerm) setSelectedTerm(globalTerm);
    if (globalSession && !selectedSession) setSelectedSession(globalSession);
    if (studentClass && !selectedClass) setSelectedClass(studentClass);
  }, [globalTerm, globalSession, studentClass]);

  // Fetch report when term changes
  useEffect(() => {
    if (!selectedTerm) return;
    fetchReport(selectedTerm);
  }, [selectedTerm]);

  const fetchReport = async (term: string) => {
    setLoading(true);
    try {
      const [reportRes, psyRes] = await Promise.allSettled([
        apiClient.get("/api/student/student-report", { params: { term } }),
        apiClient.get("/api/student/student-psy", { params: { term } }),
      ]);

      if (reportRes.status === "fulfilled" && reportRes.value.data.success) {
        const d = reportRes.value.data.data;
        const rawSubjects: SubjectResult[] = d.eachSubjects || [];

        // Deduplicate by subjectId — merge entries for the same subject
        const subjectMap = new Map<number, SubjectResult>();
        for (const s of rawSubjects) {
          const existing = subjectMap.get(s.subjectId);
          if (!existing) {
            subjectMap.set(s.subjectId, { ...s });
          } else {
            // Keep the entry with the higher totalScore (the more complete record)
            if (s.totalScore > existing.totalScore) {
              subjectMap.set(s.subjectId, { ...s });
            }
          }
        }
        const merged = Array.from(subjectMap.values());

        setSubjects(merged);
        setOverall(d.overall || null);
        if (rawSubjects[0]?.class?.name) {
          setClassName(rawSubjects[0].class.name);
        }
        // Extract class size if the report response includes it
        if (d.noInClass != null) setNoInClass(d.noInClass);
        if (d.overall?.noInClass != null) setNoInClass(d.overall.noInClass);
      } else {
        setSubjects([]);
        setOverall(null);
      }

      if (psyRes.status === "fulfilled" && psyRes.value.data.success) {
        const psyArr = psyRes.value.data.data;
        if (Array.isArray(psyArr) && psyArr.length > 0) {
          setPsyData({ skills: psyArr[0].skills || {}, behaviours: psyArr[0].behaviours || {} });
        } else {
          setPsyData(null);
        }
      } else {
        setPsyData(null);
      }
    } catch {
      setSubjects([]);
      setOverall(null);
      setPsyData(null);
    }
    setLoading(false);
  };

  const displayClass = className || selectedClass || "—";
  const totalSubjects = subjects.length;
  const computedTotal = subjects.reduce((sum, s) => sum + s.totalScore, 0);
  const computedAvg = totalSubjects > 0 ? computedTotal / totalSubjects : 0;
  const totalScore = totalSubjects > 0 ? computedTotal.toFixed(2) : "—";
  const avg = totalSubjects > 0 ? computedAvg.toFixed(2) : "—";
  const position = overall?.position ?? "—";

  // Psychomotor helpers
  const getSkillRating = (key: string) => psyData?.skills?.[key]?.rating ?? 0;
  const getBehaviourRating = (key: string) => psyData?.behaviours?.[key]?.rating ?? 0;

  const skillEntries: [string, number][] = Object.keys(SKILL_LABELS).map((key) => [
    SKILL_LABELS[key],
    getSkillRating(key),
  ]);

  const behaviourEntries: [string, number][] = Object.keys(BEHAVIOUR_LABELS).map((key) => [
    BEHAVIOUR_LABELS[key],
    getBehaviourRating(key),
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-semibold">Report Card</div>

      {/* Dropdowns + PDF download */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <Dropdown
            options={studentClass ? [studentClass] : ["Class"]}
            selected={selectedClass || "Class"}
            onChange={setSelectedClass}
          />
          <Dropdown
            options={["Term 1", "Term 2", "Term 3"]}
            selected={selectedTerm}
            onChange={setSelectedTerm}
          />
          <Dropdown
            options={allSessions.length > 0 ? allSessions.map(s => s.name) : (selectedSession ? [selectedSession] : [])}
            selected={selectedSession}
            onChange={setSelectedSession}
          />
        </div>

        <button title="Download PDF" onClick={() => printReportCard("report-card-content")}>
          <img src={PdfIcon} alt="PDF" className="w-8 h-8 object-contain" />
        </button>
      </div>

      {loading && <LoadingState />}

      {!loading && (
        <div className="px-6">
          <div id="report-card-content" className="relative bg-white rounded-xl shadow p-6 overflow-hidden">
            {/* Watermark */}
            <img
              src={SchoolLogo}
              alt="watermark"
              className="pointer-events-none select-none opacity-10 absolute -z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[700px] w-[80%]"
            />

            {/* Top meta row */}
            <div className="relative z-10 grid grid-cols-3 items-center mb-4">
              <div className="text-sm text-gray-700">{selectedTerm || "—"}</div>
              <div className="text-sm font-medium text-gray-900 text-center">{displayClass}</div>
              <div className="flex justify-end">
                <button onClick={() => printReportCard("report-card-content")} className="bg-[#13A541] text-white px-4 py-2 rounded inline-flex items-center gap-2">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Bordered card content */}
            <div className="mt-3 border border-gray-200 rounded-lg p-4">

              {/* Header row */}
              <div className="relative z-10 flex items-center justify-between mb-6">
                <img src={SchoolLogo} alt="school" className="w-16 h-16 object-contain" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-indigo-600">NIGERIAN MILITARY SCHOOL</h2>
                  <p className="text-xs text-indigo-600">Nigerian Military School, Zaria, Chindit Barracks, 810103</p>
                  <button
                    className="mt-2 bg-gradient-to-r from-[#8B0000] to-[#750000] text-white text-xs rounded"
                    style={{ width: "251px", height: "44px", padding: "10px" }}
                  >
                    TERMLY RESULT SHEET
                  </button>
                </div>
                <img src={FrameUser} alt="student" className="w-16 h-16 object-contain" />
              </div>

              {/* Student Information Table */}
              <div className="relative z-10 mt-6 mb-6">
                <table className="w-full border-collapse text-xs">
                  <tbody>
                    <tr className="bg-gray-50 border-t border-b border-gray-300">
                      <td className="p-2 font-medium">The Full Name:</td>
                      <td className="p-2">{studentName.toUpperCase()}</td>
                      <td className="p-2 font-medium">NMS No:</td>
                      <td className="p-2">{nmsNumber}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium">Class:</td>
                      <td className="p-2">{displayClass}</td>
                      <td className="p-2 font-medium">No. in Class:</td>
                      <td className="p-2">{noInClass ?? "—"}</td>
                    </tr>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <td className="p-2 font-medium">Term:</td>
                      <td className="p-2">{selectedTerm}</td>
                      <td className="p-2 font-medium">Session:</td>
                      <td className="p-2">{selectedSession || "—"}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="p-2 font-medium">Term Average:</td>
                      <td className="p-2">{avg}%</td>
                      <td className="p-2 font-medium">Total:</td>
                      <td className="p-2">{totalScore}</td>
                    </tr>
                    <tr className="bg-gray-50 border-b border-gray-300">
                      <td className="p-2 font-medium">Position:</td>
                      <td className="p-2">{position}</td>
                      <td className="p-2 font-medium">Total Subjects:</td>
                      <td className="p-2">{totalSubjects}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Academics table */}
              <div className="relative z-10">
                <div className="text-white text-sm font-semibold px-3 py-2 rounded-t" style={{ background: "#1A80C8C2" }}>ACADEMICS</div>
                <div className="overflow-x-auto border rounded-b">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "#519ED5C2" }} className="text-gray-700">
                        <th className="p-2 text-left">S/N</th>
                        <th className="p-2 text-left">SUBJECT</th>
                        <th className="p-2">CA</th>
                        <th className="p-2">EXAMS</th>
                        <th className="p-2">TOTAL</th>
                        <th className="p-2">GRADE</th>
                        <th className="p-2">REMARK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-gray-400">No results available</td>
                        </tr>
                      ) : (
                        subjects.map((subj, i) => (
                          <tr key={subj.id} className="border-b">
                            <td className="p-2">{i + 1}</td>
                            <td className="p-2">{subj.subject?.name || "—"}</td>
                            <td className="p-2 text-center">{subj.testScore}</td>
                            <td className="p-2 text-center">{subj.examScore}</td>
                            <td className="p-2 text-center">{subj.totalScore.toFixed(2)}</td>
                            <td className="p-2 text-center">{subj.grade}</td>
                            <td className="p-2 text-center">{subj.remark}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Total Subject Row */}
                <div className="bg-[#FFFF00] p-2 text-xs font-semibold border border-gray-300">
                  <div className="flex justify-between items-center">
                    <span>TOTAL SUBJECT: {totalSubjects}</span>
                    <span>Total SCORE: {totalScore}</span>
                    <span>AVG: {avg}</span>
                  </div>
                </div>

                {/* Military Section */}
                <div className="mt-4">
                  <div className="bg-[#FF0000] text-white p-2 text-sm font-semibold">MILITARY</div>
                  <div className="border-2 border-[#FF0000]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[#FF0000] text-white border-b border-[#FF0000]">
                          <th className="p-2">S/N</th>
                          <th className="p-2">SUBJECT</th>
                          <th className="p-2">CA</th>
                          <th className="p-2">EXAMS</th>
                          <th className="p-2">TOTAL</th>
                          <th className="p-2">GRADE</th>
                          <th className="p-2">REMARK</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-[#13A541] text-white">
                          <td className="p-2 text-center" colSpan={3}>TOTAL SCORE: 0</td>
                          <td className="p-2 text-center" colSpan={4}>AVG: N/A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Commandant / Repeat Class */}
                <div className="mt-4 border-t-2 border-[#1A3C8F]">
                  <div className="flex justify-between items-center py-2 px-1 text-xs font-medium">
                    <span><strong>COMMANDANT</strong>: {overall && overall.average < 45 ? "FAIR PERFORMANCE, WORK HARDER NEXT TERM." : "GOOD PERFORMANCE, KEEP IT UP."}</span>
                    <span><strong>NEXT TERM BEGINS</strong> : —</span>
                  </div>
                  {overall && overall.average < 45 && (
                    <div className="text-center py-3">
                      <p className="text-base font-black text-red-700">REPEAT CLASS: Student average is less than 45</p>
                    </div>
                  )}
                  <div className="border-t-2 border-[#D4A017]"></div>
                </div>

                {/* Psychomotor Section */}
                <div className="mt-4">
                  <div className="text-xs font-semibold mb-2">KEY TO RATINGS:</div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Academic Wing */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">ACADEMIC WING</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">SKILLS</h4>
                          <RatingTable entries={skillEntries} />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">BEHAVIOUR</h4>
                          <RatingTable entries={behaviourEntries} />
                        </div>
                      </div>
                    </div>

                    {/* Boy's Battalion */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">BOY'S BATTALION</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">SKILLS</h4>
                          <RatingTable entries={[
                            ["Leadership in (Co)Companies", 0],
                            ["Drill discipline", 0],
                            ["Game skills and rating", 0],
                          ]} />
                        </div>
                        <div>
                          <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">BEHAVIOUR</h4>
                          <RatingTable entries={[
                            ["Physical fitness/stamina", 0],
                            ["Care of kit/equipment & school kit", 0],
                            ["Regularity", 0],
                            ["Participation in coy activities", 0],
                            ["Obedience to school rules", 0],
                            ["Relationship with other students", 0],
                            ["Sense of accountability", 0],
                            ["Initiative", 0],
                            ["Punctuality", 0],
                            ["Self care/Personal habits corps", 0],
                            ["Integrity/honesty", 0],
                            ["Self improvement", 0],
                          ]} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signature Area */}
                <div className="mt-8 text-center">
                  <div className="border-b border-black inline-block px-16 mb-1"></div>
                  <div className="text-xs font-medium">COMMANDANT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RatingTable({ entries }: { entries: [string, number][] }): ReactElement {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className="p-1 w-48"></th>
          {[5,4,3,2,1].map(n => (
            <th key={n} className="p-1 w-8 text-center border">{n}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {entries.map(([label, score], i) => (
          <tr key={i} className="border-b">
            <td className="p-1">{label}</td>
            {[5,4,3,2,1].map(n => (
              <td key={n} className="p-1 text-center border">{n === score ? n : ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
