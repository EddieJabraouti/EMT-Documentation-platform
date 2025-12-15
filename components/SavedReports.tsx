"use client";

import { useState, useEffect } from "react";
import { SavedReport } from "@/types/report";
import { getSavedReportsList, getSavedReport } from "@/lib/localStorage";

interface SavedReportsProps {
  onViewReport: (report: SavedReport) => void;
  onBack: () => void;
}

export function SavedReports({ onViewReport, onBack }: SavedReportsProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);

  useEffect(() => {
    const savedReports = getSavedReportsList();
    setReports(savedReports);
  }, []);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Saved Reports</h1>
          </div>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No Saved Reports
            </h2>
            <p className="text-gray-600">
              Reports you save will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Saved Reports</h1>
          <p className="text-gray-600 mt-2">
            {reports.length} {reports.length === 1 ? "report" : "reports"} saved
          </p>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewReport(report)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {report.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {formatDate(report.timestamp)}
                  </p>
                  <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${
                    report.qaStatus === "complete"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {report.qaStatusMessage}
                  </div>
                </div>
                <div className="text-gray-400 ml-4">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

