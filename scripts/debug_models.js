const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const result = await ai.models.list();
        fs.writeFileSync('model_debug.json', JSON.stringify(result, null, 2));
        console.log(`Saved result to model_debug.json`);
    } catch (e) {
        fs.writeFileSync('model_error.txt', e.toString() + "\n" + JSON.stringify(e));
        console.error(e);
    }
}
listModels();
