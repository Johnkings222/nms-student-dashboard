import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import EmptyStateImg from "../../assets/undraw_open_note_cgre 1.png";
import RulesService, { type RulesAndRegulations as RulesData } from "../../services/rulesService";
import LoadingState from "../../components/ui/LoadingState";

export default function RulesAndRegulations(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rulesData, setRulesData] = useState<RulesData | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await RulesService.getRulesAndRegulations();
      console.log("Rules data received:", data);

      // Validate data structure
      if (data && data.sections && Array.isArray(data.sections)) {
        setRulesData(data);
      } else {
        console.warn("Invalid data structure received:", data);
        setRulesData(null);
      }
    } catch (err: any) {
      console.error("Error fetching rules:", err);

      // Handle 403 (Forbidden) and 404 (Not Found) as "no data yet"
      // This happens when admin hasn't uploaded rules yet
      if (err.response?.status === 403 || err.response?.status === 404) {
        setRulesData(null);
        setError("");
      } else {
        // Show error for other types of failures
        setError(err.message || "Failed to load rules and regulations");
        setRulesData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await RulesService.downloadRulesAndRegulations();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Rules_and_Regulations_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading rules:", err);
      alert("Failed to download rules and regulations");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h1 className="text-xl text-center">Rules and Regulations</h1>
      </div>

      {/* Loading state */}
      {loading && <LoadingState />}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center justify-center py-24">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && !rulesData && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center text-center text-gray-500">
            <img
              src={EmptyStateImg}
              alt="No data illustration"
              className="w-72 h-auto mb-4"
              loading="lazy"
            />
            <p>No record yet</p>
          </div>
        </div>
      )}

      {/* Content with rules */}
      {!loading && rulesData && rulesData.sections && (
        <div className="bg-white rounded-xl shadow">
          {/* Header with last updated and download button */}
          <div className="bg-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between">
            <h2 className="font-semibold text-lg">{rulesData.title || "Rules and Regulations"}</h2>
          </div>

          <div className="p-6">
            {/* Last updated and Download button */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Last updated: {rulesData.lastUpdated ? new Date(rulesData.lastUpdated).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                }) : "N/A"}
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors disabled:opacity-50"
                title="Download Rules and Regulations"
              >
                <Download size={20} />
              </button>
            </div>

            {/* Rules sections */}
            <div className="space-y-6">
              {rulesData.sections.map((section, index) => (
                <div key={section.id || index} className="border rounded-lg p-6">
                  <h3 className="font-semibold text-base mb-4">
                    {index + 1}. {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.rules && section.rules.map((rule, ruleIndex) => (
                      <li key={rule.id || ruleIndex} className="text-sm text-gray-700 flex">
                        <span className="mr-2">•</span>
                        <span className="flex-1">{rule.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
