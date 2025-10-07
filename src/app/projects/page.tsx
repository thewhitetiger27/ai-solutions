
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/data";
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Discover how our innovative AI solutions have driven success for our clients.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Projects</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Discover how our innovative AI solutions have driven success for our clients.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
            <Card key={project.id} className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 w-full">
              <Link href={`/projects/${project.id}`} aria-label={`View details for ${project.title}`}>
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={600}
                  height={400}
                  className="w-full h-56 object-cover"
                  data-ai-hint="technology abstract"
                />
              </Link>
              <CardHeader>
                <CardTitle className="font-headline">
                   <Link href={`/projects/${project.id}`}>
                    {project.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{project.summary}</p>
              </CardContent>
              <CardFooter className="flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
