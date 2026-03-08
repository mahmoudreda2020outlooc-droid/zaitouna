const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Precise Group 2 Corrections (IDs and Full Names)
const group2Fixes = [
    { id: '2420111', name: 'إسماعيل محمد إسماعيل محمد إبراهيم', group: '2' },
    { id: '2420155', name: 'أماني رمضان مبروك عبد الرازق', group: '2' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف', group: '2' },
    { id: '2420161', name: 'أميرة محمود بدري محمد ملكي', group: '2' },
    { id: '2420150', name: 'أروى أشرف محمد محمد عبد العزيز', group: '2' },
    { id: '2420165', name: 'أمنية نبيل محمد', group: '2' }, // Reported as 2420165
    { id: '2320127', name: 'إيهاب حمدي إبراهيم', group: '2' }
];

group2Fixes.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        students[index].name = corr.name;
        students[index].group = corr.group;
    } else {
        students.push({
            id: corr.id,
            name: corr.name,
            group: corr.group,
            section: "2",
            subGroup: "A",
            serial: 999
        });
    }
});

// 2. Global Group 2 Normalization (Hamzas, Ta' Marbuta, and "Abd" spacing)
students = students.map(s => {
    let name = s.name;

    // Spelling fixes
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/\bامنيه\b/g, 'أمنية');
    name = name.replace(/^ايمان\b/g, 'إيمان');

    // Abd spacing for Group 2
    if (s.group === '2') {
        name = name.replace(/\bعبد الرازق\b/g, 'عبدالرازق');
        name = name.replace(/\bعبد العاطي\b/g, 'عبدالعاطي');
        name = name.replace(/\bعبد الصادق\b/g, 'عبدالصادق');
    }

    return { ...s, name };
});

// 3. ID Consistency check: If user said إسماعيل is 2420111, but was 2420110, we should ensure 2420110 is NOT Ismail.
// To avoid accidental overwrites of other students, we'll rely on the user's specific mapping.

// Final sort and unique
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Group 2 Surgical Precision Complete.');
