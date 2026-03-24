const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

function isArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
}

function analyze() {
    if (!fs.existsSync(DATA_FILE)) {
        console.error("Data file not found.");
        return;
    }

    const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    console.log(`Total lectures: ${db.length}`);

    const problematic = [];

    for (const lecture of db) {
        if (!lecture.quiz || lecture.quiz.length === 0) continue;

        let arabicInMain = 0;
        let missingAr = 0;

        for (const q of lecture.quiz) {
            if (isArabic(q.question)) arabicInMain++;
            if (!q.question_ar) missingAr++;
        }

        if (arabicInMain > 0 || missingAr > 0) {
            problematic.push({
                id: lecture.id,
                title: lecture.title,
                arabicInMain,
                missingAr,
                total: lecture.quiz.length
            });
        }
    }

    console.log(`\nFound ${problematic.length} problematic lectures:\n`);
    problematic.forEach(p => {
        console.log(`- ${p.id}: ${p.arabicInMain}/${p.total} Arabic questions, ${p.missingAr}/${p.total} missing translations (${p.title})`);
    });
}

analyze();
