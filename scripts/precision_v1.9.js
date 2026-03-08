const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// The Ultra Precision Map for v1.9
const v19Fixes = [
    { id: '2420377', name: 'حبيبة إبراهيم السيد محمد جلال', group: '4' },
    { id: '2420380', name: 'حبيبة محمد جلال الدين محمد', group: '4' },
    { id: '2420406', name: 'حنين محمد إبراهيم محمد عبد القوي', group: '4' },
    { id: '2320141', name: 'حسام حسن محمد علي', group: '4' }
];

v19Fixes.forEach(fix => {
    // Force delete any instance by ID or Name to prevent ghosting
    students = students.filter(s => s.id !== fix.id && s.name !== fix.name);
    students.push({
        id: fix.id,
        name: fix.name,
        group: fix.group,
        section: fix.id === '2320141' ? '16' : '12',
        subGroup: 'A',
        serial: 999,
        _sync: Date.now() // Force a change at the object level
    });
});

// Final cleanup and sort
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Ultra Precision v1.9 complete.');
