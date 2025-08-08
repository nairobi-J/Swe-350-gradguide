'use client'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { useState } from "react";
<<<<<<< HEAD

// Main App component
const App = () => {
  // State for user's primary interest/goal
  const [interest, setInterest] = useState('Machine Learning and AI, healthcare technology, and data science');
  const [editingInterest, setEditingInterest] = useState(false); // New state for edit mode

  // State for desired output format/detail
  const [outputFormat, setOutputFormat] = useState('a comprehensive career guideline with actionable steps');
  const [editingOutputFormat, setEditingOutputFormat] = useState(false); // New state for edit mode

  // State for university input
  const [university, setUniversity] = useState('Shahjalal University of Science and Technology');
  const [editingUniversity, setEditingUniversity] = useState(false); // New state for edit mode

  // State for degree/major
  const [degree, setDegree] = useState('Software Engineering');
  const [editingDegree, setEditingDegree] = useState(false); // New state for edit mode

  // State for desired career level
  const [careerLevel, setCareerLevel] = useState('Student');
  const [editingCareerLevel, setEditingCareerLevel] = useState(false); // New state for edit mode

   const [projects, setProjects] = useState('Home Rental App, Chat Application, Portfolio Website');
  const [editingProjects, setEditingProjects] = useState(false);

   const [stacks, setStacks] = useState('Mern, java , postgreSQL, MySQL, Firebase');
  const [editingStacks, setEditingStacks] = useState(false);

   const [priorExperience, setPriorExperience] = useState('worked part-time at a tech startup');
  const [editingPriorExperience, setEditingPriorExperience] = useState(false);



   const [cgpa, setCgpga] = useState('3.54');
  const [editingCgpa, setEditingCgpa] = useState(false);
    
   //it should be fetched from his search , his starts interests and all
   const [shortSummary, setShortSummary] = useState('searching for remote jobs or higher studies');
=======
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
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19

  // State for storing the AI's response
  const [response, setResponse] = useState('');
  // State to manage loading status during API call
  const [isLoading, setIsLoading] = useState(false);
  // State to store any errors that occur
  const [error, setError] = useState('');
<<<<<<< HEAD

  // Function to handle the API call
  const generateGuidelines = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // --- Dynamic Prompt Construction ---
      let basePrompt = `Suggest career guidelines for someone interested in ${interest}.`;

      if (university) {
        basePrompt += ` currently studying at ${university}.`;
      }
      if (degree) {
        basePrompt += `major/degree is ${degree}.`;
      }
      if (careerLevel) {
        basePrompt += ` looking for ${careerLevel} `;
      }
       if (projects) {
        basePrompt += `doing projects: ${projects}`;
      }
       if (stacks) {
        basePrompt += `Stacks worked with: ${stacks} `;
      }
       if (priorExperience) {
        basePrompt += ` prior experiences ${priorExperience} `;
      }
    
      if (cgpa) {
        basePrompt += ` cgpa ${cgpa} career advice.`;
      }
       if (shortSummary) {
        basePrompt += ` cgpa ${shortSummary} career advice.`;
      }

      

      const fullPrompt = `${basePrompt} Please provide ${outputFormat}.`;
      // --- End Dynamic Prompt Construction ---

      const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_DeepS}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Career Guideline Generator",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324:free",
          "messages": [
            {
              "role": "user",
              "content": fullPrompt
            }
          ]
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(`API Error: ${apiResponse.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await apiResponse.json();

      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        setResponse(data.choices[0].message.content);
      } else {
        setError('No content found in the API response.');
      }

    } catch (err) {
      setError(`Failed to fetch guidelines: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };
