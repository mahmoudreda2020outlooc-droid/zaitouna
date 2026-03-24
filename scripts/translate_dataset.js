require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../src/data/lectures.json');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(batch, isAr, client, modelName) {
    const targetLangLabel = isAr ? 'clear academic English' : 'simple direct Egyptian Arabic colloquial (عامية مصرية)';
    const prompt = `
        You are an expert educational translator. 
        Translate the following array of quiz items into ${targetLangLabel}.
        Return ONLY a JSON array of objects, each with keys: question, options, answer, explanation.
        The order of items in the output array MUST match the order in the input array.
        Return ONLY the JSON array, no markdown or extra text.
        
        Input Items:
        ${JSON.stringify(batch.map(q => ({
        question: q.question,
        options: q.options || [],
        answer: q.answer,
        explanation: q.explanation
    })))}
    `;

    for (let retry = 0; retry < 3; retry++) {
        try {
            const result = await client.models.generateContent({
                model: modelName,
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            });

            const generatedText = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const cleanJson = generatedText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (Array.isArray(parsed) && parsed.length === batch.length) {
                return parsed;
            }
            throw new Error("Invalid response format or length mismatch");
        } catch (err) {
            if (err.message.includes('429') || err.message.includes('quota')) {
                console.log(`\n    Rate limited. Retrying in 30s... (Attempt ${retry + 1}/3)`);
                await sleep(30000);
            } else {
                throw err;
            }
        }
    }
    throw new Error("Failed after 3 retries");
}

async function main() {
    if (!process.env.GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY not found in .env.local");
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    console.log(`Loaded dataset with ${data.length} lectures.`);
    const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    const modelName = "gemini-2.0-flash";

    let totalCount = 0;
    for (let lecture of data) {
        if (!lecture.quiz || lecture.quiz.length === 0) continue;

        // Group questions by language that need translation
        const arBatch = [];
        const enBatch = [];

        for (let i = 0; i < lecture.quiz.length; i++) {
            let q = lecture.quiz[i];
            if (q.question_ar) continue; // Already translated

            const isAr = /[\u0600-\u06FF]/.test(q.question);
            if (isAr) {
                arBatch.push({ index: i, original: q });
            } else {
                enBatch.push({ index: i, original: q });
            }
        }

        if (arBatch.length === 0 && enBatch.length === 0) continue;

        console.log(`Processing lecture: ${lecture.id} (Translating ${arBatch.length} AR, ${enBatch.length} EN)`);
        let modified = false;

        const processGroups = async (groups, isAr) => {
            const BATCH_SIZE = 5; // Smaller batch to avoid token limits per request
            for (let i = 0; i < groups.length; i += BATCH_SIZE) {
                const batch = groups.slice(i, i + BATCH_SIZE);
                try {
                    const results = await translateBatch(batch.map(g => g.original), isAr, client, modelName);
                    results.forEach((translated, idx) => {
                        const q = batch[idx].original;
                        if (isAr) {
                            q.question_ar = q.question;
                            q.options_ar = q.options;
                            q.answer_ar = q.answer;
                            q.explanation_ar = q.explanation;
                            q.question = translated.question;
                            q.options = translated.options;
                            q.answer = translated.answer;
                            q.explanation = translated.explanation;
                        } else {
                            q.question_ar = translated.question;
                            q.options_ar = translated.options;
                            q.answer_ar = translated.answer;
                            q.explanation_ar = translated.explanation;
                        }
                        totalCount++;
                        modified = true;
                    });
                    process.stdout.write(` ✓${batch.length}`);
                    await sleep(2000); // 2s pause between batches to be safe
                } catch (err) {
                    console.error(`\n    ✗ Error in batch starting at index ${i}:`, err.message);
                }
            }
        };

        if (arBatch.length > 0) await processGroups(arBatch, true);
        if (enBatch.length > 0) await processGroups(enBatch, false);

        if (modified) {
            console.log(`\n  Saving changes for ${lecture.id}...`);
            fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        }
    }

    console.log(`\nFinished! Translated ${totalCount} items.`);
}

main().catch(err => {
    console.error("FATAL:", err);
    process.exit(1);
});
