const xlsx = require('xlsx');
const fs = require('fs');

const excelPath = 'c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية (1).xlsx';
const jsonPath = 'c:/Users/user/Desktop/works/الزتونة/zaitouna-web/src/data/students.json';

const workbook = xlsx.readFile(excelPath);
const studentsJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const jsonMap = new Map(studentsJson.map(s => [s.id, s]));

console.log("--- Comparison: Raw Excel vs. Processed JSON ---");

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach(row => {
        const process = (name, id) => {
            const sid = String(id).trim();
            if (!sid || sid.length !== 7 || isNaN(parseInt(sid))) return;

            const jsonEntry = jsonMap.get(sid);
            if (jsonEntry) {
                const rawName = String(name || "").trim();
                const processedName = jsonEntry.name;
                if (rawName !== processedName) {
                    console.log(`ID: ${sid} | Diff Found!`);
                    console.log(`   Raw: "${rawName}"`);
                    console.log(`   Fix: "${processedName}"`);
                }
            }
        };

        process(row[0], row[1]);
        process(row[4], row[5]);
    });
});
