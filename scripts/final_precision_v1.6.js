const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// The Precision List for v1.6 (Final Absolute Source)
const v16Fixes = [
    { id: '2420111', name: 'إسماعيل محمد إسماعيل محمد إبراهيم', group: '2', section: '2' },
    { id: '2420155', name: 'أماني رمضان مبروك عبدالرازق', group: '2', section: '2' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف', group: '2', section: '2' },
    { id: '2420161', name: 'أميرة محمود بدري محمد ملكي', group: '2', section: '2' },
    { id: '2420165', name: 'أمنية نبيل محمد', group: '2', section: '2' },
    { id: '2320127', name: 'إيهاب حمدي إبراهيم', group: '2', section: '4' }, // Page 16, typically Group 2
    { id: '2420150', name: 'أروى أشرف محمد محمد عبد العزيز', group: '2', section: '2' }
];

// 1. Explicitly clear the IDs before inserting to avoid any stale grouping or name
const idsToFix = v16Fixes.map(f => f.id);
const shiftedIds = ['2420110', '2420154', '2420158'];

students = students.filter(s => {
    // Remove if it's one of the IDs we are about to put the correct student into
    if (idsToFix.includes(s.id)) return false;

    // Remove the "Shifted" IDs if they belong to these specific students
    if (shiftedIds.includes(s.id)) {
        if (s.name.includes('إسماعيل') || s.name.includes('أماني') || s.name.includes('أميرة')) {
            return false;
        }
    }
    return true;
});

// 2. Insert the correct data
v16Fixes.forEach(corr => {
    students.push({
        id: corr.id,
        name: corr.name,
        group: corr.group,
        section: corr.section || "2",
        subGroup: "A",
        serial: 999
    });
});

// 3. Global Hamzas and Spelling
students = students.map(s => {
    let name = s.name;
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/\bامنيه\b/g, 'أمنية');
    name = name.replace(/^ايمان\b/g, 'إيمان');
    name = name.replace(/^اسماعيل/g, 'إسماعيل');

    if (s.group === '2') {
        name = name.replace(/\bعبد الرازق\b/g, 'عبدالرازق');
        name = name.replace(/\bعبد العاطي\b/g, 'عبدالعاطي');
        name = name.replace(/\bعبد الصادق\b/g, 'عبدالصادق');
    }
    return { ...s, name };
});

// 4. Final Unique Check and Sort
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Precision surgery v1.6 complete.');
