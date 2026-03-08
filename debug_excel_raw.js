const xlsx = require('xlsx');
const fs = require('fs');

const excelPath = 'c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية (1).xlsx';
const workbook = xlsx.readFile(excelPath);

const sampleIds = ['2220512', '2421132', '2421288'];

console.log("--- RAW EXCEL DUMP (NO CLEANING) ---");
workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach(row => {
        const rowStr = row.join(' ');
        sampleIds.forEach(id => {
            if (rowStr.includes(id)) {
                console.log(`Sheet: ${sheetName} | ID: ${id}`);
                console.log(`Row Array:`, JSON.stringify(row, null, 2));
            }
        });
    });
});
