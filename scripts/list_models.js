const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const models = await ai.models.list();
        console.log(JSON.stringify(models, null, 2));
    } catch (e) {
        console.error(e);
    }
}
listModels();
