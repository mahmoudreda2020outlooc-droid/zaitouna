/**
 * add_sheet_types.js
 * Adds a `type` field to every sheetSolution entry in lectures.json
 * Overwrites any existing type values.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/lectures.json');
const lectures = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function detectType(q) {
    const question = q.question || '';
    const answer = (q.answer || '').trim().toLowerCase();
    const qLower = question.toLowerCase();

    // ---------- True / False ----------
    if (/true or false|false or true|صح أم خطأ|صح او خطأ|correct or incorrect/i.test(qLower)) return 'tf';
    if (/^(true|false|صح|خطأ|correct|incorrect)$/.test(answer)) return 'tf';

    // ---------- Fill in the blank ----------
    if (/\.{4,}/.test(question) || /_{3,}/.test(question)) return 'fitb';
    if (/أكمل|اكمل|fill in/i.test(qLower)) return 'fitb';

    // ---------- MCQ (broad) ----------
    if (/which of the following|which one|which statement|which option|which function|which method|which superglobal|which keyword|which tag|which command|which tool/i.test(qLower)) return 'mcq';
    if (/أي مما يلي|أيهما يمثل|أيهما صحيح|اختر (الإجابة|الصحيح)/i.test(qLower)) return 'mcq';
    if (/what is the correct|what is the right|what are the correct|what is the proper/i.test(qLower)) return 'mcq';
    // Acronym / definition questions (typically MCQ in exams)
    if (/what does .+ stand for\?/i.test(qLower)) return 'mcq';
    // "What is used to..." / "What is needed to..." style questions
    if (/what is used to|what is needed to|what is required to/i.test(qLower)) return 'mcq';
    // Inline choice lines like "a) ..." or "A. ..."
    if (/\n\s*[a-dA-D][).]\s/.test('\n' + question)) return 'mcq';
    if (/\n\s*[أ-د][).]\s/.test('\n' + question)) return 'mcq';
    // Short factual answer (1-4 words) on questions that start with "What is"
    const answerWordCount = answer.split(/\s+/).filter(Boolean).length;
    if (/^what is\b/.test(qLower) && answerWordCount <= 4) return 'mcq';
    // "What is the main/primary/purpose/role/function of..." style questions
    if (/what is the (main|primary|purpose|role|function|goal|advantage|disadvantage|difference|use|benefit|feature|type)\b/i.test(qLower)) return 'mcq';
    // "What is X?" where answer is a short phrase (up to 8 words) and not a coding question
    if (/^what is\b/.test(qLower) && answerWordCount <= 8 && !/[{}();]/.test(q.answer || '')) return 'mcq';

    // ---------- Essay / Coding / Short Answer ----------
    if (/^write\s|^كتابة|^اكتب|^write a\b/i.test(question)) return 'essay';
    if (/^explain\s|^describe\s|^discuss\s|^mention\s|^what is the difference|^اشرح|^وضح|^ناقش|^اذكر/i.test(qLower)) return 'essay';

    return 'essay';
}

let changed = 0;
for (const lecture of lectures) {
    if (!lecture.sheetSolutions) continue;
    for (const q of lecture.sheetSolutions) {
        const det = detectType(q);
        if (q.type !== det) {
            q.type = det;
            changed++;
        }
    }
}

fs.writeFileSync(filePath, JSON.stringify(lectures, null, 2), 'utf8');

const stats = {};
for (const lecture of lectures) {
    for (const q of (lecture.sheetSolutions || [])) {
        stats[q.type] = (stats[q.type] || 0) + 1;
    }
}
console.log(`✅  Done! Updated ${changed} entries.`);
console.log('Type distribution:', stats);

// Print all to verify
for (const lecture of lectures) {
    if (!lecture.sheetSolutions) continue;
    for (const q of lecture.sheetSolutions) {
        console.log(`[${q.type}] ${q.question.substring(0, 60)}`);
    }
}
