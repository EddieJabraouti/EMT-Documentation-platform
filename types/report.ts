export type ReportData = {
  patientAge: string;
  patientGender: string;
  chiefComplaint: string;
  incidentLocation: string;
  assessmentSummary: string;
  interventionsPerformed: string;
  transportOutcome: string;
};

export type Question = {
  id: keyof ReportData;
  label: string;
  question: string;
  placeholder: string;
  required: boolean;
  type: "text" | "textarea";
  validation?: {
    minWords?: number;
    minSentences?: number;
  };
};

export type ValidationError = {
  field: keyof ReportData;
  message: string;
};

export type ValidationResults = {
  isValid: boolean;
  errors: ValidationError[];
  status: "ready" | "needs-review";
};

export type ReportState = {
  data: ReportData;
  currentStep: number;
  isComplete: boolean;
  validationResults: ValidationResults | null;
};

