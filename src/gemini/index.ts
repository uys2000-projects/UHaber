import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.API_KEY) throw new Error("API_KEY Not Exsists");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const fakePromise = (t: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), t));
export const ask = async function (prompt: string) {
  await fakePromise(60000);
  return await model.generateContent(prompt);
};
