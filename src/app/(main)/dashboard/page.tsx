'use client';
import { GamificationCard } from '@/components/dashboard/gamification-card';
import { ProgressCard } from '@/components/dashboard/progress-card';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import {
  BookCheck,
  Trophy,
  Flame,
  Target,
  Medal,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          {t('dashboard.welcome')}, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.class')} {user?.class}
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-semibold font-headline">
          {t('dashboard.progress.title')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProgressCard
            title={t('dashboard.completed_topics')}
            value="12"
            total="58"
            icon={BookCheck}
          />
          <ProgressCard
            title={t('dashboard.avg_score')}
            value="82%"
            icon={Target}
          />
          <ProgressCard
            title={t('dashboard.mastered_topics')}
            value="8"
            icon={TrendingUp}
          />
          <ProgressCard
            title={t('dashboard.weak_topics')}
            value="3"
            icon={TrendingUp}
            iconClassName="text-destructive"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold font-headline">
          {t('dashboard.gamification.title')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <GamificationCard
            title={t('dashboard.points')}
            value="1,250"
            icon={Trophy}
          />
          <GamificationCard
            title={t('dashboard.badges')}
            value="5"
            icon={Medal}
          />
          <GamificationCard
            title={t('dashboard.streak')}
            value={`14 ${t('dashboard.days')}`}
            icon={Flame}
          />
        </div>
      </section>
    </div>
  );
}
