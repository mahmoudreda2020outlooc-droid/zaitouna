const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MATERIALS_DIR = path.join(__dirname, '../public/materials');
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

async function extractText(pdfPath) {
    try {
        const buf = fs.readFileSync(pdfPath);
        const data = await pdf(buf);
        return data.text;
    } catch (e) {
        console.error('PDF error:', e.message);
        return null;
    }
}

async function generateSummary(text, title) {
    console.log(`🤖 Summarizing: ${title}...`);
    const prompt = `أنت صاحب بيشرح لصاحبه. اشرح المحاضرة دي (${title}) لطالب جامعي بطريقة مصرية شبابية شيك.

قواعد:
1. ابدأ بجملة تشدّ الانتباه تشرح فيها ليه المحاضرة دي مهمة.
2. قسّم الشرح بعناوين ### روشة.
3. كل نقطة على سطر ببدء بـ - وكونها مختصرة وواضحة.
4. المصطلحات التقنية اكتبها بالإنجليزي وحطها بين ** **.
5. آخر عنوان يكون ### الزتونة 🫒 فيه نصيحة للامتحان.

نص المحاضرة:
"""
${text.substring(0, 20000)}
"""`;

    const modelsToTry = ['models/gemini-2.0-flash', 'models/gemini-2.5-flash'];
    for (const model of modelsToTry) {
        try {
            const res = await ai.models.generateContent({ model, contents: prompt });
            return res.text;
        } catch (e) {
            console.error(`${model} failed:`, e.message);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
    return null;
}

async function main() {
    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // Items that need processing: [subjectId, lectureId, pdfFile, sheetFile, assignmentFile, title]
    const toProcess = [
        // DB-202 lecture 5
        { subjectId: 'DB-202', lectureId: 'lecture_5', pdfFile: 'المحاضرة الخامسة.pdf', sheet: '#', assignment: '#', title: 'المحاضرة 5' },
        // JAV-110 lecture 5
        { subjectId: 'JAV-110', lectureId: 'lecture_5', pdfFile: 'المحاضرة الخامسة.pdf', sheet: 'شيت 5.pdf', assignment: '#', title: 'المحاضرة 5' },
        // JAV-110 lecture 3 has wrong path - fix it
        { subjectId: 'JAV-110', lectureId: 'lecture_3', pdfFile: 'المحاضرة التالتة.pdf', sheet: 'شيت 3.pdf', assignment: '#', title: 'المحاضرة 3', fixOnly: true },
        // JAV-110 lecture 4 - link sheet 4
        { subjectId: 'JAV-110', lectureId: 'lecture_4', pdfFile: 'المحاضرة الرابعة.pdf', sheet: 'شيت 4.pdf', assignment: '#', title: 'المحاضرة 4', fixOnly: true },
    ];

    for (const item of toProcess) {
        const idx = db.findIndex(l => l.subjectId === item.subjectId && l.lectureId === item.lectureId);
        const pdfPath = path.join(MATERIALS_DIR, item.subjectId, item.pdfFile);
        const sheetPath = item.sheet !== '#' ? `/materials/${item.subjectId}/${item.sheet}` : '#';
        const pdfPathStr = `/materials/${item.subjectId}/${item.pdfFile}`;

        if (idx !== -1) {
            // Always fix resources
            db[idx].resources = { pdf: pdfPathStr, sheet: sheetPath, assignments: item.assignment };
            console.log(`🔗 Fixed resources for ${item.subjectId} ${item.lectureId}`);

            // Generate summary if needed (short or error)
            if (!item.fixOnly && db[idx].summary.length < 200) {
                const text = await extractText(pdfPath);
                if (text) {
                    const summary = await generateSummary(text, item.title);
                    if (summary) {
                        db[idx].summary = summary;
                        console.log(`✅ Generated summary for ${item.subjectId} ${item.lectureId}`);
                    }
                }
            }
        }

        // Save after each item
        fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
        console.log(`💾 Saved.`);

        // Rate limit pause
        if (!item.fixOnly) await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n🎉 All done!');
}

main();
