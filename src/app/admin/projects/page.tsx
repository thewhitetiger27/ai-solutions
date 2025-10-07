import { getProjects } from '@/lib/data';
import { ProjectsClient } from './_components/projects-client';

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  
  return <ProjectsClient projects={projects} />;
}
