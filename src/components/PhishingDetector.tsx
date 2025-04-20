
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';
import { extractFeatures } from '@/utils/urlFeatureExtractor';
import { phishingClassifier } from '@/lib/models/classifiers';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const PhishingDetector = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [prediction, setPrediction] = useState<{
    status: 'safe' | 'risky' | 'unknown';
    confidence: number;
  } | null>(null);

  useEffect(() => {
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
      const urlFeatures = extractFeatures(url);
      const result = await phishingClassifier.predict(urlFeatures);
      
      setPrediction({
        status: result.prediction === 'safe' 
          ? 'safe' 
          : (result.prediction === 'suspicious' ? 'risky' : 'risky'),
        confidence: result.confidence
      });
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setPrediction({ status: 'unknown', confidence: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isModelLoading) return <Shield className="h-12 w-12 text-gray-400" />;
    if (!prediction) return <Shield className="h-12 w-12 text-gray-500" />;
    
    switch (prediction.status) {
      case 'safe': 
        return <ShieldCheck className="h-12 w-12 text-green-500" />;
      case 'risky': 
        return <ShieldX className="h-12 w-12 text-red-500" />;
      default: 
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
    }
  };

  const getRiskMessage = () => {
    if (!prediction) return null;

    switch (prediction.status) {
      case 'safe':
        return (
          <Alert variant="default">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Safe Website</AlertTitle>
            <AlertDescription>
              This website appears to be legitimate and does not show signs of phishing.
            </AlertDescription>
          </Alert>
        );
      case 'risky':
        return (
          <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertTitle>Potential Phishing Risk</AlertTitle>
            <AlertDescription>
              Warning: This website shows multiple suspicious characteristics. Exercise caution before proceeding.
            </AlertDescription>
          </Alert>
        );
      default:
        return (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Unable to Verify</AlertTitle>
            <AlertDescription>
              We could not definitively determine the safety of this website.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">PhishEye Detector</CardTitle>
          <CardDescription>
            {isModelLoading ? 'Loading machine learning models...' : 'Check website safety instantly'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Enter URL to analyze"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading || isModelLoading}
              className="flex-1"
            />
            <Button 
              onClick={analyzeUrl}
              disabled={!url.trim() || isLoading || isModelLoading}
            >
              Analyze
            </Button>
          </div>
          
          {prediction && !isLoading && getRiskMessage()}
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-pulse">
                <Shield className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-center mt-4 text-muted-foreground">
                Analyzing URL...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhishingDetector;
