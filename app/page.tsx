"use client";

import { useState, useEffect, useRef } from "react";
import { ConversationFlow } from "@/components/ConversationFlow";
import { QuestionStep } from "@/components/QuestionStep";
import { ReportPreview } from "@/components/ReportPreview";
import { CompletionChecklist } from "@/components/CompletionChecklist";
import { GeneratedReport } from "@/components/GeneratedReport";
import { SavedReports } from "@/components/SavedReports";
import { ViewReport } from "@/components/ViewReport";
import { questions, getTotalSteps } from "@/lib/schema";
import { generateReportId } from "@/lib/utils";
import { GeneratedReportResponse, SavedReport } from "@/types/report";
import { ReportData } from "@/types/report";

type ViewMode = "home" | "new-report" | "saved-reports" | "view-report";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [generatedReportText, setGeneratedReportText] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [qaStatus, setQaStatus] = useState<"complete" | "needs-review" | null>(null);
  const [qaStatusMessage, setQaStatusMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [reportDataToGenerate, setReportDataToGenerate] = useState<ReportData | null>(null);
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null);
  const generationTriggeredRef = useRef<string | null>(null);

  // Generate report when validation passes
  useEffect(() => {
    if (
      reportDataToGenerate &&
      !generatedReportText &&
      !isGenerating &&
      !generationError &&
      generationTriggeredRef.current !== JSON.stringify(reportDataToGenerate)
    ) {
      setIsGenerating(true);
      setGenerationError(null);
      const newReportId = generateReportId();
      setReportId(newReportId);
      generationTriggeredRef.current = JSON.stringify(reportDataToGenerate);

      fetch("/api/report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: reportDataToGenerate,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to generate report");
          }
          return res.json();
        })
        .then((result: GeneratedReportResponse) => {
          setGeneratedReportText(result.generatedText);
          setQaStatus(result.qaStatus);
          setQaStatusMessage(result.qaStatusMessage);
          setIsGenerating(false);
        })
        .catch((err) => {
          setGenerationError(err instanceof Error ? err.message : "Failed to generate report");
          setIsGenerating(false);
          generationTriggeredRef.current = null;
        });
    }
  }, [reportDataToGenerate, generatedReportText, isGenerating, generationError]);

  if (viewMode === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            EMS Documentation Platform
          </h1>
          <p className="text-gray-600 mb-6">
            Create a guided, complete EMS report in minutes. Our step-by-step process
            ensures all required fields are captured.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setViewMode("new-report")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              New EMS Report
            </button>
            <button
              onClick={() => setViewMode("saved-reports")}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              View Saved Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "saved-reports") {
    return (
      <SavedReports
        onViewReport={(report) => {
          setViewingReport(report);
          setViewMode("view-report");
        }}
        onBack={() => setViewMode("home")}
      />
    );
  }

  if (viewMode === "view-report" && viewingReport) {
    return (
      <ViewReport
        report={viewingReport}
        onBack={() => setViewMode("saved-reports")}
      />
    );
  }

  return (
    <ConversationFlow>
      {(state, actions) => {
        // Trigger report generation when validation passes
        if (
          state.isComplete &&
          state.validationResults &&
          state.validationResults.status === "ready" &&
          !reportDataToGenerate &&
          !generatedReportText &&
          !isGenerating
        ) {
          setReportDataToGenerate(state.data);
        }

        // Show generated report if available
        if (generatedReportText && reportId) {
          return (
            <GeneratedReport
              reportData={state.data}
              generatedText={generatedReportText}
              reportId={reportId}
              qaStatus={qaStatus!}
              qaStatusMessage={qaStatusMessage!}
              onSave={() => {
                setGeneratedReportText(null);
                setReportId(null);
                setQaStatus(null);
                setQaStatusMessage(null);
                setReportDataToGenerate(null);
                generationTriggeredRef.current = null;
                actions.reset();
                setViewMode("home");
              }}
              onDiscard={() => {
                setGeneratedReportText(null);
                setReportId(null);
                setQaStatus(null);
                setQaStatusMessage(null);
                setReportDataToGenerate(null);
                generationTriggeredRef.current = null;
                actions.reset();
                setViewMode("home");
              }}
              onRegenerate={() => {
                setGeneratedReportText(null);
                setReportId(null);
                setQaStatus(null);
                setQaStatusMessage(null);
                setReportDataToGenerate(null);
                generationTriggeredRef.current = null;
                actions.reset();
                setViewMode("new-report");
              }}
            />
          );
        }

        // Show loading state while generating
        if (isGenerating) {
          return (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Generating Report...
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we format your report.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        // Show error state if generation failed
        if (generationError) {
          return (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-red-800 mb-2">
                    Error Generating Report
                  </h2>
                  <p className="text-red-700 mb-4">{generationError}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setGenerationError(null);
                        setGeneratedReportText(null);
                        setReportId(null);
                        setReportDataToGenerate(null);
                        generationTriggeredRef.current = null;
                        actions.resetCompletion();
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setGenerationError(null);
                        setGeneratedReportText(null);
                        setReportId(null);
                        setQaStatus(null);
                        setQaStatusMessage(null);
                        setReportDataToGenerate(null);
                        generationTriggeredRef.current = null;
                        actions.reset();
                        setViewMode("home");
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Show checklist if validation complete but not ready
        if (state.isComplete && state.validationResults) {
          return (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <button
                    onClick={() => {
                      actions.reset();
                      setViewMode("home");
                      setGeneratedReportText(null);
                      setReportId(null);
                      setQaStatus(null);
                      setQaStatusMessage(null);
                      setReportDataToGenerate(null);
                      generationTriggeredRef.current = null;
                    }}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                  >
                    ← Start New Report
                  </button>
                </div>
                <CompletionChecklist
                  data={state.data}
                  validationResults={state.validationResults}
                  onEditField={(fieldId) => {
                    const stepIndex = questions.findIndex((q) => q.id === fieldId);
                    if (stepIndex !== -1) {
                      actions.resetCompletion();
                      setGeneratedReportText(null);
                      setReportId(null);
                      setReportDataToGenerate(null);
                      generationTriggeredRef.current = null;
                      actions.goToStep(stepIndex);
                    }
                  }}
                />
              </div>
            </div>
          );
        }

        const currentQuestion = questions[state.currentStep];
        const totalSteps = getTotalSteps();
        const canGoNext = !currentQuestion.required || state.data[currentQuestion.id].trim() !== "";
        const canGoPrevious = state.currentStep > 0;
        const isLastStep = state.currentStep === totalSteps - 1;

        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
              <div className="mb-4">
                <button
                  onClick={() => {
                    actions.reset();
                    setViewMode("home");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-120px)]">
                <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
                  <QuestionStep
                    question={currentQuestion}
                    value={state.data[currentQuestion.id]}
                    onChange={(value) => actions.updateField(currentQuestion.id, value)}
                    onNext={actions.nextStep}
                    onPrevious={actions.prevStep}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                    isLastStep={isLastStep}
                    onComplete={actions.complete}
                  />
                </div>

                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                  <ReportPreview data={state.data} currentStep={state.currentStep} />
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </ConversationFlow>
  );
}

