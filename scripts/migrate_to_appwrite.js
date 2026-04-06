const { Client, Databases, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function migrate() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const collId = 'students'; // سنقوم بإنشاء كوليكشن جديد للطلاب

    const studentsPath = path.join(__dirname, '..', 'src', 'data', 'students.json');
    const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

    console.log(`Starting migration of ${students.length} students...`);

    // ملاحظة: يجب إنشاء الـ Collection والـ Attributes في Appwrite أولاً
    // Attributes: studentId (string), name (string), group (string), section (string), subGroup (string), serial (integer)

    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        try {
            await databases.createDocument(dbId, collId, student.id, {
                studentId: student.id,
                name: student.name,
                group: String(student.group || ''),
                section: String(student.section || ''),
                subGroup: String(student.subGroup || ''),
                serial: Number(student.serial || 0)
            });
            if (i % 100 === 0) console.log(`Migrated ${i} / ${students.length}`);
        } catch (e) {
            if (e.code === 409) {
                // Document already exists, skip or update
                continue;
            }
            console.error(`Error migrating student ${student.id}:`, e.message);
        }
    }

    console.log('Migration completed!');
}

migrate();
