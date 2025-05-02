
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Settings } from 'lucide-react';

const ExtensionInfo = () => {
  return (
    <Card className="max-w-md mx-auto mt-8 shadow-md border-dashed border-2 bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Shield className="h-5 w-5 mr-2 text-blue-500" />
          Browser Extension Coming Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          The PhishEye Browser Extension is currently under development. Once released, it will provide:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Real-time URL scanning as you browse</li>
          <li>Site safety indicators in your toolbar</li>
          <li>Automatic blocking of dangerous sites</li>
          <li>Customizable security levels</li>
          <li>Offline detection capabilities</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button disabled className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Get Extension Preview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionInfo;
