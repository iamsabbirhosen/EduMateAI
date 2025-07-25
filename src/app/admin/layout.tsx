import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - EduMate AI',
  description: 'Administration panel for EduMate AI curriculum management',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
