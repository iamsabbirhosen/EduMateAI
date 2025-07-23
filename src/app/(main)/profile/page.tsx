'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { User, Edit } from 'lucide-react';
import { ProgressCard } from '@/components/dashboard/progress-card';
import { GamificationCard } from '@/components/dashboard/gamification-card';
import { BookCheck, Target, TrendingUp, Trophy, Medal, Flame } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('profile.title')}</h1>
        <p className="text-muted-foreground">{t('profile.subtitle')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('profile.info.title')}</CardTitle>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold">{t('profile.info.class')}: </span>
                  <span className="text-muted-foreground">{user.class}</span>
                </div>
                <div>
                  <span className="font-semibold">{t('profile.info.role')}: </span>
                  <span className="text-muted-foreground capitalize">{user.role}</span>
                </div>
                 <div>
                  <span className="font-semibold">{t('login.language')}: </span>
                  <span className="text-muted-foreground capitalize">{user.language}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.stats.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="mb-4 text-lg font-semibold font-headline text-primary">
                  {t('dashboard.progress.title')}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
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
                <h3 className="mb-4 text-lg font-semibold font-headline text-primary">
                  {t('dashboard.gamification.title')}
                </h3>
                <div className="grid gap-4 sm:grid-cols-3">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
