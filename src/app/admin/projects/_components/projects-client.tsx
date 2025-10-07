'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { ProjectForm } from './project-form';
import { ProjectActions } from './project-actions';
import type { Project } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

type ProjectsClientProps = {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Create, edit, and delete case studies.</CardDescription>
            </div>
            <ProjectForm>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Project
              </Button>
            </ProjectForm>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map(project => (
                <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="max-w-sm truncate">{project.summary}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {project.technologies.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <ProjectActions project={project} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8" />
                    <h3 className="text-lg font-semibold">Could not load projects</h3>
                    <p className="text-sm">
                        Please ensure you have enabled the Firestore API and seeded the database.
                    </p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
