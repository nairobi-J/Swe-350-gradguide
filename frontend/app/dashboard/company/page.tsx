// app/companies/page.tsx
import Link from 'next/link';
import { CompanyOverview } from '@/types';

// Helper component for star rendering
function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {Array(fullStars).fill(0).map((_, i) => (
        <span key={`full-${i}`} className="text-yellow-400 text-lg">★</span>
      ))}
      {halfStar && <span className="text-yellow-400 text-lg">½</span>}
      {Array(emptyStars).fill(0).map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300 text-lg">★</span>
      ))}
      <span className="ml-2 text-sm text-gray-600">({Number(rating).toFixed(1)}/5)</span>
    </div>
  );
}

// Updated CompanyCard component with the new design for consistent height
function CompanyCard({ firm, avg_overall_rating }: CompanyOverview) {
  return (
    <div className="w-full sm:w-80">
      <Link href={`company/${firm}`} className="block h-full">
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full">
          {/* Main content section */}
          <div className="p-6 flex-grow">
            {/* The line-clamp-2 class ensures the title doesn't overflow and cause card size changes */}
            <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{firm}</h2>
            <div className="flex items-center text-sm text-gray-600">
              <StarRatingDisplay rating={avg_overall_rating} />
            </div>
          </div>
          
          {/* Call to Action section */}
          <div className="px-6 pb-6">
            <div className="flex">
              <div className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center">
                View Details
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;

// Main page component (Server Component)
export default async function CompaniesPage() {
  let companies: CompanyOverview[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(`${AZURE_BACKEND_URL}/review/avg-review`, {
      cache: 'no-store' // This ensures data is fetched on every request, equivalent to getServerSideProps
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error fetching companies: ${res.status} ${res.statusText} - ${errorText}`);
    }
    companies = await res.json();
  } catch (err: any) {
    console.error('Failed to fetch companies:', err.message);
    error = err.message;
  }

  if (error) {
    return <div className="p-8 text-red-600 text-center text-lg">Error: {error}</div>;
  }

  if (companies.length === 0) {
    return <div className="p-8 text-center text-lg text-gray-700">Loading companies or no data available...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Explore Companies</h1>
      
      <div className="flex flex-wrap justify-center gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.firm} firm={company.firm} avg_overall_rating={company.avg_overall_rating} />
        ))}
      </div>
    </div>
  );
}

// Optional: Metadata for this page (for better SEO in App Router)
export const metadata = {
  title: 'Explore Companies - Graduate Guide',
  description: 'Browse companies and their employee reviews for career guidance.',
};
