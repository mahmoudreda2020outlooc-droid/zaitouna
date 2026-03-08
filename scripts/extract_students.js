const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = 'c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية (1).xlsx';
const outputPath = path.join(__dirname, '..', 'src', 'data', 'students.json');
const overridesPath = path.join(__dirname, '..', 'src', 'data', 'manual_overrides.json');

// Get manual overrides if তারা exist
let manualOverrides = {};
if (fs.existsSync(overridesPath)) {
    manualOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
}

/**
 * High-Fidelity Extraction (v6 - Document Faithful).
 * 1. ZERO global normalization of Hamzas or Spaces (Abds).
 * 2. ONLY cleans OCR symbols and junk dots.
 * 3. Joins fragments safely.
 * 4. Relies on overrides for cases where the source is actually wrong.
 */
function cleanName(name, id) {
    if (!name) return "";

    // 1. Manual Overrides (TRUST 100% as written, no extra cleaning)
    if (manualOverrides[id]) return manualOverrides[id].trim();

    // 2. OCR Cleanup (ONLY symbols and strange chars, keep Arabic ALIFS and YAs as is)
    let raw = String(name).trim()
        .replace(/[·•:\.ṿ]/g, ' ')
        .replace(/[^\u0600-\u06FF\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // 3. Directional Joiner (To fix actual "flying" letters but NOT independent words)
    let words = raw.split(' ');
    let resultRows = [];

    for (let i = 0; i < words.length; i++) {
        let w = words[i];
        if (w.length === 1) {
            // Affinities: only join if it looks like a genuine split
            const joinRightPrefixes = ['ا', 'أ', 'إ', 'و', 'ج', 'چ', 'ب', 'م', 'س', 'ك', 'ص', 'ن'];
            if (joinRightPrefixes.includes(w) && i < words.length - 1) {
                words[i + 1] = w + words[i + 1];
                continue;
            } else if (resultRows.length > 0) {
                resultRows[resultRows.length - 1] += w;
                continue;
            }
        }
        resultRows.push(w);
    }
    let cleaned = resultRows.join(' ');

    // 4. Note Stripping
    const notesToStrip = ['جديد', 'محول', 'باقي', 'ناجح', 'راسب', 'غائب', 'إعادة'];
    notesToStrip.forEach(note => {
        cleaned = cleaned.replace(new RegExp(note, 'g'), '');
    });

    // 5. Final Touch: Double check "Ali" truncation which is a hard OCR bug in this file
    // But only if it's " عل" standalone at end
    if (cleaned.endsWith(" عل")) {
        cleaned = cleaned.substring(0, cleaned.length - 2) + "علي";
    }

    return cleaned.replace(/\s+/g, ' ').trim();
}

function extractData() {
    try {
        console.log('Reading Excel file...');
        const workbook = xlsx.readFile(excelPath);
        const students = [];

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

            let currentGroup = 1;
            let currentSection = 1;

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length === 0) continue;

                const rowStr = row.join(' ');
                const headerMatch = rowStr.match(/المجموعة\s*(\d+)\s*--\s*فصل\s*(\d+)/);
                if (headerMatch) {
                    currentGroup = parseInt(headerMatch[1]);
                    currentSection = parseInt(headerMatch[2]);
                    continue;
                }

                const processStudent = (name, id, serial, subGroup) => {
                    if (!id) return;
                    const sid = String(id).trim();
                    if (sid.length < 5 || isNaN(parseInt(sid))) return;

                    students.push({
                        id: sid,
                        name: cleanName(name, sid),
                        group: String(currentGroup),
                        section: String(currentSection),
                        subGroup: subGroup,
                        serial: parseInt(serial)
                    });
                };

                processStudent(row[0], row[1], row[2], 'B');
                processStudent(row[4], row[5], row[6], 'A');
            }
        });

        const uniqueStudents = Array.from(new Map(students.map(s => [s.id, s])).values());
        uniqueStudents.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        fs.writeFileSync(outputPath, JSON.stringify(uniqueStudents, null, 2));
        console.log(`Successfully extracted ${uniqueStudents.length} unique students (FIDELITY MODE).`);

    } catch (error) {
        console.error('Extraction failed:', error);
    }
}

extractData();
