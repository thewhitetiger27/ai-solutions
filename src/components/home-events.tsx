
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import type { Event } from "@/lib/mock-data";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type HomeEventsProps = {
    events: Event[];
}

export function HomeEvents({ events }: HomeEventsProps) {
    const upcomingEvents = events
        .filter(e => !e.is_past)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (upcomingEvents.length === 0) {
        return null;
    }

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tight">Upcoming Events</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                        Join us at our next event and connect with our team.
                    </p>
                </div>
                 <Carousel opts={{ align: "start", loop: upcomingEvents.length > 3 }} className="w-full">
                    <CarouselContent>
                        {upcomingEvents.map((event) => (
                           <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <Card className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                        <Image
                                            src={event.imageUrl}
                                            alt={event.title}
                                            width={600}
                                            height={300}
                                            className="w-full h-48 object-cover"
                                        />
                                        <CardHeader>
                                            <CardTitle className="font-headline line-clamp-2">{event.title}</CardTitle>
                                            <div className="flex items-center gap-4 text-muted-foreground text-sm pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>{event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <span>{event.location}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="link" asChild>
                                                <Link href={`/events/${event.id}`}>View Details</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                           </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="ml-12" />
                    <CarouselNext className="mr-12" />
                </Carousel>
                <div className="mt-12 text-center">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/events">See All Events <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
