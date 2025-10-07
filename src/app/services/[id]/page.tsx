import { getServices } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const services = await getServices();
  const service = services.find(s => s.id === params.id);
 
  if (!service) {
    return {
      title: 'Service Not Found'
    }
  }

  return {
    title: service.title,
    description: service.short_description,
  }
}

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
    const services = await getServices();
    const service = services.find(s => s.id === params.id);

    if (!service) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
                <Button asChild variant="outline">
                    <Link href="/services">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Services
                    </Link>
                </Button>
            </div>
            <div className="relative w-full h-96 mb-12 rounded-lg overflow-hidden">
                <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    data-ai-hint="technology abstract"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-white">{service.title}</h1>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <section className="mb-12">
                    <h2 className="font-headline text-3xl font-bold mb-4">Service Overview</h2>
                    <p className="text-lg text-muted-foreground">{service.long_description}</p>
                </section>

                {service.key_benefits && service.key_benefits.length > 0 && (
                    <section className="mb-12">
                        <h2 className="font-headline text-3xl font-bold mb-6">Key Benefits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {service.key_benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary mt-1 shrink-0" />
                                    <p className="text-muted-foreground">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {service.pricing && service.pricing.length > 0 && (
                    <section className="mb-12">
                        <h2 className="font-headline text-3xl font-bold mb-6 text-center">Pricing Plans</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {service.pricing.map((plan, index) => (
                                <Card key={index} className="flex flex-col">
                                    <CardHeader className="items-center text-center">
                                        <CardTitle className="font-headline">{plan.plan}</CardTitle>
                                        <p className="text-4xl font-bold text-primary">{plan.price}</p>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <ul className="space-y-3">
                                            {plan.features.map((feature, fIndex) => (
                                                <li key={fIndex} className="flex items-center gap-2 text-muted-foreground">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
                
                <section className="text-center bg-card p-8 rounded-lg">
                    <h2 className="font-headline text-3xl font-bold">Ready to Get Started?</h2>
                    <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Contact us today to discuss your project and get a personalized quote.</p>
                    <Button asChild size="lg" className="mt-6">
                        <Link href={`/quotes/${service.id}`}>
                            Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </section>
            </div>
        </div>
    )
}
