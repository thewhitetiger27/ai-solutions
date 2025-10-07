
import { getGalleryImages } from '@/lib/data';
import { GalleryClient } from './_components/gallery-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A glimpse into our world at AI-Solutions.',
};

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Gallery</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          A glimpse into our world at AI-Solutions.
        </p>
      </div>
      <GalleryClient galleryImages={galleryImages} />
    </div>
  );
}
