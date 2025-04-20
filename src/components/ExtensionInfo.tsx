
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Settings } from 'lucide-react';

const ExtensionInfo = () => {
  return (
    <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center text-xl text-blue-700 dark:text-blue-400">
          <Shield className="h-5 w-5 mr-2" />
          Browser Extension Coming Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-600 dark:text-slate-300">
        <p className="mb-4">
          The PhishEye Browser Extension is currently under development. Once released, it will provide:
        </p>
        <ul className="space-y-3">
          {[
            'Real-time URL scanning as you browse',
            'Site safety indicators in your toolbar',
            'Automatic blocking of dangerous sites',
            'Customizable security levels',
            'Offline detection capabilities'
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="h-2 w-2 mt-2 mr-2 rounded-full bg-blue-500 dark:bg-blue-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          disabled 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-2" />
          Get Extension Preview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionInfo;
