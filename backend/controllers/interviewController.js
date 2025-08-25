const pool = require('../db')

const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY2;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
// Use a model suitable for this task. gemini-1.5-flash-latest is a great choice.
const MODEL_NAME = "gemini-2.0-flash";

const getInterviewQuestions  = async (req, res) => {
     try {
    const { topic, difficulty, count = 5 } = req.body;

    // The Gemini API requires a specific payload structure.
    const payload = {
      // The `contents` field is used for messages.
      contents: [
        {
          role: "user",
          // The `parts` array contains the text or other content.
          parts: [
            {
              text: `Generate ${count} ${difficulty} level interview questions about ${topic} with answers. Return the response as a JSON array of objects, where each object has a 'question' and 'answer' field.`
            }
          ]
        }
      ],
      // This is crucial for getting a structured JSON response.
      generationConfig: {
        responseMimeType: "application/json",
        // The `responseSchema` ensures the model adheres to a specific format.
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "question": { "type": "STRING" },
              "answer": { "type": "STRING" }
            },
            required: ["question", "answer"]
          }
        }
      }
    };

    const response = await axios.post(
      `${GEMINI_BASE_URL}/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // The structured JSON is located in a different part of the Gemini response object.
    const content = JSON.parse(response.data.candidates[0].content.parts[0].text);
    const questions = Array.isArray(content) ? content : [content];

    res.json({ questions });
  } catch (error) {
    console.error("Gemini API error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
}

const evaluateAnswer = async(req, res) => {
      try {
    const { questions } = req.body;

    // The payload for an unstructured text response is simpler.
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Please evaluate these interview responses:\n\n${questions.map(q =>
                `Question: ${q.question}\nResponse: ${q.userResponse}`
              ).join('\n\n')}\n\nProvide detailed feedback on technical accuracy, completeness, and clarity. Rate each response out of 10 and give an overall evaluation.`
            }
          ]
        }
      ]
    };

    const response = await axios.post(
      `${GEMINI_BASE_URL}/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // The unstructured text response is also located in a different path.
    const evaluation = response.data.candidates[0].content.parts[0].text;

    res.json({ evaluation });
  } catch (error) {
    console.error("Gemini API error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to evaluate interview" });
  }
}


module.exports = {getInterviewQuestions, evaluateAnswer}