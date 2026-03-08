const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 1. Explicit ID/Name Surgeon List
const finalSurgeries = [
    { id: '2420002', name: 'إبراهيم أبو الفتوح إبراهيم عبد الواحد القط' },
    { id: '2420003', name: 'إبراهيم حاتم رمضان أحمد' },
    { id: '2420004', name: 'إبراهيم خميس إبراهيم صالح' },
    { id: '2420005', name: 'إبراهيم رمضان محمد الشلقاني' },
    { id: '2420006', name: 'إبراهيم عبد الرحمن عبد المنعم أحمد' },
    { id: '2420007', name: 'إبراهيم عبد المؤمن هنداوي هنداوي الفقى' },
    { id: '2420019', name: 'أحمد أمين أحمد محمد حداد' },
    { id: '2420059', name: 'أحمد علي أحمد علي علي العياط' },
    { id: '2420061', name: 'أحمد علي عبد المنعم عشماوي عشماوي' },
    { id: '2420066', name: 'أحمد محمد جاد الله محمد جاد الله' },
    { id: '2320088', name: 'أحمد فاروق كمال عبد البديع' },
    { id: '2320089', name: 'أحمد محمد صلاح عبد الحميد' },
    { id: '2420155', name: 'أماني رمضان مبروك عبد الرازق' },
    { id: '2420056', name: 'أحمد عبد المجيد أحمد عبد المجيد' }
];

finalSurgeries.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        students[index].name = corr.name;
    } else {
        // If ID not found, check if student exists with different ID by partial name
        const partialName = corr.name.split(' ').slice(0, 3).join(' ');
        const nameIdx = students.findIndex(s => s.name.includes(partialName));
        if (nameIdx !== -1) {
            students[nameIdx].id = corr.id;
            students[nameIdx].name = corr.name;
        } else {
            // New student
            students.push({
                id: corr.id,
                name: corr.name,
                group: corr.id.startsWith('24') ? "1" : "4",
                section: "1",
                subGroup: "A",
                serial: 999
            });
        }
    }
});

// 2. Global Hamza Cleanup (Ahmad -> Ahmad with Hamza)
students = students.map(s => {
    let name = s.name;

    // Global replace for 'احمد ' at the start of any word or name
    // This is aggressive but matches the user requirement "خطأ متكرر في كل أسماء أحمد"
    name = name.replace(/^احمد\s/g, 'أحمد ');
    name = name.replace(/\sاحمد\s/g, ' أحمد ');

    // Other specific hamzas mentioned
    name = name.replace(/^اماني\s/g, 'أماني ');
    name = name.replace(/^اميرة\s/g, 'أميرة ');
    name = name.replace(/^اسامه\s/g, 'أسامة ');
    name = name.replace(/^ابرار\s/g, 'أبرار ');
    name = name.replace(/^ابراهيم\s/g, 'إبراهيم ');

    // Specific typo for AbdulAti
    if (name.includes('أميرة صبحي')) {
        name = name.replace('عبد العاطي', 'عبدالعاطي');
    }

    s.name = name;
    return s;
});

// Final check to ensure surgeries aren't messed up by global rules
finalSurgeries.forEach(corr => {
    const index = students.findIndex(s => s.id === corr.id);
    if (index !== -1) {
        students[index].name = corr.name;
    }
});

// Ensure ID Uniqueness (Keep the one in surgeries if there's a conflict)
const surgeryIds = new Set(finalSurgeries.map(s => s.id));
const uniqueMap = new Map();

// First pass: put surgeries
finalSurgeries.forEach(corr => {
    const existing = students.find(s => s.id === corr.id);
    if (existing) {
        uniqueMap.set(corr.id, existing);
    }
});

// Second pass: put others
students.forEach(s => {
    if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
    }
});

const result = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(result, null, 2));
console.log('Final Precision Surgery Complete.');
