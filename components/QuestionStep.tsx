"use client";

import { useState } from "react";
import { Question } from "@/types/report";
import { enhanceResponse, isAIAvailable } from "@/lib/ai";

interface QuestionStepProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  onComplete: () => void;
}

export function QuestionStep({
  question,
  value,
  onChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastStep,
  onComplete,
}: QuestionStepProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const aiAvailable = isAIAvailable();

  const handleUnknown = () => {
    onChange("unknown");
  };

  const handleEnhance = async () => {
    if (!value.trim() || !aiAvailable) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceResponse(value, question.label);
      onChange(enhanced);
    } catch (error) {
      console.error("Failed to enhance response:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {question.question}
        </h2>
        {question.required && (
          <span className="text-sm text-red-600">Required</span>
        )}
      </div>

      <div className="flex-1 mb-6">
        {question.type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}

        {aiAvailable && value.trim() && question.type === "textarea" && (
          <button
            onClick={handleEnhance}
            disabled={isEnhancing}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
          >
            {isEnhancing ? "Enhancing..." : "✨ Enhance with AI"}
          </button>
        )}
      </div>

      <div className="flex gap-3">
        {canGoPrevious && (
          <button
            onClick={onPrevious}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleUnknown}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Mark as Unknown
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext && question.required && !value.trim()}
          className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLastStep ? "Complete Report" : "Next"}
        </button>
      </div>
    </div>
  );
}

