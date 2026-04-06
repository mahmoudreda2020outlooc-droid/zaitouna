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
    const collId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

    // 1. إعداد المخطط (Attributes)
    console.log("Setting up schema attributes...");
    const attributes = [
        { id: 'studentId', type: 'string', size: 50, required: true },
        { id: 'name', type: 'string', size: 255, required: true },
        { id: 'group', type: 'string', size: 50, required: false },
        { id: 'section', type: 'string', size: 50, required: false },
        { id: 'subGroup', type: 'string', size: 50, required: false },
        { id: 'serial', type: 'integer', required: false }
    ];

    for (const attr of attributes) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(dbId, collId, attr.id, attr.size, attr.required);
            } else if (attr.type === 'integer') {
                await databases.createIntegerAttribute(dbId, collId, attr.id, attr.required);
            }
            console.log(`Attribute '${attr.id}' created.`);
            // نحتاج وقت بسيط بين كل عملية إنشاء عشان Appwrite يلحق يخلص
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
            console.log(`Attribute '${attr.id}' already exists or error:`, e.message);
        }
    }

    // انتظر قليلاً لضمان تفعيل الـ indexes
    console.log("Waiting for indexes to build...");
    await new Promise(resolve => setTimeout(resolve, 5000));

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
