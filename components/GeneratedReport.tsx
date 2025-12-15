"use client";

import { useState } from "react";
import { ReportData, SaveReportResponse, DiscardReportResponse } from "@/types/report";

interface GeneratedReportProps {
  reportData: ReportData;
  generatedText: string;
  reportId: string;
  onSave: () => void;
  onDiscard: () => void;
  onRegenerate: () => void;
}

export function GeneratedReport({
  reportData,
  generatedText,
  reportId,
  onSave,
  onDiscard,
  onRegenerate,
}: GeneratedReportProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [discardConfirmed, setDiscardConfirmed] = useState(false);
  const [discardSuccess, setDiscardSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/report/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          data: reportData,
          generatedText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save report");
      }

      const result: SaveReportResponse = await response.json();
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          onSave();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = async () => {
    if (!discardConfirmed) {
      setDiscardConfirmed(true);
      return;
    }

    setIsDiscarding(true);
    setError(null);

    try {
      const response = await fetch("/api/report/discard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to discard report");
      }

      const result: DiscardReportResponse = await response.json();
      if (result.success) {
        setDiscardSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to discard report");
      setIsDiscarding(false);
    }
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

  if (discardSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Report Discarded
            </h2>
            <p className="text-gray-600 mb-6">
              The report has been discarded successfully.
            </p>
            <div className="space-y-3">
              <p className="text-lg font-medium text-gray-700 mb-4">
                Would you like to generate another report?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onRegenerate}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Yes, Generate New Report
                </button>
                <button
                  onClick={onDiscard}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  No, Return to Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (discardConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Discard This Report?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to discard this report? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setDiscardConfirmed(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscard}
                disabled={isDiscarding}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isDiscarding ? "Discarding..." : "Yes, Discard Report"}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Generated EMS Report
          </h1>
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
            disabled={isDiscarding}
            className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Discard Report
          </button>
        </div>
      </div>
    </div>
  );
}

