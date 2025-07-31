'use client'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { useState } from "react";

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



   const [cgpa, setCgpga] = useState('0.00');
  const [editingCgpa, setEditingCgpa] = useState(false);
    
   //it should be fetched from his search , his starts interests and all
   const [shortSummary, setShortSummary] = useState('searching for remote jobs or higher studies');

  // State for storing the AI's response
  const [response, setResponse] = useState('');
  // State to manage loading status during API call
  const [isLoading, setIsLoading] = useState(false);
  // State to store any errors that occur
  const [error, setError] = useState('');

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
          )}
        </button>
      </div>

      {editingState ? (
        isTextArea ? (
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            value={value}
            onChange={(e) => setter(e.target.value)}
            rows={isTextArea && label.includes('Output') ? 2 : 1} // Adjust rows for output format
            placeholder={placeholder}
          />
        ) : (
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            value={value}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className="text-gray-800 break-words min-h-[24px]">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
      )}
    </div>
  );

  return (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;