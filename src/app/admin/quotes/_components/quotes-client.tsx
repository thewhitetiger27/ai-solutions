
'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuoteRequest } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, Mail, Loader, CheckCircle, XCircle, RefreshCcw, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateQuoteRequestStatus, deleteQuoteRequest } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type QuotesClientProps = {
    initialRequests: QuoteRequest[];
}

export function QuotesClient({ initialRequests }: QuotesClientProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleStatusChange = (id: string, status: QuoteRequest['status']) => {
    startTransition(async () => {
        const result = await updateQuoteRequestStatus(id, status);
        if (result.success) {
            setRequests(current => current.map(s => s.id === id ? {...s, status } : s))
            toast({ title: 'Status Updated', description: `Quote request has been marked as ${status}.`});
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message});
        }
    })
  }

  const handleDelete = () => {
    if (!selectedQuoteId) return;

    startTransition(async () => {
        const result = await deleteQuoteRequest(selectedQuoteId);
        if (result.success) {
            setRequests(current => current.filter(item => item.id !== selectedQuoteId));
            toast({ title: 'Quote Request Deleted', description: 'The quote request has been successfully deleted.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsDeleteDialogOpen(false);
        setSelectedQuoteId(null);
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedQuoteId(id);
    setIsDeleteDialogOpen(true);
  }

  const getStatusBadgeVariant = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  }

  const getStatusIcon = (status: QuoteRequest['status']) => {
    switch (status) {
      case 'new': return <RefreshCcw className="h-4 w-4 mr-2" />;
      case 'contacted': return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'closed': return <XCircle className="h-4 w-4 mr-2" />;
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <Card>
                <CardHeader>
                    <CardTitle>Quote Requests</CardTitle>
                    <CardDescription>Review and manage service quote requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {requests.length > 0 ? (
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map(request => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">{request.serviceTitle}</TableCell>
                                <TableCell>{request.fullName}</TableCell>
                                <TableCell>{request.selectedPlan}</TableCell>
                                <TableCell>{formatDateTime(request.createdAt)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(request.status)}>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-1">
                                    {isPending ? <Loader className="h-4 w-4 animate-spin inline-block" /> : (
                                    <>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(request)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                {getStatusIcon(request.status)}
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'new')}>
                                                    <RefreshCcw className="mr-2 h-4 w-4" /> Mark as New
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'contacted')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Contacted
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(request.id, 'closed')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Mark as Closed
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(request.id)}>
                                              <Trash className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                    </>
                                    )}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-10 border-dashed border-2 rounded-lg">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Mail className="w-8 h-8" />
                                <h3 className="text-lg font-semibold">No Quote Requests Yet</h3>
                                <p className="text-sm">
                                    New quote requests will appear here.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DialogContent className="sm:max-w-xl">
                {selectedRequest && (
                    <>
                    <DialogHeader>
                        <DialogTitle>Quote for: {selectedRequest.serviceTitle}</DialogTitle>
                        <DialogDescription>
                            From: {selectedRequest.fullName} ({selectedRequest.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-sm">
                        <div className="font-semibold">Selected Plan: <Badge>{selectedRequest.selectedPlan}</Badge></div>
                        <div>
                            <h4 className="font-semibold mb-2">Message:</h4>
                            <p className="text-muted-foreground bg-secondary p-4 rounded-md">{selectedRequest.message}</p>
                        </div>
                    </div>
                    </>
                )}
            </DialogContent>

             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this quote request.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedQuoteId(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </Dialog>
  );
}
