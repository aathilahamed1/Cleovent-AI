'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Loader2 } from 'lucide-react';
import type { Scenario, Intervention } from '@/lib/types';
import { runScenarioSimulation } from '@/app/actions/simulation';
import { useToast } from '@/hooks/use-toast';
import { AddScenarioForm } from './add-scenario-form';

type ScenariosPanelProps = {
  scenarios: Scenario[];
  allInterventions: Intervention[];
  isLoading: boolean;
};

export default function ScenariosPanel({
  scenarios,
  allInterventions,
  isLoading
}: ScenariosPanelProps) {
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRunSimulation = async (scenario: Scenario) => {
    setRunningScenario(scenario.id);
    toast({
      title: 'Simulation Started',
      description: `Running simulation for "${scenario.name}".`,
    });
    try {
      const result = await runScenarioSimulation(scenario.id);
      if (result.success) {
        toast({
          title: 'Simulation Complete',
          description: `Scenario "${scenario.name}" finished successfully.`,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: `Could not complete simulation for "${scenario.name}".`,
      });
    } finally {
      setRunningScenario(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-lg">Scenario Planner</CardTitle>
        <AddScenarioForm allInterventions={allInterventions} isLoading={isLoading}/>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{scenario.name}</p>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-medium">Interventions:</span>
                  <Badge variant="secondary">{scenario.interventions.length}</Badge>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRunSimulation(scenario)}
                disabled={!!runningScenario}
              >
                {runningScenario === scenario.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="mr-2 h-4 w-4" />
                )}
                Run Simulation
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
