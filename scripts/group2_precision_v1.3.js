const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Group Reassignment: F04, F05, F06 -> Group 2
students = students.map(s => {
    if (['4', '5', '6'].includes(s.section)) {
        return { ...s, group: '2' };
    }
    return s;
});

// 2. Specific Surgical Fixes (Name and ID move)
const surgicals = [
    { oldId: '2420110', newId: '2420111', name: 'إسماعيل محمد إسماعيل محمد إبراهيم', group: '2' },
    { oldId: '2420154', newId: '2420155', name: 'أماني رمضان مبروك عبدالرازق', group: '2' },
    { oldId: '2420158', newId: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف', group: '2' },
    { oldId: '2420160', newId: '2420161', name: 'أميرة محمود بدري محمد ملكي', group: '2' },
    { oldId: '2420164', newId: '2420165', name: 'أمنية نبيل محمد', group: '2' },
    { currentId: '2420150', name: 'أروى أشرف محمد محمد عبد العزيز', group: '2' },
    { currentId: '2320127', name: 'إيهاب حمدي إبراهيم', group: '2' }
];

surgicals.forEach(fix => {
    if (fix.oldId) {
        // Find if the student at oldId is the one we want to move
        const currentAtOld = students.find(s => s.id === fix.oldId);
        // Remove students from both old and new positions to prevent duplicates
        students = students.filter(s => s.id !== fix.oldId && s.id !== fix.newId);
        // Add the corrected student at new position
        students.push({
            ...(currentAtOld || { section: '2', subGroup: 'A', serial: 999 }),
            id: fix.newId,
            name: fix.name,
            group: fix.group
        });
    } else {
        // Direct update by Id for non-shift cases
        const index = students.findIndex(s => s.id === fix.currentId);
        if (index !== -1) {
            students[index].name = fix.name;
            students[index].group = fix.group;
        } else {
            students.push({
                id: fix.currentId,
                name: fix.name,
                group: fix.group,
                section: '2',
                subGroup: 'A',
                serial: 999
            });
        }
    }
});

// 3. Global Spelling & Formatting for Group 2
students = students.map(s => {
    let name = s.name;
    // Spelling fixes
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');
    name = name.replace(/\bامنيه\b/g, 'أمنية');
    name = name.replace(/^ايمان\b/g, 'إيمان');
    name = name.replace(/^اسماعيل/g, 'إسماعيل');

    // Arabic "Abd" spacing as per user preference (no space for Group 2)
    if (s.group === '2') {
        name = name.replace(/\bعبد الرازق\b/g, 'عبدالرازق');
        name = name.replace(/\bعبد العاطي\b/g, 'عبدالعاطي');
        name = name.replace(/\bعبد الصادق\b/g, 'عبدالصادق');
    }

    return { ...s, name };
});

// 4. Cleanup and Uniqueness
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Group 2 Surgical Precision v1.3 Complete.');
