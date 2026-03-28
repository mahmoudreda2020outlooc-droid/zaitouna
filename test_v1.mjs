import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Key:", apiKey.substring(0, 6) + "...");

    // Test with the OLD SDK
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Old SDK Success:", result.response.text());
    } catch (err) {
        console.error("Old SDK Error:", err.message);
    }
}
main();
