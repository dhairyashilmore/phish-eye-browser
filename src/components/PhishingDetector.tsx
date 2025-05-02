
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldCheck, Link2Off, AlertTriangle } from 'lucide-react';
import { extractFeatures } from '@/utils/urlFeatureExtractor';
import { phishingClassifier } from '@/lib/models/classifiers';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type DetectionResult = {
  prediction: 'safe' | 'risky';
  confidence: number;
  riskFactors: string[];
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
      
      // Generate risk factors based on features
      const riskFactors = generateRiskFactors(urlFeatures);
      
      setResult({
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        riskFactors
      });
    } catch (error) {
      console.error('Error analyzing URL:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateRiskFactors = (features: any): string[] => {
    const factors = [];
    
    if (!features.hasHttps) {
      factors.push("No HTTPS secure connection");
    }
    
    if (features.hasIpAddress) {
      factors.push("Uses IP address instead of domain name");
    }
    
    if (features.hasSuspiciousTld) {
      factors.push("Uses suspicious top-level domain");
    }
    
    if (features.hasUrlShortener) {
      factors.push("Uses URL shortening service");
    }
    
    if (features.numDashes > 2) {
      factors.push("Contains excessive dashes in domain");
    }
    
    if (features.numDigits > 5) {
      factors.push("Contains excessive numbers in domain");
    }
    
    if (features.urlLength > 75) {
      factors.push("Unusually long URL");
    }
    
    if (features.numSubdomains > 3) {
      factors.push("Multiple subdomains");
    }
    
    return factors;
  };

  const getStatusColor = () => {
    if (!result) return 'bg-gray-200';
    
    switch (result.prediction) {
      case 'safe': return 'bg-green-500';
      case 'risky': return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusIcon = () => {
    if (isModelLoading) return <Shield className="h-12 w-12 text-gray-400" />;
    if (!result) return <Shield className="h-12 w-12 text-gray-500" />;
    
    switch (result.prediction) {
      case 'safe': 
        return <ShieldCheck className="h-12 w-12 text-green-500" />;
      case 'risky': 
        return <Link2Off className="h-12 w-12 text-red-500" />;
      default: 
        return <Shield className="h-12 w-12 text-gray-500" />;
    }
  };

  const getStatusTitle = () => {
    if (isModelLoading) return 'Loading Models...';
    if (!result) return 'Enter a URL to analyze';
    
    switch (result.prediction) {
      case 'safe': return 'Website Appears Safe';
      case 'risky': return 'This Website Looks Risky';
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
                <p className="text-sm text-muted-foreground mb-4">
                  {result.prediction === 'safe' && 'This URL appears to be legitimate.'}
                  {result.prediction === 'risky' && 'This URL has multiple risk indicators.'}
                </p>
                
                <div className="pt-2 mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{result.prediction === 'safe' ? 'Safety Score' : 'Risk Score'}</span>
                    <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
                  </div>
                  <Progress
                    value={result.confidence * 100}
                    className={`h-2 ${getStatusColor()}`}
                  />
                </div>
                
                {result.prediction === 'risky' && result.riskFactors.length > 0 && (
                  <Alert variant="destructive" className="text-left mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Security Issues Detected</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        {result.riskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {result.prediction === 'safe' && (
                  <Alert className="text-left mt-4 bg-green-50 border-green-200">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Security Features Present</AlertTitle>
                    <AlertDescription className="text-green-600">
                      This website has passed our security checks and appears to be legitimate.
                    </AlertDescription>
                  </Alert>
                )}
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
      </Card>
    </div>
  );
};

export default PhishingDetector;
