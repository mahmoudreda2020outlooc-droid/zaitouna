const fs = require('fs');

const db = JSON.parse(fs.readFileSync('src/data/lectures.json', 'utf-8'));

// Manual proper titles based on what's actually in the PDFs
const manualTitles = {
    'WEB-201_lecture_1': 'المحاضرة 1: مقدمة في هندسة البرمجيات (SDLC & Waterfall)',
    'WEB-201_lecture_2': 'المحاضرة 2: Agile, Scrum & Version Control',
    'WEB-201_lecture_3': 'المحاضرة 3: Loops & Control Structures (For, While, Foreach)',
    'WEB-201_lecture_4': 'المحاضرة 4: دوال الـ Arrays والـ Filters في PHP',
    'NET-301_lecture_1': 'المحاضرة 1: مقدمة في الشبكات وأساسيات CCNA',
    'NET-301_lecture_2': 'المحاضرة 2: Network Models (OSI & TCP/IP)',
    'NET-301_lecture_3': 'المحاضرة 3: Addressing & Subnetting',
    'NET-301_lecture_4': 'المحاضرة 4: Ethernet & Data Link Layer',
    'JAV-110_lecture_1': 'المحاضرة 1: مقدمة في Java (Variables, Types & Operators)',
    'JAV-110_lecture_2': 'المحاضرة 2: Control Flow (If, Switch & Loops)',
    'JAV-110_lecture_3': 'المحاضرة 3: Loops Statements and Arrays',
    'JAV-110_lecture_4': 'المحاضرة 4: Methods & Functions in Java',
    'JAV-110_lecture_5': 'المحاضرة 5: مبادئ الـ OOP في Java',
    'DS-401_lecture_1': 'المحاضرة 1: مقدمة في هياكل البيانات (Data Structures Intro)',
    'DS-401_lecture_2': 'المحاضرة 2: Arrays & Linked Lists',
    'DS-401_lecture_3': 'المحاضرة 3: Stacks & Queues',
    'DS-401_lecture_4': 'المحاضرة 4: Trees & Binary Search Trees',
    'DB-202_lecture_1': 'المحاضرة 1: مقدمة في قواعد البيانات (Database Intro & SQL)',
    'DB-202_lecture_2': 'المحاضرة 2: Queries & Joins في SQL',
    'DB-202_lecture_3': 'المحاضرة 3: Advanced SQL & Stored Procedures',
    'DB-202_lecture_4': 'المحاضرة 4: Transactions & Database Design',
    'DB-202_lecture_5': 'المحاضرة 5: PHP & Database Integration (PDO & MySQLi)',
};

let updated = 0;
db.forEach((l, i) => {
    const key = `${l.subjectId}_${l.lectureId}`;
    if (manualTitles[key]) {
        db[i].title = manualTitles[key];
        updated++;
    }
});

fs.writeFileSync('src/data/lectures.json', JSON.stringify(db, null, 2), 'utf-8');
console.log(`✅ Updated ${updated} titles!`);
db.forEach(l => console.log(l.subjectId, l.lectureId, '→', l.title));
