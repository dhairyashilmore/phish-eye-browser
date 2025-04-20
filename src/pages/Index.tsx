
import { useState } from 'react';
import PhishingDetector from '@/components/PhishingDetector';
import PhishingStats from '@/components/PhishingStats';
import ExtensionInfo from '@/components/ExtensionInfo';
import { Shield } from 'lucide-react';

const Index = () => {
  const [currentYear] = useState(new Date().getFullYear());
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-xl"></div>
        <div className="relative">
          <div className="flex justify-center items-center mb-4 animate-fade-in">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
              PhishEye
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Advanced machine learning protection against phishing attacks using ensemble classifiers
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 space-y-12 max-w-7xl">
        {/* Phishing detector component */}
        <section className="animate-fade-in [--animate-delay:200ms]">
          <PhishingDetector />
        </section>
        
        {/* Stats and Extension Info in grid */}
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in [--animate-delay:400ms]">
          <section>
            <PhishingStats />
          </section>
          <section>
            <ExtensionInfo />
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-8 text-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400">© {currentYear} PhishEye - ML Phishing Detection System</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Powered by XGBoost, Logistic Regression, and Gaussian models
        </p>
      </footer>
    </div>
  );
};

export default Index;
