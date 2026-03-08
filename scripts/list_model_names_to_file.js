const { GoogleGenAI } = require('@google/genai');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    try {
        const result = await ai.models.list();
        const names = result.models.map(m => m.name);
        fs.writeFileSync('model_names.txt', names.join('\n'));
        console.log(`Saved ${names.length} model names to model_names.txt`);
    } catch (e) {
        fs.writeFileSync('model_error.txt', e.toString());
        console.error(e);
    }
}
listModels();
