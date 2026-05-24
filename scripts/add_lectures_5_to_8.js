const fs = require('fs');
const path = require('path');

const lecturesPath = path.join(__dirname, '../src/data/lectures.json');
const lectures = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));

const newLectures = [
    {
        "id": "lecture_5",
        "subjectId": "WEB-201",
        "lectureId": "lecture_5",
        "title": "المحاضرة 5",
        "summary": "سيتم إضافة الملخص قريباً...",
        "resources": {
            "pdf": "/materials/WEB-201/المحاضرة 5.pdf"
        },
        "quiz": []
    },
    {
        "id": "lecture_6",
        "subjectId": "WEB-201",
        "lectureId": "lecture_6",
        "title": "المحاضرة 6",
        "summary": "سيتم إضافة الملخص قريباً...",
        "resources": {
            "pdf": "/materials/WEB-201/المحاضرة 6.pdf"
        },
        "quiz": []
    },
    {
        "id": "lecture_7",
        "subjectId": "WEB-201",
        "lectureId": "lecture_7",
        "title": "المحاضرة 7",
        "summary": "سيتم إضافة الملخص قريباً...",
        "resources": {
            "pdf": "/materials/WEB-201/المحاضرة 7.pdf"
        },
        "quiz": []
    },
    {
        "id": "lecture_8",
        "subjectId": "WEB-201",
        "lectureId": "lecture_8",
        "title": "المحاضرة 8",
        "summary": "سيتم إضافة الملخص قريباً...",
        "resources": {
            "pdf": "/materials/WEB-201/المحاضرة 8.pdf"
        },
        "quiz": []
    }
];

// Check if they already exist
newLectures.forEach(newLecture => {
    const exists = lectures.find(l => l.subjectId === 'WEB-201' && l.lectureId === newLecture.lectureId);
    if (!exists) {
        lectures.push(newLecture);
        console.log(`Added ${newLecture.title}`);
    } else {
        // update resources
        exists.resources.pdf = newLecture.resources.pdf;
        console.log(`Updated ${newLecture.title}`);
    }
});

fs.writeFileSync(lecturesPath, JSON.stringify(lectures, null, 2), 'utf8');
console.log('Finished updating lectures.json');
