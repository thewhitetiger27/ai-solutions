
'use client';

import Image from "next/image"
import { GalleryActions } from "./gallery-actions"
import type { GalleryImage } from "@/lib/mock-data"

type GalleryImageCardProps = {
    image: GalleryImage;
}

export function GalleryImageCard({ image }: GalleryImageCardProps) {
    return (
        <div className="relative group">
            <Image
                src={image.imageUrl}
                alt={image.title}
                width={300}
                height={300}
                className="w-full h-auto object-cover rounded-md aspect-square"
                data-ai-hint="team work office"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GalleryActions image={image} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-md">
                <h3 className="text-white font-bold text-sm truncate">{image.title}</h3>
                <p className="text-white/80 text-xs truncate">{image.caption}</p>
            </div>
        </div>
    )
}
