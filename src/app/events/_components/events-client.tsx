"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import type { Event } from "@/lib/mock-data";

type EventsClientProps = {
    events: Event[];
}

export function EventsClient({ events }: EventsClientProps) {
  const promotionalEvent = events.find((e) => e.promotional && !e.is_past);
  const upcomingEvents = events.filter((e) => !e.is_past && !e.promotional);
  const pastEvents = events.filter((e) => e.is_past);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold tracking-tight">
          Events
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join us at upcoming events or catch up on our past engagements.
        </p>
      </div>

      <div className="space-y-16">
        {/* Featured Event */}
        {promotionalEvent && (
          <div>
            <h2 className="font-headline text-3xl font-bold mb-6 text-center text-primary">
              Featured Event
            </h2>
             <Card className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border-primary shadow-2xl shadow-primary/10">
              <Image
                src={promotionalEvent.imageUrl}
                alt={promotionalEvent.title}
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    {promotionalEvent.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{promotionalEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{promotionalEvent.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    {promotionalEvent.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/events/${promotionalEvent.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </div>
        )}

        {/* Upcoming Events */}
        <div>
          <h2 className="font-headline text-3xl font-bold mb-6">
            Upcoming Events
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id}>
                  <Card className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      width={600}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="font-headline line-clamp-2">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">
                        {event.description}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" asChild>
                        <Link href={`/events/${event.id}`}>View More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No upcoming events scheduled. Check back soon!
            </p>
          )}
        </div>

        <Separator />

        {/* Past Events */}
        <div>
          <h2 className="font-headline text-3xl font-bold mb-6">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id}>
                <Card
                  className="h-full flex flex-col overflow-hidden opacity-80 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="font-headline line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">
                      {event.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" asChild>
                      <Link href={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
