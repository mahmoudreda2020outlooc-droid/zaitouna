require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/lectures.json');

async function main() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelName = "gemini-2.0-flash";


    const lecture = data.find(l => l.id === "net_301_lecture_1");
    if (!lecture) {
        console.error("Lecture not found!");
        return;
    }

    console.log(`Translating ${lecture.id}...`);

    for (let i = 0; i < lecture.quiz.length; i++) {
        const q = lecture.quiz[i];
        const prompt = `
            Translate this quiz item into clear academic English.
            Return ONLY JSON with keys: question, options, answer, explanation.
            
            Item:
            ${JSON.stringify({
            question: q.question,
            options: q.options || [],
            answer: q.answer,
            explanation: q.explanation
        })}
        `;

        const result = await client.models.generateContent({
            model: modelName,
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const text = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());

        q.question_ar = q.question;
        q.options_ar = q.options;
        q.answer_ar = q.answer;
        q.explanation_ar = q.explanation;

        q.question = parsed.question;
        q.options = parsed.options;
        q.answer = parsed.answer;
        q.explanation = parsed.explanation;

        console.log(`  ✓ Translated Q${i + 1}`);
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log("Done!");
}

main();
