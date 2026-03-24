const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Configuration
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing from .env.local file.");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: apiKey });
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

// Helper for delay to respect rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function translateQuiz(quiz, lectureTitle, retryCount = 0) {
    console.log(`   🌍 ${retryCount > 0 ? '🔄 Retrying' : 'Translating'} Quiz for: ${lectureTitle}...`);

    const prompt = `
You are an expert bilingual education assistant (English & Arabic).
Your task is to take a quiz for a university lecture titled: "${lectureTitle}" and ensure it is perfectly bilingual.

For each question in the provided JSON array:
1. Ensure these fields are in ENGLISH: "question", "options", "answer", "explanation". (If they are currently in Arabic, translate them to English).
2. Ensure these fields are in ARABIC: "question_ar", "options_ar", "answer_ar", "explanation_ar". (If they are missing or currently in English, translate them to Arabic).
3. "options_ar" must match the index/order of "options".
4. For True/False (tf), "answer_ar" should be "صح" for true and "خطأ" for false.
5. Maintain all other fields (type, topic, etc.) exactly as they are.
6. Return ONLY the JSON array, no markdown or extra text.

Quiz Data:
${JSON.stringify(quiz, null, 2)}
`;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt,
        });

        if (!result || !result.text) {
            console.error(`   ❌ AI returned empty response for ${lectureTitle}.`);
            return null;
        }

        let responseText = result.text;
        // Clean up markdown if any
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const translatedQuiz = JSON.parse(responseText);
            return translatedQuiz;
        } catch (e) {
            console.error(`   ❌ JSON Parse Error for ${lectureTitle}:`, e.message);
            console.debug(`   Raw response prefix: ${responseText.substring(0, 100)}...`);
            return null;
        }
    } catch (error) {
        if ((error.message.includes("429") || error.message.includes("quota")) && retryCount < 3) {
            console.log(`   ⏳ Quota hit. Waiting 35s (Retry ${retryCount + 1})...`);
            await sleep(35000);
            return translateQuiz(quiz, lectureTitle, retryCount + 1);
        }
        console.error(`   ❌ API Error for ${lectureTitle}:`, error.message);
        return null;
    }
}

async function run() {
    console.log("🚀 Starting Quiz Translation Process...\n");

    if (!fs.existsSync(DATA_FILE)) {
        console.error(`❌ Data file not found: ${DATA_FILE}`);
        return;
    }

    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || "[]");
    let updated = false;

    // Process each lecture
    for (let lecture of db) {
        if (!lecture.quiz || lecture.quiz.length === 0) continue;

        console.log(`📄 Processing: ${lecture.lectureId} (${lecture.title})`);

        const CHUNK_SIZE = 5;
        let translatedQuiz = [];

        for (let i = 0; i < lecture.quiz.length; i += CHUNK_SIZE) {
            const chunk = lecture.quiz.slice(i, i + CHUNK_SIZE);
            console.log(`   ⏳ Translating chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(lecture.quiz.length / CHUNK_SIZE)}...`);

            const translatedChunk = await translateQuiz(chunk, lecture.title);
            if (translatedChunk && Array.isArray(translatedChunk) && translatedChunk.length === chunk.length) {
                translatedQuiz = translatedQuiz.concat(translatedChunk);
            } else {
                console.log(`   ⚠️ Failed to translate chunk starting at ${i}. Retrying once...`);
                await sleep(2000);
                const retryChunk = await translateQuiz(chunk, lecture.title);
                if (retryChunk && Array.isArray(retryChunk)) {
                    translatedQuiz = translatedQuiz.concat(retryChunk);
                } else {
                    console.log(`   ❌ Failed to translate chunk at ${i} after retry.`);
                    break;
                }
            }
        }

        if (translatedQuiz.length === lecture.quiz.length) {
            // Merge translations
            lecture.quiz = lecture.quiz.map((q, idx) => ({
                ...q,
                question_ar: translatedQuiz[idx].question_ar,
                options_ar: translatedQuiz[idx].options_ar,
                answer_ar: translatedQuiz[idx].answer_ar,
                explanation_ar: translatedQuiz[idx].explanation_ar
            }));

            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
            console.log(`   💾 Saved ALL translations for ${lecture.lectureId}`);
            updated = true;
            await sleep(2000);
        } else {
            console.log(`   ⚠️ Incomplete translation for ${lecture.lectureId}. Skip saving.`);
        }
    }

    if (updated) {
        console.log("\n✨ All done! lectures.json updated with Arabic translations.");
    } else {
        console.log("\nℹ️ No new translations needed.");
    }
}

run();
