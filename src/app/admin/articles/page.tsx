import { getArticles } from '@/lib/data';
import { ArticlesClient } from './_components/articles-client';

export default async function AdminArticlesPage() {
  const articles = await getArticles();
  
  return <ArticlesClient articles={articles} />;
}
