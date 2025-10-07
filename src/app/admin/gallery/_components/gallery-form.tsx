'use client';

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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addGalleryImage, updateGalleryImage } from "@/lib/data"
import { Loader } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import type { GalleryImage } from "@/lib/mock-data"

const galleryFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  caption: z.string().min(3, "Caption is required.").max(100, "Caption must be less than 100 characters."),
  // keep the original single-image schema so we don't break other code paths
  imageUrl: z.union([
    z.string().url("Please enter a valid URL."),
    z.instanceof(File).optional(),
  ]),
  category: z.string().min(1, "A category is required."),
})

type GalleryFormValues = z.infer<typeof galleryFormSchema>

type GalleryFormProps = {
  children?: ReactNode;
  image?: GalleryImage;
}

export function GalleryForm({ children, image }: GalleryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      title: image?.title || "",
      caption: image?.caption || "",
      imageUrl: image?.imageUrl || "https://placehold.co/600x400.png",
      category: image?.category || "Tech Conferences",
    },
  })

  const imageUrl = form.watch("imageUrl");

  // ★ NEW: allow multiple file and URL selection without changing the schema
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])       // ★
  const [urlList, setUrlList] = useState<string[]>([])                 // ★
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    typeof imageUrl === 'string' && image ? [imageUrl] : []
  ) // ★

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []); // ★ grab all files
    if (files.length) {
      setSelectedFiles(files);                      // ★ track all
      form.setValue("imageUrl", files[0]);          // keep schema happy
      Promise.all(files.map(f => toBase64(f))).then((urls) => {
        setPreviewUrls(urls);                       // ★ preview all
      });
    }
  };

  // Accept multiple URLs (newline or comma separated)
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { // ★
    const raw = e.target.value;
    // split by newline or comma, trim empties
    const urls = raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean); // ★
    setUrlList(urls);                                                    // ★
    if (urls.length) {
      form.setValue("imageUrl", urls[0]); // keep schema valid
      setPreviewUrls(urls);               // ★ preview all
    } else {
      setPreviewUrls([]);
    }
  }

  const onSubmit = (values: GalleryFormValues) => {
    startTransition(async () => {
      if (image) {
        // EDIT MODE: still single update (unchanged behavior)
        let finalValues: any = { ...values };
        if (values.imageUrl instanceof File) {
          finalValues.imageUrl = await toBase64(values.imageUrl);
        }
        const result = await updateGalleryImage(image.id, finalValues);

        if (result.success) {
          toast({
            title: "Image Updated",
            description: `The image "${values.title}" has been successfully updated.`,
          })
          setIsOpen(false);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message,
          })
        }
        return;
      }

      // CREATE MODE: upload ALL selected files and/or ALL URLs  ★
      const results: { ok: boolean; msg?: string }[] = [];

      // If multiple files selected, upload all
      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          const base64 = await toBase64(selectedFiles[i]);
          const titleSuffix = selectedFiles.length > 1 ? ` (${i + 1})` : "";
          const payload = {
            ...values,
            title: values.title + titleSuffix, // keep titles unique-ish ★
            imageUrl: base64,
          };
          const r = await addGalleryImage(payload);
          results.push({ ok: !!r?.success, msg: r?.message });
        }
      }

      // If multiple URLs provided, upload all
      if (urlList.length > 0) {
        for (let i = 0; i < urlList.length; i++) {
          const titleSuffix = urlList.length > 1 ? ` (${i + 1})` : "";
          const payload = {
            ...values,
            title: values.title + titleSuffix, // ★
            imageUrl: urlList[i],
          };
          const r = await addGalleryImage(payload);
          results.push({ ok: !!r?.success, msg: r?.message });
        }
      }

      // If neither multi-files nor multi-urls were used, fall back to the original single upload
      if (selectedFiles.length === 0 && urlList.length === 0) {
        let finalValues: any = { ...values };
        if (values.imageUrl instanceof File) {
          finalValues.imageUrl = await toBase64(values.imageUrl);
        }
        const r = await addGalleryImage(finalValues);
        results.push({ ok: !!r?.success, msg: r?.message });
      }

      const successCount = results.filter(r => r.ok).length;
      const failCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: successCount > 1 ? "Images Uploaded" : "Image Uploaded",
          description: `${successCount} item(s) uploaded successfully.${failCount ? ` ${failCount} failed.` : ""}`,
        })
        setIsOpen(false);
        form.reset();
        setSelectedFiles([]);      // ★
        setUrlList([]);            // ★
        setPreviewUrls([]);        // ★
      }

      if (failCount > 0) {
        toast({
          variant: "destructive",
          title: "Some uploads failed",
          description: "One or more items could not be uploaded.",
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{image ? 'Edit Image' : 'Upload New Image'}</DialogTitle>
          <DialogDescription>
            {image ? 'Update the details for this image.' : 'Fill in the details for the new gallery image(s).'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Team at AI Conf 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tech Conferences">Tech Conferences</SelectItem>
                      <SelectItem value="Client Meetups">Client Meetups</SelectItem>
                      <SelectItem value="Product Launches">Product Launches</SelectItem>
                      <SelectItem value="Workshops & Training">Workshops &amp; Training</SelectItem>
                      <SelectItem value="Award & Recognition">Award &amp; Recognition</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A short description for the image." {...field} />
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
                  <Tabs defaultValue={image ? "url" : "url"}>
                    <TabsList>
                      <TabsTrigger value="url">URL(s)</TabsTrigger>
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>

                    {/* ★ URLs: allow multiple via textarea (newline/comma separated) */}
                    <TabsContent value="url">
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder={`https://example.com/one.png\nhttps://example.com/two.jpg`}
                          onChange={handleUrlChange}
                          defaultValue={typeof imageUrl === 'string' ? imageUrl : ""}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can paste multiple URLs separated by new lines or commas.
                      </p>
                    </TabsContent>

                    {/* ★ Files: enable multiple selection */}
                    <TabsContent value="upload">
                      <FormControl>
                        <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can select multiple files.
                      </p>
                    </TabsContent>
                  </Tabs>

                  {/* ★ Preview ALL selected URLs/files (no limit) */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {previewUrls.map((src, idx) => (
                        <div key={idx} className="relative w-full aspect-video overflow-hidden rounded-md">
                          <Image
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {image ? 'Update Image' : 'Upload'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
