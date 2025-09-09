export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  advice: string;
  forecast?: DayForecast[];
}

export interface DayForecast {
  date: string;
  temperature: number;
  condition: string;
  rainfall: number;
  humidity: number;
}

export class WeatherService {
  private apiKey: string | undefined;
  private baseUrl = "https://api.openweathermap.org/data/2.5";

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
  }

  async getCurrentWeather(location: string = "Bangalore, Karnataka, IN"): Promise<WeatherData> {
    try {
      // If no API key, use intelligent mock data based on location and season
      if (!this.apiKey) {
        return this.getIntelligentMockWeather(location);
      }

      const currentUrl = `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`;
      const forecastUrl = `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`;

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error('Weather API request failed');
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      return this.formatWeatherData(currentData, forecastData);
    } catch (error) {
      console.error("Weather API error:", error);
      // Fallback to intelligent mock data
      return this.getIntelligentMockWeather(location);
    }
  }

  private formatWeatherData(current: any, forecast: any): WeatherData {
    const temperature = Math.round(current.main.temp);
    const humidity = current.main.humidity;
    const condition = current.weather[0].main;
    
    // Calculate rainfall from forecast data
    const rainfall = forecast.list
      .slice(0, 8) // Next 24 hours (3-hour intervals)
      .reduce((total: number, item: any) => {
        return total + (item.rain?.['3h'] || 0);
      }, 0);

    return {
      location: current.name + ", " + current.sys.country,
      temperature,
      humidity,
      rainfall: Math.round(rainfall * 10) / 10,
      condition: this.mapCondition(condition),
      advice: this.generateFarmingAdvice(temperature, humidity, rainfall, condition),
      forecast: this.formatForecast(forecast.list)
    };
  }

  private formatForecast(forecastList: any[]): DayForecast[] {
    const dailyData = new Map<string, any>();
    
    // Group by date and calculate daily averages
    forecastList.slice(0, 35).forEach(item => { // 5 days of data
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          temps: [],
          conditions: [],
          rainfall: 0,
          humidity: []
        });
      }
      
      const dayData = dailyData.get(date);
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].main);
      dayData.rainfall += (item.rain?.['3h'] || 0);
      dayData.humidity.push(item.main.humidity);
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      temperature: Math.round(data.temps.reduce((a: number, b: number) => a + b, 0) / data.temps.length),
      condition: this.mapCondition(this.getMostFrequent(data.conditions)),
      rainfall: Math.round(data.rainfall * 10) / 10,
      humidity: Math.round(data.humidity.reduce((a: number, b: number) => a + b, 0) / data.humidity.length)
    }));
  }

  private getMostFrequent(arr: string[]): string {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop() || arr[0];
  }

  private mapCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'Clear': 'Sunny',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Light Rain',
      'Thunderstorm': 'Stormy',
      'Snow': 'Snowy',
      'Mist': 'Misty',
      'Fog': 'Foggy'
    };
    return conditionMap[condition] || condition;
  }

  private generateFarmingAdvice(temp: number, humidity: number, rainfall: number, condition: string): string {
    let advice = "";

    if (temp > 35) {
      advice += "Very hot weather. Provide shade for crops and increase irrigation frequency. ";
    } else if (temp > 30) {
      advice += "Hot weather. Water crops early morning or evening to prevent heat stress. ";
    } else if (temp < 15) {
      advice += "Cool weather. Protect sensitive crops from cold. Reduce watering frequency. ";
    } else {
      advice += "Favorable temperature for most crops. ";
    }

    if (humidity > 80) {
      advice += "High humidity increases risk of fungal diseases. Ensure good air circulation. ";
    } else if (humidity < 40) {
      advice += "Low humidity may stress plants. Consider light misting in evening. ";
    }

    if (rainfall > 10) {
      advice += "Heavy rainfall expected. Ensure proper drainage to prevent waterlogging. ";
    } else if (rainfall > 2) {
      advice += "Moderate rainfall expected. Good for irrigation savings. ";
    } else {
      advice += "Little to no rainfall. Plan irrigation accordingly. ";
    }

    if (condition.includes('Storm')) {
      advice += "Storm warning! Secure crops and equipment. Avoid outdoor farm work.";
    }

    return advice.trim();
  }

  private getIntelligentMockWeather(location: string): WeatherData {
    const now = new Date();
    const month = now.getMonth();
    const isKarnataka = location.toLowerCase().includes('karnataka');
    const isMonsoon = month >= 5 && month <= 9; // June to October
    const isWinter = month >= 10 || month <= 2; // November to March
    
    let baseTemp = 25;
    let humidity = 60;
    let rainfall = 0;
    let condition = "Partly Cloudy";

    if (isKarnataka) {
      if (isMonsoon) {
        baseTemp = 24;
        humidity = 85;
        rainfall = 15 + Math.random() * 20;
        condition = "Rainy";
      } else if (isWinter) {
        baseTemp = 22;
        humidity = 55;
        rainfall = 0;
        condition = "Clear";
      } else {
        baseTemp = 28;
        humidity = 70;
        rainfall = 2;
        condition = "Partly Cloudy";
      }
    }

    // Add some realistic variation
    const temperature = Math.round(baseTemp + (Math.random() * 6 - 3));
    const finalHumidity = Math.round(humidity + (Math.random() * 20 - 10));
    const finalRainfall = Math.round(rainfall * (0.5 + Math.random()) * 10) / 10;

    return {
      location: location || "Karnataka, India",
      temperature,
      humidity: Math.max(30, Math.min(95, finalHumidity)),
      rainfall: Math.max(0, finalRainfall),
      condition,
      advice: this.generateFarmingAdvice(temperature, finalHumidity, finalRainfall, condition)
    };
  }
}

export const weatherService = new WeatherService();