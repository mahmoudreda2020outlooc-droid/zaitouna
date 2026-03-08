const fs = require('fs');
const lectures = JSON.parse(fs.readFileSync('./src/data/lectures.json', 'utf8'));

function getType(q) {
    const typeStr = (q.type || '').toLowerCase().trim();
    if (['mcq', 'multiple_choice', 'multiple choice', 'اختياري'].includes(typeStr)) return 'اختياري';
    if (['tf', 'true_false', 'true/false', 't/f', 'صح وخطأ'].includes(typeStr)) return 'صح وخطأ';
    if (['fitb', 'fill_in_the_blanks', 'أكمل'].includes(typeStr)) return 'أكمل';
    if (q.options && Array.isArray(q.options) && q.options.length > 0) return 'اختياري';
    const text = (q.question || '').toLowerCase();
    if (/which of the following/i.test(text) || /أي مما يلي/i.test(text)) return 'اختياري';
    if (/\.{4,}/.test(q.question) || /_{3,}/.test(q.question)) return 'أكمل';
    if (/true or false|صح أم خطأ/i.test(text)) return 'صح وخطأ';
    if (q.answer && /^(true|false|صح|خطأ)$/i.test((q.answer || '').trim())) return 'صح وخطأ';
    return 'مقالى';
}

// Print only 'مقالى' to see what we're missing
for (const lecture of lectures) {
    if (lecture.sheetSolutions && lecture.sheetSolutions.length > 0) {
        for (const q of lecture.sheetSolutions) {
            if (getType(q) === 'مقالى') {
                console.log(`Q: ${q.question}`);
                console.log(`A: ${q.answer}`);
                console.log('---');
            }
        }
    }
}
