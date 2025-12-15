"use client";

import { ValidationResults, ReportData } from "@/types/report";
import { questions } from "@/lib/schema";
import { StatusBadge } from "./StatusBadge";

interface CompletionChecklistProps {
  data: ReportData;
  validationResults: ValidationResults;
  onEditField: (fieldId: keyof ReportData) => void;
}

export function CompletionChecklist({
  data,
  validationResults,
  onEditField,
}: CompletionChecklistProps) {
  const getFieldError = (fieldId: keyof ReportData) => {
    return validationResults.errors.find((err) => err.field === fieldId);
  };

  const isFieldValid = (fieldId: keyof ReportData) => {
    const error = getFieldError(fieldId);
    return !error;
  };

  const getFieldValue = (fieldId: keyof ReportData) => {
    const value = data[fieldId];
    if (!value || value.trim() === "") {
      return null;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <StatusBadge validationResults={validationResults} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Completion Checklist
        </h3>

        <div className="space-y-4">
          {questions.map((question) => {
            const isValid = isFieldValid(question.id);
            const error = getFieldError(question.id);
            const value = getFieldValue(question.id);
            const isUnknown = value?.toLowerCase().trim() === "unknown";

            return (
              <div
                key={question.id}
                className={`p-4 border rounded-lg ${
                  isValid
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isValid ? (
                        <span className="text-green-600 text-xl">✓</span>
                      ) : (
                        <span className="text-red-600 text-xl">✗</span>
                      )}
                      <h4 className="font-medium text-gray-800">
                        {question.label}
                      </h4>
                      {question.required && (
                        <span className="text-xs text-gray-500">(Required)</span>
                      )}
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 mb-2">{error.message}</p>
                    )}

                    {value && (
                      <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 mt-2">
                        {isUnknown ? (
                          <span className="italic text-gray-500">Marked as unknown</span>
                        ) : (
                          <p className="whitespace-pre-wrap">{value}</p>
                        )}
                      </div>
                    )}

                    {!value && !error && (
                      <p className="text-sm text-gray-500 italic">Not answered</p>
                    )}
                  </div>

                  {error && (
                    <button
                      onClick={() => onEditField(question.id)}
                      className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {validationResults.errors.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Please review the items marked above.</strong> All required fields
            must be completed, and certain fields have minimum requirements (e.g., word
            count, sentence count).
          </p>
        </div>
      )}
    </div>
  );
}

