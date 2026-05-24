const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extractText(filename) {
    const filePath = path.join(__dirname, '../public/materials/WEB-201', filename);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const outPath = path.join(__dirname, '../tmp', filename.replace('.pdf', '.txt'));
    fs.writeFileSync(outPath, data.text);
    console.log(`Extracted ${filename}`);
}

async function run() {
    await extractText('المحاضرة 6.pdf');
    await extractText('المحاضرة 7.pdf');
    await extractText('المحاضرة 8.pdf');
}

run().catch(console.error);
