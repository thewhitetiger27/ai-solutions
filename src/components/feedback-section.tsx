"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Feedback } from '@/lib/mock-data';
import { MessageSquareQuote, Star } from 'lucide-react';
import { addTestimonial } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  company: z.string().min(2, { message: 'Company is required.' }),
  role: z.string().min(2, { message: 'Your role is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  rating: z.number().min(1, { message: 'Please provide a rating.' }).max(5),
});

type FeedbackFormData = z.infer<typeof formSchema>;

type FeedbackSectionProps = {
    testimonials: Feedback[];
    approvedTestimonials: Feedback[];
}

const StarRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-6 h-6 cursor-pointer transition-colors',
            star <= value ? 'text-primary fill-primary' : 'text-muted-foreground/50'
          )}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
};


export function FeedbackSection({ testimonials, approvedTestimonials }: FeedbackSectionProps) {
  const { toast } = useToast();
  // The pending feedback state is kept for optimistic UI updates, but is no longer displayed.
  const [pendingFeedback, setPendingFeedback] = useState<Feedback[]>(testimonials.filter(t => t.status === 'pending'));

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', company: '', role: '', message: '', rating: 0 },
  });

  async function onSubmit(values: FeedbackFormData) {
    const newFeedback: Omit<Feedback, 'id' | 'status'> = {
      ...values,
    };
    
    const result = await addTestimonial(newFeedback);

    if (result.success) {
      toast({
        title: 'Feedback Submitted!',
        description: 'Thank you! Your feedback is pending and will be reviewed by our team.',
      });
      // Optimistically update the UI state
      setPendingFeedback(prev => [...prev, { ...newFeedback, id: result.id, status: 'pending' }]);
      form.reset();
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.message,
       })
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Leave a Review</CardTitle>
              <CardDescription>Share your experience with our services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <StarRating value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Innovate Corp" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem><FormLabel>Your Role</FormLabel><FormControl><Input placeholder="CEO" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Tell us about your experience..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full !mt-6 bg-primary text-primary-foreground hover:bg-primary/90">Submit Feedback</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <h2 className="font-headline text-2xl font-bold mb-4">Testimonials</h2>
           <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-4">
                {approvedTestimonials.length > 0 ? (
                    approvedTestimonials.map(testimonial => (
                        <Card key={testimonial.id}>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex flex-row items-center gap-4">
                                <MessageSquareQuote className="w-10 h-10 text-primary" />
                                <div>
                                    <p className="font-bold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                                </div>
                            </div>
                            {testimonial.rating && (
                                <div className="flex items-center gap-0.5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                                    ))}
                                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                                        <Star key={i + testimonial.rating!} className="w-4 h-4 text-muted-foreground/30" />
                                    ))}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground italic">"{testimonial.message}"</p>
                        </CardContent>
                        </Card>
                    ))
                ) : (
                <div className="text-center py-10 border-dashed border-2 rounded-lg">
                    <p className="text-muted-foreground">No testimonials yet. Be the first to leave one!</p>
                </div>
                )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
