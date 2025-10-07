
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { GalleryImage } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HomeGalleryProps = {
    galleryImages: GalleryImage[];
}

export function HomeGallery({ galleryImages }: HomeGalleryProps) {
    if (!galleryImages || galleryImages.length === 0) {
        return null;
    }

    const duplicatedImages = [...galleryImages, ...galleryImages];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tight">From Our Gallery</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                        A visual journey through our company culture, events, and technology.
                    </p>
                </div>
            </div>
            
            <div
                className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] group"
            >
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll group-hover:[animation-play-state:paused]">
                    {duplicatedImages.map((image, index) => (
                        <li key={index} className="relative rounded-lg overflow-hidden group/item aspect-square w-64 h-64 flex-shrink-0">
                            <Image
                                src={image.imageUrl}
                                alt={image.title}
                                fill
                                className="object-cover w-full h-full group-hover/item:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="absolute bottom-4 left-4 text-white text-left">
                                    <h3 className="font-bold text-sm">{image.title}</h3>
                                    <p className="text-xs">{image.caption}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 animate-scroll group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {duplicatedImages.map((image, index) => (
                        <li key={index} className="relative rounded-lg overflow-hidden group/item aspect-square w-64 h-64 flex-shrink-0">
                            <Image
                                src={image.imageUrl}
                                alt={image.title}
                                fill
                                className="object-cover w-full h-full group-hover/item:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="absolute bottom-4 left-4 text-white text-left">
                                    <h3 className="font-bold text-sm">{image.title}</h3>
                                    <p className="text-xs">{image.caption}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>


            </div>
            
            <div className="mt-12 text-center">
                <Button asChild size="lg" variant="outline">
                    <Link href="/gallery">View Full Gallery <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
            </div>
        </section>
    );
}
