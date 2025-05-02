
import { useState } from 'react';
import PhishingDetector from '@/components/PhishingDetector';
import ExtensionInfo from '@/components/ExtensionInfo';
import { Shield, AlertTriangle } from 'lucide-react';

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
          Detect risky websites and protect your online safety
        </p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col items-center">
        {/* Helpful tips */}
        <div className="max-w-md w-full mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Stay Safe Online</h3>
              <p className="text-sm text-amber-700 mt-1">
                PhishEye analyzes URLs and identifies security risks. Enter any suspicious link to check if it's safe before visiting.
              </p>
            </div>
          </div>
        </div>
        
        {/* Phishing detector component */}
        <PhishingDetector />
        
        {/* Extension info */}
        <ExtensionInfo />
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© {currentYear} PhishEye - ML Phishing Detection System</p>
        <p className="text-xs mt-1">Protecting you from online threats</p>
      </footer>
    </div>
  );
};

export default Index;
