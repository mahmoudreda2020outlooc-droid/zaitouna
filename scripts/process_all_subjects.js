require('dotenv').config({ path: '.env.local' });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const dataToProcess = [
    {
        subjectId: "NET-301",
        title: "CCNA",
        prefix: "net301",
        lectures: [
            { id: "lecture_1", name: "المحاضرة الأولى", pdf: "المحاضرة الاولى.pdf", sheet: "اسيمنت-1.pdf", assignment: "#" },
            { id: "lecture_2", name: "المحاضرة الثانية", pdf: "المحاضرة الثانية.pdf", sheet: "شيت 2.pdf", assignment: "#" },
            { id: "lecture_3", name: "المحاضرة الثالثة", pdf: "المحاضرة الثالثة.pdf", sheet: "شيت 3.pdf", assignment: "اسيمنت -3.pdf" },
            { id: "lecture_4", name: "المحاضرة الرابعة", pdf: "المحاضرة الرابعة.pdf", sheet: "#", assignment: "#" }
        ]
    },
    {
        subjectId: "JAV-110",
        title: "Java",
        prefix: "jav110",
        lectures: [
            { id: "lecture_1", name: "المحاضرة الأولى", pdf: "المحاضرة الاولى.pdf", sheet: "شيت 1.pdf", assignment: "#" },
            { id: "lecture_2", name: "المحاضرة الثانية", pdf: "المحاضرة الثانية.pdf", sheet: "شيت 2.pdf", assignment: "اسيمنت -2.pdf" },
            { id: "lecture_3", name: "المحاضرة الثالثة", pdf: "المحاضرة التالتة.pdf", sheet: "#", assignment: "#" },
            { id: "lecture_4", name: "المحاضرة الرابعة", pdf: "المحاضرة الرابعة.pdf", sheet: "#", assignment: "اسيمنت -4.pdf" }
        ]
    },
    {
        subjectId: "DS-401",
        title: "Data Structure",
        prefix: "ds401",
        lectures: [
            { id: "lecture_1", name: "المحاضرة الأولى", pdf: "المحاضرة الاولى.pdf", sheet: "الشيت 1.pdf", assignment: "#" },
            { id: "lecture_2", name: "المحاضرة الثانية", pdf: "المحاضرة الثانية.pdf", sheet: "شيت 2.pdf", assignment: "as-2.pdf" },
            { id: "lecture_3", name: "المحاضرة الثالثة", pdf: "المحاضرة الثالثة.pdf", sheet: "شيت 3.pdf", assignment: "#" },
            { id: "lecture_4", name: "المحاضرة الرابعة", pdf: "المحاضرة الرابعة.pdf", sheet: "شيت 4.pdf", assignment: "#" }
        ]
    },
    {
        subjectId: "DB-202",
        title: "Database Systems",
        prefix: "db202",
        lectures: [
            { id: "lecture_1", name: "المحاضرة الأولى", pdf: "المحاضرة الاولى.pdf", sheet: "#", assignment: "#" },
            { id: "lecture_2", name: "المحاضرة الثانية", pdf: "المحاضرة الثانية.pdf", sheet: "الاسيمن -2.pdf", assignment: "#" },
            { id: "lecture_3", name: "المحاضرة الثالثة", pdf: "المحاضرة الثالثة.pdf", sheet: "#", assignment: "#" },
            { id: "lecture_4", name: "المحاضرة الرابعة", pdf: "المحاضرة الرابعة.pdf", sheet: "#", assignment: "#" }
        ]
    }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function extractTextFromPDF(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`Error reading ${pdfPath}:`, error);
        return "";
    }
}

