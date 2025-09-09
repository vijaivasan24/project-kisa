import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingVoiceButton } from '@/components/floating-voice-button';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  advice: string;
  forecast?: DayForecast[];
}

interface DayForecast {
  date: string;
  temperature: number;
  condition: string;
  rainfall: number;
  humidity: number;
}

export default function Weather() {
  const [location, setLocation] = useState('Karnataka, India');
  const [searchLocation, setSearchLocation] = useState('');

  const { data: weather, isLoading, refetch } = useQuery<WeatherData>({
    queryKey: ['/api/weather', location],
    queryFn: ({ queryKey }) => {
      const [, loc] = queryKey;
      const params = new URLSearchParams();
      if (loc) params.set('location', loc as string);
      return fetch(`/api/weather?${params}`).then(res => res.json());
    }
  });

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      setLocation(searchLocation.trim());
      setSearchLocation('');
    }
  };

  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude},${longitude}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <h1 className="text-xl font-bold">Weather & Farming Advice</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Location Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-search mr-2 text-blue-500"></i>
              Search Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter city, state, or coordinates"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                className="flex-1"
              />
              <Button onClick={handleLocationSearch} className="sm:w-auto">
                <i className="fas fa-search mr-2"></i>
                Search
              </Button>
              <Button 
                onClick={getLocationWeather} 
                variant="outline"
                className="sm:w-auto"
              >
                <i className="fas fa-location-arrow mr-2"></i>
                Use My Location
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Current: {location}
            </p>
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <i className="fas fa-info-circle mr-1"></i>
                Currently using intelligent weather estimates. For real-time data, add an OpenWeatherMap API key to get live weather updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Getting accurate weather data...</p>
          </div>
        ) : weather ? (
          <>
            {/* Current Weather */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                  {weather.location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-thermometer-half text-2xl text-orange-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{weather.temperature}°C</div>
                    <div className="text-sm text-gray-600">Temperature</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-tint text-2xl text-blue-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{weather.humidity}%</div>
                    <div className="text-sm text-gray-600">Humidity</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-cloud-rain text-2xl text-green-600"></i>
                    </div>
                    <div className="text-3xl font-bold text-gray-800">{weather.rainfall}mm</div>
                    <div className="text-sm text-gray-600">Rainfall</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <i className="fas fa-sun text-2xl text-yellow-600"></i>
                    </div>
                    <div className="text-lg font-bold text-gray-800">{weather.condition}</div>
                    <div className="text-sm text-gray-600">Condition</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Farming Advice */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-robot mr-2 text-green-500"></i>
                  AI Farming Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">{weather.advice}</p>
                </div>
              </CardContent>
            </Card>

            {/* Forecast */}
            {weather.forecast && weather.forecast.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {weather.forecast.map((day, i) => (
                      <div key={i} className="text-center p-3 border rounded-lg">
                        <div className="text-sm font-medium text-gray-600 mb-2">
                          {new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <i className={`fas ${
                          day.condition.toLowerCase().includes('rain') ? 'fa-cloud-rain text-blue-500' :
                          day.condition.toLowerCase().includes('cloud') ? 'fa-cloud text-gray-500' :
                          day.condition.toLowerCase().includes('storm') ? 'fa-bolt text-purple-500' :
                          'fa-sun text-yellow-500'
                        } text-2xl mb-2`}></i>
                        <div className="text-lg font-bold">{day.temperature}°C</div>
                        <div className="text-xs text-gray-600">{day.condition}</div>
                        <div className="text-xs text-blue-600">{day.rainfall}mm</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Farming Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                  This Week's Farming Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      Mon
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Irrigation Day</h4>
                      <p className="text-sm text-gray-600">Water crops early morning (6-8 AM)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      Wed
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Pest Inspection</h4>
                      <p className="text-sm text-gray-600">Check for pest damage on leaves and stems</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      Fri
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Fertilizer Application</h4>
                      <p className="text-sm text-gray-600">Apply organic fertilizer based on soil test results</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-4"></i>
            <p className="text-gray-600">Weather data unavailable</p>
          </div>
        )}
      </main>

      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
}
