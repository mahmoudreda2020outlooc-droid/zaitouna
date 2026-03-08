const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const result = await ai.models.list();
        if (result && result.models) {
            result.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found in the result");
            console.log(JSON.stringify(result));
        }
    } catch (e) {
        console.error(e);
    }
}
listModels();
