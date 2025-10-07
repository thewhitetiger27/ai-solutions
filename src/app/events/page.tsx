import { getEvents } from "@/lib/data";
import { EventsClient } from "./_components/events-client";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Join us at upcoming events or catch up on our past engagements.',
};

export default async function EventsPage() {
    const events = await getEvents();
    return <EventsClient events={events} />;
}
