const fs = require('fs');
const path = require('path');

const lecturesPath = path.join(__dirname, 'src/data/lectures.json');
const lectures = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));

const titleMap = {
    'WEB-201_lecture_1': 'المحاضرة 1: مقدمة في هندسة البرمجيات (SDLC & Waterfall)',
    'WEB-201_lecture_2': 'المحاضرة 2: مقدمة في PHP (المتغيرات، الأنواع، echo، switch)',
    'DS-401_lecture_1': 'المحاضرة 1: مقدمة في هياكل البيانات (Data Structures)',
    'DS-401_lecture_2': 'المحاضرة 2: تحليل كفاءة الخوارزميات (Big-O Notation)',
    'DS-401_lecture_3': 'المحاضرة 3: تقييم التعبيرات الرياضية باستخدام Stack',
};

let updated = 0;
lectures.forEach(l => {
    const key = `${l.subjectId}_${l.lectureId}`;
    if (titleMap[key]) {
        console.log(`Updating: ${l.title} => ${titleMap[key]}`);
        l.title = titleMap[key];
        updated++;
    }
});

fs.writeFileSync(lecturesPath, JSON.stringify(lectures, null, 2), 'utf8');
console.log(`\nDone! Updated ${updated} lectures.`);
