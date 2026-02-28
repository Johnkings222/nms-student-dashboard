import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import SchoolLogo from "../../assets/School_Logo.png";
import FrameUser from "../../assets/Frame_User.png";
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

export default function ReportCard(): ReactElement {
  const [selectedClass, setSelectedClass] = useState("Class");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedSession, setSelectedSession] = useState("2023/2024");

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-4 text-center text-lg font-semibold">Report Card</div>

      {/* Dropdowns + PDF download */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
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

        {/* Download PDF Icon */}
        <button title="Download PDF">
          <img src={PdfIcon} alt="PDF" className="w-8 h-8 object-contain" />
        </button>
      </div>

      {/* Card container with watermark */}
      <div className="px-6">
        <div className="relative bg-white rounded-xl shadow p-6 overflow-hidden">
          {/* Watermark */}
          <img
            src={SchoolLogo}
            alt="watermark"
            className="pointer-events-none select-none opacity-10 absolute -z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[700px] w-[80%]"
          />

          {/* Top meta row: left count, center class, right download */}
          <div className="relative z-10 grid grid-cols-3 items-center mb-4">
            <div className="text-sm text-gray-700">Term 1</div>
            <div className="text-sm font-medium text-gray-900 text-center">SS2E</div>
            <div className="flex justify-end">
              <button className="bg-[#13A541] text-white px-4 py-2 rounded inline-flex items-center gap-2">
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
                  style={{ width: "251px", height: "44px", padding: "10px", gap: "10px", opacity: 1 }}
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
                    <td className="p-2">ZAKARIAH IBRAHIM OVEH</td>
                    <td className="p-2 font-medium">NMS No:</td>
                    <td className="p-2">NMS/20/8935</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 font-medium">Class:</td>
                    <td className="p-2">SS 2E</td>
                    <td className="p-2 font-medium">No. in Class:</td>
                    <td className="p-2">45</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <td className="p-2 font-medium">Term:</td>
                    <td className="p-2">First Term</td>
                    <td className="p-2 font-medium">Session:</td>
                    <td className="p-2">2024/2025</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="p-2 font-medium">Term Average:</td>
                    <td className="p-2">45.51%</td>
                    <td className="p-2 font-medium">Total:</td>
                    <td className="p-2">546.10</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-300">
                    <td className="p-2 font-medium">Cumulative Average:</td>
                    <td className="p-2">...</td>
                    <td className="p-2 font-medium">53:</td>
                    <td className="p-2">...</td>
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
                      <th className="p-2">1 CA</th>
                      <th className="p-2">2 CA</th>
                      <th className="p-2">EXAMS</th>
                      <th className="p-2">TOTAL</th>
                      <th className="p-2">GRADE</th>
                      <th className="p-2">REMARK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "ENGLISH","MEDIA STUDIES","SPORT BTEC","FRENCH","GEOGRAPHY","Literacy","Food & Cookery","Sociology","ART","RELIGIOUS EDUCATION","Add Maths","HISTORY",
                    ].map((subj, i) => (
                      <tr key={subj} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{subj}</td>
                        <td className="p-2 text-center">13</td>
                        <td className="p-2 text-center">15</td>
                        <td className="p-2 text-center">33</td>
                        <td className="p-2 text-center">59.00</td>
                        <td className="p-2 text-center">C5</td>
                        <td className="p-2 text-center">Credit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Subject Row */}
              <div className="bg-[#FFFF00] p-2 text-xs font-semibold border border-gray-300">
                <div className="flex justify-between items-center">
                  <span>TOTAL SUBJECT: 12</span>
                  <span>Total SCORE: 546.10</span>
                  <span>AVG: 45.51</span>
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
                        <th className="p-2">1 CA</th>
                        <th className="p-2">2 CA</th>
                        <th className="p-2">EXAMS</th>
                        <th className="p-2">TOTAL</th>
                        <th className="p-2">GRADE</th>
                        <th className="p-2">REMARK</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-[#13A541] text-white">
                        <td className="p-2 text-center" colSpan={4}>TOTAL SCORE: 0</td>
                        <td className="p-2 text-center" colSpan={4}>AVG: N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commandant / Repeat Class */}
              <div className="mt-4 border-t-2 border-[#1A3C8F]">
                <div className="flex justify-between items-center py-2 px-1 text-xs font-medium">
                  <span><strong>COMMANDANT</strong>: FAIR PERFORMANCE, WORK HARDER NEXT TERM.</span>
                  <span><strong>NEXT TERM BEGINS</strong> : 20 SEPTEMBER 2025</span>
                </div>
                <div className="text-center py-3">
                  <p className="text-base font-black">REPEAT CLASS: Student average is less than 45</p>
                </div>
                <div className="border-t-2 border-[#D4A017]"></div>
              </div>

              {/* Key to Ratings */}
              <div className="mt-4">
                <div className="text-xs font-semibold mb-2">KEY TO RATINGS:</div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Academic Wing */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">ACADEMIC WING</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">SKILLS</h4>
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
                            {([
                              ["Handling of lab tools & workshop equipment", 3],
                              ["Handwriting", 4],
                              ["Fluency", 5],
                              ["Gymnastics", 2],
                            ] as [string, number][]).map(([skill, score]) => (
                              <tr key={skill} className="border-b">
                                <td className="p-1">{skill}</td>
                                {[5,4,3,2,1].map(n => (
                                  <td key={n} className="p-1 text-center border">{n === score ? score : ""}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">BEHAVIOUR</h4>
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
                            {([
                              ["Attentiveness", 4],
                              ["Participation in class/sch activities", 3],
                              ["Class attendance", 5],
                              ["Neatness/Turnout", 4],
                              ["Politeness/Respect", 5],
                              ["Relationship with staff", 3],
                              ["Self control", 4],
                              ["Attentiveness", 2],
                            ] as [string, number][]).map(([behavior, score], i) => (
                              <tr key={i} className="border-b">
                                <td className="p-1">{behavior}</td>
                                {[5,4,3,2,1].map(n => (
                                  <td key={n} className="p-1 text-center border">{n === score ? score : ""}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Boy's Battalion */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2">BOY'S BATTALION</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">SKILLS</h4>
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
                            {([
                              ["Leadership in (Co)Companies", 4],
                              ["Drill discipline", 3],
                              ["Game skills and rating", 5],
                            ] as [string, number][]).map(([skill, score]) => (
                              <tr key={skill} className="border-b">
                                <td className="p-1">{skill}</td>
                                {[5,4,3,2,1].map(n => (
                                  <td key={n} className="p-1 text-center border">{n === score ? score : ""}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium mb-1 bg-[#5C6BC0] text-white p-1">BEHAVIOUR</h4>
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
                            {([
                              ["Physical fitness/stamina", 4],
                              ["Care of kit/equipment & school kit", 3],
                              ["Regularity", 5],
                              ["Participation in coy activities", 4],
                              ["Obedience to school rules", 3],
                              ["Relationship with other students", 5],
                              ["Sense of accountability", 4],
                              ["Initiative", 2],
                              ["Punctuality", 5],
                              ["Self care/Personal habits corps", 3],
                              ["Integrity/honesty", 4],
                              ["Self improvement", 3],
                            ] as [string, number][]).map(([behavior, score]) => (
                              <tr key={behavior} className="border-b">
                                <td className="p-1">{behavior}</td>
                                {[5,4,3,2,1].map(n => (
                                  <td key={n} className="p-1 text-center border">{n === score ? score : ""}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
    </div>
  );
}
