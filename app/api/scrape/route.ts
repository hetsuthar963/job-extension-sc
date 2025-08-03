// /app/api/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { summarizeJobPost } from "@/lib/summarizer";
import { connectToDB, Job } from "@/lib/database";

export async function POST(req: NextRequest) {
  const { html, url } = await req.json();
  if (!html) return NextResponse.json({ error: "Missing HTML" }, { status: 400 });

  await connectToDB();

  const summary = await summarizeJobPost(html);
  console.log("🧠 Parsed Summary:", summary);

  if (!summary.title || !summary.summary) {
    return NextResponse.json({ message: "⚠️ Summary incomplete. Skipping save." });
  }

  const saved = await Job.create({ ...summary, url });
  return NextResponse.json({ message: "✅ Saved", job: saved });
}
