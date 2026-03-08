const fs = require('fs');
const xlsx = require('xlsx');

const excelPath = 'c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية (1).xlsx';
const workbook = xlsx.readFile(excelPath);

workbook.SheetNames.forEach((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`Sheet ${index}: ${sheetName} | Rows: ${rows.length}`);
    for (let i = 0; i < Math.min(10, rows.length); i++) {
        console.log(`Row ${i}:`, rows[i]);
    }
});
