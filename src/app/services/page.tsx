
import { getServices } from "@/lib/data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from 'next/link';
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'We offer a comprehensive suite of AI-powered services to help your business thrive in the digital age.',
};

export default async function ServicesPage() {
  const services = await getServices();
  const defaultImageUrl = "https://placehold.co/600x400.png";

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Our Services</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We offer a comprehensive suite of AI-powered services to help your business thrive in the digital age.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.id} className="h-full flex flex-col text-center items-center hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
             <Link href={`/services/${service.id}`} className="w-full">
                <Image 
                    src={service.imageUrl || defaultImageUrl}
                    alt={service.title}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover"
                    data-ai-hint="technology abstract"
                />
              </Link>
              <CardHeader>
                <CardTitle className="font-headline">
                    <Link href={`/services/${service.id}`}>{service.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{service.short_description}</p>
              </CardContent>
              <CardFooter>
                 <Button asChild variant="link">
                  <Link href={`/services/${service.id}`}>Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
