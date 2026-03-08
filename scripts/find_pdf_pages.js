const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const LECTURES_PATH = path.join(__dirname, '../src/data/lectures.json');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function getPdfPages(pdfPath) {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pages = [];
    const options = {
        pagerender: function (pageData) {
            return pageData.getTextContent().then(function (textContent) {
                let text = '';
                for (let item of textContent.items) text += item.str + ' ';
                pages.push(text);
                return text;
            });
        }
    };
    await pdf(dataBuffer, options);
    return pages;
}

function findBestPage(question, answer, pages) {
    if (!pages || pages.length === 0) return 1;

    let bestPage = 1;
    let maxScore = -1;

    const qLower = question.toLowerCase();
    const aLower = answer.toLowerCase();

    // Extract unique identifiers (numbers and symbols)
    const mathCandidates = (question + " " + answer).match(/[\d+\-*/^=]{3,}/g) || [];
    const cleanMath = mathCandidates.map(m => m.replace(/\s+/g, ''));

    const keywords = (qLower + " " + aLower).split(/[^\w\u0621-\u064A]+/).filter(w => w.length > 3);

    for (let i = 0; i < pages.length; i++) {
        const pageText = pages[i].toLowerCase();
        const pageTextNoSpace = pageText.replace(/\s+/g, '');
        let score = 0;

        // 1. Math match (space insensitive) - High Priority
        for (const m of cleanMath) {
            if (pageTextNoSpace.includes(m)) score += 30;
        }

        // 2. Keyword match - Medium Priority
        for (const kw of keywords) {
            if (pageText.includes(kw)) {
                score += (kw.length > 6) ? 3 : 1;
            }
        }

        // 3. Exact answer string match
        if (aLower.length > 5 && pageText.includes(aLower)) score += 40;

        if (score > maxScore) {
            maxScore = score;
            bestPage = i + 1;
        }
    }

    return bestPage;
}

async function run() {
    console.log('Reading lectures...');
    const lectures = JSON.parse(fs.readFileSync(LECTURES_PATH, 'utf8'));
    let totalUpdated = 0;

    for (const lecture of lectures) {
        const pdfRelPath = lecture.resources?.pdf;
        if (!pdfRelPath || pdfRelPath === '#' || pdfRelPath.startsWith('http')) continue;

        const pdfPath = path.join(PUBLIC_DIR, pdfRelPath);
        if (!fs.existsSync(pdfPath)) continue;

        console.log(`📄 Processing: ${lecture.title}`);
        try {
            const pages = await getPdfPages(pdfPath);
            if (lecture.sheetSolutions) {
                for (const q of lecture.sheetSolutions) {
                    const prevPage = q.pdfPage;
                    const newPage = findBestPage(q.question, q.answer, pages);
                    q.pdfPage = newPage;
                    if (prevPage !== newPage) totalUpdated++;
                }
            }
        } catch (err) {
            console.error(`❌ Error parsing ${pdfPath}:`, err.message);
        }
    }

    fs.writeFileSync(LECTURES_PATH, JSON.stringify(lectures, null, 2), 'utf8');
    console.log(`\n✅ Done! Fixed ${totalUpdated} pages with high-precision mapping.`);
}

run().catch(console.error);
