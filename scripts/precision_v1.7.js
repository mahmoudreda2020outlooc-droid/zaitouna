const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Definite Precision Fixes for Group 2 & 1
const nuclearFixes = [
    { id: '2420111', name: 'إسماعيل محمد إسماعيل محمد إبراهيم', group: '2', section: '2' },
    { id: '2420155', name: 'أماني رمضان مبروك عبدالرازق', group: '2', section: '2' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف', group: '2', section: '2' },
    { id: '2420161', name: 'أميرة محمود بدري محمد ملكي', group: '2', section: '2' },
    { id: '2420165', name: 'أمنية نبيل محمد', group: '2', section: '2' },
    { id: '2320127', name: 'إيهاب حمدي إبراهيم', group: '2', section: '4' },
    { id: '2320088', name: 'أحمد فاروق كمال عبد البديع', group: '1', section: '4' },
    { id: '2320089', name: 'أحمد محمد صلاح', group: '1', section: '4' }
];

nuclearFixes.forEach(fix => {
    // Remove if already exists (by ID or Name to avoid duplicates)
    students = students.filter(s => s.id !== fix.id && s.name !== fix.name);
    students.push({
        id: fix.id,
        name: fix.name,
        group: fix.group,
        section: fix.section || "2",
        subGroup: "A",
        serial: 999,
        _v: "1.7" // Metadata to force a change
    });
});

// 2. Global Hamza & Normalization
students = students.map(s => {
    let name = s.name;
    // Standard Hamza fixes
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/\bامنيه\b/g, 'أمنية');
    name = name.replace(/^ايمان\b/g, 'إيمان');
    name = name.replace(/^اسماعيل/g, 'إسماعيل');
    name = name.replace(/^ايهاب/g, 'إيهاب'); // Normalize Ehab

    // Group 2 specific Abd spacing
    if (s.group === '2') {
        name = name.replace(/\bعبد الرازق\b/g, 'عبدالرازق');
        name = name.replace(/\bعبد العاطي\b/g, 'عبدالعاطي');
        name = name.replace(/\bعبد الصادق\b/g, 'عبدالصادق');
    }
    return { ...s, name };
});

// 3. Clear shifted IDs if they exist
const shiftedIds = ['2420110', '2420154', '2420158', '2420160', '2420164'];
students = students.filter(s => !shiftedIds.includes(s.id));

// 4. Final Final Sort and Unique
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log(`Precision surgery v1.7 complete. Total students: ${finalStudents.length}`);
