import apiClient from "./api";

export interface Rule {
  id: string;
  content: string;
}

export interface RuleSection {
  id: string;
  title: string;
  rules: Rule[];
}

export interface RulesAndRegulations {
  id: string;
  title: string;
  lastUpdated: string;
  sections: RuleSection[];
}

class RulesService {
  /**
   * Get the current rules and regulations
   */
  static async getRulesAndRegulations(): Promise<RulesAndRegulations> {
    const response = await apiClient.get("/api/rules-regulations");
    return response.data;
  }

  /**
   * Download rules and regulations as PDF
   */
  static async downloadRulesAndRegulations(): Promise<Blob> {
    const response = await apiClient.get("/api/rules-regulations/download", {
      responseType: "blob"
    });
    return response.data;
  }
}

export default RulesService;
