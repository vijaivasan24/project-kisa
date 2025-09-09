export interface SchemeData {
  id: number;
  name: string;
  description: string;
  amount: string;
  eligibility: string[];
  applicationLink: string;
  category: string;
  status: "eligible" | "under_review" | "not_eligible";
}

export class SchemesService {
  private schemes: SchemeData[] = [
    {
      id: 1,
      name: "PM-KISAN Scheme",
      description: "Direct income support of ₹6,000 per year to eligible farmer families",
      amount: "₹6,000/year",
      eligibility: [
        "Small and marginal farmers",
        "Landholding up to 2 hectares",
        "Valid Aadhaar card",
      ],
      applicationLink: "https://pmkisan.gov.in/",
      category: "income_support",
      status: "eligible",
    },
    {
      id: 2,
      name: "Drip Irrigation Subsidy",
      description: "Up to 50% subsidy on drip irrigation systems",
      amount: "50% subsidy",
      eligibility: [
        "Farmers with irrigation facilities",
        "Minimum 0.5 hectare land",
        "No previous subsidy claimed",
      ],
      applicationLink: "https://pmksy.gov.in/",
      category: "subsidy",
      status: "under_review",
    },
    {
      id: 3,
      name: "Crop Insurance Scheme",
      description: "Comprehensive risk solution for crop loss coverage",
      amount: "Up to ₹2 lakh coverage",
      eligibility: [
        "All farmers (loanee and non-loanee)",
        "Coverage for pre-sowing to post-harvest",
        "Premium varies by crop",
      ],
      applicationLink: "https://pmfby.gov.in/",
      category: "insurance",
      status: "eligible",
    },
    {
      id: 4,
      name: "Soil Health Card Scheme",
      description: "Free soil testing and nutrient recommendations",
      amount: "Free service",
      eligibility: [
        "All farmers",
        "Valid land documents",
      ],
      applicationLink: "https://soilhealth.dac.gov.in/",
      category: "advisory",
      status: "eligible",
    },
  ];

  async getAllSchemes(): Promise<SchemeData[]> {
    return this.schemes;
  }

  async getSchemeById(id: number): Promise<SchemeData | null> {
    return this.schemes.find(scheme => scheme.id === id) || null;
  }

  async searchSchemes(query: string): Promise<SchemeData[]> {
    const lowerQuery = query.toLowerCase();
    return this.schemes.filter(scheme => 
      scheme.name.toLowerCase().includes(lowerQuery) ||
      scheme.description.toLowerCase().includes(lowerQuery) ||
      scheme.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getSchemesByCategory(category: string): Promise<SchemeData[]> {
    return this.schemes.filter(scheme => scheme.category === category);
  }

  async getSchemeRecommendation(userQuery: string): Promise<string> {
    const query = userQuery.toLowerCase();
    
    if (query.includes("income") || query.includes("money") || query.includes("support")) {
      return "Based on your query, I recommend the PM-KISAN Scheme which provides ₹6,000 per year direct income support to eligible farmers.";
    }
    
    if (query.includes("irrigation") || query.includes("water") || query.includes("drip")) {
      return "For irrigation needs, the Drip Irrigation Subsidy scheme offers up to 50% subsidy on drip irrigation systems.";
    }
    
    if (query.includes("insurance") || query.includes("crop loss") || query.includes("protection")) {
      return "The Crop Insurance Scheme provides comprehensive coverage for crop losses with coverage up to ₹2 lakh.";
    }
    
    if (query.includes("soil") || query.includes("fertilizer") || query.includes("nutrients")) {
      return "The Soil Health Card Scheme provides free soil testing and nutrient recommendations to optimize your crop yield.";
    }
    
    return "I found several relevant schemes. The PM-KISAN scheme provides direct income support, while other schemes offer subsidies for irrigation, crop insurance, and soil health services.";
  }
}

export const schemesService = new SchemesService();
