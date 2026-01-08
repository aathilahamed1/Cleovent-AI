import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Intervention } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AddInterventionForm } from './add-intervention-form';
import { Skeleton } from '@/components/ui/skeleton';

type InterventionsPanelProps = {
  interventions: Intervention[];
  isLoading: boolean;
};

export default function InterventionsPanel({
  interventions,
  isLoading
}: InterventionsPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-lg">Interventions</CardTitle>
        <AddInterventionForm />
      </CardHeader>
      <CardContent>
      {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>System ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Est. Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow key={intervention.id}>
                <TableCell className="font-medium">
                  {intervention.systemId}
                </TableCell>
                <TableCell>{intervention.type}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      intervention.status === 'Deployed' &&
                        'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
                      intervention.status === 'Simulated' &&
                        'border-primary/50 bg-primary/10 text-primary',
                      intervention.status === 'Proposed' &&
                        'border-accent/50 bg-accent/10 text-accent-foreground'
                    )}
                    variant="outline"
                  >
                    {intervention.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {intervention.estimatedImpact
                    ? `${intervention.estimatedImpact} tCO₂/day`
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
