import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { geminiService } from "./services/gemini";
import { marketService } from "./services/market";
import { schemesService } from "./services/schemes";
import { weatherService } from "./services/weather";
import { 
  diagnoseDiseaseSchema,
  marketInsightSchema,
  marketAnalysisSchema,
  schemeRecommendationSchema,
  voiceQuerySchema,
  weatherSchema
 } from "../shared/validation";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Disease diagnosis endpoint
  app.post("/api/diagnose-disease", async (req, res) => {
    try {
      const validation = diagnoseDiseaseSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }

      const { imageData, userId } = validation.data;
      
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "");
      
      const diagnosis = await geminiService.diagnoseCropDisease(base64Data);
      
      // Save to database if userId provided
      if (userId) {
        await storage.createDiseaseScan({
          userId: userId,
          imageData: base64Data,
          diagnosis: diagnosis.disease,
          confidence: diagnosis.confidence,
          remedies: diagnosis.remedies,
        });

        // Add activity
        await storage.createActivity({
          userId: userId,
          type: "scan",
          title: "Disease scan completed",
          description: `${diagnosis.disease} detected in crop`,
          icon: "fas fa-camera",
        });
      }

      res.json(diagnosis);
    } catch (error) {
      console.error("Disease diagnosis error:", error);
      res.status(500).json({ error: "Failed to diagnose disease" });
    }
  });

  // Market prices endpoint
  app.get("/api/market-prices", async (req, res) => {
    try {
      const prices = await marketService.getCurrentPrices();
      res.json(prices);
    } catch (error) {
      console.error("Market prices error:", error);
      res.status(500).json({ error: "Failed to fetch market prices" });
    }
  });

  // Market price for specific crop
  app.get("/api/market-prices/:crop", async (req, res) => {
    try {
      const { crop } = req.params;
      const price = await marketService.getPriceForCrop(crop);
      
      if (!price) {
        return res.status(404).json({ error: "Crop not found" });
      }

      res.json(price);
    } catch (error) {
      console.error("Market price error:", error);
      res.status(500).json({ error: "Failed to fetch crop price" });
    }
  });

  // Market insight endpoint
  app.post("/api/market-insight", async (req, res) => {
    try {
      const validation = marketInsightSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }
      const { query, userId } = validation.data;
      
      const insight = await geminiService.getMarketInsight(query);
      
      // Add activity if userId provided
      if (userId) {
        await storage.createActivity({
          userId: userId,
          type: "market",
          title: "Market analysis requested",
          description: `Analysis for: ${query}`,
          icon: "fas fa-chart-line",
        });
      }

      res.json({ insight });
    } catch (error) {
      console.error("Market insight error:", error);
      res.status(500).json({ error: "Failed to get market insight" });
    }
  });

  // Market analysis endpoint
  app.post("/api/market-analysis", async (req, res) => {
    try {
      const validation = marketAnalysisSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }
      const { query, userId } = validation.data;

      const analysis = await geminiService.generateMarketAnalysis(query);

      // Add activity if userId provided
      if (userId) {
        await storage.createActivity({
          userId: userId,
          type: "market",
          title: "Market analysis generated",
          description: `In-depth analysis for: ${query}`,
          icon: "fas fa-chart-pie",
        });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Market analysis error:", error);
      res.status(500).json({ error: "Failed to generate market analysis" });
    }
  });

  // Government schemes endpoint
  app.get("/api/schemes", async (req, res) => {
    try {
      const schemes = await schemesService.getAllSchemes();
      res.json(schemes);
    } catch (error) {
      console.error("Schemes error:", error);
      res.status(500).json({ error: "Failed to fetch schemes" });
    }
  });

  // Search schemes endpoint
  app.get("/api/schemes/search", async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const schemes = await schemesService.searchSchemes(query);
      res.json(schemes);
    } catch (error) {
      console.error("Scheme search error:", error);
      res.status(500).json({ error: "Failed to search schemes" });
    }
  });

  // Scheme recommendation endpoint
  app.post("/api/schemes/recommend", async (req, res) => {
    try {
      const validation = schemeRecommendationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }
      const { query, userId } = validation.data;
      
      const recommendation = await schemesService.getSchemeRecommendation(query);
      
      // Add activity if userId provided
      if (userId) {
        await storage.createActivity({
          userId: userId,
          type: "scheme",
          title: "Scheme recommendation requested",
          description: `Query: ${query}`,
          icon: "fas fa-landmark",
        });
      }

      res.json({ recommendation });
    } catch (error) {
      console.error("Scheme recommendation error:", error);
      res.status(500).json({ error: "Failed to get scheme recommendation" });
    }
  });

  // Voice query endpoint (general AI assistant)
  app.post("/api/voice-query", async (req, res) => {
    try {
      const validation = voiceQuerySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }
      const { query, userId } = validation.data;

      const response = await geminiService.processVoiceQuery(query);
      
      // Add activity if userId provided
      if (userId) {
        await storage.createActivity({
          userId: userId,
          type: "voice",
          title: "Voice query processed",
          description: query,
          icon: "fas fa-microphone",
        });
      }

      res.json({ response });
    } catch (error) {
      console.error("Voice query error:", error);
      res.status(500).json({ error: "Failed to process voice query" });
    }
  });

  // User activities endpoint
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const activities = await storage.getActivitiesByUserId(userId);
      res.json(activities);
    } catch (error) {
      console.error("Activities error:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const validation = weatherSchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.formErrors.fieldErrors });
      }
      const { location } = validation.data;
      const weather = await weatherService.getCurrentWeather(location as string);
      res.json(weather);
    } catch (error) {
      console.error("Weather error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
