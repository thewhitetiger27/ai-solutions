

'use client';

import { useState, useTransition } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Check, X, Loader, AlertTriangle, Trash, Star } from 'lucide-react';
import type { Feedback } from '@/lib/mock-data';
import { updateTestimonialStatus, deleteTestimonial, updateTestimonialFeaturedStatus } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
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

type FeedbackClientProps = {
    initialFeedback: Feedback[];
}

export function FeedbackClient({ initialFeedback }: FeedbackClientProps) {
  const [feedbackItems, setFeedbackItems] = useState(initialFeedback);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

  const handleStatusChange = (id: string, status: 'approved' | 'rejected') => {
    startTransition(async () => {
        const result = await updateTestimonialStatus(id, status);
        if(result.success) {
            setFeedbackItems(current =>
                current.map(item => (item.id === id ? { ...item, status } : item))
            );
            toast({
                title: 'Status Updated',
                description: `The testimonial has been ${status}.`
            })
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.message
            })
        }
    });
  };

  const handleFeaturedChange = (id: string, featured: boolean) => {
    startTransition(async () => {
      const result = await updateTestimonialFeaturedStatus(id, featured);
      if (result.success) {
        setFeedbackItems(current =>
          current.map(item => (item.id === id ? { ...item, featured } : item))
        );
        toast({
          title: 'Featured Status Updated',
          description: `Testimonial has been ${featured ? 'featured' : 'unfeatured'}.`
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message
        });
      }
    });
  };

  const handleDelete = () => {
    if (!selectedFeedbackId) return;

    startTransition(async () => {
        const result = await deleteTestimonial(selectedFeedbackId);
        if (result.success) {
            setFeedbackItems(current => current.filter(item => item.id !== selectedFeedbackId));
            toast({ title: 'Feedback Deleted', description: 'The feedback has been successfully deleted.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        setIsDeleteDialogOpen(false);
        setSelectedFeedbackId(null);
    });
  };

  const openDeleteDialog = (id: string) => {
    setSelectedFeedbackId(id);
    setIsDeleteDialogOpen(true);
  }

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>Approve or reject testimonials submitted by users.</CardDescription>
        </CardHeader>
        <CardContent>
          {feedbackItems.length > 0 ? (
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="max-w-xs">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                  {feedbackItems.map(item => (
                  <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.company}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.message}</TableCell>
                      <TableCell>
                      <Badge
                          variant={
                          item.status === 'approved'
                              ? 'default'
                              : item.status === 'rejected'
                              ? 'destructive'
                              : 'secondary'
                          }
                      >
                          {item.status}
                      </Badge>
                      </TableCell>
                       <TableCell>
                        {item.status === 'approved' && (
                           <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleFeaturedChange(item.id, !item.featured)}
                            disabled={isPending}
                            className={item.featured ? "text-primary" : ""}
                          >
                            <Star className={`h-4 w-4 ${item.featured ? 'fill-current' : ''}`} />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                          {isPending ? (
                              <Loader className="h-4 w-4 animate-spin inline-block" />
                          ) : (
                              <>
                                  {item.status !== 'approved' && (
                                      <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-green-500 hover:text-green-400"
                                      onClick={() => handleStatusChange(item.id, 'approved')}
                                      disabled={isPending}
                                      >
                                      <Check className="h-4 w-4" />
                                      </Button>
                                  )}
                                  {item.status !== 'rejected' && (
                                      <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-500 hover:text-red-400"
                                      onClick={() => handleStatusChange(item.id, 'rejected')}
                                      disabled={isPending}
                                      >
                                      <X className="h-4 w-4" />
                                      </Button>
                                  )}
                                  <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => openDeleteDialog(item.id)}>
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
                      <AlertTriangle className="w-8 h-8" />
                      <h3 className="text-lg font-semibold">No Feedback Found</h3>
                      <p className="text-sm">
                          There are no testimonials to moderate. New submissions will appear here.
                      </p>
                  </div>
              </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the feedback.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedFeedbackId(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                    {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>

    </AlertDialog>
  );
}
