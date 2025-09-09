import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingVoiceButton } from '@/components/floating-voice-button';
import { VoiceIndicator } from '@/components/voice-indicator';
import { useState } from 'react';

interface MarketPrice {
  crop: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  price: number;
  unit: string;
  market: string;
}

interface Scheme {
  id: number | string;
  name: string;
  description: string;
  amount: string;
  status: 'eligible' | 'under_review' | 'not_eligible';
}

interface Activity {
  id: number | string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const { data: marketPrices } = useQuery<MarketPrice[]>({
    queryKey: ['/api/market-prices'],
  });

  const { data: schemes } = useQuery<Scheme[]>({
    queryKey: ['/api/schemes'],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ['/api/activities/1'], // Using userId 1 for demo
  });

  const quickActions = [
    {
      title: 'Crop Disease',
      description: 'Take a photo to diagnose plant diseases instantly',
      icon: 'fas fa-camera',
      color: 'bg-red-500 hover:bg-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      path: '/scan',
    },
    {
      title: 'Market Prices',
      description: 'Check current rates and price trends',
      icon: 'fas fa-chart-line',
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      path: '/market',
    },
    {
      title: 'Gov Schemes',
      description: 'Find subsidies and government support',
      icon: 'fas fa-landmark',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      path: '/schemes',
    },
    {
      title: 'Weather',
      description: 'Get weather updates and farming advice',
      icon: 'fas fa-cloud-sun',
      color: 'bg-orange-500 hover:bg-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      path: '/weather',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-seedling text-2xl"></i>
              <h1 className="text-xl font-bold">Project Kisan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-white text-farm-green px-3 py-2 rounded-lg text-sm font-medium">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="te">తెలుగు</option>
              </select>
              <Button
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className="bg-harvest-orange hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <i className="fas fa-microphone"></i>
                <span className="hidden sm:inline text-sm font-medium">Voice</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <VoiceIndicator isVisible={isVoiceMode} isListening={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150" 
                alt="Farmer profile" 
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome, User</h2>
                <p className="text-gray-600">Farming in India</p>
              </div>
            </div>
            <div className="bg-farm-green bg-opacity-10 border border-farm-green rounded-lg p-4">
              <p className="text-farm-green font-medium">🌾 Your AI agricultural assistant is ready to help!</p>
              <p className="text-sm text-gray-600 mt-1">Tap the microphone to speak or use the tools below</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-6" onClick={() => setLocation(action.path)}>
                <div className={`${action.iconBg} rounded-full w-16 h-16 flex items-center justify-center mb-4`}>
                  <i className={`${action.icon} text-2xl ${action.iconColor}`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <Button className={`w-full ${action.color} text-white py-3 font-medium`}>
                  {action.title === 'Crop Disease' && 'Scan Disease'}
                  {action.title === 'Market Prices' && 'View Prices'}
                  {action.title === 'Gov Schemes' && 'Browse Schemes'}
                  {action.title === 'Weather' && 'Check Weather'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Prices Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Today's Market Prices</h3>
              <Button variant="ghost" className="text-farm-green hover:text-green-700 font-medium">
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {marketPrices?.slice(0, 3).map((price) => (
                <div key={price.crop} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{price.crop}</h4>
                    <span className={`text-sm font-medium ${
                      price.trend === 'up' ? 'text-green-600' : 
                      price.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {price.trend === 'up' ? '+' : price.trend === 'down' ? '-' : ''}{Math.abs(price.trendPercentage)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-1">₹{(price.price / 100).toFixed(0)}/{price.unit}</p>
                  <p className="text-sm text-gray-600">{price.market}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-700 mb-2">
                <i className="fas fa-robot mr-2"></i>
                AI Market Insight
              </h4>
              <p className="text-sm text-gray-700">
                Tomato prices are trending up by 5% this week. Consider selling your harvest in the next 2-3 days for maximum profit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Government Schemes Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Available Government Schemes</h3>
            
            <div className="space-y-4">
              {schemes?.slice(0, 2).map((scheme) => (
                <div key={scheme.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-2">{scheme.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{scheme.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-green-600 font-medium">{scheme.amount}</span>
                        <span className={`${
                          scheme.status === 'eligible' ? 'text-green-600' :
                          scheme.status === 'under_review' ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {scheme.status === 'eligible' ? 'Eligible' :
                           scheme.status === 'under_review' ? 'Under Review' : 'Not Eligible'}
                        </span>
                      </div>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {activities?.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="bg-farm-green bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <i className={`${activity.icon} text-farm-green`}></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-8">
                  <i className="fas fa-history text-4xl mb-4 opacity-50"></i>
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
}
