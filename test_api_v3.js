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

async function test() {
    const model = "gemini-flash-latest";
    try {
        console.log(`Testing multimodal with ${model}...`);
        // Smallest 1x1 transparent PNG base64
        const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

        const response = await client.models.generateContent({
            model: model,
            contents: [{
                role: "user",
                parts: [
                    { text: "Describe this image." },
                    { inlineData: { data: dummyImage, mimeType: "image/png" } }
                ]
            }],
            config: {
                systemInstruction: "You are a helpful assistant."
            }
        });
        console.log("Success! Response:", response.text);
    } catch (err) {
        console.error(`Error with ${model}:`, err.message);

        const modelWithPrefix = `models/${model}`;
        console.log(`Retrying with prefix: ${modelWithPrefix}...`);
        try {
            const response = await client.models.generateContent({
                model: modelWithPrefix,
                contents: [{ role: "user", parts: [{ text: "Hi" }] }],
                config: {
                    systemInstruction: "You are a helpful assistant."
                }
            });
            console.log("Success with prefix! Response:", response.text);
        } catch (err2) {
            console.error(`Error with prefix:`, err2.message);
        }
    }
}

test();
