'use client'

import { useState, useTransition, type ReactNode } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addService, updateService } from "@/lib/data"
import type { Service } from "@/lib/mock-data"
import { Loader, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const pricingPlanSchema = z.object({
  plan: z.string().min(1, "Plan name is required."),
  price: z.string().min(1, "Price is required."),
  features: z.string().min(1, "Enter at least one feature, separated by commas."),
});

const serviceFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  imageUrl: z.union([
      z.string().url("Please enter a valid URL."),
      z.instanceof(File).refine(file => file.size > 0, "Please upload a file.")
    ]),
  short_description: z.string().min(10, "Short description must be at least 10 characters long.").max(100, "Short description must be less than 100 characters."),
  long_description: z.string().min(20, "Long description must be at least 20 characters long."),
  featured: z.boolean().default(false),
  key_benefits: z.string().min(1, "Enter at least one benefit, separated by commas."),
  pricing: z.array(pricingPlanSchema).optional(),
})

type ServiceFormValues = z.infer<typeof serviceFormSchema>

type ServiceFormProps = {
  children: ReactNode
  service?: Service
}

export function ServiceForm({ children, service }: ServiceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title || "",
      imageUrl: service?.imageUrl || "https://placehold.co/600x400.png",
      short_description: service?.short_description || "",
      long_description: service?.long_description || "",
      featured: service?.featured || false,
      key_benefits: service?.key_benefits?.join(', ') || "",
      pricing: service?.pricing?.map(p => ({...p, features: p.features.join(', ')})) || [{plan: "", price: "", features: ""}],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pricing"
  });

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

  const onSubmit = (values: ServiceFormValues) => {
    startTransition(async () => {
        const processedValues = {
            ...values,
            key_benefits: values.key_benefits.split(',').map(item => item.trim()),
            pricing: values.pricing?.map(p => ({...p, features: p.features.split(',').map(f => f.trim())}))
        }
        
        let finalValues: any = { ...processedValues };

        if (values.imageUrl instanceof File) {
          const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
          });
          finalValues.imageUrl = await toBase64(values.imageUrl);
        }

        const result = service 
            ? await updateService(service.id, finalValues)
            : await addService(finalValues);

        if (result.success) {
            toast({
                title: service ? "Service Updated" : "Service Created",
                description: `The service "${values.title}" has been successfully ${service ? 'updated' : 'created'}.`,
            })
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
          <DialogTitle>{service ? 'Edit Service' : 'Create New Service'}</DialogTitle>
          <DialogDescription>
            {service ? 'Update the details of the service.' : 'Fill in the details for the new service.'}
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
                          <FormLabel>Service Title</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., Predictive Analytics" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="short_description"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                              <Textarea placeholder="A brief summary of the service." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="long_description"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Long Description</FormLabel>
                          <FormControl>
                              <Textarea placeholder="A detailed description of the service." className="min-h-[100px]" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                    control={form.control}
                    name="key_benefits"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Key Benefits</FormLabel>
                            <FormControl>
                                <Input placeholder="Benefit 1, Benefit 2, Benefit 3" {...field} />
                            </FormControl>
                             <FormDescription>
                                Enter key benefits separated by commas.
                            </FormDescription>
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
                <div>
                  <FormLabel>Pricing Plans</FormLabel>
                  <div className="space-y-4 mt-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-md relative space-y-2">
                         <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <FormField
                          control={form.control}
                          name={`pricing.${index}.plan`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Plan Name</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a plan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Professional">Professional</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`pricing.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                               <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a price" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="$20/month">$20/month</SelectItem>
                                  <SelectItem value="$50/month">$50/month</SelectItem>
                                  <SelectItem value="$100/month">$100/month</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`pricing.${index}.features`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Features</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Feature 1, Feature 2, Feature 3" />
                              </FormControl>
                              <FormDescription>
                                Enter features separated by commas.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ plan: "", price: "", features: "" })}
                    >
                      Add Pricing Plan
                    </Button>
                  </div>
                </div>

                  <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                  <FormLabel>Feature on Homepage</FormLabel>
                                  <FormDescription>
                                  Mark this service to display it on the homepage.
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
                  <DialogFooter className="pr-6">
                      <DialogClose asChild>
                          <Button type="button" variant="secondary" disabled={isPending}>
                              Cancel
                          </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isPending}>
                          {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                          {service ? 'Update Service' : 'Create Service'}
                      </Button>
                  </DialogFooter>
              </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
