const fs = require('fs');

const filePath = 'c:\\Users\\user\\Desktop\\works\\الزتونة\\zaitouna-web\\src\\data\\lectures.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 3 missing real PHP sheet 2 solutions
const missingSolutions = [
    {
        "question": "What is the difference between integer and float data types in PHP?",
        "answer": "Integer stores whole numbers (e.g., 5, -10), while Float stores decimal numbers (e.g., 3.14, -0.5).",
        "explanation": "الـ Integer بيخزن الأرقام الصحيحة من غير كسور، والـ Float بيخزن الأرقام العشرية اللي فيها فاصلة زي 3.14.",
        "type": "mcq",
        "pdfPage": 3
    },
    {
        "question": "Write a PHP code to check if a variable $score is greater than or equal to 50, and display 'Pass' or 'Fail'.",
        "answer": "$score = 60; if($score >= 50) { echo 'Pass'; } else { echo 'Fail'; }",
        "explanation": "بنستخدم الـ if...else عشان نقارن قيمة المتغير ونطبع الحكم المناسب.",
        "type": "essay",
        "pdfPage": 7
    },
    {
        "question": "What does the var_dump() function return in PHP?",
        "answer": "It returns both the data type and the value of a variable.",
        "explanation": "الـ var_dump() بيرجعلك نوع البيانات والقيمة بتاعتها مع بعض، مثلاً: int(5) أو string(4) \"test\".",
        "type": "mcq",
        "pdfPage": 5
    }
];

// Find the real lecture_2 (with 50 quiz questions) and the duplicate (with 1 quiz question)
const realIndex = data.findIndex(l => l.subjectId === 'WEB-201' && l.lectureId === 'lecture_2' && l.quiz && l.quiz.length > 10);
const dupIndex = data.findIndex(l => l.subjectId === 'WEB-201' && l.lectureId === 'lecture_2' && (!l.quiz || l.quiz.length <= 10));

console.log(`Real lecture_2 found at index: ${realIndex}`);
console.log(`Duplicate lecture_2 found at index: ${dupIndex}`);
console.log(`Solutions before: ${data[realIndex].sheetSolutions.length}`);

// Add the 3 missing solutions to the real lecture_2
data[realIndex].sheetSolutions = [...data[realIndex].sheetSolutions, ...missingSolutions];
console.log(`Solutions after: ${data[realIndex].sheetSolutions.length}`);

// Remove the duplicate (remove higher index first to avoid shifting)
const removeIdx = Math.max(realIndex, dupIndex);
const keepIdx = Math.min(realIndex, dupIndex);
// Always remove the duplicate
data.splice(dupIndex, 1);

console.log(`Duplicate removed at index ${dupIndex}.`);
console.log(`Total lectures now: ${data.length}`);

// Write back
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Done! lectures.json updated successfully.');
