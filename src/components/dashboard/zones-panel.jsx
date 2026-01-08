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
import { AddZoneForm } from './add-zone-form';
import type { Zone } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type ZonesPanelProps = {
  zones: Zone[];
  isLoading: boolean;
};

export default function ZonesPanel({ zones, isLoading }: ZonesPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-lg">Zones</CardTitle>
        <AddZoneForm />
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Base Emissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{zone.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {zone.baseEmissions.toLocaleString()} tCO₂/day
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
