import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingVoiceButton } from '@/components/floating-voice-button';
import { useToast } from '@/hooks/use-toast';

interface Scheme {
  id: number;
  name: string;
  description: string;
  amount: string;
  eligibility: string[];
  applicationLink: string;
  category: string;
  status: 'eligible' | 'under_review' | 'not_eligible';
}

export default function GovernmentSchemes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: schemes, isLoading } = useQuery<Scheme[]>({
    queryKey: ['/api/schemes'],
  });

  const recommendationMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest('POST', '/api/schemes/recommend', {
        query,
        userId: "1",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setRecommendation(data.recommendation);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get scheme recommendation",
        variant: "destructive",
      });
    },
  });

  const handleGetRecommendation = () => {
    if (searchQuery.trim()) {
      recommendationMutation.mutate(searchQuery);
    }
  };

  const filteredSchemes = schemes?.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.category.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      case 'not_eligible': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'income_support': return 'fas fa-coins';
      case 'subsidy': return 'fas fa-percentage';
      case 'insurance': return 'fas fa-shield-alt';
      case 'advisory': return 'fas fa-user-graduate';
      default: return 'fas fa-file-alt';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <h1 className="text-xl font-bold">Government Schemes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Recommendation Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find Relevant Schemes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Describe your need (e.g., 'subsidies for drip irrigation')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGetRecommendation()}
                />
                <Button
                  onClick={handleGetRecommendation}
                  disabled={recommendationMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {recommendationMutation.isPending ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-search"></i>
                  )}
                </Button>
              </div>

              {recommendation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    <i className="fas fa-lightbulb mr-2"></i>
                    AI Recommendation
                  </h4>
                  <p className="text-blue-700 text-sm">{recommendation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            All Schemes
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Income Support
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Subsidies
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Insurance
          </Button>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            Advisory
          </Button>
        </div>

        {/* Schemes List */}
        {isLoading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-600">Loading schemes...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                          <i className={`${getCategoryIcon(scheme.category)} text-blue-600`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{scheme.name}</h3>
                          <Badge variant="outline" className="capitalize">
                            {scheme.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{scheme.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-green-600">{scheme.amount}</span>
                          <Badge className={getStatusColor(scheme.status)}>
                            {scheme.status === 'eligible' ? 'Eligible' :
                             scheme.status === 'under_review' ? 'Under Review' : 'Not Eligible'}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Eligibility:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {scheme.eligibility.map((criteria, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 space-y-2">
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => window.open(scheme.applicationLink, '_blank')}
                      >
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <i className="fas fa-tractor text-2xl text-blue-500 mb-2"></i>
                  <div className="text-sm font-medium">PM-KISAN Portal</div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <i className="fas fa-leaf text-2xl text-green-500 mb-2"></i>
                  <div className="text-sm font-medium">Soil Health Card</div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto">
                <div className="text-center">
                  <i className="fas fa-shield-alt text-2xl text-orange-500 mb-2"></i>
                  <div className="text-sm font-medium">Crop Insurance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
}
