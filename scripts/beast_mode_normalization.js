const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing.");
    process.exit(1);
}

const client = new GoogleGenAI({ apiKey: apiKey });
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function normalizeChunk(quizChunk, lectureTitle, retryCount = 0) {
    const prompt = `
Task: Convert JSON quiz for "${lectureTitle}" to "English-First" bilingual format.
1. "question", "options", "answer", "explanation" -> ENGLISH.
2. "question_ar", "options_ar", "answer_ar", "explanation_ar" -> ARABIC.
Return ONLY JSON.
Data:
${JSON.stringify(quizChunk)}
`;

    try {
        const result = await client.models.generateContent({
            model: "gemini-flash-latest",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        let text = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        if (error.message.includes("429") && retryCount < 2) {
            await sleep(15000);
            return normalizeChunk(quizChunk, lectureTitle, retryCount + 1);
        }
        return null;
    }
}

async function run() {
    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const isArabic = (t) => t && /[\u0600-\u06FF]/.test(t);

    // Prioritize lectures
    const priority = ['DS-401', 'DB-202'];
    db.sort((a, b) => {
        const aPri = priority.indexOf(a.subjectId);
        const bPri = priority.indexOf(b.subjectId);
        if (aPri !== -1 && bPri !== -1) return aPri - bPri;
        if (aPri !== -1) return -1;
        if (bPri !== -1) return 1;
        return 0;
    });

    console.log("🌀 FINAL SPRINT: NORMALIZATION STARTED 🌀\n");

    for (let lecture of db) {
        if (!lecture.quiz || lecture.quiz.length === 0) continue;

        const needsFix = lecture.quiz.some(q => isArabic(q.question) || !q.question_ar);
        if (!needsFix) continue;

        console.log(`🚀 Fixing: ${lecture.lectureId} (${lecture.subjectId}) - ${lecture.title}`);

        let normalized = [];
        const CHUNK_SIZE = 15;
        for (let i = 0; i < lecture.quiz.length; i += CHUNK_SIZE) {
            const chunk = lecture.quiz.slice(i, i + CHUNK_SIZE);
            console.log(`   ⏳ Chunk ${Math.floor(i / CHUNK_SIZE) + 1}...`);
            const res = await normalizeChunk(chunk, lecture.title);
            if (res && res.length === chunk.length) normalized = normalized.concat(res);
            else {
                // Retry size 5
                for (let j = 0; j < chunk.length; j += 5) {
                    const r = await normalizeChunk(chunk.slice(j, j + 5), lecture.title);
                    if (r) normalized = normalized.concat(r);
                    await sleep(1000);
                }
            }
        }

        if (normalized.length === lecture.quiz.length) {
            lecture.quiz = normalized;
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
            console.log(`   ✅ DONE: ${lecture.lectureId}`);
        }
        await sleep(1000);
    }
    console.log("\n✨ SYSTEM FULLY NORMALIZED! ✨");
}

run();
