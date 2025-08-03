import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, category, url, title } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Determine the analysis type and create appropriate prompts
    const isJobContent =
      category === "job" ||
      content.toLowerCase().includes("job") ||
      content.toLowerCase().includes("developer") ||
      content.toLowerCase().includes("engineer") ||
      content.toLowerCase().includes("position")

    let prompt = "";

    if (isJobContent) {
      prompt = `You are an expert career advisor and job market analyst. Your task is to analyze job postings and provide actionable insights for job seekers. Focus on:

1. Key requirements and qualifications
2. Salary and compensation analysis
3. Company culture indicators
4. Growth opportunities
5. Priority level (high/medium/low) based on market value
6. Specific preparation recommendations

Be concise but thorough. Provide practical advice that helps job seekers make informed decisions.

Analyze this job posting and provide insights:

Title: ${title}
URL: ${url}
Content: ${content}

Please provide:
1. A brief summary (1-2 sentences)
2. Priority level (HIGH/MEDIUM/LOW) with reasoning
3. Key preparation areas
4. Salary/benefits assessment if mentioned
5. Any red flags or standout positives

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "priority": "HIGH | MEDIUM | LOW",
  "insights": "..."
}`
    } else {
      prompt = `You are an expert business development consultant and prospect analyst. Your task is to analyze company profiles, executive profiles, and business information to provide actionable insights for sales and business development. Focus on:

1. Company size, revenue, and growth indicators
2. Decision maker identification
3. Pain points and business challenges
4. Opportunity assessment
5. Recommended approach and timing
6. Priority level for outreach

Be strategic and practical. Provide insights that help with effective business development and sales approaches.

Analyze this business prospect and provide insights:

Title: ${title}
URL: ${url}
Content: ${content}

Please provide:
1. A brief company/prospect summary (1-2 sentences)
2. Prospect priority (HIGH/MEDIUM/LOW) with reasoning
3. Identified pain points or opportunities
4. Recommended approach strategy
5. Best timing and method for outreach

Return ONLY valid JSON in this format:
{
  "summary": "...",
  "priority": "HIGH | MEDIUM | LOW",
  "insights": "..."
}`
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    try {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const normalized = cleaned.replace(/\n/g, '\n');
      const parsed = JSON.parse(normalized);

      return NextResponse.json({
        ...parsed,
        category: isJobContent ? "job" : "business"
      });
    } catch (err) {
      console.warn('⚠️ Could not parse structured JSON. Returning raw text.');
      return NextResponse.json({
        summary: rawText,
        raw: true,
        category: isJobContent ? "job" : "business"
      });
    }
  } catch (error) {
    console.error("AI analysis failed:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
