// /app/api/jobs/route.ts
import { NextResponse } from "next/server";
import { connectToDB, Job } from "@/lib/database";

export async function GET() {
  await connectToDB();
  const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
  return NextResponse.json(jobs);
}
