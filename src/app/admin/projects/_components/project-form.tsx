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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { addProject, updateProject } from "@/lib/data"
import type { Project } from "@/lib/mock-data"
import { Loader } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

const projectFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
  imageUrl: z.union([
      z.string().url("Please enter a valid URL."),
      z.instanceof(File).refine(file => file.size > 0, "Please upload a file.")
    ]),
  technologies: z.string().min(1, "Please enter at least one technology."),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

type ProjectFormProps = {
  children: ReactNode
  project?: Project
}

export function ProjectForm({ children, project }: ProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || "",
      summary: project?.summary || "",
      imageUrl: project?.imageUrl || "https://placehold.co/600x400.png",
      technologies: project?.technologies.join(", ") || "",
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

  const onSubmit = (values: ProjectFormValues) => {
    startTransition(async () => {
        let finalValues: any = {
            ...values,
            technologies: values.technologies.split(',').map(tech => tech.trim()),
        };

        if (values.imageUrl instanceof File) {
          const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
          });
          finalValues.imageUrl = await toBase64(values.imageUrl);
        }

        const result = project 
            ? await updateProject(project.id, finalValues)
            : await addProject(finalValues);

        if (result.success) {
            toast({
                title: project ? "Project Updated" : "Project Created",
                description: `The project "${values.title}" has been successfully ${project ? 'updated' : 'created'}.`,
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
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update the details of the project.' : 'Fill in the details for the new project.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., E-commerce Recommendation Engine" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                            <Textarea placeholder="A brief summary of the project and its impact." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Technologies</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Python, TensorFlow, React" {...field} />
                        </FormControl>
                         <p className="text-sm text-muted-foreground">Enter technologies separated by a comma.</p>
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

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
