import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getTutorResponse = async (prompt: string, context: string) => {
  const systemInstruction = `
    You are an expert Data Science Tutor. 
    The user is learning ${context}. 
    Provide clear, concise, and accurate explanations. 
    Include code examples using Python, Pandas, or Spark where appropriate.
    Focus on practical application for Data Analysts.
    Use Markdown for formatting.
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ parts: [{ text: systemInstruction + "\n\nUser Question: " + prompt }] }],
  });
  return response.text || "I couldn't generate a response.";
};
