const { GoogleGenAI } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Testing getGenerativeModel...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("Success with getGenerativeModel:", result.response.text());
    } catch (e1) {
        console.log("Failed getGenerativeModel:", e1.message);
        try {
            console.log("Testing ai.models.generateContent...");
            const result = await genAI.models.generateContent({
                model: "gemini-1.5-flash",
                contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
            });
            console.log("Success with generateContent:", result.text);
        } catch (e2) {
            console.log("Failed generateContent:", e2.message);
        }
    }
}

test();
