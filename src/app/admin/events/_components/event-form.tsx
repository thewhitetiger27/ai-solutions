
'use client'

import { useState, useTransition, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { addEvent, updateEvent, addGalleryImage } from "@/lib/data"
import type { Event } from "@/lib/mock-data"
import { Loader } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"

const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  time: z.string().min(1, "Time is required."),
  imageUrl: z.union([
    z.string().url("Please enter a valid URL."),
    z.instanceof(File).refine(file => file.size > 0, "Please upload a file.")
  ]),
  is_past: z.boolean().default(false),
  promotional: z.boolean().default(false),
  addToGallery: z.boolean().default(false),
})

type EventFormValues = z.infer<typeof eventFormSchema>

type EventFormProps = {
  children: ReactNode
  event?: Event
}

export function EventForm({ children, event }: EventFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || "",
      location: event?.location || "",
      description: event?.description || "",
      date: event?.date || new Date().toISOString().split('T')[0],
      time: event?.time || "10:00 AM",
      imageUrl: event?.imageUrl || "https://picsum.photos/seed/5/600/400",
      is_past: event?.is_past || false,
      promotional: event?.promotional || false,
      addToGallery: false,
    },
  })

  const imageUrl = form.watch("imageUrl");
  const [previewUrl, setPreviewUrl] = useState<string | null>(typeof imageUrl === 'string' ? imageUrl : null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("imageUrl", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    form.setValue("imageUrl", url);
    setPreviewUrl(url);
  }

  const onSubmit = (values: EventFormValues) => {
    startTransition(async () => {
        let finalValues: any = { ...values };

        if (values.imageUrl instanceof File) {
          const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
          });
          finalValues.imageUrl = await toBase64(values.imageUrl);
        }

        const result = event 
            ? await updateEvent(event.id, finalValues)
            : await addEvent(finalValues);

        if (result.success) {
            toast({
                title: event ? "Event Updated" : "Event Created",
                description: `The event "${values.title}" has been successfully ${event ? 'updated' : 'created'}.`,
            })

            if (values.addToGallery) {
                const galleryImage = {
                    title: values.title,
                    caption: values.description.substring(0, 100),
                    imageUrl: finalValues.imageUrl,
                    category: 'Event' as const
                };
                const galleryResult = await addGalleryImage(galleryImage);
                if(galleryResult.success) {
                    toast({
                        title: "Added to Gallery",
                        description: `The event image has been added to the gallery.`
                    });
                } else {
                     toast({
                        variant: "destructive",
                        title: "Gallery Error",
                        description: galleryResult.message,
                    })
                }
            }

            setIsOpen(false);
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message,
            })
        }
    })
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {event ? 'Update the details of the event.' : 'Fill in the details for the new event.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-4">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-6">
                   <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., AI in Fintech Summit" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Event Time</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 10:00 AM" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>
                   <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                              <Textarea placeholder="A brief summary of the event." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <Tabs defaultValue="url">
                                    <TabsList>
                                        <TabsTrigger value="url">URL</TabsTrigger>
                                        <TabsTrigger value="upload">Upload</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="url">
                                        <FormControl>
                                          <Input 
                                            placeholder="https://example.com/image.png" 
                                            onChange={handleUrlChange}
                                            defaultValue={typeof imageUrl === 'string' ? imageUrl : ""}
                                          />
                                        </FormControl>
                                    </TabsContent>
                                    <TabsContent value="upload">
                                        <FormControl>
                                            <Input type="file" accept="image/*" onChange={handleFileChange} />
                                        </FormControl>
                                    </TabsContent>
                                </Tabs>
                                {previewUrl && (
                                  <div className="mt-4">
                                    <Image src={previewUrl} alt="Image preview" width={200} height={100} className="rounded-md object-cover"/>
                                  </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                  <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="is_past"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                <div className="space-y-0.5">
                                    <FormLabel>Past Event</FormLabel>
                                    <FormDescription>
                                    Mark this if the event has already occurred.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="promotional"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                <div className="space-y-0.5">
                                    <FormLabel>Promotional</FormLabel>
                                    <FormDescription>
                                    Mark this as a promotional event.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="addToGallery"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                                <div className="space-y-0.5">
                                    <FormLabel>Add to Gallery</FormLabel>
                                    <FormDescription>
                                        Add this event&apos;s image to the main gallery.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                  </div>


                  <DialogFooter className="pr-6">
                      <DialogClose asChild>
                          <Button type="button" variant="secondary" disabled={isPending}>
                              Cancel
                          </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isPending}>
                          {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          {event ? 'Update Event' : 'Create Event'}
                      </Button>
                  </DialogFooter>
              </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
