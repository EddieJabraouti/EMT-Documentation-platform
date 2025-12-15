import { ReportData, SavedReport, QAStatus } from "@/types/report";
import { generateReportId } from "./utils";

const STORAGE_KEY = "ems_saved_reports";

function generateReportTitle(data: ReportData): string {
  const complaint = data.chiefComplaint?.toLowerCase() || "";
  const age = data.patientAge?.trim() || "";
  const gender = data.patientGender?.trim() || "";
  
  // Extract key complaint words
  const complaintWords = complaint.split(/\s+/).slice(0, 3).join(" ");
  const title = complaintWords || "Patient Care";
  
  let demographics = "";
  if (age && age.toLowerCase() !== "unknown") {
    demographics += age;
    if (gender && gender.toLowerCase() !== "unknown") {
      demographics += gender.charAt(0).toUpperCase();
    }
  } else if (gender && gender.toLowerCase() !== "unknown") {
    demographics = gender;
  }
  
  if (demographics) {
    return `${title.charAt(0).toUpperCase() + title.slice(1)} – ${demographics}`;
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function saveReportToLocalStorage(
  data: ReportData,
  generatedText: string,
  qaStatus: QAStatus,
  qaStatusMessage: string
): string {
  const reportId = generateReportId();
  const title = generateReportTitle(data);
  const timestamp = Date.now();

  const savedReport: SavedReport = {
    reportId,
    title,
    timestamp,
    data,
    generatedText,
    qaStatus,
    qaStatusMessage,
  };

  const existingReports = getAllSavedReports();
  existingReports[reportId] = savedReport;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingReports));
    return reportId;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    throw new Error("Failed to save report to local storage");
  }
}

export function getAllSavedReports(): Record<string, SavedReport> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {};
  }
}

export function getSavedReport(reportId: string): SavedReport | null {
  const reports = getAllSavedReports();
  return reports[reportId] || null;
}

export function getSavedReportsList(): SavedReport[] {
  const reports = getAllSavedReports();
  return Object.values(reports).sort((a, b) => b.timestamp - a.timestamp);
}

