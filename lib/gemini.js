import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

export function getGemini() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      throw new Error("GEMINI_API_KEY is not set. Please add it to .env.local");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function classifyGrievance(imageBase64, description = "") {
  const model = getGemini().getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are an AI civic grievance classifier for the NagarSeva platform in Bangalore, India.

Analyze the provided image${description ? " and description" : ""} of a civic issue and classify it.

${description ? `User description: "${description}"` : ""}

Return a JSON object with these fields:
{
  "category": one of ["street_light", "pothole", "garbage", "water_leak", "illegal_parking", "broken_pavement", "drainage", "safety_hazard", "other"],
  "severity": one of ["low", "medium", "high", "critical"],
  "title": a concise title for this grievance report (max 80 chars),
  "summary": a brief AI-generated summary of the issue (2-3 sentences),
  "department": the responsible department - one of ["Electricity Board", "Public Works Department", "Municipal Sanitation", "Traffic Police", "Water Board", "Drainage Department"],
  "confidence": your confidence score from 0.0 to 1.0,
  "is_valid": true if this appears to be a genuine civic issue, false if spam/irrelevant,
  "validation_reason": brief reason for validity assessment
}

Return ONLY valid JSON, no markdown.`;

  const parts = [];

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    });
  }

  parts.push({ text: prompt });

  const result = await model.generateContent(parts);
  const text = result.response.text().trim();

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse AI classification response");
  }

  return JSON.parse(jsonMatch[0]);
}

export async function classifyFromText(description) {
  return classifyGrievance(null, description);
}

export async function findDuplicates(newReport, existingReports) {
  const model = getGemini().getGenerativeModel({ model: "gemini-2.0-flash" });

  const nearby = existingReports.filter((r) => {
    const dist = getDistance(newReport.lat, newReport.lng, r.lat, r.lng);
    return dist < 500; // within 500m
  });

  if (nearby.length === 0) return { isDuplicate: false, cluster: [] };

  const prompt = `You are analyzing civic grievance reports to detect duplicates.

New report: "${newReport.title}" - Category: ${newReport.category}
Location: ${newReport.lat}, ${newReport.lng}

Existing nearby reports:
${nearby.map((r, i) => `${i + 1}. "${r.title}" - Category: ${r.category} (ID: ${r.id})`).join("\n")}

Which existing reports (if any) describe the SAME issue as the new report?
Return JSON: { "isDuplicate": boolean, "matchingIds": [array of matching report IDs], "cluster_id": "string or null" }
Return ONLY valid JSON.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { isDuplicate: false, cluster: [] };

  return JSON.parse(jsonMatch[0]);
}

// Haversine distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
