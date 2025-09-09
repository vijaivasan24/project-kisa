import { z } from "zod";

export const diagnoseDiseaseSchema = z.object({
  imageData: z.string(),
  userId: z.string().optional(),
});

export const marketInsightSchema = z.object({
  query: z.string(),
  userId: z.string().optional(),
});

export const marketAnalysisSchema = z.object({
  query: z.string(),
  userId: z.string().optional(),
});

export const schemeRecommendationSchema = z.object({
  query: z.string(),
  userId: z.string().optional(),
});

export const voiceQuerySchema = z.object({
  query: z.string(),
  userId: z.string().optional(),
});

export const weatherSchema = z.object({
  location: z.string(),
});
