import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const apiKey = process.env.GEMINI_API_KEY;
    const client = new GoogleGenAI({ apiKey });

    try {
        const response = await client.models.list();
        for await (const model of response) {
            if (model.name.includes("flash") || model.name.includes("pro")) {
                console.log(model.name);
            }
        }
    } catch (err) {
        console.error("List Models Error:", err.message);
    }
}
main();
