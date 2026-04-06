require('dotenv').config();
const fetch = require('node-fetch');

async function testLookup() {
    const studentId = '2220011'; // أول طالب في السكريبت
    console.log(`Testing lookup for student: ${studentId}`);

    // محاكاة طلب من الفرونت إيند (بدون cookie حالياً للتجربة)
    // بس الـ API بيحتاج cookie أو يكون check=true
    const url = `http://localhost:3000/api/student-lookup?id=${studentId}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Result:', data);
    } catch (e) {
        console.error('Fetch failed (Normal if dev server is not running):', e.message);
    }
}

testLookup();
