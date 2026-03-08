import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Manually load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

async function listModels() {
    try {
        console.log("Checking API Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
        const models = await client.models.list();
        console.log("Available Models:");
        for await (const model of models) {
            console.log(`- ${model.name}`);
        }
    } catch (err) {
        console.error("Error listing models:", err.message);
    }
}

listModels();
