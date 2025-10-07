
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Loader } from 'lucide-react';
import { useTransition } from 'react';
import { addContactSubmission } from '@/lib/data';
import type { Metadata } from 'next';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  country: z.string().min(2, { message: 'Country is required.' }),
  company: z.string().min(2, { message: 'Company is required.' }),
  jobTitle: z.string().min(2, { message: 'Job title is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      company: '',
      jobTitle: '',
      message: '',
    },
  });

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      const result = await addContactSubmission(values);
      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: 'Thank you for contacting us. We will get back to you shortly.',
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

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Contact Us</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Have a project in mind or just want to say hello? We'd love to hear from you.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-headline text-3xl font-bold mb-6">Get in Touch</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="e.g., USA" {...field} disabled={isPending} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl><Input placeholder="Your Company Inc." {...field} disabled={isPending} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl><Input placeholder="e.g., Project Manager" {...field} disabled={isPending} /></FormControl>
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
                    <FormControl><Textarea placeholder="Tell us about your project or inquiry..." className="min-h-[120px]" {...field} disabled={isPending} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" size="lg" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-6">
            <h2 className="font-headline text-3xl font-bold">Contact Information</h2>
            <p className="text-muted-foreground">
                You can also reach us through the following channels. Our team is available from 9 AM to 5 PM, Monday to Friday.
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>Our Office</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 mt-1 text-primary" />
                        <span>123 AI Avenue, Innovation City, Techland 12345</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-primary" />
                        <span>+1 (555) 808-AI-AI</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-primary" />
                        <span>contact@aisolutions.com</span>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
