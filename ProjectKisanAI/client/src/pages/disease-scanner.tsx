import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { BottomNavigation } from '@/components/bottom-navigation';
import { FloatingVoiceButton } from '@/components/floating-voice-button';

interface DiagnosisResult {
  disease: string;
  confidence: number;
  remedies: string[];
  severity: string;
}

export default function DiseaseScanner() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const diagnoseMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const response = await apiRequest('POST', '/api/diagnose-disease', {
        imageData,
        userId: "1", // Demo user ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      setDiagnosisResult(data);
      toast({
        title: "Diagnosis Complete",
        description: `${data.disease} detected with ${data.confidence}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Diagnosis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setDiagnosisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      diagnoseMutation.mutate(selectedImage);
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera preference
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <h1 className="text-xl font-bold">Crop Disease Scanner</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Plant Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Selected crop" 
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                  <Button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 p-0"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                  <i className="fas fa-camera text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 mb-4">Take a photo of the affected plant</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCameraCapture}
                  className="bg-farm-green hover:bg-green-700 text-white py-3"
                >
                  <i className="fas fa-camera mr-2"></i>
                  Take Photo
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="py-3"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Upload Image
                </Button>
              </div>

              {selectedImage && (
                <Button
                  onClick={handleAnalyze}
                  disabled={diagnoseMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
                >
                  {diagnoseMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Analyze Disease
                    </>
                  )}
                </Button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Diagnosis Results */}
        {diagnosisResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-stethoscope mr-2 text-red-500"></i>
                Diagnosis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-800 text-lg mb-2">
                    {diagnosisResult.disease}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-red-600">
                      Confidence: {diagnosisResult.confidence}%
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      diagnosisResult.severity === 'High' ? 'bg-red-100 text-red-800' :
                      diagnosisResult.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {diagnosisResult.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">
                    <i className="fas fa-leaf mr-2"></i>
                    Recommended Remedies
                  </h4>
                  <ul className="space-y-2">
                    {diagnosisResult.remedies.map((remedy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-green-700 text-sm">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Additional Tips
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Monitor your crop daily and apply treatments in the early morning or evening. 
                    Consult your local agricultural expert if symptoms persist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Instructions */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="bg-harvest-orange bg-opacity-10 border border-harvest-orange rounded-lg p-3">
              <p className="text-sm text-harvest-orange font-medium">
                <i className="fas fa-microphone mr-2"></i>
                Say "Scan my crop" to start voice-guided diagnosis
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      <FloatingVoiceButton />
    </div>
  );
}
