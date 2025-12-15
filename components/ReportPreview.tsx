"use client";

import { ReportData } from "@/types/report";
import { questions, getTotalSteps } from "@/lib/schema";

interface ReportPreviewProps {
  data: ReportData;
  currentStep: number;
}

export function ReportPreview({ data, currentStep }: ReportPreviewProps) {
  const totalSteps = getTotalSteps();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const getFieldValue = (fieldId: keyof ReportData) => {
    const value = data[fieldId];
    if (!value || value.trim() === "") {
      return <span className="text-gray-400 italic">Not answered</span>;
    }
    return <span>{value}</span>;
  };

  const isFieldComplete = (fieldId: keyof ReportData) => {
    const value = data[fieldId];
    return value && value.trim() !== "";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Report Preview
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Step {currentStep + 1} of {totalSteps}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {questions.map((question) => {
          const isComplete = isFieldComplete(question.id);
          const isCurrent = question.id === questions[currentStep]?.id;

          return (
            <div
              key={question.id}
              className={`p-4 border rounded-lg ${
                isCurrent
                  ? "border-blue-500 bg-blue-50"
                  : isComplete
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{question.label}</h4>
                {isComplete ? (
                  <span className="text-green-600 text-sm">✓</span>
                ) : question.required ? (
                  <span className="text-red-500 text-sm">Required</span>
                ) : null}
              </div>
              <div className="text-sm text-gray-700">{getFieldValue(question.id)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

