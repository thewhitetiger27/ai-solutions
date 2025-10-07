import { getGalleryImages } from "@/lib/data";
import { GalleryClient } from "./_components/gallery-client";

export default async function AdminGalleryPage() {
    const galleryImages = await getGalleryImages();
    return <GalleryClient galleryImages={galleryImages} />;
}