=======
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
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19

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
<<<<<<< HEAD
    <div className="mb-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-gray-700 text-sm font-semibold">
          {label}:
        </label>
        <button
          onClick={() => setEditingState(!editingState)}
          className="p-1 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150"
          aria-label={`Edit ${label}`}
        >
          {editingState ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg> // Checkmark icon for done editing
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.109 7.391L11.391 10 7 14.391V17h2.609l4.391-4.391-1.414-1.414z" />
            </svg> // Pencil icon for edit
=======
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
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
          )}
        </button>
      </div>

      {editingState ? (
        isTextArea ? (
          <textarea
<<<<<<< HEAD
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            value={value}
            onChange={(e) => setter(e.target.value)}
            rows={isTextArea && label.includes('Output') ? 2 : 1} // Adjust rows for output format
=======
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all duration-200 resize-none"
            value={value}
            onChange={(e) => setter(e.target.value)}
            rows={3}
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
<<<<<<< HEAD
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
=======
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 bg-slate-50 focus:bg-white transition-all duration-200"
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
<<<<<<< HEAD
        <p className="text-gray-800 break-words min-h-[24px]">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
=======
        <p className="text-slate-800 text-base leading-relaxed min-h-[1.5rem]">
          {value || <span className="text-slate-400 italic">Click to add information</span>}
        </p>
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
      )}
    </div>
  );

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 items-center justify-center font-inter">
      <div className=" w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col ">
        {/* Left Section: Input and Controls */}
        <div className="p-8 md:w-1/2 flex flex-row justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
              Craft Your <span className="text-indigo-600">Career Path</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Review and adjust your details below, then generate personalized career guidelines.
            </p>

            {/* Editable Fields Section */}
            <div className="p-2 mb-6 flex justify-center gap-3">
              {renderEditableField(
                "Primary Career Interest/Goal",
                interest,
                setInterest,
                editingInterest,
                setEditingInterest,
                true, // This is a textarea
                "E.g., 'AI ethics and public policy'"
              )}
              {renderEditableField(
                "Your University",
                university,
                setUniversity,
                editingUniversity,
                setEditingUniversity,
                false,
                "E.g., 'Stanford University'"
              )}
              {renderEditableField(
                "CGPA",
                cgpa,
                setCgpga,
                editingCgpa,
                setEditingCgpa,
                false,
                "E.g., '3.6'"
              )}
              {renderEditableField(
                "Your Degree/Major",
                degree,
                setDegree,
                editingDegree,
                setEditingDegree,
                false,
                "E.g., 'Computer Science'"
              )}
              {renderEditableField(
                "Desired Career Level",
                careerLevel,
                setCareerLevel,
                editingCareerLevel,
                setEditingCareerLevel,
                false,
                "E.g., 'entry-level', 'mid-career'"
              )}
               {renderEditableField(
                "Projects",
                projects,
                setProjects,
                editingProjects,
                setEditingProjects,
                false,
                "E.g., 'Booking app', 'Chat app', 'Portfolio website'"
              )}
               {renderEditableField(
                "Stacks",
                stacks,
                setStacks,
                editingStacks,
                setEditingStacks,
                false,
                "E.g., 'MERN', 'PostGreSQL'"
              )}
               {renderEditableField(
                "Prior Experience",
                priorExperience,
                setPriorExperience,
                editingPriorExperience,
                setEditingPriorExperience,
                false,
                "E.g., 'did remote job', 'worked in a startup', 'interned at a tech company'"
              )}
              {renderEditableField(
                "Desired Output Format",
                outputFormat,
                setOutputFormat,
                editingOutputFormat,
                setEditingOutputFormat,
                true, // This is a textarea
                "E.g., 'a 5-year career plan with specific milestones'"
              )}
              <p className="text-black">{shortSummary}</p>

            </div>

            <button
              onClick={generateGuidelines}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-bold shadow-lg flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5  text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  Generate Guidelines
                  <svg className=" h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Output Display */}
        <div className="p-8  bg-indigo-50 flex items-center justify-center rounded-r-3xl md:rounded-l-none">
          <div className="bg-white p-6 rounded-2xl shadow-inner border border-indigo-100 w-full min-h-[300px] flex flex-col justify-start overflow-auto">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            {response ? (
              <div className="text-gray-800 leading-relaxed prose prose-indigo max-w-none">
                <h3 className="text-xl font-bold text-indigo-700 mb-3">Your Personalized Guideline:</h3>
                {/* Use ReactMarkdown to render the response */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-gray-500 text-center flex flex-col items-center justify-center flex-grow">
                {isLoading ? (
                  <p>Awaiting AI response...</p>
                ) : (
                  <p>Your career guidelines will appear here after generation.</p>
                )}
              </div>
            )}
=======
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
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default CareerPathGenerator;
>>>>>>> 7e59814f67febc65859046c5ce5db8127204fc19
