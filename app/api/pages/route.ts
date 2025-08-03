import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with actual database integration
let mockDatabase: any[] = []

export async function GET() {
  try {
    // In production, fetch from your actual database
    // const pages = await db.pages.findMany()

    return NextResponse.json(mockDatabase)
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, title, content } = body

    if (!url || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new page entry
    const newPage = {
      id: Date.now().toString(),
      url,
      title,
      content,
      capturedAt: new Date().toISOString(),
      category: detectCategory(content),
    }

    // In production, save to your actual database
    // const savedPage = await db.pages.create({ data: newPage })

    mockDatabase.push(newPage)

    return NextResponse.json(newPage, { status: 201 })
  } catch (error) {
    console.error("Failed to save page:", error)
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Page ID required" }, { status: 400 })
    }

    // In production, delete from your actual database
    // await db.pages.delete({ where: { id } })

    mockDatabase = mockDatabase.filter((page) => page.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete page:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}

function detectCategory(content: string): "job" | "business" | "other" {
  const jobKeywords = ["job", "position", "role", "career", "hiring", "developer", "engineer", "salary", "benefits"]
  const businessKeywords = ["ceo", "founder", "company", "business", "revenue", "funding", "enterprise", "startup"]

  const lowerContent = content.toLowerCase()

  const jobScore = jobKeywords.reduce((score, keyword) => score + (lowerContent.includes(keyword) ? 1 : 0), 0)

  const businessScore = businessKeywords.reduce((score, keyword) => score + (lowerContent.includes(keyword) ? 1 : 0), 0)

  if (jobScore > businessScore && jobScore > 2) return "job"
  if (businessScore > jobScore && businessScore > 2) return "business"
  return "other"
}
