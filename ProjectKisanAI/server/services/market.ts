export interface MarketData {
  crop: string;
  price: number;
  unit: string;
  market: string;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
}

export class MarketService {
  // Mock market data - in production, this would fetch from real APIs
  private mockMarketData: MarketData[] = [
    {
      crop: "Tomato",
      price: 2500, // in paise (₹25.00/kg)
      unit: "kg",
      market: "Bangalore Mandi",
      trend: "up",
      trendPercentage: 5,
    },
    {
      crop: "Onion",
      price: 1800, // in paise (₹18.00/kg)
      unit: "kg",
      market: "Bangalore Mandi",
      trend: "down",
      trendPercentage: -3,
    },
    {
      crop: "Rice",
      price: 3200, // in paise (₹32.00/kg)
      unit: "kg",
      market: "Bangalore Mandi",
      trend: "up",
      trendPercentage: 2,
    },
    {
      crop: "Wheat",
      price: 2800,
      unit: "kg",
      market: "Bangalore Mandi",
      trend: "stable",
      trendPercentage: 0,
    },
    {
      crop: "Maize",
      price: 2200,
      unit: "kg",
      market: "Bangalore Mandi",
      trend: "up",
      trendPercentage: 4,
    },
  ];

  async getCurrentPrices(): Promise<MarketData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockMarketData;
  }

  async getPriceForCrop(cropName: string): Promise<MarketData | null> {
    const crop = this.mockMarketData.find(
      item => item.crop.toLowerCase() === cropName.toLowerCase()
    );
    return crop || null;
  }

  async getMarketInsight(crop: string): Promise<string> {
    const cropData = await this.getPriceForCrop(crop);
    if (!cropData) {
      return "No market data available for this crop.";
    }

    const trendText = cropData.trend === "up" ? "increasing" : 
                     cropData.trend === "down" ? "decreasing" : "stable";
    
    if (cropData.trend === "up") {
      return `${crop} prices are trending ${trendText} by ${cropData.trendPercentage}% this week. Consider selling your harvest in the next 2-3 days for maximum profit.`;
    } else if (cropData.trend === "down") {
      return `${crop} prices are ${trendText} by ${Math.abs(cropData.trendPercentage)}% this week. You may want to hold off selling or consider alternative crops for next season.`;
    } else {
      return `${crop} prices are ${trendText} this week. Good time for steady sales at current market rates.`;
    }
  }
}

export const marketService = new MarketService();
