const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
const lostPath = path.join(process.cwd(), 'src/data/lost_students.json');

let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));
let lostStudents = fs.existsSync(lostPath) ? JSON.parse(fs.readFileSync(lostPath, 'utf8')) : [];

const corrections = [
    { id: '2420001', name: 'أبرار السيد محمد محمد' },
    { id: '2420005', name: 'إبراهيم رمضان محمد الشلقاني' },
    { id: '2420004', name: 'إبراهيم خميس إبراهيم صالح' },
    { id: '2420055', name: 'أحمد عبد الرحمن عبد المنعم غندور' },
    { id: '2420056', name: 'أحمد عبد المجيد أحمد عبد المجيد' },
    { id: '2420019', name: 'أحمد أمين أحمد محمد حداد' },
    { id: '2420066', name: 'أحمد محمد جاد الله محمد جاد الله' },
    { id: '2420108', name: 'أسامة محمود السيد محمد' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف' },
    { id: '2420259', name: 'آلاء السيد عبد الحميد عبد الحليم' },
    { id: '2420279', name: 'بسملة إسلام عبد الله سلام' },
    { id: '2420111', name: 'إسماعيل محمد إسماعيل' },
    { id: '2420505', name: 'ليلى محمد حسن صابر' },
    { id: '2420161', name: 'أميرة محمود بدري محمد ملکی' }
];

corrections.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        // Log existing to lost if name is significantly different (not just hamzas)
        const oldName = students[index].name;
        const isSignificantlyDifferent = !corr.name.includes(oldName.replace(/[أإآا]/g, 'ا').substring(0, 5));

        if (isSignificantlyDifferent) {
            console.log(`Moving ${oldName} (${corr.id}) to lost students.`);
            lostStudents.push(students[index]);
        }

        students[index].name = corr.name;
        console.log(`Updated ${corr.id}: ${oldName} -> ${corr.name}`);
    } else {
        // Create new record if ID not found? Usually they exist under different ID.
        // For simplicity, let's look for the name if ID fails.
        const nameIndex = students.findIndex(s => s.name.includes(corr.name.replace(/[أإآ]/g, 'ا').substring(0, 10)));
        if (nameIndex !== -1) {
            const oldId = students[nameIndex].id;
            students[nameIndex].id = corr.id;
            students[nameIndex].name = corr.name;
            console.log(`Updated by Name ${corr.name}: ${oldId} -> ${corr.id}`);
        } else {
            console.log(`Warning: Student ${corr.name} (${corr.id}) not found at all.`);
        }
    }
});

// Remove duplicates in students array (if any ID was reassigned to a secondary slot)
const uniqueStudents = [];
const seenIds = new Set();
for (const s of students) {
    if (!seenIds.has(s.id)) {
        uniqueStudents.push(s);
        seenIds.add(s.id);
    } else {
        console.log(`Removing duplicate record for ${s.id}: ${s.name}`);
        lostStudents.push(s);
    }
}

fs.writeFileSync(studentsPath, JSON.stringify(uniqueStudents, null, 2));
fs.writeFileSync(lostPath, JSON.stringify(lostStudents, null, 2));
console.log('Correction complete.');
