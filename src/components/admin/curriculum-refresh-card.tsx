'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCurriculumContext } from '@/context/CurriculumContext';
import { useTranslation } from '@/hooks/use-translation';

export function CurriculumRefreshCard() {
  const [refreshing, setRefreshing] = useState(false);
  const { refetch } = useCurriculumContext();
  const { t } = useTranslation();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      // Optionally show a success message
    } catch (error) {
      console.error('Error refreshing curriculum:', error);
      // Optionally show an error message
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          {t('system.curriculum.title')}
        </CardTitle>
        <CardDescription>
          {t('system.curriculum.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="w-full"
        >
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              {t('system.curriculum.refreshing')}
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('system.curriculum.refresh')}
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          {t('system.curriculum.note')}
        </p>
      </CardContent>
    </Card>
  );
}
