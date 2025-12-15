import { Question, ReportData } from "@/types/report";

export const initialReportData: ReportData = {
  patientAge: "",
  patientGender: "",
  chiefComplaint: "",
  incidentLocation: "",
  assessmentSummary: "",
  interventionsPerformed: "",
  transportOutcome: "",
};

export const questions: Question[] = [
  {
    id: "patientAge",
    label: "Patient Age",
    question: "What is the patient's age?",
    placeholder: "Enter age (e.g., 45, 65, unknown)",
    required: true,
    type: "text",
  },
  {
    id: "patientGender",
    label: "Patient Gender",
    question: "What is the patient's gender?",
    placeholder: "Enter gender (e.g., male, female, non-binary, unknown)",
    required: true,
    type: "text",
  },
  {
    id: "chiefComplaint",
    label: "Chief Complaint",
    question: "What is the patient's chief complaint?",
    placeholder: "Describe the primary reason for the call in detail...",
    required: true,
    type: "textarea",
    validation: {
      minWords: 5,
    },
  },
  {
    id: "incidentLocation",
    label: "Incident Location",
    question: "Where did the incident occur?",
    placeholder: "Enter the location (e.g., 123 Main St, Apartment 4B)",
    required: true,
    type: "text",
  },
  {
    id: "assessmentSummary",
    label: "Assessment Summary",
    question: "Provide a summary of your assessment findings.",
    placeholder: "Describe vital signs, physical examination findings, and clinical observations...",
    required: true,
    type: "textarea",
    validation: {
      minSentences: 1,
    },
  },
  {
    id: "interventionsPerformed",
    label: "Interventions Performed",
    question: "What interventions were performed?",
    placeholder: "List all treatments, medications, or procedures performed...",
    required: false,
    type: "textarea",
  },
  {
    id: "transportOutcome",
    label: "Transport Outcome",
    question: "What was the transport outcome?",
    placeholder: "Describe the outcome (e.g., transported to hospital, refused transport, etc.)",
    required: true,
    type: "textarea",
  },
];

export const getTotalSteps = (): number => questions.length;

