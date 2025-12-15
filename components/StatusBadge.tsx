"use client";

import { ValidationResults } from "@/types/report";

interface StatusBadgeProps {
  validationResults: ValidationResults;
}

export function StatusBadge({ validationResults }: StatusBadgeProps) {
  if (validationResults.status === "ready") {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-300">
        <span className="text-xl">✅</span>
        <span className="font-semibold">Report Ready for Submission</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
      <span className="text-xl">⚠️</span>
      <span className="font-semibold">Report Needs Review</span>
    </div>
  );
}

