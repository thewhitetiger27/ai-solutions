
import { getQuoteRequests } from '@/lib/data';
import { QuotesClient } from './_components/quotes-client';

export default async function AdminQuotesPage() {
    const requests = await getQuoteRequests();
    return <QuotesClient initialRequests={requests} />;
}
