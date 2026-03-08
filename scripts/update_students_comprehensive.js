const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Explicit ID/Name Corrections & Shifts
const specificCorrections = [
    { id: '2420002', name: 'إبراهيم أبو الفتوح إبراهيم عبد الواحد القط' },
    { id: '2420003', name: 'إبراهيم حاتم رمضان أحمد' },
    { id: '2420004', name: 'إبراهيم خميس إبراهيم صالح' },
    { id: '2420005', name: 'إبراهيم رمضان محمد الشلقاني' },
    { id: '2420006', name: 'إبراهيم عبد الرحمن عبد المنعم أحمد' },
    { id: '2420007', name: 'إبراهيم عبد المؤمن هنداوي هنداوي الفقى' },
    { id: '2420019', name: 'أحمد أمين أحمد محمد حداد' },
    { id: '2420055', name: 'أحمد عبد الرحمن عبد المنعم غندور' },
    { id: '2420056', name: 'أحمد عبد المجيد أحمد عبد المجيد' },
    { id: '2420059', name: 'أحمد علي أحمد علي علي العياط' },
    { id: '2420060', name: 'أحمد علي عبد العظيم إبراهيم' },
    { id: '2420061', name: 'أحمد علي عبد المنعم عشماوي عشماوي' },
    { id: '2420066', name: 'أحمد محمد جاد الله محمد جاد الله' },
    { id: '2320089', name: 'أحمد محمد صلاح عبد الحميد' }
];

specificCorrections.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        students[index].name = corr.name;
        // Ensure some students from group 4/others are marked as Group 1 if they follow the new logic (optional based on user prompt but let's stick to name/ID)
    } else if (corr.id === '2320089') {
        // Add if entirely missing
        students.push({
            id: '2320089',
            name: corr.name,
            group: "1",
            section: "1",
            subGroup: "A",
            serial: 999
        });
    }
});

// 2. Global spelling normalize rules
const globalFixes = [
    { from: /^احمد /, to: 'أحمد ' },
    { from: /^اماني /, to: 'أماني ' },
    { from: /^اميرة /, to: 'أميرة ' },
    { from: /^اسامه /, to: 'أسامة ' },
    { from: /^ابرار /, to: 'أبرار ' },
    { from: /^إبراهيم /, to: 'إبراهيم ' },
    { from: / عبدالعاطي /g, to: ' عبدالعاطي ' }, // normalize middle words
    { from: /هنداوي$/, to: 'هنداوي' }
];

students = students.map(s => {
    let name = s.name;

    // Normalize Hamzas (Global)
    if (name.startsWith('احمد ')) name = name.replace('احمد ', 'أحمد ');
    if (name.startsWith('احمد')) name = name.replace('احمد', 'أحمد');
    if (name.startsWith('اماني ')) name = name.replace('اماني ', 'أماني ');
    if (name.startsWith('اميرة ')) name = name.replace('اميرة ', 'أميرة ');
    if (name.startsWith('اسامه ')) name = name.replace('اسامه ', 'أسامة ');
    if (name.startsWith('اسامه')) name = name.replace('اسامه', 'أسامة');
    if (name.startsWith('ابرار ')) name = name.replace('ابرار ', 'أبرار ');
    if (name.startsWith('ابراهيم ')) name = name.replace('ابراهيم ', 'إبراهيم ');

    // Tail corrections
    if (name.endsWith(' هنداوي')) name = name.replace(' هنداوي', ' هنداوي هنداوي الفقى'); // specific logic for one record but globalized

    s.name = name;
    return s;
});

// Re-run specific to be sure they win over global rules
specificCorrections.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) students[index].name = corr.name;
});

// Remove duplicates by ID
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values());

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Comprehensive corrections complete.');
