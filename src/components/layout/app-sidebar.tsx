'use client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/hooks/use-translation';
import { Book, BookOpenCheck, Home, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('sidebar.dashboard') },
    { href: '/subjects', icon: Book, label: t('sidebar.subjects') },
    { href: '/profile', icon: User, label: t('sidebar.profile') },
  ];

  return (
    <aside className="hidden border-r bg-background sm:flex">
      <nav className="flex h-full flex-col gap-4 sm:py-4">
        <div className="flex h-14 items-center justify-center border-b px-4 lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            <span>EduMate</span>
          </Link>
        </div>

        <TooltipProvider>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                        pathname === item.href && 'bg-muted text-primary',
                        item.disabled && 'pointer-events-none opacity-50'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        </TooltipProvider>

        <div className="mt-auto flex flex-col items-center gap-4 p-4">
          <div className="text-center">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </nav>
    </aside>
  );
}
