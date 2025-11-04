import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

// ⚠️ WARNING: Hardcoding API keys in frontend is unsafe for production.
// Only do this for quick local testing.
const API_KEY = "AIzaSyAH3xEyD6t48IdZrmBVEkgvWthdN-WqhsM";

const GenAiChat = () => {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Create a single client object
  const ai = new GoogleGenAI({
    apiKey: API_KEY,
  });

  const handleGemini = async () => {
    if (!prompt.trim()) {
      setResponseText("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setResponseText("");

    try {
      const quizPrompt = `Generate a quiz with 5 multiple choice questions about ${prompt}. 
Return ONLY a valid JSON object with no additional text, markdown, or code blocks.
The JSON must strictly follow this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: quizPrompt,
      });

      let result = response.text;

      // Clean the response from code blocks
      const cleanedResponse = result
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const quizData = JSON.parse(cleanedResponse);

      // Display the questions only
      setResponseText(quizData.questions.map(q => q.question).join("\n\n"));
    } catch (error) {
      console.error("Error:", error);
      setResponseText("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <div>
        <h2>ASK GEMINI</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          cols={50}
          placeholder="Enter your prompt here"
        />
      </div>
      <button
        style={{ marginTop: 10, marginBottom: 10 }}
        onClick={handleGemini}
      >
        {loading ? "Thinking..." : "Answer"}
      </button>
      <div
        style={{
          width: "80vw",
          minHeight: "100px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <strong>Response:</strong>
        <p
          style={{
            minHeight: "500px",
            width: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            textAlign: "left",
            backgroundColor: "#3B3B3B",
            color: "lightgray",
            padding: 10,
            borderRadius: 10,
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >
          {responseText}
        </p>
      </div>
    </>
  );
};

export default GenAiChat;
