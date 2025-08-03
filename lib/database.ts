// // Database utility functions
// // Replace with your actual database implementation (Prisma, Supabase, etc.)

// export interface CapturedPage {
//   id: string
//   url: string
//   title: string
//   content: string
//   capturedAt: string
//   category?: "job" | "business" | "other"
//   summary?: string
//   insights?: string
//   priority?: "high" | "medium" | "low"
//   metadata?: {
//     description?: string
//     keywords?: string
//     author?: string
//     publishedTime?: string
//   }
// }

// // Mock database for development
// const mockDatabase: CapturedPage[] = []

// export class Database {
//   static async getAllPages(): Promise<CapturedPage[]> {
//     // In production, replace with actual database query
//     // return await prisma.capturedPage.findMany()
//     return mockDatabase
//   }

//   static async getPageById(id: string): Promise<CapturedPage | null> {
//     // In production: return await prisma.capturedPage.findUnique({ where: { id } })
//     return mockDatabase.find((page) => page.id === id) || null
//   }

//   static async createPage(data: Omit<CapturedPage, "id" | "capturedAt">): Promise<CapturedPage> {
//     const newPage: CapturedPage = {
//       ...data,
//       id: Date.now().toString(),
//       capturedAt: new Date().toISOString(),
//     }

//     // In production: return await prisma.capturedPage.create({ data: newPage })
//     mockDatabase.push(newPage)
//     return newPage
//   }

//   static async updatePage(id: string, data: Partial<CapturedPage>): Promise<CapturedPage | null> {
//     // In production: return await prisma.capturedPage.update({ where: { id }, data })
//     const index = mockDatabase.findIndex((page) => page.id === id)
//     if (index === -1) return null

//     mockDatabase[index] = { ...mockDatabase[index], ...data }
//     return mockDatabase[index]
//   }

//   static async deletePage(id: string): Promise<boolean> {
//     // In production: await prisma.capturedPage.delete({ where: { id } })
//     const index = mockDatabase.findIndex((page) => page.id === id)
//     if (index === -1) return false

//     mockDatabase.splice(index, 1)
//     return true
//   }

//   static async getPagesByCategory(category: "job" | "business" | "other"): Promise<CapturedPage[]> {
//     // In production: return await prisma.capturedPage.findMany({ where: { category } })
//     return mockDatabase.filter((page) => page.category === category)
//   }

//   static async searchPages(query: string): Promise<CapturedPage[]> {
//     // In production: implement full-text search
//     const lowerQuery = query.toLowerCase()
//     return mockDatabase.filter(
//       (page) =>
//         page.title.toLowerCase().includes(lowerQuery) ||
//         page.content.toLowerCase().includes(lowerQuery) ||
//         page.url.toLowerCase().includes(lowerQuery),
//     )
//   }
// }






// /lib/database.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI!;
if (!MONGO_URI) throw new Error('Missing MONGO_URI');

export const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGO_URI, {
    dbName: 'job_scraper',
  });
};

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    experience: String,
    skills: [String],
    summary: String,
    url: String,
  },
  { timestamps: true }
);

export const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
