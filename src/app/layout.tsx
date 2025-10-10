
'use client';

import './globals.css';
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { FirebaseClientProvider } from '@/lib/firebase-client-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import Chatbot from '@/components/chatbot';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <title>AI-Solutions - Innovate with Intelligent Automation</title>
        <meta name="description" content="We build cutting-edge AI solutions that drive growth, efficiency, and transformation for businesses worldwide." />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-body antialiased",
          { 'bg-grid-white/[0.05]': isLoginPage }
        )}
      >
        <FirebaseClientProvider>
          <div className="relative flex min-h-screen flex-col">
            {!isAdminPage && !isLoginPage && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdminPage && !isLoginPage && <Footer />}
            {!isAdminPage && !isLoginPage && <Chatbot />}
          </div>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
