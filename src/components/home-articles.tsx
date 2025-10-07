
'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import type { Article } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type HomeArticlesProps = {
    articles: Article[];
}

export function HomeArticles({ articles }: HomeArticlesProps) {

    if (articles.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-card/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold tracking-tight">From Our Blog</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
                        Stay updated with our latest insights and stories.
                    </p>
                </div>
                 <Carousel opts={{ align: "start", loop: articles.length > 3 }} className="w-full">
                    <CarouselContent>
                        {articles.map((article) => (
                            <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <Card className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                                        <Image
                                            src={article.imageUrl}
                                            alt={article.title}
                                            width={600}
                                            height={300}
                                            className="w-full h-48 object-cover"
                                            data-ai-hint="technology abstract"
                                        />
                                        <CardHeader>
                                            <CardTitle className="font-headline line-clamp-2">{article.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                            <div>
                                                <p className="text-sm font-medium">{article.author}</p>
                                                <p className="text-xs text-muted-foreground">{article.published_date}</p>
                                            </div>
                                            </div>
                                            <Button variant="link" asChild>
                                                <Link href={`/blog/${article.id}`}>View More</Link>
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
                        <Link href="/blog">View All Articles <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
