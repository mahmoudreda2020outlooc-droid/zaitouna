const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Read API key from .env.local manually to ensure correctness
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const GEMINI_API_KEY = envContent.match(/GEMINI_API_KEY=(.*)/)[1].trim();

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



const DATA_PATH = path.join(__dirname, '../src/data/lectures.json');

async function translateItem(item) {
    // If the item already has English and Arabic, and they look valid, we skip or verify.
    // For now, let's assume we want to ENSURE question is English and question_ar is Arabic.

    const prompt = `
    You are a professional educational translator. 
    The following JSON represents a quiz question. 
    I need you to provide both English and Arabic versions for:
    1. The question text.
    2. The options (if any).
    3. The correct answer.
    4. The explanation.

    Current Item: 
    ${JSON.stringify(item, null, 2)}

    Rules:
    - The "question" field MUST be English.
    - The "question_ar" field MUST be Arabic.
    - The "options" field MUST be English strings.
    - The "options_ar" field MUST be Arabic strings.
    - The "answer" field MUST be English.
    - The "answer_ar" field MUST be Arabic.
    - The "explanation" field MUST be English.
    - The "explanation_ar" field MUST be Arabic.
    - Keep technical terms (like LAN, WAN, HTTP) in English even in Arabic text if it's common practice, or provide the Arabic transliteration.
    - Return ONLY the updated JSON object.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        if (error.status === 429) {
            console.log("Rate limit hit, waiting 60s...");
            await new Promise(r => setTimeout(r, 60000));
            return await translateItem(item); // Retry
        }
        console.error("Error translating item:", error);
    }
    return null;

}

async function main() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    let updatedCount = 0;

    for (let lIndex = 0; lIndex < data.length; lIndex++) {
        const lecture = data[lIndex];
        if (!lecture.quiz) continue;

        console.log(`Processing Lecture: ${lecture.lectureId} (${lIndex + 1}/${data.length})`);

        for (let qIndex = 0; qIndex < lecture.quiz.length; qIndex++) {
            const item = lecture.quiz[qIndex];

            // Optimization: Skip if question is already English and we have an Arabic backup?
            // Actually, let's just re-process to be 100% sure the structure is correct.
            // But let's check if it "looks" done to save tokens/time.
            const isDone = item.question && item.question_ar && (!item.options || (item.options_ar && item.options_ar.length === item.options.length));

            if (isDone) {
                // If the question is currently Arabic in the "question" field, we MUST swap it.
                const isArabic = (text) => /[\u0600-\u06FF]/.test(text);
                if (isArabic(item.question)) {
                    // Need to swap or re-translate
                } else {
                    continue; // Truly done
                }
            }

            console.log(`  Question ${qIndex + 1}/${lecture.quiz.length}...`);
            const updated = await translateItem(item);
            if (updated) {
                lecture.quiz[qIndex] = { ...item, ...updated };
                updatedCount++;

                // Save periodically
                if (updatedCount % 5 === 0) {
                    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
                }
            }

            // Avoid extreme rate limiting
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`\nFinished! Updated ${updatedCount} items.`);
}

main();
