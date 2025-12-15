import { NextRequest, NextResponse } from "next/server";
import { ReportData } from "@/types/report";
import { generateReportText } from "@/lib/reportGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body as { data: ReportData };

    if (!data) {
      return NextResponse.json(
        { error: "Report data is required" },
        { status: 400 }
      );
    }

    const { text: generatedText, qaStatus } = generateReportText(data);

    const qaStatusMessage = qaStatus === "complete" 
      ? "Complete – Ready for Submission"
      : "Needs Review";

    return NextResponse.json({ 
      generatedText,
      qaStatus,
      qaStatusMessage
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