const promptTemplate = `
أنت الآن "الدحيح"، مساعد ذكي جداً لطلاب حاسبات ومعلومات.
بناءً على هذا النص المستخرج من ملف PDF لمحاضرة ({LECTURE_NAME})، قم باستخراج المخرجات التالية بصيغة JSON فقط:
1. "title": عنوان مناسب وجذاب للمحاضرة بالعربية. يجب أن يبدأ بـ "{LECTURE_NAME}: " متبوعاً بالعنوان الفعلي الموجود في المحاضرة (مثلاً: {LECTURE_NAME}: مقدمة في الشبكات). استخرج العنوان الحقيقي من النص.
2. "summary": ملخص شرح "زتونة" للمحاضرة، اشرح وكأنك الدحيح بطريقة عامية مصرية قريبة لقلوب الدفعة، استخدم عناوين فرعية (###)، واستخدم الـ Markdown لإضافة **تحديد (Highlight)** للكلمات المهمة جداً بوضعها بين علامتين نجمة مزدوجة هكذا: **الكلمة المهمة**. لا تستخدم علامات النجمة المزدوجة أكثر من 20 مرة في الملخص. 
يجب أن يكون الملخص شاملاً وكاملاً ومفيداً جداً للطالب ومغطياً لكل تفاصيل المحاضرة بدون استثناء أي جزء (خاصة التفاصيل التقنية والعملية والقوانين إن وجدت).
3. "quiz": مصفوفة تحتوي على 45 سؤالاً متنوعاً وشاملاً (MCQ, True/False, Fill in the Blank) مستوحاة من النص لتختبر فهم الطالب بعمق شديد. 
يجب أن تغطي الأسئلة كل جملة وكل فكرة في المحاضرة. لا تكرر الأسئلة، واجعلها متدرجة في الصعوبة.
كل سؤال يجب أن يكون كائن JSON كالتالي:
- type: "mcq" أو "tf" أو "fitb"
- question: نص السؤال بالعربية.
- options: مصفوفة من 4 خيارات (فقط في حالة الـ mcq، وإلا اتركها فارغة).
- answer: الإجابة الصحيحة بالضبط (في حالة tf اكتب "صح" أو "خطأ").
- explanation: شرح مبسط وعامي مصري لسبب الإجابة الصحيحة.

النص:
{TEXT}

تأكد من إرجاع JSON صالح 100% فقط (بدون أي نصوص إضافية، ابدأ بـ { وانتهي بـ }).
`;

async function processData() {
    for (const subject of dataToProcess) {
        const outputFile = `scripts/${subject.prefix}_output.json`;
        let results = [];

        // Load existing if there
        if (fs.existsSync(outputFile)) {
            try {
                results = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
                console.log(`Loaded ${results.length} existing lectures from ${outputFile}`);
            } catch (e) { }
        }

        console.log(`\n=== Processing ${subject.title} (${subject.subjectId}) ===\n`);

        for (const lecture of subject.lectures) {
            // Check if already processed
            if (results.some(r => r.lectureId === lecture.id)) {
                console.log(`Skipping ${lecture.id} for ${subject.subjectId} as it already exists.`);
                continue;
            }

            console.log(`Processing ${lecture.id} - ${lecture.pdf}...`);

            const pdfAbsPath = path.join(__dirname, '..', 'public', 'materials', subject.subjectId, lecture.pdf);

            if (!fs.existsSync(pdfAbsPath)) {
                console.error(`ERROR: PDF not found at ${pdfAbsPath}`);
                continue;
            }

            const text = await extractTextFromPDF(pdfAbsPath);
            if (!text || text.trim() === '') {
                console.error(`ERROR: No text extracted from ${lecture.pdf}`);
                continue;
            }

            const prompt = promptTemplate.replace(/{LECTURE_NAME}/g, lecture.name).replace('{TEXT}', text.substring(0, 30000));

            let attempts = 0;
            let success = false;

            while (attempts < 3 && !success) {
                try {
                    const response = await ai.models.generateContent({
                        model: 'gemini-flash-latest',
                        contents: prompt,
                        config: {
                            temperature: 0.7
                        }
                    });

                    let jsonText = response.text.trim();
                    if (jsonText.startsWith('```json')) jsonText = jsonText.substring(7);
                    if (jsonText.startsWith('```')) jsonText = jsonText.substring(3);
                    if (jsonText.endsWith('```')) jsonText = jsonText.substring(0, jsonText.length - 3);

                    const parsed = JSON.parse(jsonText.trim());

                    const finalObject = {
                        id: `${subject.subjectId}_${lecture.id}`.toLowerCase().replace('-', '_'),
                        subjectId: subject.subjectId,
                        lectureId: lecture.id,
                        title: parsed.title,
                        summary: parsed.summary,
                        resources: {
                            pdf: `/materials/${subject.subjectId}/${encodeURI(lecture.pdf)}`,
                            sheet: lecture.sheet !== '#' ? `/materials/${subject.subjectId}/${encodeURI(lecture.sheet)}` : '#',
                            assignments: lecture.assignment !== '#' ? `/materials/${subject.subjectId}/${encodeURI(lecture.assignment)}` : '#'
                        },
                        quiz: parsed.quiz
                    };

                    results.push(finalObject);
                    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
                    console.log(`✅ Successfully processed ${lecture.id} for ${subject.subjectId}`);
                    success = true;

                } catch (err) {
                    attempts++;
                    console.error(`Attempt ${attempts} failed for ${lecture.id} (${subject.subjectId}):`);
                    console.error(err.message);
                    if (attempts < 3) {
                        console.log(`Waiting 45 seconds before retry...`);
                        await sleep(45000);
                    }
                }
            }
            // Wait between API calls to avoid rate limits
            await sleep(3000);
        }
    }

    console.log("\nAll subjects processed successfully.");
}

processData();
