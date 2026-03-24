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
const MATERIALS_DIR = path.join(__dirname, '../public/materials');
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

// Function to read PDF text
async function extractTextFromPDF(pdfPath) {
    try {
        let dataBuffer = fs.readFileSync(pdfPath);
        let data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`❌ Error reading PDF ${pdfPath}:`, error.message);
        return null;
    }
}

// Function to ask Gemini for a highly detailed summary
async function generateLectureSummary(text, title) {
    console.log(`🤖 Asking AI to generate a highly detailed summary for: ${title}...`);

    const prompt = `
أنت صاحب بيشرح لصاحبه.. مش أستاذ بيلقي محاضرة.
مهمتك إنك تاخد نص المحاضرة دي وتشرحها لطالب جامعي بطريقة بسيطة جداً وحلوة، زي ما بتشرح لصاحبك على الفاضي.

قواعد وأسلوب التلخيص (التزم بيها جداً عشان تطلع تحفة):
1. **الروح والشخصية:** اتكلم كأنك "أخ كبير فاهم اللعبة" أو "صانع محتوى فشيخ على يوتيوب". استخدم لغة شبابية مصرية شيك (زي: بص يا سيدي، الفكرة وما فيها، الخلاصة، اللقطة هنا إن..).
2. **المقدمة (الخطاف):** ابدأ بجملة واحدة بتشد الانتباه وتلخص "إحنا ليه أصلاً بندرس الكلام ده؟" بطريقة عملية أو بمثال من الحياة.
3. **التقسيم لمواضيع (عناوين جذابة):** استخدم عناوين فرعية (تبدأ بـ ### ) بس خلي العناوين نفسها روشة، مثلاً أكتب "### 1. إيه هو الـ Software Engineering وليه وجع الدماغ ده؟" بدل "مقدمة عن هندسة البرمجيات".
4. **الشرح في هيئة نقاط سريعة:** قسم الشرح لـ Bullet points بتبدأ بعلامة \`-\`. بلاش فقرات طويلة مملة. خلي كل نقطة سطرين بالكتير.
5. **المصطلحات الإنجليزي (مهم جداً جداً):** أي مسمى تقني أو علمي لازم تكتبه بالإنجليزية الأصلية بتاعته زي ما هو مكتوب في المحاضرة بين قوسين أو جانبه، عشان الطالب يعرف يحفظه. زائد إنك تميز الكلمة بعلامة النجمتين **زي كده** عشان تنور في الموقع. ممثلاً: "الـ **Software Engineering** (هندسة البرمجيات) دي عبارة عن..."
6. **الزتونة في الآخر:** اختم التلخيص بعنوان "### الزتونة 🫒" واكتب تحتها نصيحة في سطر واحد للامتحان أو لفهم المادة، مع كلمة تشجيعية.

شكل التلخيص المتوقع (مثال للهيكل):
جملة افتتاحية بتشد الانتباه وتخلي الطالب يركز.
### 1. عنوان روش للموضوع الأول
- شرح مبسط للنقطة الأولى وفيها **كلمة_مهمة**.
- شرح للنقطة التانية بمثال من الشارع.
### 2. عنوان الموضوع التاني
... وهكذا
### الزتونة 🫒
جملة النصيحة في الآخر.

نص المحاضرة المستخرج من الـ PDF:
"""
${text.substring(0, 25000)}
"""
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("❌ Error generating summary with Gemini:", error);
        return "حدث خطأ أثناء الذكاء الاصطناعي.. جاري المحاولة مرة أخرى لاحقاً.";
    }
}

// Function to ask Gemini for a JSON array of 50 English quiz questions
async function generateLectureQuiz(text, title) {
    console.log(`🧠 Asking AI to generate 50 English Quiz Questions for: ${title}...`);

    const prompt = `
You are an expert university professor creating an exam for students who have studied this lecture.
Your task is to create exactly 50 comprehensive questions covering every point in the lecture.
Question types should include: Multiple Choice (MCQ), True or False (TF), and Fill in the Blank with a specific word (FITB).

Strict Rules:
1. You MUST return exactly 50 questions.
2. The output MUST be a valid JSON array only. Do not write any text outside the JSON.
3. ALL text (questions, options, answers, explanations) MUST BE IN ENGLISH.
4. Follow this JSON structure for each question:
[
  {
    "type": "mcq", // mcq, tf, or fitb
    "question": "Question text here?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Only for mcq
    "answer": "Exact text of the correct answer", // Must match one of the options for mcq, "true"/"false" for tf, or the exact word for fitb
    "explanation": "Brief explanation of why this is correct",
    "topic": "The specific topic or concept this question covers (e.g., Software Architecture, Loops, etc.)",
    "question_ar": "ترجمة السؤال بالعربي",
    "options_ar": ["الاختيار الأول", "الاختيار الثاني", "الاختيار الثالث", "الاختيار الرابع"], // Only for mcq
    "answer_ar": "ترجمة الإجابة الصحيحة",
    "explanation_ar": "ترجمة الشرح (الزتونة) بالعربي"
  }
]

For true/false (tf) questions, the answer must be either "true" or "false". For fill-in-the-blanks (fitb), options should be an empty array [] and the answer is the missing word.
Make the questions smart and not superficial.

Lecture Text:
"""
${text.substring(0, 25000)}
"""
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let jsonStr = response.text;
        // Clean up markdown code blocks if Gemini added them
        jsonStr = jsonStr.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

        const quizData = JSON.parse(jsonStr);
        return Array.isArray(quizData) ? quizData : [];
    } catch (error) {
        console.error("❌ Error generating quiz with Gemini:", error);
        return [];
    }
}

