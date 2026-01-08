import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const kpis = [
  { title: 'tCO₂ Captured/Day', value: '120', unit: 'tons/day', comparison: '111' },
  { title: 'Overall PPM Reduction', value: '8', unit: 'ppm', comparison: '8' },
  { title: 'Cost per tCO₂ Reduction', value: '$150', unit: '/ ton', comparison: 'High' },
  { title: 'Energy Use/Day', value: '33,500', unit: 'kW/H', comparison: '$10 / ton' },
];

export default function KpiSidebar() {
  return (
    <aside className="hidden w-80 flex-col gap-6 border-l bg-background p-4 lg:flex">
      <h2 className="font-headline text-lg font-semibold">
        Key Performance Indicators (KPI)
      </h2>
      <div className="flex flex-col gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="bg-card/50">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">{kpi.value} <span className="text-sm font-normal text-muted-foreground">{kpi.unit}</span></p>
                <p className="text-sm font-medium text-foreground">{kpi.comparison}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  );
}
