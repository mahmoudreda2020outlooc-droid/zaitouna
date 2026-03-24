const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function test() {
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-lite',
            contents: 'Say Hello',
        });
        console.log('--- RESPONSE STRUCTURE ---');
        console.log(JSON.stringify(response, null, 2));
        console.log('--- RESPONSE TEXT ---');
        console.log(response.text);
    } catch (e) {
        console.error('--- ERROR ---', e.message);
    }
}
test();
