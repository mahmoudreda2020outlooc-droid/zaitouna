const fs = require('fs');
const lecturesData = JSON.parse(fs.readFileSync('src/data/lectures.json', 'utf8'));

const subjects = {
    "WEB-201": "برمجة المواقع 2 (Web Programming II)",
    "DB-202": "برمجة قواعد البيانات 2 (Database 2)",
    "NET-301": "الشبكات (CCNA)",
    "DS-401": "هياكل البيانات (Data Structures)",
    "JAV-110": "برمجة جافا (Java)"
};

let searchMessage = "برمجة المواقع 2".toLowerCase();
const messageKeywords = searchMessage.split(/\s+/).filter((k) => k.length > 2 || /^\d+$/.test(k));
console.log("Keywords:", messageKeywords);

let relevantLectures = lecturesData
    .map((lect) => {
        const subjectName = (subjects[lect.subjectId] || "").toLowerCase();
        const titleMatch = messageKeywords.reduce((count, kw) =>
            count + (lect.title.toLowerCase().includes(kw) ? 3 : 0), 0);
        const summaryMatch = messageKeywords.reduce((count, kw) =>
            count + (lect.summary.toLowerCase().includes(kw) ? 1 : 0), 0);
        const subjectMatch = messageKeywords.reduce((count, kw) =>
            count + (subjectName.includes(kw) ? 5 : 0), 0);

        const score = titleMatch + summaryMatch + subjectMatch;
        return { id: lect.lectureId, title: lect.title, score };
    })
    .filter((l) => l.score > 0)
    .sort((a, b) => b.score - a.score);

console.log("All matching scores:");
console.log(relevantLectures.slice(0, 10));
