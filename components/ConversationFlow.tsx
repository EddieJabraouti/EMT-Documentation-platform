"use client";

import { useReducer, useCallback } from "react";
import { ReportData, ReportState, ValidationResults } from "@/types/report";
import { initialReportData, questions, getTotalSteps } from "@/lib/schema";
import { validateReport } from "@/lib/validation";

type Action =
  | { type: "UPDATE_FIELD"; field: keyof ReportData; value: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "COMPLETE" }
  | { type: "RESET" }
  | { type: "RESET_COMPLETION" };

function reportReducer(state: ReportState, action: Action): ReportState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: action.value,
        },
      };
    case "NEXT_STEP":
      if (state.currentStep < getTotalSteps() - 1) {
        return {
          ...state,
          currentStep: state.currentStep + 1,
        };
      }
      return state;
    case "PREV_STEP":
      if (state.currentStep > 0) {
        return {
          ...state,
          currentStep: state.currentStep - 1,
        };
      }
      return state;
    case "GO_TO_STEP":
      if (action.step >= 0 && action.step < getTotalSteps()) {
        return {
          ...state,
          currentStep: action.step,
          isComplete: false,
          validationResults: null,
        };
      }
      return state;
    case "RESET_COMPLETION":
      return {
        ...state,
        isComplete: false,
        validationResults: null,
      };
    case "COMPLETE":
      const validationResults = validateReport(state.data);
      return {
        ...state,
        isComplete: true,
        validationResults,
      };
    case "RESET":
      return {
        data: initialReportData,
        currentStep: 0,
        isComplete: false,
        validationResults: null,
      };
    default:
      return state;
  }
}

const initialState: ReportState = {
  data: initialReportData,
  currentStep: 0,
  isComplete: false,
  validationResults: null,
};

interface ConversationFlowProps {
  children: (state: ReportState, actions: {
    updateField: (field: keyof ReportData, value: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    complete: () => void;
    reset: () => void;
    resetCompletion: () => void;
  }) => React.ReactNode;
}

export function ConversationFlow({ children }: ConversationFlowProps) {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  const updateField = useCallback((field: keyof ReportData, value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: "NEXT_STEP" });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: "PREV_STEP" });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: "GO_TO_STEP", step });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: "COMPLETE" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const resetCompletion = useCallback(() => {
    dispatch({ type: "RESET_COMPLETION" });
  }, []);

  return (
    <>
      {children(state, {
        updateField,
        nextStep,
        prevStep,
        goToStep,
        complete,
        reset,
        resetCompletion,
      })}
    </>
  );
}

