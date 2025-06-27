'use client';
import { TrendingUp, Award, BookOpen, ArrowRight, ChevronRight, DollarSign } from 'lucide-react';

export default function CareerPathsPage() {
  const careerPaths = [
    {
      title: "Data Science & AI",
      description: "From data analysis to advanced AI research",
      growth: "+35%",
      demand: "Very High",
      salary: "$90k - $150k",
      skills: ["Python", "Machine Learning", "Statistics", "Deep Learning"],
      levels: ["Junior Data Analyst", "Data Scientist", "Senior Data Scientist", "AI Research Lead"],
      matchScore: 95,
    },
    {
      title: "Full Stack Development",
      description: "Master both frontend and backend development",
      growth: "+25%",
      demand: "High",
      salary: "$80k - $140k",
      skills: ["JavaScript", "React", "Node.js", "SQL"],
      levels: ["Junior Developer", "Full Stack Developer", "Senior Developer", "Tech Lead"],
      matchScore: 92,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Career Paths</h1>
        <p className="text-gray-600">Explore and plan your career progression with personalized pathways</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Average Growth</p>
              <p className="text-lg font-semibold text-gray-900">+28%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Skill Match</p>
              <p className="text-lg font-semibold text-gray-900">85%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Learning Paths</p>
              <p className="text-lg font-semibold text-gray-900">12 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      <div className="space-y-4">
        {careerPaths.map((path, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{path.title}</h2>
                  <p className="text-gray-600">{path.description}</p>
                </div>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {path.matchScore}% Match
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Growth Rate</p>
                    <p className="font-medium text-gray-900">{path.growth}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Market Demand</p>
                    <p className="font-medium text-gray-900">{path.demand}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium text-gray-900">{path.salary}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Career Progression</h3>
                <div className="space-y-2">
                  {path.levels.map((level, idx) => (
                    <div key={idx} className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                Explore Path
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}