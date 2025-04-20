
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, AlertTriangle } from 'lucide-react';
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
        status: result.prediction === 'safe' ? 'safe' : 'risky',
        confidence: result.confidence
      });
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setPrediction({ status: 'unknown', confidence: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const getResultDisplay = () => {
    if (!prediction) return null;

    switch (prediction.status) {
      case 'safe':
        return (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <AlertTitle className="text-green-800 dark:text-green-400">Safe to Browse</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                This website appears to be legitimate and safe to visit.
              </AlertDescription>
            </Alert>
          </div>
        );
      case 'risky':
        return (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertTitle className="text-amber-800 dark:text-amber-400">Exercise Caution</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                This website shows signs of being potentially unsafe. Please be careful.
              </AlertDescription>
            </Alert>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-slate-200/50 dark:border-slate-700/50">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-light tracking-tight">URL Safety Check</CardTitle>
          <CardDescription className="text-base">
            Enter a website URL to check if it's safe to visit
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading || isModelLoading}
                  className="pl-10 bg-white dark:bg-slate-900"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              <Button 
                onClick={analyzeUrl}
                disabled={!url.trim() || isLoading || isModelLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Analyzing..." : "Check Safety"}
              </Button>
            </div>
            
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Analyzing website safety...
                </p>
              </div>
            ) : (
              getResultDisplay()
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhishingDetector;
