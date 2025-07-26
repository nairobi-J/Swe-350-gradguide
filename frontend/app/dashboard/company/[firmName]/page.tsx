// app/companies/[firmName]/page.tsx
// NO "use client" here! This is a Server Component

import { CompanyDetailData } from '@/types'; // Adjust path
import { CompanyDetailsClientComponent } from './companyDetailsClientComponent'; // Import the Client Component

// Props for the CompanyDetailsPage component (passed from the async getServerSideProps equivalent)
interface CompanyDetailsPageProps {
  params: { firmName: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Function to fetch initial data on the server
async function getInitialCompanyData(firmName: string): Promise<{ data: CompanyDetailData | null; error: string | null }> {
  const initialLimit = 10; // Fetch the first 10 reviews initially
  try {
    const res = await fetch(`http://localhost:5000/review/review-by-firm/?firmName=${firmName}&?page=1&limit=${initialLimit}`, {
      cache: 'no-store' // Ensures this is SSR, not cached as a static page
    });

    if (!res.ok) {
      if (res.status === 404) {
        return { data: null, error: 'Company not found.' };
      }
      const errorBody = await res.text();
      throw new Error(`Error fetching initial company data: ${res.status} ${res.statusText} - ${errorBody}`);
    }
    const data: CompanyDetailData = await res.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Failed to fetch initial company data:', err.message);
    return { data: null, error: err.message };
  }
}

// Main page component (Server Component)
export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  const {firmName} = await params;
  const { data: initialData, error: initialError } = await getInitialCompanyData(firmName);

  return <CompanyDetailsClientComponent initialData={initialData} initialError={initialError} firmName={firmName} />;
}