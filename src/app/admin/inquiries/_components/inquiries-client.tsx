

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
import type { ContactSubmission } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, Mail, Loader, CheckCircle, EyeOff, Trash } from 'lucide-react';
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
import { updateContactSubmissionStatus, deleteContactSubmission } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type InquiriesClientProps = {
    initialSubmissions: ContactSubmission[];
}

export function InquiriesClient({ initialSubmissions }: InquiriesClientProps) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);


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

  const handleMarkAsRead = (submission: ContactSubmission) => {
    startTransition(async () => {
        const result = await updateContactSubmissionStatus(submission.id, true);
        if (result.success) {
            setSubmissions(current => current.map(s => s.id === submission.id ? {...s, read_status: true} : s))
            toast({ title: 'Marked as Read', description: `Inquiry from ${submission.name} has been updated.`});
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message});
        }
    })
  }
  
  const handleMarkAsUnread = (submission: ContactSubmission) => {
    startTransition(async () => {
        const result = await updateContactSubmissionStatus(submission.id, false);
        if (result.success) {
            setSubmissions(current => current.map(s => s.id === submission.id ? {...s, read_status: false} : s))
            toast({ title: 'Marked as Unread', description: `Inquiry from ${submission.name} has been updated.`});
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message});
        }
    })
  }

  const handleDelete = () => {
    if (!selectedSubmissionId) return;

    startTransition(async () => {
        const result = await deleteContactSubmission(selectedSubmissionId);
        if (result.success) {
            setSubmissions(current => current.filter(item => item.id !== selectedSubmissionId));
            toast({ title: 'Inquiry Deleted', description: 'The inquiry has been successfully deleted.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsDeleteDialogOpen(false);
        setSelectedSubmissionId(null);
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedSubmissionId(id);
    setIsDeleteDialogOpen(true);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedSubmission(null)}>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Card>
            <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Review and manage contact form submissions.</CardDescription>
            </CardHeader>
            <CardContent>
                {submissions.length > 0 ? (
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.map(submission => (
                        <TableRow key={submission.id} className={!submission.read_status ? 'font-bold' : ''}>
                            <TableCell>{submission.name}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{submission.company || 'N/A'}</TableCell>
                            <TableCell>{formatDateTime(submission.created_at)}</TableCell>
                            <TableCell>
                            <Badge variant={submission.read_status ? 'secondary' : 'default'}>
                                {submission.read_status ? 'Read' : 'New'}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                {isPending ? <Loader className="h-4 w-4 animate-spin inline-block" /> : (
                                <>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedSubmission(submission)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    {submission.read_status ? (
                                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsUnread(submission)}>
                                            <EyeOff className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(submission)}>
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(submission.id)}>
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
                            <h3 className="text-lg font-semibold">No Inquiries Yet</h3>
                            <p className="text-sm">
                                New contact form submissions will appear here.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        <DialogContent className="sm:max-w-xl">
            {selectedSubmission && (
                <>
                <DialogHeader>
                    <DialogTitle>Inquiry from {selectedSubmission.name}</DialogTitle>
                    <DialogDescription>
                        From: {selectedSubmission.email}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="font-semibold">Company:</div>
                        <div>{selectedSubmission.company}</div>
                        
                        <div className="font-semibold">Country:</div>
                        <div>{selectedSubmission.country}</div>

                        <div className="font-semibold">Job Title:</div>
                        <div>{selectedSubmission.jobTitle}</div>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Message:</h4>
                        <p className="text-muted-foreground bg-secondary p-4 rounded-md">{selectedSubmission.message}</p>
                    </div>
                </div>
                </>
            )}
        </DialogContent>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this inquiry.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedSubmissionId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
