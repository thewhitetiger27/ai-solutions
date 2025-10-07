
"use client"

import * as React from "react"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import {
  Bot,
  LayoutDashboard,
  MessageSquareQuote,
  FileText,
  Lightbulb,
  GalleryThumbnails,
  Calendar,
  Mail,
  LogOut,
  Settings,
  Briefcase,
  Quote,
} from "lucide-react"

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

const adminNavLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
    { href: "/admin/feedback", label: "Feedback", icon: MessageSquareQuote },
    { href: "/admin/articles", label: "Articles", icon: FileText },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/services", label: "Services", icon: Lightbulb },
    { href: "/admin/quotes", label: "Services Quotes", icon: Quote },
    { href: "/admin/gallery", label: "Gallery", icon: GalleryThumbnails },
    { href: "/admin/events", label: "Events", icon: Calendar },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // This is a simple client-side auth check.
    // In a real app, this would be handled by a proper auth provider.
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      router.replace('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/login');
  };

  const currentPage = adminNavLinks.find(link => pathname.startsWith(link.href));
  const pageTitle = currentPage ? currentPage.label : 'Admin';

  React.useEffect(() => {
    document.title = `${pageTitle} | AI-Solutions Admin`;
  }, [pageTitle]);

  if (isAuthenticated === null) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <Bot className="w-7 h-7 text-primary" />
                <span className="text-lg font-headline font-semibold">Admin Panel</span>
              </div>
            </SidebarHeader>
            <SidebarMenu>
                {adminNavLinks.map(link => (
                    <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton asChild tooltip={link.label} isActive={pathname === link.href || (link.href !== "/admin/dashboard" && pathname.startsWith(link.href))}>
                          <Link href={link.href}>
                              <link.icon/>
                              <span>{link.label}</span>
                          </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline">
              {pageTitle}
            </h1>
          </header>
          <div className="p-4 md:p-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
