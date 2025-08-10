'use client'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { useState } from "react";
import { Edit2, Check, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const CareerPathGenerator = () => {
  // State for user's primary interest/goal
  const [interest, setInterest] = useState('Machine Learning and AI, healthcare technology, and data science');
  const [editingInterest, setEditingInterest] = useState(false);

  // State for desired output format/detail
  const [outputFormat, setOutputFormat] = useState('a comprehensive career guideline with actionable steps');
  const [editingOutputFormat, setEditingOutputFormat] = useState(false);

  // State for university input
  const [university, setUniversity] = useState('Shahjalal University of Science and Technology');
  const [editingUniversity, setEditingUniversity] = useState(false);

  // State for degree/major
  const [degree, setDegree] = useState('Software Engineering');
  const [editingDegree, setEditingDegree] = useState(false);

  // State for desired career level
  const [careerLevel, setCareerLevel] = useState('Student');
  const [editingCareerLevel, setEditingCareerLevel] = useState(false);

  const [projects, setProjects] = useState('Home Rental App, Chat Application, Portfolio Website');
  const [editingProjects, setEditingProjects] = useState(false);

  const [stacks, setStacks] = useState('MERN, Java, PostgreSQL, MySQL, Firebase');
  const [editingStacks, setEditingStacks] = useState(false);

  const [priorExperience, setPriorExperience] = useState('worked part-time at a tech startup');
  const [editingPriorExperience, setEditingPriorExperience] = useState(false);

  const [cgpa, setCgpa] = useState('3.75');
  const [editingCgpa, setEditingCgpa] = useState(false);
    
  const [shortSummary, setShortSummary] = useState('searching for remote jobs or higher studies');

  // State for storing the AI's response
  const [response, setResponse] = useState('');
  // State to manage loading status during API call
  const [isLoading, setIsLoading] = useState(false);
  // State to store any errors that occur
  const [error, setError] = useState('');
  const AZURE_BACKEND_URL = process.env.NEXT_PUBLIC_AZURE_BACKEND_URL;
const generateGuidelines = async () => {
  setIsLoading(true);
  setError('');
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AZURE_BACKEND_URL}/generate/response`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interest,
          university,
          // ... other fields
        })
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    
    setResponse(data.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  // Helper function to render an editable field
  const renderEditableField = (
    label,
    value,
    setter,
    editingState,
    setEditingState,
    isTextArea = false,
    placeholder = ''
  ) => (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <label className="block text-slate-700 text-sm font-semibold tracking-wide uppercase opacity-75">
          {label}
        </label>
        <button
          onClick={() => setEditingState(!editingState)}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Edit ${label}`}
        >
          {editingState ? (
            <Check className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {editingState ? (
        isTextArea ? (
          <textarea
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all duration-200 resize-none"
            value={value}
            onChange={(e) => setter(e.target.value)}
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all duration-200"
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className="text-slate-800 text-base leading-relaxed min-h-[1.5rem]">
          {value || <span className="text-slate-400 italic">Click to add information</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container max-w-7xl mx-auto p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[90vh]">
            
            {/* Left Section: Input and Controls */}
            <div className="lg:w-1/2 p-8 lg:p-12 border-r border-slate-200">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Sparkles className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                        Career Path <span className="text-indigo-600">Generator</span>
                      </h1>
                      <p className="text-slate-600 text-lg mt-1">
                        AI-powered personalized career guidance
                      </p>
                    </div>
                  </div>
                  <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>

                {/* Form Fields */}
                <div className="flex-grow space-y-6 mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderEditableField(
                      "Career Interest",
                      interest,
                      setInterest,
                      editingInterest,
                      setEditingInterest,
                      true,
                      "e.g., AI ethics and public policy"
                    )}
                    {renderEditableField(
                      "University",
                      university,
                      setUniversity,
                      editingUniversity,
                      setEditingUniversity,
                      false,
                      "e.g., Stanford University"
                    )}
                    {renderEditableField(
                      "Degree/Major",
                      degree,
                      setDegree,
                      editingDegree,
                      setEditingDegree,
                      false,
                      "e.g., Computer Science"
                    )}
                    {renderEditableField(
                      "Career Level",
                      careerLevel,
                      setCareerLevel,
                      editingCareerLevel,
                      setEditingCareerLevel,
                      false,
                      "e.g., Student, Entry-level, Mid-career"
                    )}
                    {renderEditableField(
                      "CGPA",
                      cgpa,
                      setCgpa,
                      editingCgpa,
                      setEditingCgpa,
                      false,
                      "e.g., 3.75"
                    )}
                    {renderEditableField(
                      "Tech Stack",
                      stacks,
                      setStacks,
                      editingStacks,
                      setEditingStacks,
                      false,
                      "e.g., MERN, Java, PostgreSQL"
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {renderEditableField(
                      "Projects",
                      projects,
                      setProjects,
                      editingProjects,
                      setEditingProjects,
                      true,
                      "e.g., E-commerce platform, Mobile app, Portfolio website"
                    )}
                    {renderEditableField(
                      "Experience",
                      priorExperience,
                      setPriorExperience,
                      editingPriorExperience,
                      setEditingPriorExperience,
                      true,
                      "e.g., Internship at tech company, freelance work"
                    )}
                    {renderEditableField(
                      "Output Format",
                      outputFormat,
                      setOutputFormat,
                      editingOutputFormat,
                      setEditingOutputFormat,
                      true,
                      "e.g., 5-year roadmap with specific milestones"
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Current Focus</span>
                    </div>
                    <p className="text-slate-800 text-base">{shortSummary}</p>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateGuidelines}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Career Guidance...
                      </>
                    ) : (
                      <>
                        Generate Career Roadmap
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Right Section: Output Display */}
            <div className="lg:w-1/2 bg-slate-50 p-8 lg:p-12 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-slate-800">Your Career Roadmap</h2>
              </div>

              <div className="flex-grow bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3 mb-6">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error generating guidelines</p>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                {response ? (
                  <div className="flex-grow overflow-auto">
                    <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-800">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {response}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
                          </div>
                          <div>
                            <p className="text-slate-600 font-medium">Analyzing your profile...</p>
                            <p className="text-slate-500 text-sm mt-1">This may take a few moments</p>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-sm">
                          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Sparkles className="h-12 w-12 text-slate-400" />
                          </div>
                          <p className="text-slate-600 font-medium mb-2">Ready to generate your roadmap</p>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            Click "Generate Career Roadmap" to receive personalized guidance based on your profile and goals.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPathGenerator;
