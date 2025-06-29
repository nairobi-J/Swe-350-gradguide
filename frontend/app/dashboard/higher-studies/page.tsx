'use client';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Search, DollarSign, Clock, Filter, ArrowRight } from 'lucide-react';
// Define the interface for a single institution object

export default function HigherStudiesPage() {
 const [universities, setUniversities] = useState([]);
 const [programs, setPrograms] = useState([]); // Assuming you might want to fetch programs later
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  //effect to fetch programs initially
  useEffect(() => {
    const fetchUniversityPrograms = async () => {
      try {
        const response = await fetch('http://localhost:5000/uni/programs/get?limit=20');

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
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch('http://localhost:5000/uni/get?limit=20');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Ensure we're setting the actual array to 'Universities' state
        setUniversities(result.data);
        setFilteredUniversities(result.data); // Initialize filtered Universities with all fetched Universities

        console.log("Full API Response Object:", result);
        console.log("Array being set to 'Universities' state:", result.data);

      } catch (err) {
        console.error("Failed to fetch Universities:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []); // Runs only once on component mount

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

      {/* Search Section */}
      <div className="bg-white text-black rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Find Your Perfect Study Program</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search universities or programs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm} // Bind input value to searchTerm state
              onChange={handleSearchChange} // Update searchTerm on every keystroke
            />
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSearchButtonClick} // Attach click handler
          >
            Search
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Top Universities</p>
              <p className="text-lg font-semibold text-gray-900">500+</p>
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
              <p className="text-lg font-semibold text-gray-900">2,000+</p>
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
              <p className="text-lg font-semibold text-gray-900">50+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Universities - This now displays filteredUniversities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 ">
          <div className="flex items-center justify-between mb-4 ">
            <h2 className="text-lg font-semibold text-gray-900">Top Universities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="divide-y  divide-gray-200 ">
            {/* Display filteredUniversities instead of Universities */}
            {filteredUniversities.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">
                {searchTerm ? `No results found for "${searchTerm}".` : 'No institutions found. Check your database data or API endpoint.'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto ">
                {filteredUniversities.map((institution) => (
                  <div key={institution.id} className=" rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-200 to-purple-200">
                    <div className="p-6 ">

                      <h2 className="text-2xl font-semibold text-blue-800 mb-2">{institution.name}</h2>

                      {institution.country && (
                        <p className="text-gray-700 text-sm mb-1">
                          <span className="font-medium">Country:</span> {institution.country}
                          {institution['state-province'] && ` (${institution['state-province']})`}
                        </p>
                      )}

                      {institution.web_pages && institution.web_pages.length > 0 && (
                        <p className="text-gray-700 text-sm mb-1">
                          <span className="font-medium">Website:</span>{' '}
                          <a
                            href={institution.web_pages[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {institution.web_pages[0]}
                          </a>
                        </p>
                      )}

                      {institution.domains && institution.domains.length > 0 && (
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Domains:</span> {institution.domains.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            Search Jobs
          </button>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       
        <div className="lg:col-span-3 space-y-4">
        {/* Display filteredUniversities instead of Universities */}
{programs.length === 0 ? (
  <p className="text-center text-gray-600 text-lg">
    {searchTerm ? `No results found for "${searchTerm}".` : 'No programs found. Check your database data or API endpoint.'}
  </p>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto ">
    {programs.map((program, index) => ( 
    
      <div key={program.LINK || index} className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-blue-100 bg-gradient-to-r from-blue-200 to-purple-200">
        <div className="p-6 ">

          {/* SCHOOL is the institution name from your DB */}
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">{program.PROGRAM}</h2>

          {/* PROGRAM name */}
          {program.SCHOOL && (
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Program:</span> {program.PROGRAM} ({program.TYPE})
            </p>
          )}

          {/* Country, State, City */}
          {(program.COUNTRY || program.STATE || program.CITY) && (
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Location:</span>
              {program.CITY && program.CITY !== "NA" ? `${program.CITY}, ` : ''}
              {program.STATE && program.STATE !== "NA" ? `${program.STATE}` : ''}
              {program.COUNTRY && program.COUNTRY !== "NA" ? ` (${program.COUNTRY})` : ''}
            </p>
          )}

          {/* Link to the program/university */}
          {program.LINK && (
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Website:</span>{' '}
              <a
                href={program.LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {program.LINK}
              </a>
            </p>
          )}

          {/* Other relevant fields you might want to display, e.g., Department, Delivery, Duration */}
          {program.DEPARTMENT && program.DEPARTMENT !== "Not Available" && (
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Department:</span> {program.DEPARTMENT}
            </p>
          )}
          {program.DELIVERY && program.DELIVERY !== "NA" && (
            <p className="text-gray-700 text-sm mb-1">
              <span className="font-medium">Delivery:</span> {program.DELIVERY}
            </p>
          )}
          {program.DURATION && program.DURATION !== "NA" && (
            <p className="text-gray-700 text-sm">
              <span className="font-medium">Duration:</span> {program.DURATION}
            </p>
          )}

          {/* You can add more academic/ranking details here, similar to the ProgramDetailCard */}
          {/* For example, if you want to show WORLD_RANK */}
          {program.WORLD_RANK && program.WORLD_RANK !== "NA" && (
             <p className="text-gray-700 text-sm mt-2">
               <span className="font-medium">World Rank:</span> {program.WORLD_RANK}
             </p>
          )}

        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </div>
    </div>
  
    </div>
  );
}