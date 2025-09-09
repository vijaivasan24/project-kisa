import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPT_DIAGNOSE_DISEASE, PROMPT_MARKET_INSIGHT, PROMPT_VOICE_QUERY, PROMPT_MARKET_ANALYSIS } from "./prompts";

const API_KEY = process.env.GEMINI_API_KEY as string;
const MODEL = "gemini-1.5-flash";

// Utility function to extract JSON from markdown-formatted responses
function extractJsonFromText(text: string): any {
  // Remove markdown code blocks if present
  const cleanText = text.replace(/```json\s*|```\s*/g, '').trim();
  
  try {
    return JSON.parse(cleanText);
  } catch (error) {
    // If direct parsing fails, try to find JSON within the text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw error;
  }
}

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async diagnoseCropDisease(base64ImageData: string) {
    const model = this.genAI.getGenerativeModel({ model: MODEL });
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: "image/jpeg",
      },
    };

    try {
      const result = await model.generateContent([PROMPT_DIAGNOSE_DISEASE, imagePart]);
      const response = result.response;
      const text = response.text();
      return extractJsonFromText(text);
    } catch (error) {
      console.error("Error diagnosing crop disease:", error);
      throw new Error("Failed to diagnose crop disease");
    }
  }

  async getMarketInsight(query: string) {
    const model = this.genAI.getGenerativeModel({ model: MODEL });

    try {
      const result = await model.generateContent([PROMPT_MARKET_INSIGHT, query]);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error getting market insight:", error);
      throw new Error("Failed to get market insight");
    }
  }

  async generateMarketAnalysis(query: string) {
    const model = this.genAI.getGenerativeModel({ model: MODEL });

    try {
      const result = await model.generateContent([PROMPT_MARKET_ANALYSIS, query]);
      const response = result.response;
      const text = response.text();
      return extractJsonFromText(text);
    } catch (error) {
      console.error("Error generating market analysis:", error);
      throw new Error("Failed to generate market analysis");
    }
  }
  
  async processVoiceQuery(query: string) {
    const model = this.genAI.getGenerativeModel({ model: MODEL });

    try {
      const result = await model.generateContent([PROMPT_VOICE_QUERY, query]);
      const response = result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Error processing voice query:", error);
      throw new Error("Failed to process voice query");
    }
  }
}

export const geminiService = new GeminiService(API_KEY);
