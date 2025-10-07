'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageSquareQuote, Star } from "lucide-react";
import type { Feedback } from "@/lib/mock-data";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type TestimonialsClientProps = {
    testimonials: Feedback[];
}

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tight">What Our Clients Say</h2>
            </div>
             <Carousel opts={{ align: "start", loop: testimonials.length > 3 }} className="w-full">
                <CarouselContent>
                    {testimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Card className="flex flex-col h-full">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <MessageSquareQuote className="w-10 h-10 text-primary" />
                                        <div>
                                        <p className="font-bold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                                        </div>
                                    </div>
                                    {testimonial.rating && (
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                                            ))}
                                            {[...Array(5 - testimonial.rating)].map((_, i) => (
                                                <Star key={i + testimonial.rating!} className="w-4 h-4 text-muted-foreground/30" />
                                            ))}
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground italic">"{testimonial.message}"</p>
                                </CardContent>
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
                    <Link href="/feedback">View All Testimonials <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
          </div>
        </section>
    )
}
