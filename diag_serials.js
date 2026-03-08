const fs = require('fs');
const path = require('path');

const studentsPath = path.join(__dirname, 'src', 'data', 'students.json');
const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

const sections = ["1", "2", "3", "4"];
const results = {};

sections.forEach(sec => {
    results[sec] = students
        .filter(s => s.group === "1" && s.section === sec)
        .sort((a, b) => a.serial - b.serial)
        .map(s => ({ id: s.id, serial: s.serial, name: s.name }));
});

console.log(JSON.stringify(results, null, 2));
