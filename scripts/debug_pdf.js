const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

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

async function debug(pdfRelPath, targetPageNum, searchText) {
    const pdfPath = path.join(PUBLIC_DIR, pdfRelPath);
    if (!fs.existsSync(pdfPath)) {
        console.error("PDF not found:", pdfPath);
        return;
    }

    const pages = await getPdfPages(pdfPath);
    console.log(`\n--- Debugging PDF: ${pdfRelPath} ---`);
    console.log(`Total Pages: ${pages.length}`);

    if (targetPageNum > 0 && targetPageNum <= pages.length) {
        console.log(`\nContent of Page ${targetPageNum}:`);
        console.log(pages[targetPageNum - 1].substring(0, 1000));
    }

    if (searchText) {
        console.log(`\nSearching for matches for: "${searchText}"`);
        const searchTerms = searchText.toLowerCase().split(/[^\w\u0621-\u064A]+/).filter(w => w.length > 2);

        for (let i = 0; i < pages.length; i++) {
            const pageText = pages[i].toLowerCase();
            let matches = 0;
            let matchedWords = [];
            for (const term of searchTerms) {
                if (pageText.includes(term)) {
                    matches++;
                    matchedWords.push(term);
                }
            }
            if (matches > 0) {
                console.log(`Page ${i + 1}: ${matches} matches (${matchedWords.join(', ')})`);
            }
        }
    }
}

// Debugging DS-401 Lecture 1 (Intro)
debug('/materials/DS-401/المحاضرة الاولى.pdf', 1, "organization of the data in a way that it can be used efficiently");
debug('/materials/DS-401/المحاضرة الاولى.pdf', 3, "Storing Access Insertion Deletion Searching");
debug('/materials/DS-401/المحاضرة الاولى.pdf', 10, "Primitive Non-Primitive Linear Non-Linear");
