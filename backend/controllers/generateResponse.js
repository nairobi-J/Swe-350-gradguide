const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateGuidelines = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.interest) {
      return res.status(400).json({
        success: false,
        message: "Career interest is required"
      });
    }

    // Construct detailed prompt with EXPLICIT JSON formatting instructions
    const prompt = `
    Generate a comprehensive career development plan for a person with the following profile. 
    Your entire response MUST be a valid JSON array of objects. Each object should have two fields: 
    - 'title': A string representing the section title (e.g., "Skill Development Roadmap")
    - 'content': A string containing the detailed advice for that section. Use Markdown for formatting within this string (e.g., **bold**, *italic*, lists).

    **Profile:**
    Primary Interest: ${req.body.interest}
    University: ${req.body.university || 'Not specified'}
    Degree: ${req.body.degree || 'Not specified'}
    GPA: ${req.body.cgpa || 'Not provided'}
    Professional Level: ${req.body.careerLevel || 'Not specified'}
    Technical Skills: ${req.body.stacks || 'None listed'}
    Projects: ${req.body.projects || 'No projects mentioned'}
    Work Experience: ${req.body.priorExperience || 'No prior experience'}
    Current Focus: ${req.body.shortSummary || 'Not specified'}

    **Generate the career plan as a JSON array with the following sections:**
    [
      { "title": "Skill Development Roadmap", "content": "detailed text here..." },
      { "title": "Project Recommendations", "content": "detailed text here..." },
      { "title": "Job Search Strategies", "content": "detailed text here..." },
      { "title": "Networking Advice", "content": "detailed text here..." },
      { "title": "Salary Expectations & Negotiation", "content": "detailed text here..." },
      { "title": "Industry Trends Analysis", "content": "detailed text here..." }
    ]
    `;

    // Get the model instance
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      // CRUCIAL: Configure generation for JSON output
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // Generate content
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // The response should be a JSON string. Parse it.
    let careerPlanData;
    try {
      careerPlanData = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback in case the response isn't clean JSON
      console.error("Failed to parse Gemini response as JSON:", responseText);
      // You could implement a fallback parsing strategy here if needed
      throw new Error("AI response was not in the expected JSON format.");
    }

    // Ensure it's an array before sending
    if (!Array.isArray(careerPlanData)) {
      careerPlanData = [careerPlanData];
    }

    // Send the structured data to the frontend
    res.json({
      success: true,
      data: careerPlanData // This is now a clean array of objects
    });

  } catch (error) {
    console.error("Career plan generation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate career plan",
      error: error.message
    });
  }
};