const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// Surgical Corrections based on the LAST list
const precisionCorrections = [
    { id: '2420002', name: 'إبراهيم أبو الفتوح إبراهيم عبد الواحد القط' },
    { id: '2420003', name: 'إبراهيم حاتم رمضان أحمد' },
    { id: '2420004', name: 'إبراهيم خميس إبراهيم صالح' },
    { id: '2420005', name: 'إبراهيم رمضان محمد الشلقاني' },
    { id: '2420006', name: 'إبراهيم عبد الرحمن عبد المنعم أحمد' },
    { id: '2420007', name: 'إبراهيم عبد المؤمن هنداوي هنداوي الفقى' },
    { id: '2420019', name: 'أحمد أمين أحمد محمد حداد' },
    { id: '2420056', name: 'أحمد عبد المجيد أحمد عبد المجيد' },
    { id: '2420061', name: 'أحمد علي عبد المنعم عشماوي عشماوي' },
    { id: '2420066', name: 'أحمد محمد جاد الله محمد جاد الله' },
    { id: '2320088', name: 'أحمد فاروق كمال عبد البديع' },
    { id: '2420159', name: 'أميرة صبحي إبراهيم عبدالعاطي شرف' }
];

precisionCorrections.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        students[index].name = corr.name;
    } else {
        // Find if the student exists under a wrong ID and move them
        const nameKeywords = corr.name.split(' ').slice(0, 3).join(' '); // Match first 3 names
        const nameIndex = students.findIndex(s => s.name.includes(nameKeywords));
        if (nameIndex !== -1) {
            students[nameIndex].id = corr.id;
            students[nameIndex].name = corr.name;
        } else {
            console.log(`Adding missing student: ${corr.name} (${corr.id})`);
            students.push({
                id: corr.id,
                name: corr.name,
                group: "1",
                section: "1",
                subGroup: "A",
                serial: 999
            });
        }
    }
});

// Remove potential leftovers or duplicates if IDs were shifted
const finalIds = precisionCorrections.map(c => c.id);
// No, let's just ensure clean data

const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values());

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Precision corrections complete.');
