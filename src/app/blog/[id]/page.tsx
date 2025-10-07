
import { getArticles } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from 'next';

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const articles = await getArticles();
  const article = articles.find(a => a.id === params.id);
 
  if (!article) {
    return {
      title: 'Article Not Found'
    }
  }

  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const articles = await getArticles();
  const article = articles.find(a => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">{article.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <div className="flex items-center gap-2">
                <span className="font-medium">{article.author}</span>
            </div>
            <span>&bull;</span>
            <span>{article.published_date}</span>
          </div>
        </header>

        <div className="prose prose-invert prose-lg max-w-none mx-auto text-foreground/90">
            <p className="lead text-xl mb-6">{article.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/\n/g, '<br />') }} />
        </div>
        
        <div className="mt-12 text-center">
            <Button asChild variant="outline">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Articles
                </Link>
            </Button>
        </div>
      </article>
    </div>
  );
}
