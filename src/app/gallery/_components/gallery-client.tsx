
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { GalleryImage } from '@/lib/mock-data';

type GalleryClientProps = {
  galleryImages: GalleryImage[];
};

export function GalleryClient({ galleryImages }: GalleryClientProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ["All", "Tech Conferences", "Client Meetups", "Product Launches", "Workshops & Training", "Award & Recognition"];

  const getFilteredImages = (category: string) => {
    if (category === "All") return galleryImages;
    return galleryImages.filter(img => img.category === category);
  };

  return (
    <Dialog.Root onOpenChange={(open) => !open && setSelectedImage(null)}>
      <Tabs defaultValue="All" className="w-full">
        <TabsList className="mb-8 w-full justify-center bg-transparent p-0">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              >
                {getFilteredImages(category).map((image) => (
                  <Dialog.Trigger asChild key={image.id}>
                    <div
                      className="break-inside-avoid"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Card className="overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary/10 transition-shadow duration-300">
                        <Image
                          src={image.imageUrl}
                          alt={image.title}
                          width={400}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-bold">{image.title}</h3>
                          <p className="text-sm text-muted-foreground">{image.caption}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </Dialog.Trigger>
                ))}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>

      <DialogContent className="max-w-4xl p-0 border-0">
        {selectedImage && (
          <>
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              width={1200}
              height={800}
              className="w-full h-auto rounded-t-lg"
            />
            <DialogHeader className="p-6">
              <DialogTitle className="font-headline text-2xl">{selectedImage.title}</DialogTitle>
              <DialogDescription>{selectedImage.caption}</DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog.Root>
  );
}
