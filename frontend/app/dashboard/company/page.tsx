// app/companies/page.tsx
import Link from 'next/link';
import { CompanyOverview } from '@/types'; // Adjust path if needed, or define directly

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

function CompanyCard({ firm, avg_overall_rating }: CompanyOverview) {
  return (
    <Link href={`company/${firm}`} className="block">
      <div className="bg-white shadow-lg rounded-lg p-6 m-4 w-full sm:w-80 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{firm}</h2>
        <div className="flex items-center mb-4">
          <StarRatingDisplay rating={avg_overall_rating} />
        </div>
        <p className="text-blue-600 hover:underline">Click for details</p>
      </div>
    </Link>
  );
}

// Main page component (Server Component)
export default async function CompaniesPage() {
  let companies: CompanyOverview[] = [];
  let error: string | null = null;

  try {
    const res = await fetch('http://localhost:5000/review/avg-review', {
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
      {/* Head component for metadata in App Router uses layout.tsx or generateMetadata */}
      {/* For specific page title, you can add it here if `layout.tsx` doesn't handle it dynamically */}
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