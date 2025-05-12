'use client';
import { TrendingUp, Users, Award, ArrowRight, Briefcase, BookOpen } from 'lucide-react';

export default function HomePage() {
  const jobRecommendations = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      salary: '$120K - $150K',
      matchScore: 92,
    },
    {
      title: 'Data Scientist',
      company: 'AI Solutions',
      location: 'New York, NY',
      salary: '$110K - $140K',
      matchScore: 88,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to GradGuide</h1>
        <p className="text-white/90 mb-4">Your personalized career guidance platform</p>
        <div className="flex items-center text-sm">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            Profile completion: 75%
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Job Matches</p>
              <p className="text-lg font-semibold text-gray-900">24 new</p>
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
              <p className="text-lg font-semibold text-gray-900">12 matches</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Skills Growth</p>
              <p className="text-lg font-semibold text-gray-900">+15%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Achievements</p>
              <p className="text-lg font-semibold text-gray-900">3 earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {jobRecommendations.map((job, index) => (
              <div key={index} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {job.matchScore}% Match
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Coach Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Need Career Guidance?</h2>
            <p className="text-white/90 mb-4">Get personalized advice from our AI Career Coach</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              Chat with AI Coach
            </button>
          </div>
          <div className="p-3 bg-white/20 rounded-xl">
            {/* <Bot className="h-8 w-8 text-white" /> */}
          </div>
        </div>
      </div>
    </div>
  );
}