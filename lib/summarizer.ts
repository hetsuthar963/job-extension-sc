// /lib/summarize.ts
export async function summarizeJobPost(html: string) {
  const prompt = `Extract the following...` // use your long prompt
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const json = await response.json();
  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("⚠️ Gemini response not parsable:", raw);
    return { summary: raw };
  }
}
