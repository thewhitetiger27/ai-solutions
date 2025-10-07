
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Project } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

type FeaturedProjectsClientProps = {
    featuredProjects: Project[];
}

export function FeaturedProjectsClient({ featuredProjects }: FeaturedProjectsClientProps) {
    return (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tight">Success Stories</h2>
              <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                See how we've helped our clients achieve remarkable results.
              </p>
            </div>
            {featuredProjects.length > 0 && (
              <>
                <Carousel opts={{ align: "start", loop: true }} className="w-full">
                  <CarouselContent>
                    {featuredProjects.map((project) => (
                      <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                          <Card className="overflow-hidden h-full flex flex-col">
                            <Image
                              src={project.imageUrl}
                              alt={project.title}
                              width={600}
                              height={400}
                              className="w-full h-48 object-cover"
                              data-ai-hint="technology abstract"
                            />
                            <CardHeader>
                              <CardTitle className="font-headline">{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <p className="text-muted-foreground line-clamp-3">{project.summary}</p>
                            </CardContent>
                            <CardFooter>
                               <Button asChild variant="outline">
                                  <Link href="/projects">View Case Study</Link>
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
                        <Link href="/projects">View All Projects <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
              </>
            )}
          </div>
        </section>
    )
}
