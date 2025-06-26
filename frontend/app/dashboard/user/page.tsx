'use client'

import { useState } from "react";

// Main App component
const App = () => {
  // State for user's input prompt
  const [prompt, setPrompt] = useState('Suggest a career guideline for someone interested in sustainable energy and technology.');
  // State for storing the AI's response
  const [response, setResponse] = useState('');
  // State to manage loading status during API call
  const [isLoading, setIsLoading] = useState(false);
  // State to store any errors that occur
  const [error, setError] = useState('');

  // Function to handle the API call
  const generateGuidelines = async () => {
    setIsLoading(true); // Set loading to true when starting the API call
    setError(''); // Clear any previous errors
    setResponse(''); // Clear any previous response

    try {
      const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          // IMPORTANT: For production, store your API key securely on a backend server,
          // and have your frontend call your backend, not the third-party API directly.
          // Hardcoding API keys in frontend code is a security risk.
          "Authorization": "Bearer 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",
          "HTTP-Referer": window.location.origin, // Dynamically get current origin for referer
          "X-Title": "Career Guideline Generator", // Your application title
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-chat-v3-0324:free", // Model specified by user
          "messages": [
            {
              "role": "user",
              "content": prompt // User's dynamic prompt
            }
          ]
        })
      });

      // Check if the HTTP response was successful (status code 200-299)
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json(); // Try to parse error message from API
        throw new Error(`API Error: ${apiResponse.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await apiResponse.json(); // Parse the JSON response from the API

      // Extract the content from the AI's response
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        setResponse(data.choices[0].message.content); // Set the AI's response to state
      } else {
        setError('No content found in the API response.'); // Handle cases with no content
      }

    } catch (err) {
      // Catch and display any network or parsing errors
      setError(`Failed to fetch guidelines: ${err.message}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false); // Always set loading to false after the API call
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8 flex items-center justify-center font-inter">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section: Input and Controls */}
        <div className="p-8 md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6 leading-tight">
              Craft Your <span className="text-indigo-600">Career Path</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Enter a prompt describing your interests and goals, and let AI generate personalized career guidelines for you.
            </p>

            <div className="mb-6">
              <label htmlFor="prompt" className="block text-gray-700 text-sm font-semibold mb-2">
                Your Career Prompt:
              </label>
              <textarea
                id="prompt"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y min-h-[120px] shadow-sm text-gray-800"
                placeholder="E.g., 'I want to work in AI ethics and public policy. Give me a 5-year career plan.'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
              ></textarea>
            </div>

            <button
              onClick={generateGuidelines}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-lg font-bold shadow-lg flex items-center justify-center gap-2"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  Generate Guidelines
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Section: Output Display */}
        <div className="p-8 md:w-1/2 bg-indigo-50 flex items-center justify-center rounded-r-3xl md:rounded-l-none">
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
                {/* Display response, preserving line breaks */}
                <p className="whitespace-pre-wrap">{response}</p>
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

export default App; // Export the App component as default
