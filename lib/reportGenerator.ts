import { ReportData } from "@/types/report";

export function generateReportText(data: ReportData): string {
  const formatValue = (value: string): string => {
    if (!value || value.trim() === "") {
      return "Not provided";
    }
    const lower = value.toLowerCase().trim();
    if (lower === "unknown") {
      return "Unknown";
    }
    return value.trim();
  };

  const formatSection = (title: string, content: string): string => {
    if (!content || content.trim() === "" || content.toLowerCase().trim() === "unknown") {
      return `\n${title}\n${content.trim() || "Not provided"}\n`;
    }
    return `\n${title}\n${content.trim()}\n`;
  };

  let report = "=".repeat(60);
  report += "\nEMS PATIENT CARE REPORT\n";
  report += "=".repeat(60);

  report += formatSection("PATIENT DEMOGRAPHICS", "");
  report += `Age: ${formatValue(data.patientAge)}\n`;
  report += `Gender: ${formatValue(data.patientGender)}\n`;

  report += formatSection("CHIEF COMPLAINT", data.chiefComplaint);

  report += formatSection("INCIDENT LOCATION", data.incidentLocation);

  report += formatSection("ASSESSMENT SUMMARY", data.assessmentSummary);

  if (data.interventionsPerformed && data.interventionsPerformed.trim() !== "") {
    report += formatSection("INTERVENTIONS PERFORMED", data.interventionsPerformed);
  } else {
    report += formatSection("INTERVENTIONS PERFORMED", "None documented");
  }

  report += formatSection("TRANSPORT OUTCOME", data.transportOutcome);

  report += "\n" + "=".repeat(60);
  report += "\nEnd of Report\n";
  report += "=".repeat(60);

  return report;
}

