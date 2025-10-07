
'use client';

import {
  Activity,
  ArrowUpRight,
  BookText,
  Briefcase,
  Lightbulb,
  Mail,
  MessageSquareQuote,
  PlusCircle,
  Users,
  Quote,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InquiriesChart } from './inquiries-chart';
import type { ContactSubmission, Feedback } from '@/lib/mock-data';
import Link from 'next/link';

type DashboardClientProps = {
  stats: {
    pendingFeedback: number;
    totalArticles: number;
    totalServices: number;
    newInquiries: number;
    totalProjects: number;
    newQuotes: number;
  };
  recentInquiries: ContactSubmission[];
  inquiryStats: { date: string; day: string; inquiries: number }[];
};

export function DashboardClient({
  stats,
  recentInquiries,
  inquiryStats,
}: DashboardClientProps) {
  const statCards = [
    {
      title: 'New Inquiries',
      value: stats.newInquiries,
      icon: Mail,
      trend: '+12%',
      trendColor: 'text-green-500',
    },
    {
      title: 'New Quotes',
      value: stats.newQuotes,
      icon: Quote,
      trend: '+3',
      trendColor: 'text-green-500',
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingFeedback,
      icon: MessageSquareQuote,
      trend: '+5',
      trendColor: 'text-yellow-500',
    },
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: BookText,
      trend: '+2',
      trendColor: 'text-green-500',
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: Briefcase,
      trend: '+1',
      trendColor: 'text-green-500',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trendColor}>{stat.trend}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>
                Showing contact form submissions for the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InquiriesChart data={inquiryStats} />
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Jump directly to common tasks.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button asChild variant="outline">
                  <Link href="/admin/articles">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Article
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/projects">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Project
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/services">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Service
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/events">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
