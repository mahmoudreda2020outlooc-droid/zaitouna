import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const lectures = [
    { titleEn: "Lecture 3", id: "lecture_3", file: "المحاضرة الثالثة.pdf", sheet: "#", assignments: "#" }
];

async function processPdf(lectureInfo) {
    const pdfPath = path.join(__dirname, '..', 'public', 'materials', 'DB-202', lectureInfo.file);
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        const text = data.text;

        console.log(`Extracted ${text.length} chars from ${lectureInfo.file}. Prompting Gemini...`);

        const prompt = `أنت أستاذ جامعي ومساعد تدريس مصري عبقري يسمى "الدحيح". لديك محتوى محاضرة مادة "قواعد البيانات" (Database DB-202) بالأسفل. 
مطلوب منك تلخيص المحاضرة وإنشاء أسئلة اختبار (Quiz) واسترجاع ملف JSON صارم بدون أي نص إضافي (بدون علامات \`\`\`json).

الصيغة المطلوبة للـ JSON:
{
  "title": "عنوان المحاضرة بالعربي (مثلاً: مقدمة في قواعد البيانات)",
  "summary": "ملخص المحاضرة",
  "quiz": [
    {
      "type": "mcq", // أو tf للإشارة لصح وخطأ، أو fitb للإشارة لأكمل
      "question": "السؤال بالعربي",
      "options": ["خيار 1", "خيار 2", "خيار 3", "خيار 4"], // فقط في حالة mcq
      "answer": "الإجابة الصحيحة بالضبط كما في الخيارات",
      "explanation": "شرح مبسط للإجابة بأسلوب الدحيح"
    }
  ]
}

شروط الـ summary (الملخص):
- يجب أن يكون بتنسيق Markdown.
- العناوين الرئيسية يجب أن تبدأ بـ ### (مثال: ### مقدمة).
- النقاط الفرعية يجب أن تبدأ بـ * (مثال: * نقطة أولى).
- يجب تمييز الكلمات المفتاحية والمهمة جداً بوضعها بين نجمتين مزدوجتين لتظهر كهايلايت (مثال: هذه **بيانات مهمة** جداً).
- اجعل الملخص شاملاً وكافياً للمذاكرة السريعة (الزتونة) وبأسلوب سلس.

شروط الـ quiz:
- ضع 5 إلى 7 أسئلة متنوعة وشاملة لأهم نقاط المحاضرة.

النص المستخرج من المحاضرة:
=============
${text.substring(0, 40000)} // تحديد الحجم لتجنب مشاكل الليمت
=============
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        let jsonText = response.text;

        const parsedContent = JSON.parse(jsonText.trim());

        return {
            id: `db_202_${lectureInfo.id}`,
            subjectId: "DB-202",
            lectureId: lectureInfo.id,
            title: parsedContent.title,
            summary: parsedContent.summary,
            resources: {
                pdf: `/materials/DB-202/${lectureInfo.file}`,
                sheet: lectureInfo.sheet,
                assignments: lectureInfo.assignments
            },
            quiz: parsedContent.quiz
        };

    } catch (e) {
        console.error(`Error processing ${lectureInfo.file}:`, e);
        return null;
    }
}

async function main() {
    console.log('Starting DB-202 processing...');
    const results = [];
    for (const lec of lectures) {
        const res = await processPdf(lec);
        if (res) results.push(res);
        await sleep(3000); // 3 sec delay
    }

    fs.writeFileSync(path.join(__dirname, 'db202_lec3_output.json'), JSON.stringify(results, null, 2));
    console.log('Successfully saved to scripts/db202_lec3_output.json');
}

main();
