const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Group 3 Precision Fixes (Targeted)
const v20Fixes = [
    { id: '2420259', name: 'آلاء السيد عبدالحميد عبدالحليم', group: '3', section: '7' },
    { id: '2420279', name: 'بسملة إسلام عبدالله سلام', group: '3', section: '7' },
    { id: '2420310', name: 'تامر رجب شحاتة رجب', group: '3', section: '8' },
    { id: '2420311', name: 'تسنيم محمد إبراهيم محمد', group: '3', section: '8' },
    { id: '2420275', name: 'باسم محمد جلال محمد', group: '3', section: '7' },
    { id: '2320124', name: 'إسلام محمد إبراهيم', group: '3', section: '16' } // Missing
];

v20Fixes.forEach(fix => {
    // Remove if exists to prevent ghosting or duplicates
    students = students.filter(s => s.id !== fix.id && s.name !== fix.name);
    students.push({
        id: fix.id,
        name: fix.name,
        group: fix.group,
        section: fix.section || "7",
        subGroup: "A",
        serial: 999,
        _v: "2.0"
    });
});

// 2. Global Group 3 Cleanup & Spelling
students = students.map(s => {
    let name = s.name;

    // Spelling fixes (Global)
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/^اسلام\b/g, 'إسلام');
    name = name.replace(/\bبسمله\b/g, 'بسملة');
    name = name.replace(/\bشحاته\b/g, 'شحاتة');
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/\bامنيه\b/g, 'أمنية');

    // Group 3 Specific Formatting (No spaces in Abd- names as requested)
    if (s.group === '3') {
        name = name.replace(/\bعبد الله\b/g, 'عبدالله');
        name = name.replace(/\bعبد الحليم\b/g, 'عبدالحليم');
        name = name.replace(/\bعبد المنعم\b/g, 'عبدالمنعم');
        name = name.replace(/\bعبد الحميد\b/g, 'عبدالحميد');
    }

    return { ...s, name };
});

// 3. Move range 2420201-2420300 to Group 3 if not already
students = students.map(s => {
    const idNum = parseInt(s.id);
    if (idNum >= 2420201 && idNum <= 2420300 && s.group !== '3') {
        return { ...s, group: '3' };
    }
    return s;
});

// Final Unique & Sort
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log(`Precision surgery v2.0 complete. Total students: ${finalStudents.length}`);
