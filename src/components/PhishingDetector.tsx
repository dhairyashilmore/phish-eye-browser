
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck } from 'lucide-react';
import { extractFeatures } from '@/utils/urlFeatureExtractor';
import { phishingClassifier } from '@/lib/models/classifiers';

type DetectionResult = {
  prediction: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  scores: {
    xgboost: number;
    logistic: number;
    gaussian: number;
  };
};

const PhishingDetector = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [features, setFeatures] = useState<any>(null);

  useEffect(() => {
    // Load models on component mount
    const loadModels = async () => {
      try {
        await phishingClassifier.loadModels();
        setIsModelLoading(false);
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };
    
    loadModels();
  }, []);

  const analyzeUrl = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    try {
      // Extract features from URL
      const urlFeatures = extractFeatures(url);
      setFeatures(urlFeatures);
      
      // Predict using the classifier
      const prediction = await phishingClassifier.predict(urlFeatures);
      setResult(prediction);
    } catch (error) {
      console.error('Error analyzing URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setUrl('');
    setResult(null);
    setFeatures(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-blue-600 mb-6">
            Check a Website for Phishing
          </h2>

          {!result ? (
            <>
              {isModelLoading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <div className="h-16 w-16 mx-auto bg-gray-200 rounded-full mb-4"></div>
                  </div>
                  <p className="text-gray-600">Loading models...</p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter URL to analyze"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={analyzeUrl}
                      disabled={!url.trim() || isLoading}
                    >
                      Check
                    </Button>
                  </div>
                  
                  {isLoading && (
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="animate-pulse">
                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                      </div>
                      <p className="text-center mt-4 text-gray-600">
                        Analyzing URL...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="w-full flex flex-col items-center">
              <ShieldCheck className="h-16 w-16 text-green-500 mb-3" />
              
              <h3 className="text-xl font-semibold text-green-500 mb-2">
                {result.prediction === 'safe' && 'Safe Website'}
                {result.prediction === 'suspicious' && 'Suspicious Website'}
                {result.prediction === 'dangerous' && 'Dangerous Website'}
              </h3>
              
              <div className="bg-gray-100 w-full p-4 mb-4 text-center rounded-md">
                <div className="text-gray-600 font-mono truncate">{url}</div>
              </div>
              
              <p className="text-center mb-4 text-gray-700">
                {result.prediction === 'safe' && 'This URL appears to be safe based on our analysis.'}
                {result.prediction === 'suspicious' && 'This URL has some suspicious characteristics.'}
                {result.prediction === 'dangerous' && 'This URL has multiple indicators of being a phishing site.'}
              </p>
              
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white" 
                onClick={resetAnalysis}
              >
                Check Another URL
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhishingDetector;
