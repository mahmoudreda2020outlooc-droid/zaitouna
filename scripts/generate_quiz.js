const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '.env.local' });

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
});

const LECTURES_PATH = path.join(__dirname, '../src/data/lectures.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function extractTextWithPages(relativePath) {
    if (!relativePath || relativePath === "#") return "";
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    if (!fs.existsSync(fullPath)) {
        console.warn(`File not found: ${fullPath}`);
        return "";
    }
    try {
        const dataBuffer = fs.readFileSync(fullPath);
        let pageNum = 0;
        const options = {
            pagerender: function (pageData) {
                pageNum++;
                return pageData.getTextContent().then(function (textContent) {
                    let lastY, text = `\n[SLIDE ${pageNum}]\n`;
                    for (let item of textContent.items) {
                        if (lastY != item.transform[5]) text += '\n';
                        text += item.str;
                        lastY = item.transform[5];
                    }
                    return text;
                });
            }
        };
        const data = await pdf(dataBuffer, options);
        return data.text;
    } catch (err) {
        console.error(`Error parsing PDF ${relativePath}:`, err);
        return "";
    }
}

async function generateBatch(lectureId, topic, context, type, count) {
    console.log(`Generating ${count} ${type} for ${lectureId}...`);

    const schemas = {
        mcq: `[ { "type": "mcq", "question": "...", "options": ["...", "...", "...", "..."], "answer": "exact correct option text", "explanation": "...", "topic": "...", "pageHint": "number only" } ]`,
        tf: `[ { "type": "tf", "question": "...", "answer": "true/false", "explanation": "...", "topic": "...", "pageHint": "number only" } ]`,
        essay: `[ { "type": "essay", "question": "...", "answer": "model answer", "explanation": "...", "topic": "...", "pageHint": "number only" } ]`
    };

    const prompt = `
    Based on the following materials for the lecture "${topic}", generate exactly ${count} ${type} questions in English.
    
    Materials context (contains [SLIDE X] markers):
    ${context.substring(0, 15000)}

    IMPORTANT: For each question, identify the exact [SLIDE X] where the answer is found and put that number in the "pageHint" field.

    Return the result ONLY as a JSON array following this schema:
    ${schemas[type]}
    `;

    try {
        const result = await client.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let text = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        if (error.status === 429) {
            console.warn("Rate limited. Waiting 60s...");
            await sleep(60000);
            return generateBatch(lectureId, topic, context, type, count);
        }
        console.error(`Error in batch ${type} for ${lectureId}:`, error);
        return [];
    }
}

async function run() {
    const data = JSON.parse(fs.readFileSync(LECTURES_PATH, 'utf8'));

    for (let i = 0; i < data.length; i++) {
        const lect = data[i];

        // Skip if already has enough questions with pageHint (heuristic)
        if (lect.quiz && lect.quiz.length >= 70 && lect.quiz[0].pageHint) {
            console.log(`Skipping ${lect.id} (already has ${lect.quiz.length} questions with hints)`);
            continue;
        }

        console.log(`\n--- Processing ${lect.id}: ${lect.title} ---`);

        const pdfText = await extractTextWithPages(lect.resources.pdf);
        const sheetText = await extractTextWithPages(lect.resources.sheet);

        const fullContext = `
            Lecture PDF Text: ${pdfText}
            Sheet Text: ${sheetText}
        `;

        const allQuestions = [];
        const batches = [
            { type: 'mcq', count: 25 },
            { type: 'tf', count: 25 },
            { type: 'essay', count: 25 }
        ];

        for (const batch of batches) {
            const questions = await generateBatch(lect.id, lect.title, fullContext, batch.type, batch.count);
            if (questions && Array.isArray(questions)) {
                allQuestions.push(...questions);
                console.log(`Added ${questions.length} ${batch.type} questions.`);
            }
            await sleep(10000);
        }

        if (allQuestions.length > 0) {
            lect.quiz = allQuestions;
            fs.writeFileSync(LECTURES_PATH, JSON.stringify(data, null, 2));
            console.log(`Total questions for ${lect.id}: ${allQuestions.length}`);
        }

        await sleep(20000);
    }
    console.log('Finished all lectures!');
}

run();
