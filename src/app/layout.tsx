
import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { PathnameProvider } from '@/components/layout/pathname-provider';

export const metadata: Metadata = {
  title: {
    default: 'AI-Solutions - Innovate with Intelligent Automation',
    template: '%s | AI-Solutions',
  },
  description: 'We build cutting-edge AI solutions that drive growth, efficiency, and transformation for businesses worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-body antialiased",
        )}
      >
        <PathnameProvider>
          {children}
        </PathnameProvider>
        <Toaster />
      </body>
    </html>
  );
}
