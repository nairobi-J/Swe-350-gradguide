'use client';

import { Briefcase, MapPin, Search, DollarSign, Clock, Filter, ArrowRight } from 'lucide-react';

export default function JobSearchPage() {
  const jobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$130,000 - $160,000",
      type: "Full-time",
      posted: "2 days ago",
      description: "We're looking for a Senior Software Engineer to join our team...",
      requirements: ["5+ years experience", "React", "Node.js", "AWS"],
      matchScore: 95,
    },
    {
      title: "Data Scientist",
      company: "AI Solutions Ltd",
      location: "Remote",
      salary: "$115,000 - $140,000",
      type: "Full-time",
      posted: "1 day ago",
      description: "Join our data science team to work on cutting-edge AI projects...",
      requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
      matchScore: 92,
    },
  ];

  return (
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
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-gray-900">Filters</h2>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>

            {/* Experience Level */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h3>
              <div className="space-y-2">
                {['Entry Level', 'Mid Level', 'Senior Level'].map((level) => (
                  <label key={level} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h3>
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                placeholder='1000'
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>$0</span>
                <span>$200k+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-4">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {job.matchScore}% Match
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {job.salary}
                </span>
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.type}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {job.posted}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.requirements.map((req, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}