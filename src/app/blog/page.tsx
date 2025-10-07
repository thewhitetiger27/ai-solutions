
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Insights, trends, and discussions on the world of Artificial Intelligence.',
};

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-16">
      <div
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl font-bold tracking-tight">Our Articles</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Insights, trends, and discussions on the world of Artificial Intelligence.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
            <Card key={article.id} className="h-full flex flex-col overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
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
        ))}
      </div>
      {/* TODO: Add pagination controls */}
    </div>
  );
}
