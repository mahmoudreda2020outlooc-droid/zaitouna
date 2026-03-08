const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Group Mapping: Sections 10, 11, 12 -> Group 4
// And apply the -498 ID shift to these students
const ID_SHIFT = 498;
const g4RangeStart = 2420377; // As per user's Habiba ID

// We'll perform the move in a way that avoids collisions
let movedStudents = [];
let otherStudents = [];

students.forEach(s => {
    const idNum = parseInt(s.id);
    if (['10', '11', '12'].includes(s.section)) {
        // This is a candidate for Group 4
        let newId = s.id;
        if (idNum > 2420500) { // Likely in the shifted range
            newId = (idNum - ID_SHIFT).toString();
        }
        movedStudents.push({
            ...s,
            id: newId,
            group: '4'
        });
    } else {
        otherStudents.push(s);
    }
});

// 2. Specific Surgical Precision per User Request
const specificFixes = [
    { id: '2420377', name: 'حبيبة إبراهيم السيد محمد جلال', group: '4' },
    { id: '2420380', name: 'حبيبة محمد جلال الدين محمد', group: '4' },
    { id: '2420436', name: 'دعاء شحاتة رمضان عبد الحميد', group: '4' },
    { id: '2420381', name: 'حبيبة محمد عبدالمنعم إبراهيم', group: '4' },
    { id: '2420406', name: 'حنين محمد إبراهيم محمد عبدالقوي', group: '4' },
    { id: '2320141', name: 'حسام حسن محمد علي', group: '4' }
];

// Apply specific fixes (Move from movedStudents or add new)
specificFixes.forEach(fix => {
    // Remove if already in movedStudents or others to avoid duplicates
    movedStudents = movedStudents.filter(s => s.id !== fix.id && s.name !== fix.name);
    otherStudents = otherStudents.filter(s => s.id !== fix.id && s.name !== fix.name);

    movedStudents.push({
        id: fix.id,
        name: fix.name,
        group: fix.group,
        section: fix.id === '2320141' ? '16' : '12', // Page 16 for Hossam
        subGroup: 'A',
        serial: 999
    });
});

// 3. Global Spelling & Formatting for Group 4
let finalPool = [...otherStudents, ...movedStudents].map(s => {
    let name = s.name;

    // Ta' Marbuta for Group 4 girls (Habiba, Hanine)
    if (s.group === '4') {
        name = name.replace(/\bحبيبه\b/g, 'حبيبة');
        name = name.replace(/\bحنينه\b/g, 'حنينة');
        name = name.replace(/\bشحاته\b/g, 'شحاتة');

        // Compound names (No space)
        name = name.replace(/\bعبد المنعم\b/g, 'عبدالمنعم');
        name = name.replace(/\bعبد الحميد\b/g, 'عبدالحميد');
    }

    // General hamzas for consistency
    name = name.replace(/^دعاء\b/g, 'دعاء'); // Ensure hamza on line
    name = name.replace(/^اسامه\b/g, 'أسامة');
    name = name.replace(/^الاء\b/g, 'آلاء');

    return { ...s, name };
});

// 4. Final Unique Check and Sort
const uniqueMap = new Map();
finalPool.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Group 4 Surgical Precision v1.8 Complete.');
