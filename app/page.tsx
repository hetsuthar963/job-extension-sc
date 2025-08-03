"use client"

import { useEffect, useState } from "react"
import { Clock, Briefcase, ExternalLink, Building2, Brain, Loader2, RefreshCw, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface CapturedPage {
  id: string
  url: string
  title: string
  content: string
  capturedAt: string
  category?: "job" | "business" | "other"
  summary?: string
  insights?: string
  priority?: "high" | "medium" | "low"
}

type Job = {
  _id: string
  title: string
  company: string
  location: string
  experience: string
  skills: string[]
  summary: string
  url: string
  scrapedAt: string
}

export default function WebScraperDashboard() {
  const [pages, setPages] = useState<CapturedPage[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  // Mock data for demonstration - replace with your actual API call
  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockPages: CapturedPage[] = [
        {
          id: "1",
          url: "https://linkedin.com/jobs/view/123456",
          title: "Senior Frontend Developer at TechCorp",
          content:
            "We are looking for a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies. The ideal candidate will have experience with Next.js, state management libraries like Redux or Zustand, and testing frameworks. You will be responsible for building scalable web applications, collaborating with design teams, and mentoring junior developers. Requirements: Bachelor's degree in Computer Science, 5+ years React experience, TypeScript proficiency, experience with REST APIs and GraphQL, knowledge of modern CSS frameworks, experience with version control (Git), strong problem-solving skills. Nice to have: Experience with Node.js, AWS or cloud platforms, CI/CD pipelines, mobile development experience. We offer competitive salary ($120k-150k), health insurance, 401k matching, flexible work arrangements, and professional development opportunities.",
          capturedAt: "2024-01-15T10:30:00Z",
          category: "job",
          summary:
            "Senior Frontend Developer role requiring 5+ years React/TypeScript experience. Salary range $120k-150k with excellent benefits.",
          insights:
            "HIGH PRIORITY: This role matches your React/TypeScript expertise perfectly. Key preparation areas: Review Next.js advanced patterns, prepare examples of scalable applications you've built, and brush up on testing frameworks. The salary range is competitive for senior level.",
          priority: "high",
        },
        {
          id: "2",
          url: "https://linkedin.com/in/john-doe-ceo",
          title: "John Doe - CEO at InnovateTech Solutions",
          content:
            "CEO and Founder of InnovateTech Solutions, a B2B SaaS company specializing in workflow automation for mid-market companies. Previously VP of Engineering at DataCorp for 8 years. Led the company from startup to $50M ARR. Currently expanding into European markets. Company has 150+ employees and recently raised Series B funding of $25M. Focus areas include AI-powered automation, enterprise integrations, and customer success. Active in tech community, frequent speaker at SaaS conferences. Education: MIT Computer Science, Stanford MBA. Interests: sustainable technology, mentoring startups, sailing.",
          capturedAt: "2024-01-15T09:15:00Z",
          category: "business",
          summary:
            "CEO of $50M ARR B2B SaaS company, InnovateTech Solutions. Recently raised $25M Series B, expanding to Europe.",
          insights:
            "EXCELLENT PROSPECT: Strong growth trajectory ($50M ARR), recent funding indicates expansion mode. Pitch angle: Focus on European market expansion challenges and how your solution can accelerate their international growth. Mention your experience with similar mid-market SaaS companies. Best approach: LinkedIn connection with personalized message about European expansion.",
          priority: "high",
        },
        {
          id: "3",
          url: "https://jobs.google.com/view/456789",
          title: "Full Stack Developer - Remote",
          content:
            "Remote Full Stack Developer position at StartupXYZ. We're building the next generation of e-commerce tools. Looking for someone with 3+ years experience in JavaScript, Node.js, React, and database technologies. You'll work on both frontend and backend systems, integrate with third-party APIs, and help scale our platform. Requirements: 3+ years full-stack development, JavaScript/Node.js proficiency, React experience, SQL database knowledge, API development experience, Git version control. Bonus: Experience with AWS, Docker, e-commerce platforms, payment processing. Salary: $80k-110k based on experience. Benefits include health insurance, unlimited PTO, home office stipend, and equity options.",
          capturedAt: "2024-01-15T08:45:00Z",
          category: "job",
          summary:
            "Remote Full Stack Developer role at StartupXYZ. 3+ years experience required, $80k-110k salary range.",
          insights:
            "MEDIUM PRIORITY: Good remote opportunity but salary range is below senior level. Consider if you're interested in startup equity and e-commerce domain. Preparation: Review e-commerce architecture patterns, payment processing integration, and scaling challenges.",
          priority: "medium",
        },
        {
          id: "4",
          url: "https://company.com/about",
          title: "GrowthTech Inc - Company Profile",
          content:
            "GrowthTech Inc is a fast-growing marketing technology company serving enterprise clients. Founded in 2019, now 200+ employees with offices in SF, NYC, and Austin. Specializes in customer acquisition and retention platforms. Recent achievements: 300% revenue growth in 2023, partnerships with major brands like Nike and Spotify. Leadership team has experience from Google, Facebook, and Salesforce. Currently seeking to expand their data analytics capabilities and looking for technology partners. Pain points mentioned in recent interviews: data integration challenges, need for real-time analytics, scaling customer onboarding processes.",
          capturedAt: "2024-01-15T07:20:00Z",
          category: "business",
          summary:
            "Fast-growing martech company (200+ employees) with 300% revenue growth. Partnerships with Nike, Spotify.",
          insights:
            "STRONG PROSPECT: Rapid growth indicates budget availability. Key pain points: data integration, real-time analytics, customer onboarding. Pitch strategy: Lead with case studies showing how you've solved similar data integration challenges for martech companies. Emphasize ROI and scalability. Decision makers likely have big tech backgrounds - use technical depth in presentations.",
          priority: "high",
        },
      ]

      setPages(mockPages)
      setLoading(false)
    }

    const fetchJobs = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockJobs: Job[] = [
          {
            _id: "1",
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            experience: "Senior",
            skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
            summary:
              "Join our dynamic team to build cutting-edge web applications using modern technologies. We offer competitive salary, flexible work arrangements, and excellent benefits.",
            url: "https://example.com/job/1",
            scrapedAt: "2024-01-15T10:30:00Z",
          },
          {
            _id: "2",
            title: "Full Stack Engineer",
            company: "StartupXYZ",
            location: "Remote",
            experience: "Mid-level",
            skills: ["Node.js", "React", "PostgreSQL", "AWS"],
            summary:
              "Looking for a passionate full-stack developer to help scale our platform. Great opportunity to work with cutting-edge technologies in a fast-paced environment.",
            url: "https://example.com/job/2",
            scrapedAt: "2024-01-15T09:15:00Z",
          },
          {
            _id: "3",
            title: "Junior Software Developer",
            company: "Innovation Labs",
            location: "New York, NY",
            experience: "Junior",
            skills: ["JavaScript", "Python", "Git", "SQL"],
            summary:
              "Perfect entry-level position for recent graduates. We provide mentorship, training, and a supportive environment to grow your career in software development.",
            url: "https://example.com/job/3",
            scrapedAt: "2024-01-15T08:45:00Z",
          },
          {
            _id: "4",
            title: "DevOps Engineer",
            company: "CloudTech Solutions",
            location: "Austin, TX",
            experience: "Senior",
            skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
            summary:
              "Lead our infrastructure automation efforts and help scale our cloud-native applications. Work with modern DevOps tools and practices.",
            url: "https://example.com/job/4",
            scrapedAt: "2024-01-15T07:20:00Z",
          },
          {
            _id: "5",
            title: "Product Manager",
            company: "Digital Dynamics",
            location: "Seattle, WA",
            experience: "Mid-level",
            skills: ["Product Strategy", "Agile", "Analytics", "User Research"],
            summary:
              "Drive product vision and strategy for our flagship products. Collaborate with engineering, design, and business teams to deliver exceptional user experiences.",
            url: "https://example.com/job/5",
            scrapedAt: "2024-01-15T06:10:00Z",
          },
          {
            _id: "6",
            title: "UX/UI Designer",
            company: "Creative Studio",
            location: "Los Angeles, CA",
            experience: "Mid-level",
            skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
            summary:
              "Create beautiful and intuitive user experiences for web and mobile applications. Work closely with product and engineering teams.",
            url: "https://example.com/job/6",
            scrapedAt: "2024-01-15T05:30:00Z",
          },
        ]

        setJobs(mockJobs)
        setFilteredJobs(mockJobs)
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
        toast({
          title: "Error",
          description: "Failed to fetch jobs. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
    fetchJobs()
  }, [])

  const analyzeWithAI = async (pageId: string) => {
    setAnalyzing(pageId)

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const page = pages.find((p) => p.id === pageId)
      if (!page) return

      // Mock AI analysis based on content type
      let summary = ""
      let insights = ""
      let priority: "high" | "medium" | "low" = "medium"

      if (
        page.category === "job" ||
        page.content.toLowerCase().includes("developer") ||
        page.content.toLowerCase().includes("engineer")
      ) {
        // Job analysis logic
        const salaryMatch = page.content.match(/\$(\d+)k?[-–](\d+)k?/i)
        const experienceMatch = page.content.match(/(\d+)\+?\s*years?/i)
        const techStack = extractTechStack(page.content)

        summary = `${page.title.split(" at ")[0] || "Job opportunity"} requiring ${experienceMatch?.[1] || "N/A"} years experience. ${salaryMatch ? `Salary: $${salaryMatch[1]}k-${salaryMatch[2]}k` : "Salary not specified"}.`

        const priorityScore = calculateJobPriority(page.content, techStack, salaryMatch)
        priority = priorityScore > 7 ? "high" : priorityScore > 4 ? "medium" : "low"

        insights = generateJobInsights(page.content, techStack, priority, salaryMatch)
      } else {
        // Business prospect analysis
        const companySize = extractCompanySize(page.content)
        const revenue = extractRevenue(page.content)
        const painPoints = extractPainPoints(page.content)

        summary = `${extractCompanyName(page.content)} - ${companySize}. ${revenue ? `Revenue: ${revenue}` : "Growth-stage company"}.`

        const prospectScore = calculateProspectPriority(page.content, revenue, companySize)
        priority = prospectScore > 7 ? "high" : prospectScore > 4 ? "medium" : "low"

        insights = generateBusinessInsights(page.content, painPoints, priority, revenue)
      }

      // Update the page with AI analysis
      setPages((prev) =>
        prev.map((p) =>
          p.id === pageId
            ? {
                ...p,
                summary,
                insights,
                priority,
                category: page.category || (page.content.toLowerCase().includes("job") ? "job" : "business"),
              }
            : p,
        ),
      )

      toast({
        title: "Analysis Complete",
        description: "AI has analyzed the content and generated insights.",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(null)
    }
  }

  const deletePage = async (pageId: string) => {
    setPages((prev) => prev.filter((p) => p.id !== pageId))
    toast({
      title: "Page Deleted",
      description: "Captured page has been removed.",
    })
  }

  const refreshData = async () => {
    setLoading(true)
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    toast({
      title: "Data Refreshed",
      description: "Latest captured pages have been loaded.",
    })
  }

  // Helper functions for AI analysis
  const extractTechStack = (content: string): string[] => {
    const techKeywords = [
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Python",
      "Java",
      "AWS",
      "Docker",
      "Kubernetes",
      "GraphQL",
      "REST",
      "SQL",
      "MongoDB",
      "Redis",
      "Next.js",
      "Vue",
      "Angular",
    ]
    return techKeywords.filter((tech) => content.toLowerCase().includes(tech.toLowerCase()))
  }

  const calculateJobPriority = (content: string, techStack: string[], salaryMatch: RegExpMatchArray | null): number => {
    let score = 5 // base score

    // Salary bonus
    if (salaryMatch) {
      const minSalary = Number.parseInt(salaryMatch[1])
      if (minSalary > 120) score += 3
      else if (minSalary > 100) score += 2
      else if (minSalary > 80) score += 1
    }

    // Tech stack match bonus
    score += Math.min(techStack.length * 0.5, 3)

    // Remote work bonus
    if (content.toLowerCase().includes("remote")) score += 1

    // Senior level bonus
    if (content.toLowerCase().includes("senior")) score += 1

    return Math.min(score, 10)
  }

  const generateJobInsights = (
    content: string,
    techStack: string[],
    priority: string,
    salaryMatch: RegExpMatchArray | null,
  ): string => {
    const priorityText = priority.toUpperCase() + " PRIORITY:"
    let insights = priorityText

    if (priority === "high") {
      insights += " This role aligns well with your expertise. "
    } else if (priority === "medium") {
      insights += " Decent opportunity worth considering. "
    } else {
      insights += " Lower priority but could be good for experience. "
    }

    if (techStack.length > 0) {
      insights += `Key technologies: ${techStack.join(", ")}. `
    }

    if (salaryMatch) {
      const minSalary = Number.parseInt(salaryMatch[1])
      if (minSalary > 120) {
        insights += "Excellent salary range for senior level. "
      } else if (minSalary < 80) {
        insights += "Salary may be below market rate. "
      }
    }

    // Add preparation suggestions
    insights +=
      "Preparation: Review relevant technologies, prepare portfolio examples, and research the company culture."

    return insights
  }

  const extractCompanySize = (content: string): string => {
    const sizeMatch = content.match(/(\d+)\+?\s*(employees?|people)/i)
    if (sizeMatch) {
      const size = Number.parseInt(sizeMatch[1])
      if (size > 1000) return "Large enterprise"
      if (size > 100) return "Mid-market company"
      return "Small company"
    }
    return "Company size unknown"
  }

  const extractRevenue = (content: string): string | null => {
    const revenueMatch = content.match(/\$(\d+)M?\s*(ARR|revenue|annual)/i)
    return revenueMatch ? `$${revenueMatch[1]}M ${revenueMatch[2]}` : null
  }

  const extractCompanyName = (content: string): string => {
    // Try to extract company name from title or content
    const titleMatch = content.match(/^([^-]+)/)?.[1]?.trim()
    return titleMatch || "Company"
  }

  const extractPainPoints = (content: string): string[] => {
    const painKeywords = ["challenge", "problem", "difficulty", "struggle", "need", "looking for", "seeking"]
    const sentences = content.split(/[.!?]+/)
    return sentences
      .filter((sentence) => painKeywords.some((keyword) => sentence.toLowerCase().includes(keyword)))
      .slice(0, 3)
  }

  const calculateProspectPriority = (content: string, revenue: string | null, companySize: string): number => {
    let score = 5

    if (revenue) {
      const revenueNum = Number.parseInt(revenue.match(/\d+/)?.[0] || "0")
      if (revenueNum > 50) score += 3
      else if (revenueNum > 10) score += 2
      else if (revenueNum > 1) score += 1
    }

    if (companySize.includes("Large")) score += 2
    else if (companySize.includes("Mid-market")) score += 1

    if (content.toLowerCase().includes("funding") || content.toLowerCase().includes("raised")) score += 2
    if (content.toLowerCase().includes("expansion") || content.toLowerCase().includes("growing")) score += 1

    return Math.min(score, 10)
  }

  const generateBusinessInsights = (
    content: string,
    painPoints: string[],
    priority: string,
    revenue: string | null,
  ): string => {
    const priorityText = priority.toUpperCase() + " PROSPECT:"
    let insights = priorityText

    if (priority === "high") {
      insights += " Excellent potential client with strong indicators. "
    } else if (priority === "medium") {
      insights += " Good prospect worth pursuing. "
    } else {
      insights += " Lower priority but may have future potential. "
    }

    if (revenue) {
      insights += `Strong revenue base (${revenue}) indicates budget availability. `
    }

    if (painPoints.length > 0) {
      insights += `Identified pain points suggest immediate need. `
    }

    insights += "Approach: Personalized outreach focusing on specific business challenges and ROI-driven solutions."

    return insights
  }

  const jobPages = pages.filter((p) => p.category === "job")
  const businessPages = pages.filter((p) => p.category === "business")
  const otherPages = pages.filter((p) => !p.category || p.category === "other")

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case "junior":
        return "bg-green-100 text-green-800 border-green-200"
      case "mid-level":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "senior":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleBookmark = (jobId: string) => {
    const newBookmarks = new Set(bookmarkedJobs)
    if (newBookmarks.has(jobId)) {
      newBookmarks.delete(jobId)
      toast({
        title: "Bookmark removed",
        description: "Job removed from your bookmarks.",
      })
    } else {
      newBookmarks.add(jobId)
      toast({
        title: "Job bookmarked",
        description: "Job added to your bookmarks.",
      })
    }
    setBookmarkedJobs(newBookmarks)
  }

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (experienceFilter) {
      filtered = filtered.filter((job) => job.experience.toLowerCase() === experienceFilter.toLowerCase())
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, locationFilter, experienceFilter])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading captured pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">AI Web Analyzer</h1>
              </div>
              <p className="text-gray-600">
                Capture web content and get AI-powered insights for jobs and business prospects
              </p>
            </div>
            <Button onClick={refreshData} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{jobPages.length}</p>
                  <p className="text-gray-600">Job Opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{businessPages.length}</p>
                  <p className="text-gray-600">Business Prospects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pages.filter((p) => p.insights).length}</p>
                  <p className="text-gray-600">AI Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs ({jobPages.length})
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Business ({businessPages.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              All ({pages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {jobPages.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job pages captured yet</h3>
                <p className="text-gray-500">Use the Chrome extension to capture job listings</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobPages.map((page) => (
                  <Card key={page.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {page.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(page.capturedAt)}</span>
                          </div>
                          {page.priority && (
                            <Badge className={getPriorityColor(page.priority)}>
                              {page.priority.toUpperCase()} PRIORITY
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(page.url, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deletePage(page.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {page.summary && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">AI Summary</p>
                          <p className="text-sm text-blue-800">{page.summary}</p>
                        </div>
                      )}

                      {page.insights && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-900 mb-1">AI Insights</p>
                          <p className="text-sm text-green-800">{page.insights}</p>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{page.content}</p>

                      {!page.insights ? (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          className="w-full"
                        >
                          {analyzing === page.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          variant="outline"
                          className="w-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {businessPages.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No business pages captured yet</h3>
                <p className="text-gray-500">Use the Chrome extension to capture company profiles and prospects</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {businessPages.map((page) => (
                  <Card key={page.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {page.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(page.capturedAt)}</span>
                          </div>
                          {page.priority && (
                            <Badge className={getPriorityColor(page.priority)}>
                              {page.priority.toUpperCase()} PROSPECT
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(page.url, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deletePage(page.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {page.summary && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm font-medium text-purple-900 mb-1">AI Summary</p>
                          <p className="text-sm text-purple-800">{page.summary}</p>
                        </div>
                      )}

                      {page.insights && (
                        <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm font-medium text-orange-900 mb-1">Business Insights</p>
                          <p className="text-sm text-orange-800">{page.insights}</p>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{page.content}</p>

                      {!page.insights ? (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          className="w-full"
                        >
                          {analyzing === page.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze Prospect
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          variant="outline"
                          className="w-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {pages.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pages captured yet</h3>
                <p className="text-gray-500">Install the Chrome extension and start capturing web content</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pages.map((page) => (
                  <Card key={page.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {page.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(page.capturedAt)}</span>
                            {page.category && (
                              <Badge variant="outline" className="ml-2">
                                {page.category}
                              </Badge>
                            )}
                          </div>
                          {page.priority && (
                            <Badge className={getPriorityColor(page.priority)}>{page.priority.toUpperCase()}</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.open(page.url, "_blank")}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deletePage(page.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {page.summary && (
                        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm font-medium text-slate-900 mb-1">AI Summary</p>
                          <p className="text-sm text-slate-800">{page.summary}</p>
                        </div>
                      )}

                      {page.insights && (
                        <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                          <p className="text-sm font-medium text-indigo-900 mb-1">AI Insights</p>
                          <p className="text-sm text-indigo-800">{page.insights}</p>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{page.content}</p>

                      {!page.insights ? (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          className="w-full"
                        >
                          {analyzing === page.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => analyzeWithAI(page.id)}
                          disabled={analyzing === page.id}
                          variant="outline"
                          className="w-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-analyze
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
