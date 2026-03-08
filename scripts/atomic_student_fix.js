const fs = require('fs');
const path = require('path');

const studentsPath = path.join(process.cwd(), 'src/data/students.json');
let students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// Atomic Precision List
const atomicSurgicals = [
    { id: '2420001', name: 'أبرار السيد محمد محمد أحمد', group: '1' },
    { id: '2420002', name: 'إبراهيم أبو الفتوح إبراهيم عبد الواحد القط', group: '1' },
    { id: '2420003', name: 'إبراهيم حاتم رمضان أحمد', group: '1' },
    { id: '2420004', name: 'إبراهيم خميس إبراهيم صالح', group: '1' },
    { id: '2420005', name: 'إبراهيم رمضان محمد الشلقاني', group: '1' },
    { id: '2420007', name: 'إبراهيم عبد المؤمن هنداوي هنداوي الفقى', group: '1' },
    { id: '2420019', name: 'أحمد أمين أحمد محمد حداد', group: '1' },
    { id: '2420059', name: 'أحمد علي أحمد علي علي العياط', group: '1' },
    { id: '2420061', name: 'أحمد علي عبد المنعم عشماوي عشماوي', group: '1' },
    { id: '2420066', name: 'أحمد محمد جاد الله محمد جاد الله', group: '1' },
    { id: '2420056', name: 'أحمد عبد المجيد أحمد عبد المجيد', group: '1' },
    { id: '2320088', name: 'أحمد فاروق كمال عبد البديع', group: '1' }, // Changed to Group 1
    { id: '2320089', name: 'أحمد محمد صلاح عبد الحميد', group: '1' }  // Changed to Group 1
];

atomicSurgicals.forEach(corr => {
    const s = students.find(x => x.id === corr.id);
    if (s) {
        s.name = corr.name;
        s.group = corr.group;
    } else {
        students.push({
            id: corr.id,
            name: corr.name,
            group: corr.group,
            section: "1",
            subGroup: "A",
            serial: 999
        });
    }
});

// Final duplication cleanup
const uniqueMap = new Map();
students.forEach(s => uniqueMap.set(s.id, s));
const finalStudents = Array.from(uniqueMap.values()).sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(studentsPath, JSON.stringify(finalStudents, null, 2));
console.log('Atomic surgery and grouping fix complete.');
