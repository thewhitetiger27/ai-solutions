

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addArticle, updateArticle } from "@/lib/data"
import type { Article } from "@/lib/mock-data"
import { Loader } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"

const articleFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  author: z.string().min(2, "Author name is required."),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long.").max(200, "Excerpt must be less than 200 characters."),
  content: z.string().min(50, "Content must be at least 50 characters long."),
  imageUrl: z.union([
      z.string().url("Please enter a valid URL."),
      z.instanceof(File).refine(file => file.size > 0, "Please upload a file.")
    ]),
  published_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date.",
  }),
  featured: z.boolean().default(false),
})

type ArticleFormValues = z.infer<typeof articleFormSchema>

type ArticleFormProps = {
  children: ReactNode
  article?: Article
}

export function ArticleForm({ children, article }: ArticleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title || "",
      author: article?.author || "",
      excerpt: article?.excerpt || "",
      content: article?.content || "",
      imageUrl: article?.imageUrl || "https://placehold.co/600x300.png",
      published_date: article?.published_date || new Date().toISOString().split('T')[0],
      featured: article?.featured || false,
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

  const onSubmit = (values: ArticleFormValues) => {
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

        const result = article 
            ? await updateArticle(article.id, finalValues)
            : await addArticle(finalValues);

        if (result.success) {
            toast({
                title: article ? "Article Updated" : "Article Created",
                description: `The article "${values.title}" has been successfully ${article ? 'updated' : 'created'}.`,
            })
            setIsOpen(false);
            form.reset();
            setPreviewUrl(null);
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
          <DialogTitle>{article ? 'Edit Article' : 'Create New Article'}</DialogTitle>
          <DialogDescription>
            {article ? 'Update the details of the article.' : 'Fill in the details for the new article.'}
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
                          <FormLabel>Article Title</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., The Future of AI" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="published_date"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Published Date</FormLabel>
                          <FormControl>
                              <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                              <Textarea placeholder="A brief summary of the article." {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                              <Textarea placeholder="The full content of the article." className="min-h-[200px]" {...field} />
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
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Feature on Homepage</FormLabel>
                                <FormDescription>
                                Mark this article to display it on the homepage.
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
                          {article ? 'Update Article' : 'Create Article'}
                      </Button>
                  </DialogFooter>
              </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