function extractNumber(filename) {
    const match = filename.match(/\d+/);
    if (match) return parseInt(match[0], 10);

    // Fallback for Arabic number words commonly used in filenames
    if (filename.includes('الاول') || filename.includes('الاولى') || filename.includes('الأول')) return 1;
    if (filename.includes('الثاني') || filename.includes('الثانى') || filename.includes('الثانية')) return 2;
    if (filename.includes('الثالث') || filename.includes('الثالثة')) return 3;
    if (filename.includes('الرابع') || filename.includes('الرابعة')) return 4;
    if (filename.includes('الخامس') || filename.includes('الخامسة')) return 5;
    if (filename.includes('السادس') || filename.includes('السادسة')) return 6;
    if (filename.includes('السابع') || filename.includes('السابعة')) return 7;

    return null;
}

// Main processing logic
async function processLectures() {
    console.log("🚀 Starting Smart Lecture Auto-Categorizer & AI Processor...\n");

    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || "[]");

    if (!fs.existsSync(MATERIALS_DIR)) {
        console.log(`⚠️ Materials directory not found.`);
        return;
    }

    const subjects = fs.readdirSync(MATERIALS_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const subjectCode of subjects) {
        console.log(`\n📚 Processing Subject: ${subjectCode}`);
        const subjectDir = path.join(MATERIALS_DIR, subjectCode);

        // Categorize files
        const files = fs.readdirSync(subjectDir).filter(f => f.toLowerCase().endsWith('.pdf'));
        const lecturesFiles = [];
        const sheetsFiles = [];
        const assignmentsFiles = [];

        files.forEach(file => {
            const lowerFile = file.toLowerCase();
            if (lowerFile.includes('lect') || lowerFile.includes('محاضرة') || lowerFile.includes('ch')) {
                lecturesFiles.push(file);
            } else if (lowerFile.includes('sheet') || lowerFile.includes('شيت')) {
                sheetsFiles.push(file);
            } else if (lowerFile.includes('as') || lowerFile.includes('assign') || lowerFile.includes('تكليف')) {
                assignmentsFiles.push(file);
            } else {
                lecturesFiles.push(file);
            }
        });

        console.log(`📌 Found: ${lecturesFiles.length} Lectures, ${sheetsFiles.length} Sheets, ${assignmentsFiles.length} Assignments.`);

        // Process each Lecture
        for (const file of lecturesFiles) {
            const lectureNum = extractNumber(file) || 1;
            const lectureId = `lecture_${lectureNum}`;

            console.log(`\n📄 Analyzing PDF: ${file} (Identified as Lecture ${lectureNum})`);

            // Match sheet by lecture number (exact), else none
            const matchingSheet = sheetsFiles.find(s => extractNumber(s) === lectureNum) || null;
            // Match assignment by EXACT lecture number only — if none, no assignment for this lecture
            const matchingAssignment = assignmentsFiles.find(a => extractNumber(a) === lectureNum) || null;

            // Paths for Frontend
            const pdfPathStr = `/materials/${subjectCode}/${file}`;
            const sheetPathStr = matchingSheet ? `/materials/${subjectCode}/${matchingSheet}` : "#";
            const assignmentPathStr = matchingAssignment ? `/materials/${subjectCode}/${matchingAssignment}` : "#";

            console.log(`   📎 Sheet: ${matchingSheet || 'None'} | Assignment: ${matchingAssignment || 'None'}`);

            const exists = db.find(l => l.subjectId === subjectCode && l.lectureId === lectureId);
            const hasTopics = exists && exists.quiz && exists.quiz.length > 0 && exists.quiz[0].topic;

            if (exists && exists.summary && exists.summary.length > 200 && exists.quiz && exists.quiz.length >= 50 && hasTopics) {
                console.log(`✅ Skipping ${lectureId} (Already summarized and quizzed with topics)`);
                // Still update the resources links just in case new sheets were added
                exists.resources = { pdf: pdfPathStr, sheet: sheetPathStr, assignments: assignmentPathStr };
                fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
                continue;
            }

            const pdfAbsPath = path.join(subjectDir, file);
            const text = await extractTextFromPDF(pdfAbsPath);

            if (text && text.length > 50) {
                const summary = exists && exists.summary && exists.summary.length > 200
                    ? exists.summary
                    : await generateLectureSummary(text, file);

                const quiz = exists && exists.quiz && exists.quiz.length >= 50 && hasTopics
                    ? exists.quiz
                    : await generateLectureQuiz(text, file);

                const recordIndex = db.findIndex(l => l.subjectId === subjectCode && l.lectureId === lectureId);
                const newData = {
                    id: lectureId,
                    subjectId: subjectCode,
                    lectureId: lectureId,
                    title: `المحاضرة ${lectureNum}: أهم المفاهيم والشرح`,
                    summary: summary,
                    quiz: quiz.map(q => ({
                        ...q,
                        // Ensure Arabic fields exist if AI missed them
                        question_ar: q.question_ar || "",
                        options_ar: q.options_ar || [],
                        answer_ar: q.answer_ar || "",
                        explanation_ar: q.explanation_ar || ""
                    })),
                    resources: {
                        pdf: pdfPathStr,
                        sheet: sheetPathStr,
                        assignments: assignmentPathStr
                    }
                };

                if (recordIndex >= 0) {
                    db[recordIndex] = { ...db[recordIndex], ...newData };
                } else {
                    db.push(newData);
                }

                fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
                console.log(`💾 Saved super detailed summary, quiz, & links for ${lectureId}`);
            } else {
                console.log(`⚠️ Warning: PDF ${file} text could not be extracted.`);
            }
        }
    }

    console.log("\n🎉 Processing Complete! Data ready for the platform.");
}

processLectures();
