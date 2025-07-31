'use client';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Search, DollarSign, Clock, Filter, ArrowRight } from 'lucide-react';
// Define the interface for a single institution object

export default function HigherStudiesPage() {
 const [universities, setUniversities] = useState([]);
 const [programs, setPrograms] = useState([]); 
 const [programCount, setProgramCount] = useState(null);
 const [countryCount, setCountryCount] = useState(null);
 const [universityCount, setUniversityCount] = useState(null);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;

  //effect to fetch programs initially
  useEffect(() => {
    const fetchUniversityPrograms = async () => {
      try {
        const response = await fetch(`${AZURE_BACKEND_URL}/uni/programs/get?limit=20`);
         const count = await fetch(`${AZURE_BACKEND_URL}/uni/programs/count`);
         const programCount = await fetch(`${AZURE_BACKEND_URL}/uni/programs/programs`);
        const countryCount = await fetch('http://localhost:5000/uni/programs/countries');
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
        //setFilteredUniversities(result.data); // Initialize filtered Universities with all fetched Universities

        console.log("Full API Response Object:", result);
        console.log("Array being set to 'Universities' state:", result.data);

      } catch (err) {
        console.error("Failed to fetch Universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityPrograms();
  }, []);
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
    if (!universities.length) return; // Don't filter if Universities aren't loaded yet

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const results = universities.filter(institution => {
      // Check institution name
      if (institution.name && institution.name.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Optional: Check country
      if (institution.country && institution.country.toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Optional: Check domains
      if (institution.domains && institution.domains.some(domain => domain.toLowerCase().includes(lowerCaseSearchTerm))) {
        return true;
      }
      // Optional: Check state-province
      if (institution['state-province'] && institution['state-province'].toLowerCase().includes(lowerCaseSearchTerm)) {
        return true;
      }
      // Add more properties to search through if needed (e.g., categories, program names)
      return false;
    });

    setFilteredUniversities(results);
  }, [searchTerm, universities]); // Re-run this effect when searchTerm or original Universities change

  // Handler for the search input field
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handler for the search button (optional, as filtering happens on input change)
  const handleSearchButtonClick = () => {
    
    console.log("Search button clicked for:", searchTerm);
  };
const formatCurrency = (value, currencyCode = 'USD', locale = 'en-US') => {
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

const formatLivingCostIndex = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return `${value} (Global Avg = 100)`;
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
        <p>Loading Universities...</p>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title or keyword"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            Search Jobs
          </button> */}
        </div>
      </div>

      {/* Filters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div className="lg:col-span-3 space-y-4">
    {programs.length === 0 ? (
      <p className="text-center text-gray-600 text-lg">
        {searchTerm ? `No results found for "${searchTerm}".` : 'No programs found.'}
      </p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {programs.map((program, index) => {
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
                <h2 className="text-2xl font-semibold text-black mb-2">{program.University}</h2>
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
    )}
  </div>
</div>
    </div>
  
    </div>
  );
}