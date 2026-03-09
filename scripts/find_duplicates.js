const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:\\Users\\user\\Desktop\\works\\الزتونة\\zaitouna-web\\src\\data\\lectures.json', 'utf8'));

const seen = new Set();
const duplicates = [];

data.forEach((lecture, index) => {
    const key = `${lecture.subjectId}-${lecture.lectureId}`;
    if (seen.has(key)) {
        duplicates.push({ key, index });
    }
    seen.add(key);
});

console.log('Duplicates found:', duplicates);
if (duplicates.length > 0) {
    duplicates.forEach(dup => {
        const matches = data.filter(l => `${l.subjectId}-${l.lectureId}` === dup.key);
        console.log(`Key: ${dup.key}`);
        matches.forEach((m, i) => {
            console.log(`  Occurrence ${i + 1}: solutions: ${m.sheetSolutions.length}, quiz: ${m.quiz ? m.quiz.length : 0}`);
        });
    });
} else {
    console.log('No duplicates found.');
}
