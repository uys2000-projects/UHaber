import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.API_KEY) throw new Error("API_KEY Not Exsists");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const ask = async function (prompt: string) {
  return await model.generateContent(prompt);
};
