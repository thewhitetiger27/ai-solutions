
import { getProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projects = await getProjects();
  const project = projects.find(p => p.id === params.id);
 
  if (!project) {
    return {
      title: 'Project Not Found'
    }
  }

  return {
    title: project.title,
    description: project.summary,
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const projects = await getProjects();
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/projects">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Projects
                </Link>
            </Button>
        </div>
        <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">{project.title}</h1>
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="prose prose-invert prose-lg max-w-none mx-auto text-foreground/90">
                <p>{project.summary}</p>
            </div>
            <div className="mt-8">
                <h3 className="font-headline text-2xl font-bold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">{tech}</Badge>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
