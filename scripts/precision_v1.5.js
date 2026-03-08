const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Absolute Precision Map (Surnames, REDUNDANT IDs, and Spelling)
const precisionFixes = [
    { id: '2420111', name: 'إسماعيل محمد إسماعيل محمد إبراهيم', group: '2', section: '2' },
    { id: '2420155', name: 'أماني رمضان مبروك عبدالرازق', group: '2', section: '2' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف', group: '2', section: '2' },
    { id: '2420161', name: 'أميرة محمود بدري محمد ملكي', group: '2', section: '2' },
    { id: '2420165', name: 'أمنية نبيل محمد', group: '2', section: '2' },
    { id: '2320127', name: 'إيهاب حمدي إبراهيم', group: '2', section: '2' },
    { id: '2420150', name: 'أروى أشرف محمد محمد عبد العزيز', group: '2', section: '2' }
];

precisionFixes.forEach(corr => {
    // Remove both IDs to ensure no ID shift or overlap
    students = students.filter(s => s.id !== corr.id && s.name !== corr.name);
    students.push({
        id: corr.id,
        name: corr.name,
        group: corr.group,
        section: corr.section || "2",
        subGroup: "A",
        serial: 999
    });
});

// 2. Clear out the "Shifted" IDs if they still exist with old names
const ghostIds = ['2420110', '2420154', '2420158', '2420160', '2420164'];
// Only remove them if they contain truncated names of the students we just moved
students = students.filter(s => {
    if (ghostIds.includes(s.id)) {
        if (s.name.includes('إسماعيل') || s.name.includes('أماني') || s.name.includes('أميرة')) {
            return false;
        }
    }
    return true;
});

// 3. Spelling Fixes (آلاء، أسامة، أمنية)
students = students.map(s => {
    let name = s.name;
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/\bامنيه\b/g, 'أمنية');
    name = name.replace(/^ايمان\b/g, 'إيمان');
    name = name.replace(/^اسماعيل/g, 'إسماعيل');
    return { ...s, name };
});

// Final sort and uniq
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Precision surgery v1.5 complete.');
