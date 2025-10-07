
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export function PathnameProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  return (
    <div className={cn("relative flex min-h-screen flex-col", { 'bg-grid-white/[0.05]': isLoginPage })}>
      {!isAdminPage && !isLoginPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminPage && !isLoginPage && <Footer />}
    </div>
  );
}
