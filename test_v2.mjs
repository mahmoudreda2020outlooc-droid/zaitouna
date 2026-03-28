import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Key:", apiKey.substring(0, 6) + "...");

    const client = new GoogleGenAI({ apiKey });

    try {
        const finalContents = [
            { role: "user", parts: [{ text: "Hello, what models are best?" }] }
        ];
        console.log("Trying gemini-2.0-flash...");
        const result = await client.models.generateContent({
            model: "gemini-2.0-flash",
            contents: finalContents
        });

        let generatedText = "";
        if (result.text) {
            generatedText = result.text;
        } else if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            generatedText = result.candidates[0].content.parts[0].text;
        }

        console.log("Success:", generatedText);
    } catch (err) {
        console.error("V2 Error:", err.message);
    }
}
main();
