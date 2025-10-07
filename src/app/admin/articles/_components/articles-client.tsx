'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { ArticleForm } from './article-form';
import { ArticleActions } from './article-actions';
import type { Article } from '@/lib/mock-data';

type ArticlesClientProps = {
  articles: Article[];
}

export function ArticlesClient({ articles }: ArticlesClientProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Articles</CardTitle>
                <CardDescription>Create, edit, and delete blog articles.</CardDescription>
            </div>
            <ArticleForm>
              <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Article
              </Button>
            </ArticleForm>
        </div>
      </CardHeader>
      <CardContent>
        {articles.length > 0 ? (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {articles.map(article => (
                <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>{article.published_date}</TableCell>
                    <TableCell className="text-right">
                        <ArticleActions article={article} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        ) : (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-8 h-8" />
                    <h3 className="text-lg font-semibold">Could not load articles</h3>
                    <p className="text-sm">
                        Please ensure you have enabled the Firestore API and seeded the database.
                    </p>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
