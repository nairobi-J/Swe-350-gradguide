'use client'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, SetStateAction, useState } from "react";
import { Edit2, Check, Sparkles, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
//import parseRoadmapdata from './parseRoadmapdata';
//import parseRoadmapData from './parseRoadmapdata';
import RoadMap from './Roadmap'
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
   const [parsedData, setParsedData] = useState<{ tasks: any[]; milestones: any[] }>({ tasks: [], milestones: [] });
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
    //const parsed = parseRoadmapData(data.data);
    //console.log(parsed);
    //setParsedData(parsed);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setIsLoading(false);
  }
};

  const renderEditableField = (
    label: string,
    value: string,
    setter: (value: SetStateAction<string>) => void,
    editingState: boolean,
    setEditingState: (value: SetStateAction<boolean>) => void,
    isTextArea = false,
    placeholder = ''
) => (
    <div
        className="relative bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200"
        onClick={() => setEditingState(true)}
    >
        <label className="block text-slate-500 text-xs font-semibold tracking-wider uppercase mb-1">
            {label}
        </label>
        {editingState ? (
            isTextArea ? (
                <textarea
                    className="w-full text-slate-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-transparent resize-none"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    rows={Math.max(3, value.split('\n').length)}
                    placeholder={placeholder}
                    autoFocus
                    onBlur={() => setEditingState(false)}
                />
            ) : (
                <input
                    type="text"
                    className="w-full text-slate-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-transparent"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={placeholder}
                    autoFocus
                    onBlur={() => setEditingState(false)}
                />
            )
        ) : (
            <p className="text-slate-900 text-sm leading-snug min-h-[1.5rem]">
                {value || <span className="text-slate-400 italic">Click to add information</span>}
            </p>
        )}
        <button
            onClick={(e) => {
                e.stopPropagation();
                setEditingState(!editingState);
            }}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            aria-label={`Edit ${label}`}
        >
            {editingState ? (
                <Check className="h-4 w-4" />
            ) : (
                <Edit2 className="h-4 w-4" />
            )}
        </button>
    </div>
);
return (
    <div className="flex h-screen w-full bg-slate-50 hidden-scrollbar">
        {/* Left Section: Input and Controls */}
        <div className="w-1/2 p-8 overflow-y-auto hidden-scrollbar">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-100 rounded-xl">
                            <Sparkles className="h-7 w-7 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                                Road Map <span className="text-indigo-600">Generator</span>
                            </h1>
                            <p className="text-slate-600 text-lg mt-1">
                                AI-powered personalized career guidance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateGuidelines}
                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mb-8"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating Career Guidance...
                        </>
                    ) : (
                        <>
                            Generate Roadmap
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderEditableField("Career Interest", interest, setInterest, editingInterest, setEditingInterest, true)}
                    {renderEditableField("University", university, setUniversity, editingUniversity, setEditingUniversity)}
                    {renderEditableField("Degree/Major", degree, setDegree, editingDegree, setEditingDegree)}
                    {renderEditableField("Career Level", careerLevel, setCareerLevel, editingCareerLevel, setEditingCareerLevel)}
                    {renderEditableField("CGPA", cgpa, setCgpa, editingCgpa, setEditingCgpa)}
                    {renderEditableField("Tech Stack", stacks, setStacks, editingStacks, setEditingStacks)}
                    {renderEditableField("Projects", projects, setProjects, editingProjects, setEditingProjects, true)}
                    {renderEditableField("Experience", priorExperience, setPriorExperience, editingPriorExperience, setEditingPriorExperience, true)}
                    {renderEditableField("Output Format", outputFormat, setOutputFormat, editingOutputFormat, setEditingOutputFormat, true)}
                </div>
            </div>
        </div>

        {/* Right Section: Output Display */}
        <div className="w-1/2 p-8 overflow-y-auto hidden-scrollbar">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-slate-800">Your Career Roadmap</h2>
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3 mb-6">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Error generating guidelines</p>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {response ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-800">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {response}
                        </ReactMarkdown>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-sm">
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
                            <div>
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
);
};

export default CareerPathGenerator;

