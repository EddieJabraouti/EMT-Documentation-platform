import { ReportData, QAStatus } from "@/types/report";

export function generateReportText(data: ReportData): { text: string; qaStatus: QAStatus } {
  const formatValue = (value: string, allowUnknown: boolean = true): string => {
    if (!value || value.trim() === "") {
      return "";
    }
    const lower = value.toLowerCase().trim();
    if (lower === "unknown" && allowUnknown) {
      return "Unknown";
    }
    return value.trim();
  };

  const formatDemographics = (): string => {
    const age = formatValue(data.patientAge);
    const gender = formatValue(data.patientGender);
    
    if (!age && !gender) {
      return "";
    }
    
    let demo = "";
    if (age) demo += `${age} year old`;
    if (age && gender) demo += " ";
    if (gender) demo += gender;
    return demo.trim();
  };

  const generateReportTitle = (): string => {
    const complaint = data.chiefComplaint?.toLowerCase() || "";
    const demographics = formatDemographics();
    
    // Extract key complaint words
    const complaintWords = complaint.split(/\s+/).slice(0, 3).join(" ");
    const title = complaintWords || "Patient Care";
    
    if (demographics) {
      return `${title.charAt(0).toUpperCase() + title.slice(1)} – ${demographics}`;
    }
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  let report = "";
  report += "=".repeat(70) + "\n";
  report += "EMS PATIENT CARE REPORT\n";
  report += "=".repeat(70) + "\n\n";

  // Patient Demographics
  const demographics = formatDemographics();
  if (demographics) {
    report += "PATIENT DEMOGRAPHICS\n";
    report += "-".repeat(70) + "\n";
    if (data.patientAge) report += `Age: ${formatValue(data.patientAge)}\n`;
    if (data.patientGender) report += `Gender: ${formatValue(data.patientGender)}\n`;
    report += "\n";
  }

  // Chief Complaint
  if (data.chiefComplaint && data.chiefComplaint.trim() !== "" && data.chiefComplaint.toLowerCase() !== "unknown") {
    report += "CHIEF COMPLAINT\n";
    report += "-".repeat(70) + "\n";
    report += data.chiefComplaint.trim() + "\n";
    report += "\n";
  }

  // Incident Location
  if (data.incidentLocation && data.incidentLocation.trim() !== "" && data.incidentLocation.toLowerCase() !== "unknown") {
    report += "INCIDENT LOCATION\n";
    report += "-".repeat(70) + "\n";
    report += data.incidentLocation.trim() + "\n";
    report += "\n";
  }

  // Assessment Summary
  if (data.assessmentSummary && data.assessmentSummary.trim() !== "" && data.assessmentSummary.toLowerCase() !== "unknown") {
    report += "ASSESSMENT SUMMARY\n";
    report += "-".repeat(70) + "\n";
    report += data.assessmentSummary.trim() + "\n";
    report += "\n";
  }

  // Interventions Performed
  if (data.interventionsPerformed && data.interventionsPerformed.trim() !== "" && data.interventionsPerformed.toLowerCase() !== "unknown") {
    report += "INTERVENTIONS PERFORMED\n";
    report += "-".repeat(70) + "\n";
    report += data.interventionsPerformed.trim() + "\n";
    report += "\n";
  }

  // Transport Outcome
  if (data.transportOutcome && data.transportOutcome.trim() !== "" && data.transportOutcome.toLowerCase() !== "unknown") {
    report += "TRANSPORT OUTCOME\n";
    report += "-".repeat(70) + "\n";
    report += data.transportOutcome.trim() + "\n";
    report += "\n";
  }

  report += "=".repeat(70) + "\n";
  report += "End of Report\n";
  report += "=".repeat(70);

  // Determine QA status
  const hasRequiredFields = 
    data.patientAge && data.patientAge.trim() !== "" && data.patientAge.toLowerCase() !== "unknown" &&
    data.patientGender && data.patientGender.trim() !== "" && data.patientGender.toLowerCase() !== "unknown" &&
    data.chiefComplaint && data.chiefComplaint.trim() !== "" && data.chiefComplaint.toLowerCase() !== "unknown" &&
    data.incidentLocation && data.incidentLocation.trim() !== "" && data.incidentLocation.toLowerCase() !== "unknown" &&
    data.assessmentSummary && data.assessmentSummary.trim() !== "" && data.assessmentSummary.toLowerCase() !== "unknown" &&
    data.transportOutcome && data.transportOutcome.trim() !== "" && data.transportOutcome.toLowerCase() !== "unknown";

  const qaStatus: QAStatus = hasRequiredFields ? "complete" : "needs-review";

  return { text: report, qaStatus };
}

