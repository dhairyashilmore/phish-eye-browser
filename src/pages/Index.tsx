
import { useState } from 'react';
import PhishingDetector from '@/components/PhishingDetector';
import PhishingStats from '@/components/PhishingStats';
import ExtensionInfo from '@/components/ExtensionInfo';
import { Shield } from 'lucide-react';

const Index = () => {
  const [currentYear] = useState(new Date().getFullYear());
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex justify-center items-center mb-2">
          <Shield className="h-8 w-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-white">Phishing Classifier for Websites</h1>
        </div>
        <p className="text-gray-400 max-w-md mx-auto">
          Advanced machine learning phishing detection using ensemble classifiers
        </p>
      </header>
      
      {/* Main content - only showing the detector component */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
        {/* Phishing detector component */}
        <PhishingDetector />
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© {currentYear} Phishing Classifier for Websites - ML Detection System</p>
        <p className="text-xs mt-1">Powered by XGBoost, Logistic Regression, and Gaussian models</p>
      </footer>
    </div>
  );
};

export default Index;
