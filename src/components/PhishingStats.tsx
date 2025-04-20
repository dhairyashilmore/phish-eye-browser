
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, AlertTriangle, Search, Settings } from 'lucide-react';

const PhishingStats = () => {
  return (
    <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-blue-700 dark:text-blue-400 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Phishing Threat Intelligence
        </CardTitle>
        <CardDescription>Latest cybersecurity insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Threat Statistics</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Over 300,000 new phishing sites are created every month',
                'Phishing attacks account for more than 80% of reported security incidents',
                'Average data breach from phishing costs organizations $4.65 million',
                'Over 65% of phishing sites now use HTTPS to appear legitimate'
              ].map((stat, index) => (
                <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{stat}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Detection Capabilities</h3>
            <ul className="space-y-3 text-sm">
              {[
                'Extracts 11+ URL features including entropy, length, and special characters',
                'Uses ensemble learning with XGBoost, Logistic Regression, and Gaussian models',
                'Provides real-time analysis with model confidence scores',
                'Works entirely in your browser with no data sent to external servers'
              ].map((capability, index) => (
                <li key={index} className="flex items-start text-slate-600 dark:text-slate-300">
                  <Search className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhishingStats;
