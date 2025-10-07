import { getEvents } from '@/lib/data';
import { EventsClient } from './_components/events-client';

export default async function AdminEventsPage() {
  const events = await getEvents();
  return <EventsClient events={events} />;
}
