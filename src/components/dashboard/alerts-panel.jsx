'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Info, BellRing, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { initialAlerts } from '@/lib/data';
import type { Alert as AlertType } from '@/lib/types';
import { generateAlert } from '@/app/actions/alerts';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This ensures the component has mounted on the client, avoiding hydration mismatch
    // for initialAlerts which might use Date.now() indirectly.
    setIsClient(true);
    setAlerts(initialAlerts);
  }, []);

  const handleGenerateAlert = async () => {
    setIsLoading(true);
    try {
      const newAlert = await generateAlert();
      if (newAlert) {
        setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
        toast({
          title: 'New Alert Generated',
          description: `Predictive alert for ${newAlert.zoneName} has been created.`,
        });
      } else {
        throw new Error('Failed to generate alert.');
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate a new alert. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAlertIcon = (level: AlertType['level']) => {
    switch (level) {
      case 'Critical':
      case 'Warning':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-500" />;
    }
  };

  // Render nothing on the server, and only render on the client after mount.
  if (!isClient) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-lg">
          Predictive Alerts
        </CardTitle>
        <Button size="sm" onClick={handleGenerateAlert} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BellRing className="mr-2 h-4 w-4" />
          )}
          Generate
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-4">
                <div className="mt-1 flex-shrink-0">
                  {getAlertIcon(alert.level)}
                </div>
                <div>
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      alert.level === 'Warning' && 'text-amber-600',
                      alert.level === 'Critical' && 'text-red-600'
                    )}
                  >
                    {alert.level} in {alert.zoneName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground/80">
                    {formatDistanceToNow(new Date(alert.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
