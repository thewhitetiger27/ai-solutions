
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { GalleryForm } from "./gallery-form"
import { AlertTriangle } from "lucide-react"
import type { GalleryImage } from "@/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GalleryImageCard } from "./gallery-image-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

type GalleryClientProps = {
    galleryImages: GalleryImage[];
}

export function GalleryClient({ galleryImages }: GalleryClientProps) {
    return (
        <Card className="flex flex-col h-[calc(100vh-10rem)]">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Gallery</CardTitle>
                        <CardDescription>Upload, edit, or delete gallery images.</CardDescription>
                    </div>
                    <GalleryForm>
                       <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Upload Image
                        </Button>
                    </GalleryForm>
                </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4">
                    {galleryImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {galleryImages.map(image => (
                                <GalleryImageCard key={image.id} image={image} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 border-dashed border-2 rounded-lg h-full flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <AlertTriangle className="w-8 h-8" />
                                <h3 className="text-lg font-semibold">No Gallery Images Found</h3>
                                <p className="text-sm">
                                    Upload an image to get started.
                                </p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
