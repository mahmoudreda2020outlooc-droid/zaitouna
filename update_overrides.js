const fs = require('fs');
const path = require('path');

const overridesPath = path.join(__dirname, 'src', 'data', 'manual_overrides.json');
const manualOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

const newOverrides = {
    "2420013": "احمد ابراهیم اسماعيل خلف الله على",
    "2420022": "احمد إبراهيم إبراهيم عبد الدايم",
    "2420030": "احمد حسام عبدالله فهمی",
    "2420057": "احمد عبده على عبد الله",
    "2420103": "اروا عبد الرازق عبد الحميد عبد الرازق",
    "2420108": "اسامه محمود السيد محمد",
    "2420117": "اسلام عبد اللطيف فرحات عبداللطيف",
    "2420136": "الاء احمد محمد احمد البهواشي",
    "2420159": "اميره صبحي ابراهيم عبدالعاطی شرف",
    "2420195": "إبراهيم محمد محمد عبد الباقی",
    "2420237": "أروى منتصر عبد الجواد عيسوى موسى",
    "2420238": "اروی موسی محمد نبيه موسى الخولى",
    "2420259": "آلاء السيد عبد الحميد عبد الحليم",
    "2420279": "بسمله اسلام عبدالله سلام",
    "2420320": "جنی محمد جمعه محمد ابراهيم عبد الجواد",
    "2420335": "چنى رضا محمود محمد",
    "2420338": "حازم إبراهيم أحمد محمد الاصور",
    "2420365": "حبيبه نشات محمود عطيه",
    "2420380": "حسنی محمد حسنی محمد"
};

Object.assign(manualOverrides, newOverrides);

// Sort keys for neatness
const sortedOverrides = Object.keys(manualOverrides).sort().reduce((acc, key) => {
    acc[key] = manualOverrides[key];
    return acc;
}, {});

fs.writeFileSync(overridesPath, JSON.stringify(sortedOverrides, null, 2));
console.log('Overrides updated successfully.');
