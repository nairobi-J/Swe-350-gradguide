'use client';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Search, DollarSign, Clock, Filter, ArrowRight } from 'lucide-react';

// Define the interface for a single program object
interface Program {
  university: string;
  program: string;
  level: string;
  country: string;
  city: string;
  duration_years: string;
  tuition_usd: string;
  rent_usd: string;
  visa_fee_usd: string;
  insurance_usd: string;
  exchange_rate: string;
  link: string;
  domain?: string[];
  Living_Cost_Index?: number;
  University?: string; // Sometimes API returns this instead of 'university'
}

export default function HigherStudiesPage() {
 const [universities, setUniversities] = useState<Program[]>([]);
 const [programs, setPrograms] = useState<Program[]>([]); 
 const [programCount, setProgramCount] = useState<number | null>(null);
 const [countryCount, setCountryCount] = useState<number | null>(null);
 const [universityCount, setUniversityCount] = useState<number | null>(null);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
const [itemsPerPage, setItemsPerPage] = useState<number>(20);
const [totalPrograms, setTotalPrograms] = useState<number>(0);

 const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
// In your page.tsx file, at the top of your component or function
//console.log('The backend URL is:', process.env.NEXT_PUBLIC_AZURE_BACKEND_URL);
  //effect to fetch programs initially
  useEffect(() => {
    const fetchUniversityPrograms = async () => {
      try {
        const response = await fetch(`${AZURE_BACKEND_URL}/uni/programs/get`);
         const count = await fetch(`${AZURE_BACKEND_URL}/uni/programs/count`);
         const programCount = await fetch(`${AZURE_BACKEND_URL}/uni/programs/programs`);
        const countryCount = await fetch(`${AZURE_BACKEND_URL}/uni/programs/countries`);
        //const response = await fetch(`https:localhost:5000/uni/programs/get?limit=20`);
        //  const count = await fetch(`https:localhost:5000/uni/programs/count`);
        //  const programCount = await fetch(`https:localhost:5000/uni/programs/programs`);
        // const countryCount = await fetch(`https:localhost:5000/uni/programs/countries`);
         if (!count.ok) {
          throw new Error(`HTTP error! status: ${count.status} for count`);
        }
        const countUniversity = await count.json();
        setUniversityCount(countUniversity.count);
       
        const countProgram = await programCount.json();
        setProgramCount(countProgram.count);



        const countCountry = await countryCount.json();
        setCountryCount(countCountry.count);
        



        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Ensure we're setting the actual array to 'Universities' state
        setPrograms(result.data);
        setFilteredPrograms(result.data); // Initialize filtered Programs with all fetched Programs
        
        // Set total programs for pagination - using program count as total
        setTotalPrograms(countProgram.count);

        console.log("Full API Response Object:", result);
        console.log("Array being set to 'Universities' state:", result.data);
        console.log("Total programs for pagination:", countProgram.count);

      } catch (err) {
        console.error("Failed to fetch Universities:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityPrograms();
  }, [currentPage, itemsPerPage]);
  // Effect to fetch Universities initially
  // useEffect(() => {
  //   const fetchUniversities = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/uni/get?limit=20');

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const result = await response.json();

  //       // Ensure we're setting the actual array to 'Universities' state
  //       setUniversities(result.data);
  //       setFilteredUniversities(result.data); // Initialize filtered Universities with all fetched Universities

  //       console.log("Full API Response Object:", result);
  //       console.log("Array being set to 'Universities' state:", result.data);

  //     } catch (err) {
  //       console.error("Failed to fetch Universities:", err);
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUniversities();
  // }, []); // Runs only once on component mount

  // Effect to filter Universities whenever searchTerm or Universities changes
  useEffect(() => {
    if (!programs.length) return; // Don't filter if Universities aren't loaded yet

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseSearchLocation = searchLocation.toLowerCase();

    const results = programs.filter(institution => {
      // Check institution name
      if (institution.university && institution.university.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
       if (institution.program && institution.program.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Optional: Check domains
      if (institution.domain && institution.domain.some(domain => domain.toLowerCase().includes(lowerCaseSearchTerm))) {
        return true;
      }
      // Add more properties to search through if needed (e.g., categories, program names)
      return false;
    });

    // Filter by location if searchLocation is provided
    if (searchLocation) {
      return setFilteredPrograms(results.filter(institution => {
        return (institution.country && institution.country.toLowerCase().includes(lowerCaseSearchLocation)) ||
               (institution.city && institution.city.toLowerCase().includes(lowerCaseSearchLocation));
      }));
    }

    setFilteredPrograms(results);
  }, [searchTerm, searchLocation, programs]); // Re-run this effect when searchTerm or original Universities change

  // Handler for the search input field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handler for the search input field for location
  const handleSearchLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchLocation(event.target.value);
  };
  // Handler for the search button (optional, as filtering happens on input change)
  const handleSearchButtonClick = () => {
    
    console.log("Search button clicked for:", searchTerm);
  };
const formatCurrency = (value: any, currencyCode = 'USD', locale = 'en-US') => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatLivingCostIndex = (value: any) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return `${value} (Global Avg = 100)`;
};

// Enhanced Pagination component
const Pagination = ({ totalPrograms, programsPerPage, currentPage, setCurrentPage }: {
  totalPrograms: number;
  programsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) => {
    const totalPages = Math.ceil(totalPrograms / programsPerPage);
    
    if (totalPages <= 1) return null; // Don't show pagination if only 1 page
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex justify-center items-center space-x-2 mt-6">
            {/* Previous button */}
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            
            {/* First page */}
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-2">...</span>}
                </>
            )}
            
            {/* Page numbers */}
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                        currentPage === number 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {number}
                </button>
            ))}
            
            {/* Last page */}
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2">...</span>}
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            
            {/* Next button */}
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
            
            <div className="ml-4 text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalPrograms} total programs)
            </div>
        </nav>
    );
};

 if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Universities...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
        <p>Error: {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

    

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Universities</p>
              <p className="text-lg font-semibold text-gray-900">{universityCount }</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Study Programs</p>
              <p className="text-lg font-semibold text-gray-900">{programCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Countries</p>
              <p className="text-lg font-semibold text-gray-900">{countryCount}</p>
            </div>
          </div>
        </div>
      </div>

      { /*Recommended Universities - This now displays filteredUniversities */}


      {/* Recommended Programs */}
     
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-800 h-5 w-5" />
            <input
              type="text"
              placeholder="University or program name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-800 h-5 w-5" />
            <input
              type="text"
              placeholder="Country or city"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              value={searchLocation}
              onChange={handleSearchLocationChange}
            />
          </div>
          <div className="flex items-center">
            <label className="text-sm text-gray-600 mr-2">Per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

       {/*pagination component*/}
      <Pagination
          totalPrograms={totalPrograms}
          programsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
      />

      {/* Filters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="lg:col-span-3 space-y-4">
    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600">Loading programs...</span>
        </div>
      </div>
    ) : programs.length === 0 ? (
      <p className="text-center text-gray-600 text-lg py-8">
        {searchTerm || searchLocation ? `No results found for your search criteria.` : 'No programs found.'}
      </p>
    ) : (
      <>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalPrograms)} of {totalPrograms} programs
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
          {filteredPrograms.map((program, index) => {
          const tuition = parseFloat(program.tuition_usd) || 0;
          const rent = parseFloat(program.rent_usd) || 0;
          const visaFee = parseFloat(program.visa_fee_usd) || 0;
          const insurance = parseFloat(program.insurance_usd) || 0;
          const durationYears = parseFloat(program.duration_years) || 0;
          const exchangeRate = parseFloat(program.exchange_rate) || 1.00;
          const universityWebsite = program.link
          const totalTuitionCost = tuition * durationYears;
          const totalRentCost = rent * 12 * durationYears;
          const totalOtherFees = visaFee + insurance;
          const totalEstimatedCostUSD = totalTuitionCost + totalRentCost + totalOtherFees;

          return (
            <a
   key={`${program.university}-${program.program}-${index}`} // Key is on the outermost <a> tag
      href={universityWebsite} // <-- DYNAMICALLY USES program.link
      target="_blank" // Opens in a new tab
      rel="noopener noreferrer" // Security best practice
      className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col cursor-pointer"
> <div
              key={`${program.university}-${program.program}-${index}`}
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col"
            >
              
              <div className="p-6 flex-grow from-blue-50 to-purple-50">
                <h2 className="text-2xl font-semibold text-black mb-2">{program.university || program.University}</h2>
                 {program.university && (
                  <h1 className="text-gray-700 text-lg font-bold mb-1">
                    {program.university} 
                  </h1>
                )}
                {program.program && (
                  <p className="text-gray-700 text-lg font-medium mb-1">
                    {program.program} ({program.level})
                  </p>
                )}
                {(program.country || program.city) && (
                  <p className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">Location:</span>
                    {program.city ? `${program.city}, ` : ''}
                    {program.country ? `${program.country}` : ''}
                  </p>
                )}
                {program.duration_years && (
                  <p className="text-gray-700 text-sm mb-1">
                    <span className="font-medium">Duration:</span> {durationYears} Year{durationYears !== 1 ? 's' : ''}
                  </p>
                )}
                 
                <div className="mt-4 pt-4 ">
                  {/* <h3 className="text-lg font-semibold text-blue-700 mb-2">Estimated Annual Costs</h3> */}
                  {/* <div className="grid grid-cols-1 gap-1 text-gray-700 text-sm">
                    <p><span className="font-medium">Tuition:</span> {formatCurrency(tuition, 'USD')}</p>
                    <p><span className="font-medium">Monthly Rent:</span> {formatCurrency(rent, 'USD')}</p>
                    <p><span className="font-medium">Visa Fee:</span> {formatCurrency(visaFee, 'USD')} (one-time)</p>
                    <p><span className="font-medium">Insurance:</span> {formatCurrency(insurance, 'USD')} (annual)</p>
                    <p><span className="font-medium">Living Cost Index:</span> {formatLivingCostIndex(program.Living_Cost_Index)}</p>
                    <p><span className="font-medium">Exchange Rate:</span> 1 USD = {exchangeRate} Local</p>
                  </div> */}
                </div>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-200 rounded-b-xl">
                <p className="text-lg font-bold text-black">
                  Total Estimated Program Cost:
                  <span className="text-2xl">{formatCurrency(totalEstimatedCostUSD, 'USD')}</span>
                </p>
              </div>
            </div></a>
           
          );
        })}
        </div>
      </>
    )}
  </div>
</div>

<Pagination
          totalPrograms={totalPrograms}
          programsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
      />
    </div>
  
    </div>
  );
}