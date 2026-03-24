const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing from .env.local file.");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey: apiKey });
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function normalizeChunk(quizChunk, lectureTitle, retryCount = 0) {
    const prompt = `
You are an expert bilingual education assistant.
Convert this JSON array of quiz questions for "${lectureTitle}" to a perfectly bilingual EN-First format.

RULES:
1. "question", "options", "answer", "explanation" fields MUST be in ENGLISH.
2. "question_ar", "options_ar", "answer_ar", "explanation_ar" fields MUST be in ARABIC.
3. If original is Arabic, translate to EN for main fields.
4. Keep the exact same structure.

Data:
${JSON.stringify(quizChunk)}

Return ONLY a valid JSON array.
`;

    try {
        const result = await client.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        if (!result || !result.text) throw new Error("Empty response");

        let text = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        if ((error.message.includes("429") || error.message.includes("quota")) && retryCount < 3) {
            console.log("   ⏳ Quota hit. Waiting 30s...");
            await sleep(30000);
            return normalizeChunk(quizChunk, lectureTitle, retryCount + 1);
        }
        console.error("   ❌ API Error:", error.message);
        return null;
    }
}

async function run() {
    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const isArabic = (t) => t && /[\u0600-\u06FF]/.test(t);

    for (let lecture of db) {
        if (!lecture.quiz || lecture.quiz.length === 0) continue;

        // Use a more aggressive check
        const needsFix = lecture.quiz.some(q => isArabic(q.question) || !q.question_ar);
        if (!needsFix) continue;

        console.log(`\n🚀 Normalizing: ${lecture.lectureId} (${lecture.title})`);

        let normalized = [];
        const CHUNK_SIZE = 15; // Increased chunk size for speed
        for (let i = 0; i < lecture.quiz.length; i += CHUNK_SIZE) {
            const chunk = lecture.quiz.slice(i, i + CHUNK_SIZE);
            console.log(`   ⏳ Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(lecture.quiz.length / CHUNK_SIZE)}...`);

            const result = await normalizeChunk(chunk, lecture.title);
            if (result && Array.isArray(result) && result.length === chunk.length) {
                normalized = normalized.concat(result);
            } else {
                console.log("   🛑 Chunk failure. Retrying with size 5...");
                for (let j = 0; j < chunk.length; j += 5) {
                    const subChunk = chunk.slice(j, j + 5);
                    const subResult = await normalizeChunk(subChunk, lecture.title);
                    if (subResult) normalized = normalized.concat(subResult);
                    await sleep(1000);
                }
            }
            await sleep(1000);
        }

        if (normalized.length === lecture.quiz.length) {
            lecture.quiz = normalized.map((nq, idx) => ({
                ...lecture.quiz[idx],
                ...nq
            }));
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
            console.log(`   ✅ Normalized ${lecture.lectureId}`);
        }
    }
    console.log("\n✨ Done!");
}

run();
