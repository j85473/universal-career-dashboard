import Dashboard from '@/components/Dashboard';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const settings = await prisma.userSettings.findUnique({ where: { id: "global" } });
  
  if (!settings || !settings.deepseekApiKey) {
    redirect('/setup');
  }

  return (
    <main>
      <Dashboard />
    </main>
  );
}
