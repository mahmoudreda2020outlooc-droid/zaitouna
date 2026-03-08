const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/students.json'));
let hasErrors = false;

function report(id, msg, name = "") {
    console.log(`[Error] ID: ${id} | Name: "${name}" -> ${msg}`);
    hasErrors = true;
}

const idSet = new Set();
const serialSet = new Map(); // section_group_sub -> [serials]

data.forEach(student => {
    const { id, name, group, section, subGroup, serial } = student;

    // 1. Basic Fields
    if (!id || !name || !group || !section || !subGroup) {
        report(id, "Missing core fields", name);
    }

    // 2. ID Uniqueness
    if (idSet.has(id)) {
        report(id, "Duplicate Student ID", name);
    }
    idSet.add(id);

    // 3. Logic Checks
    if (parseInt(group) > 4 || parseInt(group) < 1) report(id, "Invalid Group", name);
    if (parseInt(section) > 4 || parseInt(section) < 1) report(id, "Invalid Section", name);

    // 4. Name Quality (Conservative)
    if (name.includes("  ")) report(id, "Contains double spaces", name);
});

if (hasErrors) {
    console.log("❌ Validation failed.");
    process.exit(1);
} else {
    console.log(`✅ All ${data.length} students passed integrity checks!`);
}
