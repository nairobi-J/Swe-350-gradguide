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

    // Construct detailed prompt
    const prompt = `
    Generate a comprehensive career development plan with these details:
    
    **Primary Interest**: ${req.body.interest}
    **Education**:
      - University: ${req.body.university || 'Not specified'}
      - Degree: ${req.body.degree || 'Not specified'}
      - GPA: ${req.body.cgpa || 'Not provided'}
    
    **Professional Level**: ${req.body.careerLevel || 'Not specified'}
    
    **Technical Skills**: 
      ${req.body.stacks || 'None listed'}
    
    **Projects**:
      ${req.body.projects || 'No projects mentioned'}
    
    **Work Experience**:
      ${req.body.priorExperience || 'No prior experience'}
    
    **Current Focus**: 
      ${req.body.shortSummary || 'Not specified'}
    
    **Output Preferences**:
      - Format: ${req.body.outputFormat || 'Detailed steps with timeline'}
    
    Provide:
    1. Skill development roadmap
    2. Project recommendations
    3. Job search strategies
    4. Networking advice
    5. Salary expectations
    6. Industry trends analysis
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    });
    
    const responseText = result.response.text();

    // Format the response with Markdown
    res.json({ 
      success: true,
      data: responseText,
      structuredPrompt: prompt // Optional: for debugging
    });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      success: false,
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Failed to generate guidelines',
      errorType: error.constructor.name
    });
  }
};