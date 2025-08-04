const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateGuidelines = async (req, res) => {
  try {
    // Verify API key is loaded
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    // Use the CURRENT model name (as of July 2024)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest"  // Updated to latest model
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: `Brief career advice for ${req.body.interest}` }]
      }]
    });
    
    res.json({ 
      success: true,
      data: result.response.text() 
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message,
      errorType: error.constructor.name
    });
  }
};