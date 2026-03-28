import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    const client = new GoogleGenAI({ apiKey });

    try {
        const result = await client.models.generateContent({
            model: "gemini-1.5-flash",
            contents: "Hi"
        });
        console.log("Success with gemini-1.5-flash:");
        console.log(result.text);
    } catch (err) {
        console.error("Error with gemini-1.5-flash:");
        console.error(err.message || JSON.stringify(err));
    }
}

main();
