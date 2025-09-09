import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingVoiceButton } from '@/components/floating-voice-button';
import { useToast } from '@/hooks/use-toast';

interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  market: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export default function MarketPrices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [marketInsight, setMarketInsight] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: marketPrices, isLoading, refetch } = useQuery<MarketPrice[]>({
    queryKey: ['/api/market-prices'],
  });

  const insightMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/market-insight', {
        query,
        userId: "1",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMarketInsight(data.insight);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get market insight",
        variant: "destructive",
      });
    },
  });

  const handleGetInsight = () => {
    if (searchQuery.trim()) {
      insightMutation.mutate(searchQuery);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Market prices updated",
    });
  };

  const filteredPrices = marketPrices?.filter(price =>
    price.crop.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up text-green-500';
      case 'down': return 'fas fa-arrow-down text-red-500';
      default: return 'fas fa-minus text-gray-500';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">Market Prices</h1>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              className="text-white hover:bg-green-600"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Insight Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Market Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask about crop prices (e.g., 'What is tomato price today?')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGetInsight()}
                />
                <Button
                  onClick={handleGetInsight}
                  disabled={insightMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {insightMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-search"></i>
                  )}
                </Button>
              </div>

              {marketInsight && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    <i className="fas fa-robot mr-2"></i>
                    AI Market Insight
                  </h4>
                  <p className="text-blue-700 text-sm">{marketInsight}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price Cards Grid */}
        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Loading market prices...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrices.map((price) => (
              <Card key={price.crop} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{price.crop}</h3>
                      <p className="text-sm text-gray-600">{price.market}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full flex items-center space-x-1 ${getTrendColor(price.trend)}`}>
                      <i className={getTrendIcon(price.trend)}></i>
                      <span className="text-sm font-medium">
                        {price.trend === 'up' ? '+' : price.trend === 'down' ? '-' : ''}
                        {Math.abs(price.trendPercentage)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-gray-800">
                      ₹{(price.price / 100).toFixed(0)}
                      <span className="text-lg font-normal text-gray-600">/{price.unit}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last updated: Today</span>
                      <Button variant="outline" size="sm">
                        View Trends
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Price Comparison Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Price Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Crop</th>
                    <th className="text-left py-2">Current Price</th>
                    <th className="text-left py-2">Yesterday</th>
                    <th className="text-left py-2">Change</th>
                    <th className="text-left py-2">Market</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrices.map((price) => (
                    <tr key={price.crop} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{price.crop}</td>
                      <td className="py-3">₹{(price.price / 100).toFixed(0)}/{price.unit}</td>
                      <td className="py-3">₹{((price.price - (price.price * price.trendPercentage / 100)) / 100).toFixed(0)}</td>
                      <td className="py-3">
                        <span className={`flex items-center space-x-1 ${
                          price.trend === 'up' ? 'text-green-600' : 
                          price.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          <i className={getTrendIcon(price.trend)}></i>
                          <span>{Math.abs(price.trendPercentage)}%</span>
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{price.market}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
}
