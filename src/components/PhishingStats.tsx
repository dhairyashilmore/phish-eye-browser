
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, Search, Settings } from 'lucide-react';

const PhishingStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto mt-8">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Phishing Threats
          </CardTitle>
          <CardDescription>Why detection matters</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Over 300,000 new phishing sites are created every month</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Phishing attacks account for more than 80% of reported security incidents</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Average data breach from phishing costs organizations $4.65 million</span>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Over 65% of phishing sites now use HTTPS to appear legitimate</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-4 w-4 mr-2 text-purple-500" />
            How System Works
          </CardTitle>
          <CardDescription>Advanced ML detection</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li className="flex items-start">
              <Search className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Extracts 60+ URL features including entropy, length, and special characters</span>
            </li>
            <li className="flex items-start">
              <Search className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Uses ensemble learning with XGBoost, Logistic Regression, and Gaussian models</span>
            </li>
            <li className="flex items-start">
              <Search className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Provides real-time analysis with model confidence scores</span>
            </li>
            <li className="flex items-start">
              <Search className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>Works entirely in your browser with no data sent to external servers</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhishingStats;
