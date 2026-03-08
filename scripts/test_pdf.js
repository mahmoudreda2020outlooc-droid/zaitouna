const fs = require('fs');
const pdf = require('pdf-parse');

async function testPdf() {
    const dataBuffer = fs.readFileSync('public/materials/WEB-201/sheet 1.pdf');
    const data = await pdf(dataBuffer);
    console.log("Text length:", data.text.length);
    console.log("First 500 chars:", data.text.substring(0, 500));
}

testPdf();
