const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
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

// Helper for delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to read PDF text
async function extractTextFromPDF(pdfPath) {
    try {
        if (!fs.existsSync(pdfPath)) {
            console.error(`   ❌ File NOT found: ${pdfPath}`);
            return null;
        }
        let dataBuffer = fs.readFileSync(pdfPath);
        let data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`   ❌ Error reading PDF ${pdfPath}:`, error.message);
        return null;
    }
}

// Function to ask Gemini to solve the sheet
async function solveSheet(text, title) {
    console.log(`   🧠 Solving Sheet: ${title}...`);

    const prompt = `
أنت "الدحيح"، مساعد ذكي جداً ومصري روش.
مهمتك إنك تحل "الشيت" ده للطالب. الشيت ده فيه أسئلة مستخرجة من ملف PDF.
أنا عايزك تطلع لي كل سؤال وحله وشرح بسيط للحل "الزتونة".

القواعد الصارمة:
1. لازم ترجع لي JSON Array فقط.
2. كل عنصر في الـ Array يكون فيه:
   - "question": نص السؤال كما هو.
   - "answer": الإجابة الصحيحة.
   - "explanation": شرح "الزتونة" باللهجة المصرية.

نص الشيت المستخرج:
"""
${text.substring(0, 15000)}
"""

المخرج المطلوب (JSON Array فقط):
[
  {
    "question": "...",
    "answer": "...",
    "explanation": "..."
  }
]
`;

    // Trying the most likely available model
    const modelName = 'gemini-2.0-flash-lite';

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
        });

        let jsonStr = response.text;
        const jsonMatch = jsonStr.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) jsonStr = jsonMatch[0];
        else jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

        const solutions = JSON.parse(jsonStr);
        return Array.isArray(solutions) ? solutions : [];
    } catch (error) {
        console.error(`   ❌ Failed with ${modelName}:`, error.message);
        return [];
    }
}

async function run() {
    console.log("🚀 Starting Sheet Solver (Final Retry Strategy)...\n");

    let dbData = fs.readFileSync(DATA_FILE, 'utf-8');
    let db = JSON.parse(dbData || "[]");

    for (let lecture of db) {
        if (lecture.resources && lecture.resources.sheet && lecture.resources.sheet !== "#") {
            const sheetRelPath = lecture.resources.sheet;
            // Handle potentially encoded paths in JSON
            const decodedPath = decodeURIComponent(sheetRelPath);
            const sheetAbsPath = path.join(__dirname, '../public', decodedPath);

            if (lecture.sheetSolutions && lecture.sheetSolutions.length > 0) {
                console.log(`✅ Skipping ${lecture.lectureId} - Already has solutions.`);
                continue;
            }

            console.log(`\n📄 Processing: ${decodedPath}`);
            const text = await extractTextFromPDF(sheetAbsPath);

            if (text && text.trim().length > 10) {
                const solutions = await solveSheet(text, path.basename(decodedPath));
                if (solutions.length > 0) {
                    lecture.sheetSolutions = solutions;
                    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
                    console.log(`   💾 Saved ${solutions.length} solutions.`);
                    await sleep(10000); // 10s delay between lectures to respect RPD/RPM
                } else {
                    console.log(`   ⚠️ Failed to generate solutions.`);
                    await sleep(2000);
                }
            } else {
                console.log(`   ⚠️ Text extraction failed or empty.`);
            }
        }
    }

    console.log("\n🎉 Done!");
}

run();
