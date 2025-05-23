'use client';
import { BookOpen, GraduationCap, Globe, Search, ArrowRight } from 'lucide-react';

export default function HigherStudiesPage() {
  const universities = [
    {
      name: "Stanford University",
      location: "United States",
      programs: ["Computer Science", "Data Science", "AI"],
      ranking: "#2",
      matchScore: 95,
    },
    {
      name: "ETH Zurich",
      location: "Switzerland",
      programs: ["Robotics", "Computer Science", "Physics"],
      ranking: "#8",
      matchScore: 92,
    }
  ];

  const recommendedPrograms = [
    {
      name: "MSc in Artificial Intelligence",
      university: "Imperial College London",
      duration: "2 years",
      tuition: "$45,000/year",
      matchScore: 94,
    },
    {
      name: "MSc in Data Science",
      university: "TU Munich",
      duration: "2 years",
      tuition: "$35,000/year",
      matchScore: 90,
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Find Your Perfect Study Program</h1>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search universities or programs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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

      {/* Recommended Universities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Universities</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {universities.map((uni, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{uni.name}</h3>
                    <p className="text-sm text-gray-500">{uni.location}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {uni.programs.map((program, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {uni.matchScore}% Match
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Ranking: {uni.ranking}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Programs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recommended Programs</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedPrograms.map((program, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-500">{program.university}</p>
                  </div>
                  <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {program.matchScore}% Match
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>{program.duration}</span>
                  <span>{program.tuition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}