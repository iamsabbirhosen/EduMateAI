import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface ProgressCardProps {
  title: string;
  value: string;
  total?: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function ProgressCard({
  title,
  value,
  total,
  icon: Icon,
  iconClassName,
}: ProgressCardProps) {
  const progressValue = total
    ? (parseInt(value) / parseInt(total)) * 100
    : undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn('h-4 w-4 text-muted-foreground', iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
          {total && (
            <span className="text-sm font-normal text-muted-foreground">
              /{total}
            </span>
          )}
        </div>
        {progressValue !== undefined && (
          <div className="mt-2">
            <Progress value={progressValue} aria-label={`${title} progress`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
