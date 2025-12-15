import { NextRequest, NextResponse } from "next/server";
import { SaveReportRequest, SaveReportResponse } from "@/types/report";
import { saveReport } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, data, generatedText } = body as SaveReportRequest;

    if (!reportId || !data || !generatedText) {
      return NextResponse.json(
        { error: "reportId, data, and generatedText are required" },
        { status: 400 }
      );
    }

    saveReport(reportId, data, generatedText);

    return NextResponse.json({
      success: true,
      reportId,
    } as SaveReportResponse);
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}

