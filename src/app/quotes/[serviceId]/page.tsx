'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, ArrowLeft } from 'lucide-react';
import { getServices } from '@/lib/data';
import { addQuoteRequest } from '@/lib/data';
import { type Service } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  selectedPlan: z.string().min(1, { message: 'Please select a pricing plan.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type QuoteFormValues = z.infer<typeof formSchema>;

export default function QuotePage({ params }: { params: { serviceId: string } }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchService() {
      try {
        const allServices = await getServices();
        const currentService = allServices.find(s => s.id === params.serviceId);
        setService(currentService || null);
      } catch (error) {
        console.error("Failed to fetch service", error);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [params.serviceId]);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      selectedPlan: '',
      message: '',
    },
  });

  function onSubmit(values: QuoteFormValues) {
    if (!service) return;

    startTransition(async () => {
      const result = await addQuoteRequest({
        ...values,
        serviceId: service.id,
        serviceTitle: service.title,
      });
      if (result.success) {
        toast({
          title: 'Quote Request Sent!',
          description: 'Thank you for your interest. We will get back to you shortly.',
        });
        form.reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <p className="text-muted-foreground">The service you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </Button>
        </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Request a Quote</CardTitle>
            <CardDescription>
              Interested in our "{service.title}" service? Fill out the form below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} disabled={isPending} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="john.doe@example.com" {...field} disabled={isPending} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="selectedPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {service.pricing.map(plan => (
                            <SelectItem key={plan.plan} value={plan.plan}>
                              {plan.plan} - {plan.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl><Textarea placeholder="Tell us more about your requirements..." className="min-h-[120px]" {...field} disabled={isPending} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" size="lg" disabled={isPending}>
                  {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Request
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}