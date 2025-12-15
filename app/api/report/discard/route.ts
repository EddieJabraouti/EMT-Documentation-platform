import { NextRequest, NextResponse } from "next/server";
import { DiscardReportRequest, DiscardReportResponse } from "@/types/report";
import { deleteReport } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId } = body as DiscardReportRequest;

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 }
      );
    }

    const deleted = deleteReport(reportId);

    return NextResponse.json({
      success: deleted,
    } as DiscardReportResponse);
  } catch (error) {
    console.error("Error discarding report:", error);
    return NextResponse.json(
      { error: "Failed to discard report" },
      { status: 500 }
    );
  }
}

