"use client";

import { SavedReport } from "@/types/report";

interface ViewReportProps {
  report: SavedReport;
  onBack: () => void;
}

export function ViewReport({ report, onBack }: ViewReportProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Saved Reports
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {report.title}
              </h1>
              <p className="text-gray-600">
                Saved on {new Date(report.timestamp).toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              report.qaStatus === "complete"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {report.qaStatusMessage}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            {report.generatedText}
          </pre>
        </div>
      </div>
    </div>
  );
}

