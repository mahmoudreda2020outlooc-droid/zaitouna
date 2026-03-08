const xlsx = require('xlsx');

const excelPath = 'c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية (1).xlsx';
const workbook = xlsx.readFile(excelPath);

workbook.SheetNames.forEach((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    rows.forEach((row, rowIndex) => {
        const rowStr = row.join(' ');
        if (rowStr.includes("محمود رضا عبد العزيز") || rowStr.includes("2421118")) {
            console.log(`Match in Sheet "${sheetName}" (Index ${index}), Row ${rowIndex}:`);
            console.log(row);
        }
    });
});
