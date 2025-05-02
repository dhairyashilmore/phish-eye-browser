
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldCheck, ShieldX, AlertTriangle, Info } from 'lucide-react';
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

  const getStatusColor = () => {
    if (!result) return 'bg-gray-200';
    
    switch (result.prediction) {
      case 'safe': return 'bg-green-500';
      case 'suspicious': return 'bg-amber-500';
      case 'dangerous': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusIcon = () => {
    if (isModelLoading) return <Shield className="h-12 w-12 text-gray-400" />;
    if (!result) return <Shield className="h-12 w-12 text-gray-500" />;
    
    switch (result.prediction) {
      case 'safe': 
        return <ShieldCheck className="h-12 w-12 text-green-500" />;
      case 'suspicious': 
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
      case 'dangerous': 
        return <ShieldX className="h-12 w-12 text-red-500" />;
      default: 
        return <Shield className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    if (isModelLoading) return 'Loading Models...';
    if (!result) return 'Enter a URL to analyze';
    
    switch (result.prediction) {
      case 'safe': return 'Website Appears Safe';
      case 'suspicious': return 'Potentially Suspicious';
      case 'dangerous': return 'Likely Phishing Site';
      default: return 'Analysis Complete';
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
            {isModelLoading ? 'Loading machine learning models...' : 'Analyze URLs to detect phishing sites'}
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
          
          {result && (
            <div className="space-y-4 mt-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-1">{getStatusTitle()}</h3>
                <p className="text-sm text-muted-foreground">
                  {result.prediction === 'safe' && 'This URL shows no signs of being a phishing site.'}
                  {result.prediction === 'suspicious' && 'This URL has some suspicious characteristics.'}
                  {result.prediction === 'dangerous' && 'This URL has multiple indicators of being a phishing site.'}
                </p>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Risk Score</span>
                  <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                </div>
                <Progress
                  value={result.confidence * 100}
                  className={`h-2 ${getStatusColor()}`}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">XGBoost</div>
                  <Progress
                    value={result.scores.xgboost * 100}
                    className="h-1 mb-1"
                  />
                  <div className="text-xs font-medium">{Math.round(result.scores.xgboost * 100)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Logistic</div>
                  <Progress
                    value={result.scores.logistic * 100}
                    className="h-1 mb-1"
                  />
                  <div className="text-xs font-medium">{Math.round(result.scores.logistic * 100)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Gaussian</div>
                  <Progress
                    value={result.scores.gaussian * 100}
                    className="h-1 mb-1"
                  />
                  <div className="text-xs font-medium">{Math.round(result.scores.gaussian * 100)}%</div>
                </div>
              </div>
            </div>
          )}
          
          {!result && !isLoading && !isModelLoading && (
            <div className="flex flex-col items-center justify-center py-6">
              <Shield className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-center text-muted-foreground">
                Enter a URL above to analyze for phishing indicators
              </p>
            </div>
          )}
          
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
        
        {result && (
          <CardFooter className="flex justify-center border-t pt-4">
            <Button
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={() => setFeatures(prev => prev ? null : features)}
            >
              <Info className="h-3 w-3 mr-1" />
              {features ? 'Hide Details' : 'Show URL Features'}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {features && (
        <Card className="mt-4 shadow-md">
          <CardHeader className="py-3">
            <CardTitle className="text-sm">URL Feature Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL Length:</span>
                <span>{features.urlLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Domain Length:</span>
                <span>{features.domainLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">HTTPS:</span>
                <span>{features.hasHttps ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dots:</span>
                <span>{features.numDots}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dashes:</span>
                <span>{features.numDashes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Digits:</span>
                <span>{features.numDigits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subdomains:</span>
                <span>{features.numSubdomains}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <span>{features.hasIpAddress ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suspicious TLD:</span>
                <span>{features.hasSuspiciousTld ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL Shortener:</span>
                <span>{features.hasUrlShortener ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entropy:</span>
                <span>{features.entropy.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhishingDetector;
