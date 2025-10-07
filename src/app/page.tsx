

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedServices, getProjects, getFeaturedTestimonials, getGalleryImages, getFeaturedArticles, getEvents } from "@/lib/data";
import { FeaturedProjectsClient } from "@/components/featured-projects-client";
import { TestimonialsClient } from "@/components/testimonials-client";
import { HeroBackground } from "@/components/hero-background";
import { HomeGallery } from "@/components/home-gallery";
import { HomeArticles } from "@/components/home-articles";
import { HomeEvents } from "@/components/home-events";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default async function Home() {
  const services = await getFeaturedServices();
  const featuredProjects = await getProjects();
  const testimonials = await getFeaturedTestimonials();
  const galleryImages = await getGalleryImages();
  const articles = await getFeaturedArticles();
  const events = await getEvents();
  const defaultImageUrl = "https://placehold.co/600x400.png";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <HeroBackground />
          <div
            className="container mx-auto px-4 text-center relative z-10"
          >
            
            <h1
              className="font-headline text-5xl md:text-7xl font-bold tracking-tighter"
            >
              <span className="text-3d">Innovate</span> with Intelligent
            </h1>
            <h1
              className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mt-2"
            >
              Automation
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground text-balance">
              We build cutting-edge AI solutions that drive growth, efficiency, and transformation for businesses worldwide.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Link href="/services">Our Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold tracking-tight">Our Core Services</h2>
              <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                Tailored AI services to meet your unique business needs.
              </p>
            </div>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {services.map((service) => (
                  <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="h-full flex flex-col text-center items-center border-transparent hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                          <Image
                            src={service.imageUrl || defaultImageUrl}
                            alt={service.title}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover"
                          />
                          <CardHeader>
                            <CardTitle className="font-headline">{service.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{service.short_description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button variant="link" asChild className="text-primary">
                              <Link href={`/services/${service.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
                <Link href="/services">See More Services</Link>
              </Button>
            </div>
          </div>
        </section>

        <FeaturedProjectsClient featuredProjects={featuredProjects} />

        <HomeArticles articles={articles} />

        <HomeGallery galleryImages={galleryImages} />
        
        <HomeEvents events={events} />
        
        <TestimonialsClient testimonials={testimonials} />

        {/* CTA Section */}
        <section className="py-20">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="font-headline text-4xl font-bold tracking-tight">Ready to Transform Your Business?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Let's discuss how AI-Solutions can help you achieve your goals.
                 </p>
                 <div className="mt-8">
                     <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                       <Link href="/contact">Get in Touch <ArrowRight className="ml-2 h-5 w-5" /></Link>
                     </Button>
                 </div>
            </div>
        </section>
      </main>
    </div>
  );
}
