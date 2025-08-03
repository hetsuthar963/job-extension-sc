import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { pages } = await request.json()

    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({ error: "Pages array is required" }, { status: 400 })
    }

    const results = []

    for (const page of pages) {
      try {
        const isJobContent =
          page.category === "job" ||
          page.content.toLowerCase().includes("job") ||
          page.content.toLowerCase().includes("developer")

        let prompt = ""

        if (isJobContent) {
          prompt = `Analyze this job posting for a job seeker:

Title: ${page.title}
Content: ${page.content.substring(0, 2000)}

Provide a JSON response with:
{
  "summary": "Brief 1-2 sentence summary",
  "priority": "high|medium|low",
  "insights": "Detailed analysis with preparation recommendations",
  "keyRequirements": ["requirement1", "requirement2"],
  "salaryRange": "salary info if available",
  "companySize": "company size if mentioned"
}`
        } else {
          prompt = `Analyze this business prospect for sales/business development:

Title: ${page.title}
Content: ${page.content.substring(0, 2000)}

Provide a JSON response with:
{
  "summary": "Brief 1-2 sentence company summary",
  "priority": "high|medium|low",
  "insights": "Strategic approach recommendations",
  "painPoints": ["pain1", "pain2"],
  "revenue": "revenue info if available",
  "contactStrategy": "recommended approach"
}`
        }

        const { text } = await generateText({
          model: openai("gpt-4o-mini"),
          prompt,
          maxTokens: 400,
          temperature: 0.3,
        })

        // Try to parse JSON, fallback to text parsing
        let analysis
        try {
          analysis = JSON.parse(text)
        } catch {
          // Fallback parsing
          analysis = {
            summary: text.split("\n")[0] || "Analysis completed",
            priority: text.toLowerCase().includes("high")
              ? "high"
              : text.toLowerCase().includes("low")
                ? "low"
                : "medium",
            insights: text,
            category: isJobContent ? "job" : "business",
          }
        }

        results.push({
          id: page.id,
          ...analysis,
        })

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Failed to analyze page ${page.id}:`, error)
        results.push({
          id: page.id,
          error: "Analysis failed",
          summary: "Could not analyze this page",
          priority: "medium",
          insights: "Manual review required",
        })
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Batch analysis failed:", error)
    return NextResponse.json(
      {
        error: "Batch analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
