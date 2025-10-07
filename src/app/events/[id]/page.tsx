
import { getEvents } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const events = await getEvents();
  const event = events.find(e => e.id === params.id);
 
  if (!event) {
    return {
      title: 'Event Not Found'
    }
  }

  return {
    title: event.title,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const events = await getEvents();
  const event = events.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/events">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="md:col-span-2">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                    <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover"
                        data-ai-hint="conference event"
                    />
                </div>
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">{event.title}</h1>
                <p className="text-lg text-muted-foreground mt-4">{event.description}</p>
            </div>
            <div className="md:col-span-1">
                <Card className="sticky top-24">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Date</h3>
                                <p className="text-muted-foreground">{event.date}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Time</h3>
                                <p className="text-muted-foreground">{event.time}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <div>
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-muted-foreground">{event.location}</p>
                            </div>
                        </div>
                        {!event.is_past && (
                            <Button asChild className="w-full mt-4" size="lg">
                                <Link href="/contact">
                                    Register or Inquire <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
