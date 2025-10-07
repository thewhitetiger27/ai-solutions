import { getServices } from '@/lib/data';
import { ServicesClient } from './_components/services-client';

export default async function AdminServicesPage() {
  const services = await getServices();
  
  return <ServicesClient services={services} />;
}
