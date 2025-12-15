import { ReportData, ValidationResults, ValidationError, Question } from "@/types/report";
import { questions } from "./schema";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countSentences(text: string): number {
  const sentenceEndings = /[.!?]+/;
  const sentences = text.trim().split(sentenceEndings).filter(s => s.trim().length > 0);
  return sentences.length;
}

export function validateReport(data: ReportData): ValidationResults {
  const errors: ValidationError[] = [];

  questions.forEach((question: Question) => {
    const value = data[question.id];
    const isEmpty = !value || value.trim() === "";
    const isUnknown = value.trim().toLowerCase() === "unknown";

    // Check required fields
    if (question.required && isEmpty) {
      errors.push({
        field: question.id,
        message: `${question.label} is required`,
      });
      return;
    }

    // If field is "unknown", it's valid
    if (isUnknown) {
      return;
    }

    // Check minimum word count
    if (question.validation?.minWords) {
      const wordCount = countWords(value);
      if (wordCount < question.validation.minWords) {
        errors.push({
          field: question.id,
          message: `${question.label} must be at least ${question.validation.minWords} words (currently ${wordCount})`,
        });
      }
    }

    // Check minimum sentence count
    if (question.validation?.minSentences) {
      const sentenceCount = countSentences(value);
      if (sentenceCount < question.validation.minSentences) {
        errors.push({
          field: question.id,
          message: `${question.label} must contain at least ${question.validation.minSentences} complete sentence(s)`,
        });
      }
    }
  });

  const isValid = errors.length === 0;
  const status: "ready" | "needs-review" = isValid ? "ready" : "needs-review";

  return {
    isValid,
    errors,
    status,
  };
}

