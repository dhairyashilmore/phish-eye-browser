
import { useState } from 'react';
import PhishingDetector from '@/components/PhishingDetector';
import PhishingStats from '@/components/PhishingStats';
import ExtensionInfo from '@/components/ExtensionInfo';
import { Shield } from 'lucide-react';

const Index = () => {
  const [currentYear] = useState(new Date().getFullYear());
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex justify-center items-center mb-2">
          <Shield className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-blue-900">PhishEye</h1>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Advanced machine learning phishing detection using ensemble classifiers
        </p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
        {/* Phishing detector component */}
        <PhishingDetector />
        
        {/* Stats section */}
        <PhishingStats />
        
        {/* Extension info */}
        <ExtensionInfo />
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© {currentYear} PhishEye - ML Phishing Detection System</p>
        <p className="text-xs mt-1">Powered by XGBoost, Logistic Regression, and Gaussian models</p>
      </footer>
    </div>
  );
};

export default Index;
