"use client";

import { useState } from "react";
import { ConversationFlow } from "@/components/ConversationFlow";
import { QuestionStep } from "@/components/QuestionStep";
import { ReportPreview } from "@/components/ReportPreview";
import { CompletionChecklist } from "@/components/CompletionChecklist";
import { questions, getTotalSteps } from "@/lib/schema";

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
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
          <button
            onClick={() => setHasStarted(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            New EMS Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <ConversationFlow>
      {(state, actions) => {
        if (state.isComplete && state.validationResults) {
          return (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <button
                    onClick={() => {
                      actions.reset();
                      setHasStarted(false);
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
                      actions.goToStep(stepIndex);
                    }
                  }}
                />
                {state.validationResults.status === "ready" && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        actions.reset();
                        setHasStarted(false);
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Create Another Report
                    </button>
                  </div>
                )}
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
                    setHasStarted(false);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to Start
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

