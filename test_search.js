const fs = require('fs');
const pdf = require('pdf-parse');

async function test() {
    const dataBuffer = fs.readFileSync('c:/Users/user/Desktop/works/الزتونة/قوائم الفرقة الثانية.pdf');
    const data = await pdf(dataBuffer);
    const lines = data.text.split('\n').filter(l => l.trim());

    // find ID 2421288
    const idx = lines.findIndex(l => l.includes('2421288'));
    if (idx !== -1) {
        console.log("ID 2421288 raw lines:");
        for (let i = Math.max(0, idx - 5); i <= idx + 5; i++) {
            const l = lines[i];
            console.log(`[${i}] ${l}`);
            // print exact hex chars to see if 'r' is hiding inside a ligature or something
            let hex = '';
            for (let j = 0; j < l.length; j++) {
                hex += l.charCodeAt(j).toString(16) + ' ';
            }
            console.log("   Hex:", hex);
        }
    }
}
test();
