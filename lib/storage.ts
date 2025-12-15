import { ReportData } from "@/types/report";
import { generateReportId } from "./utils";

type StoredReport = {
  data: ReportData;
  generatedText: string;
  createdAt: Date;
};

const reports: Record<string, StoredReport> = {};

export function saveReport(
  reportId: string,
  data: ReportData,
  generatedText: string
): void {
  reports[reportId] = {
    data,
    generatedText,
    createdAt: new Date(),
  };
}

export function getReport(reportId: string): StoredReport | undefined {
  return reports[reportId];
}

export function deleteReport(reportId: string): boolean {
  if (reports[reportId]) {
    delete reports[reportId];
    return true;
  }
  return false;
}

export function getAllReports(): Record<string, StoredReport> {
  return reports;
}

