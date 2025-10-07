
import { getContactSubmissions } from '@/lib/data';
import { InquiriesClient } from './_components/inquiries-client';

export default async function AdminInquiriesPage() {
    const submissions = await getContactSubmissions();
    return <InquiriesClient initialSubmissions={submissions} />;
}
