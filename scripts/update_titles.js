const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Real titles from the lecture PDFs content
// We extract these by reading the first slide/page of each PDF
const MATERIALS_DIR = path.join(__dirname, '../public/materials');
const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

async function getTitleFromPDF(pdfPath) {
    try {
        const buf = fs.readFileSync(pdfPath);
        const data = await pdf(buf, { max: 2 }); // Only first 2 pages
        // Try to find the lecture title from the first few lines
        const lines = data.text.split('\n').map(l => l.trim()).filter(l => l.length > 3 && l.length < 120);
        // Find lines that look like a title (not just numbers)
        for (const line of lines.slice(0, 20)) {
            if (/[a-zA-Z\u0600-\u06FF]/.test(line) && !line.match(/^\d+$/) && line.length > 5) {
                return line;
            }
        }
        return null;
    } catch (e) {
        console.error('Error:', e.message);
        return null;
    }
}

async function main() {
    let db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    for (let i = 0; i < db.length; i++) {
        const l = db[i];
        // Check the title contains the generic text
        if (l.title.includes('أهم المفاهيم والشرح') || l.title.includes('أهم المفاهي')) {
            const pdfRelPath = l.resources.pdf; // e.g. /materials/WEB-201/Lect (1).pdf
            const pdfAbsPath = path.join(__dirname, '../public', pdfRelPath);

            if (fs.existsSync(pdfAbsPath)) {
                console.log(`Reading: ${pdfRelPath}`);
                const title = await getTitleFromPDF(pdfAbsPath);
                if (title) {
                    const num = l.lectureId.replace('lecture_', '');
                    db[i].title = `المحاضرة ${num}: ${title}`;
                    console.log(`  → ${db[i].title}`);
                }
            } else {
                console.log(`PDF not found: ${pdfAbsPath}`);
            }
        }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
    console.log('\n✅ Titles updated!');

    // Print final state
    db.forEach(l => console.log(l.subjectId, l.lectureId, '→', l.title));
}

main();
