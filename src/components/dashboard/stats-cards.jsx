import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingDown, TrendingUp, Zap } from 'lucide-react';

const stats = [
  {
    title: 'Total CO₂ Captured',
    value: '47 tCO₂/day',
    change: '+2.1%',
    icon: Target,
    changeType: 'increase',
  },
  {
    title: 'Avg. PPM Reduction',
    value: '10.5 PPM',
    change: '+5.3%',
    icon: TrendingDown,
    changeType: 'increase',
  },
  {
    title: 'Energy Consumption',
    value: '13.6 MWh',
    change: '+1.2%',
    icon: Zap,
    changeType: 'decrease',
  },
  {
    title: 'Avg. Cost per Ton',
    value: '$312.50',
    change: '-3.4%',
    icon: TrendingUp,
    changeType: 'decrease',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const ChangeIcon =
          stat.changeType === 'increase' ? TrendingUp : TrendingDown;
        const changeColor =
          stat.changeType === 'increase'
            ? 'text-emerald-500'
            : 'text-red-500';

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="flex items-center text-xs text-muted-foreground">
                <ChangeIcon
                  className={`mr-1 h-3 w-3 ${changeColor}`}
                  aria-hidden="true"
                />
                <span className={changeColor}>{stat.change}</span> vs. last
                month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
