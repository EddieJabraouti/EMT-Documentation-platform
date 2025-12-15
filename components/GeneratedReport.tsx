"use client";

import { useState } from "react";
import { ReportData, QAStatus } from "@/types/report";
import { saveReportToLocalStorage } from "@/lib/localStorage";

interface GeneratedReportProps {
  reportData: ReportData;
  generatedText: string;
  reportId: string;
  qaStatus: QAStatus;
  qaStatusMessage: string;
  onSave: () => void;
  onDiscard: () => void;
  onRegenerate: () => void;
}

export function GeneratedReport({
  reportData,
  generatedText,
  reportId,
  qaStatus,
  qaStatusMessage,
  onSave,
  onDiscard,
  onRegenerate,
}: GeneratedReportProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    setIsSaving(true);
    setError(null);

    try {
      const savedReportId = saveReportToLocalStorage(
        reportData,
        generatedText,
        qaStatus,
        qaStatusMessage
      );
      
      setSaveSuccess(true);
      setTimeout(() => {
        onSave();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save report");
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setShowDiscardPopup(true);
  };

  if (saveSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold text-green-800 mb-2">
              Report Saved Successfully
            </h2>
            <p className="text-green-700 mb-6">
              Your report has been saved with ID: <strong>{reportId}</strong>
            </p>
            <button
              onClick={onSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create New Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDiscardPopup) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Report Discarded
            </h2>
            <p className="text-gray-600 mb-6">
              Report discarded. It was not saved.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onRegenerate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Generate Another Report
              </button>
              <button
                onClick={onDiscard}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Generated EMS Report
            </h1>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              qaStatus === "complete"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {qaStatusMessage}
            </div>
          </div>
          <p className="text-gray-600">
            Review the generated report below. You can save it or discard it and generate a new one.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
            {generatedText}
          </pre>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isSaving ? "Saving..." : "Save Report"}
          </button>
          <button
            onClick={handleDiscard}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Discard Report
          </button>
        </div>
      </div>
    </div>
  );
}

