const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function testModel() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelName = 'gemini-2.0-flash-lite';
    try {
        console.log(`Testing model: ${modelName}`);
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        });
        console.log("Success!");
        console.log(response.text);
    } catch (e) {
        console.error(`Failed with ${modelName}:`, e.message);
    }
}
testModel();
