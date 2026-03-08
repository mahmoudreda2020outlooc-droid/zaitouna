const fs = require('fs');
const path = require('path');

const studentsPath = path.join(__dirname, 'src', 'data', 'students.json');
const overridesPath = path.join(__dirname, 'src', 'data', 'manual_overrides.json');

const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));
const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

const sections = {
    "1": [
        { s: 5, current: "إبراهيم", correct: "ابراهيم رمضان محمد الشلقاني" },
        { s: 7, current: "إبراهيم", correct: "ابراهيم عبد المؤمن هنداوي هنداوي الفقى" },
        { s: 8, current: "عل ابوزيد", correct: "ابراهيم عبدالرحيم على ابوزيد" },
        { s: 9, current: "عل محمود", correct: "ابراهيم على ابراهيم على محمود" },
        { s: 10, current: "إبراهيم", correct: "ابراهيم مرشدي محمد العباسي" },
        { s: 12, current: "علي", correct: "احلام جمال عبدالقادر على" },
        { s: 16, current: "صبح", correct: "احمد اسامة صبحى عبد الصادق" },
        { s: 17, current: "امي", correct: "احمد امير احمد محمد حداد" },
        { s: 19, current: "ايها", correct: "احمد ايهاب احمد عبد المجيد فزاع" },
        { s: 22, current: "إبراهيم", correct: "احمد إبراهيم إبراهيم عبد الدايم" },
        { s: 24, current: "علي", correct: "احمد جابر عبد الرازق محمد على" },
        { s: 26, current: "مصطق", correct: "احمد جمال مصطفى محمد الجوهري" },
        { s: 28, current: "عبدالله", correct: "احمد حسام عبد الله فهمي" },
        { s: 30, current: "عبدالله", correct: "احمد حسام عبد الله فهمي" },
        { s: 32, current: "حسي عل", correct: "احمد حسين على عبد الحافظ احمد" },
        { s: 36, current: "عبد السميع", correct: "احمد خميس عبد السميع حامد فرج" },
        { s: 39, current: "صيي", correct: "احمد رفيق صبحي احمد على العبد" },
        { s: 44, current: "صبح عل", correct: "احمد صبحى على محمد" },
        { s: 45, current: "عل", correct: "احمد طارق محمد على احمد" },
        { s: 47, current: "ابو ال ييد", correct: "احمد عادل محمد ابو اليزيد" },
        { s: 54, current: "عل عل عل", correct: "احمد عل على على على العياط" }
    ],
    "2": [
        { s: 1, current: "اسامه", correct: "أسامه محمود السيد محمد" },
        { s: 2, current: "اشياء", correct: "اسراء سامي ابراهيم محمد بريك" },
        { s: 5, current: "اشاء", correct: "اسراء" },
        { s: 6, current: "اشاء نصر ابو العيني", correct: "اسراء نصر ابو العينين" },
        { s: 10, current: "عل", correct: "على" },
        { s: 11, current: "سعيد", correct: "سعيد محمد محمد جاب الله" },
        { s: 16, current: "مرس", correct: "مرسى" },
        { s: 17, current: "علي", correct: "على" },
        { s: 21, current: "عدل", correct: "عبد" },
        { s: 25, current: "بنياميم", correct: "بنيامين" },
        { s: 26, current: "سنوس", correct: "سنوسى" },
        { s: 32, current: "مصطق", correct: "مصطفى" },
        { s: 33, current: "مصطق عبد الشاق", correct: "مصطفى عبد الشافى" },
        { s: 34, current: "البسطويس المس ييم", correct: "البسطويسى المسيرى" },
        { s: 35, current: "مصطق", correct: "مصطفى" },
        { s: 38, current: "صيي", correct: "صبحى" },
        { s: 40, current: "ياش", correct: "ياسر" },
        { s: 42, current: "ال خ صرى", correct: "الخضرى" },
        { s: 46, current: "ام ية", correct: "امنية" },
        { s: 47, current: "ام يه جييل", correct: "امنية نبيل" },
        { s: 48, current: "ام يه", correct: "امنية" },
        { s: 49, current: "ام يه سعد عبد العزيز سعد ابوحسي", correct: "امنية سعد عبد العزيز سعد ابوحسين" },
        { s: 51, current: "ام يه حسي", correct: "امنية حسين" },
        { s: 52, current: "ام يه محمود بدري محمد ملك", correct: "امنية محمود بدري محمد مليك" },
        { s: 53, current: "ام يه مرس", correct: "امنية مرسى" },
        { s: 54, current: "امي ارشف", correct: "اميرة اشرف" },
        { s: 55, current: "يح بمحمد", correct: "يحيى محمد" },
        { s: 57, current: "انح", correct: "انس" },
        { s: 58, current: "امي", correct: "امين" },
        { s: 59, current: "عل", correct: "على" },
        { s: 60, current: "مصطق", correct: "مصطفى" },
        { s: 61, current: "ايات", correct: "آيات" },
        { s: 63, current: "اية", correct: "آية شريف" }, // Combined aye + rshf
        { s: 68, current: "امي حسني", correct: "امين حسين" },
        { s: 69, current: "متول", correct: "متولى" },
        { s: 72, current: "امي", correct: "امين" },
        { s: 74, current: "الصاق", correct: "الصافى" },
        { s: 84, current: "عل", correct: "على" },
        { s: 86, current: "إشاء", correct: "إسراء" },
        { s: 87, current: "إشاء", correct: "إسراء" },
        { s: 89, current: "عل الكنان", correct: "على الكنانى" },
        { s: 90, current: "حسي", correct: "حسين" },
        { s: 93, current: "bيلس", correct: "بيلس" },
        { s: 95, current: "ياش", correct: "ياسر" }
    ],
    "3": [
        { s: 12, current: "عبدالعاط ميوك", correct: "عبدالعاطى ملوك" },
        { s: 14, current: "بسيو نحمادة", correct: "بسيونى حمادة" },
        { s: 16, current: "عل", correct: "على" },
        { s: 17, current: "لطق ميوك", correct: "لطفى ملوك" },
        { s: 18, current: "مصطق", correct: "مصطفى" },
        { s: 19, current: "عل الشلقامى", correct: "على الشلقامى" },
        { s: 20, current: "مصطق", correct: "مصطفى" },
        { s: 21, current: "مرس", correct: "مرسى" },
        { s: 23, current: "ها نعبد المنعم", correct: "هانى عبد المنعم" },
        { s: 24, current: "ياش ابو الخي", correct: "ياسر ابو الخير" },
        { s: 25, current: "ياسي عل مجد", correct: "ياسين على مجدى" },
        { s: 26, current: "يح بالسيد شلب", correct: "يحيى السيد شلبى" },
        { s: 27, current: "حسي", correct: "حسين" },
        { s: 30, current: "اروی موسی", correct: "أروى موسى" },
        { s: 31, current: "أشاء", correct: "أسماء" },
        { s: 32, current: "نا جإسماعيل الرميس", correct: "ناجى إسماعيل الرميسى" },
        { s: 36, current: "إيها", correct: "إيهاب" },
        { s: 38, current: "أم ية أرشف", correct: "أمنية أشرف" },
        { s: 39, current: "أم ية صيي", correct: "أمنية صبحى" },
        { s: 40, current: "أم ية", correct: "أمنية" },
        { s: 41, current: "أم يه رضا محمد موس يونس", correct: "أمنية رضا محمد موسى يونس" },
        { s: 42, current: "أم يه", correct: "أمنية" },
        { s: 43, current: "عبدالمول", correct: "عبدالمولى" },
        { s: 47, current: "سيداحمد", correct: "سيد احمد" },
        { s: 52, current: "أرشف", correct: "أشرف" },
        { s: 54, current: "سمي", correct: "سمير" },
        { s: 58, current: "رشيف", correct: "شريف" },
        { s: 60, current: "ياش", correct: "ياسر" },
        { s: 65, current: "عل", correct: "على" },
        { s: 67, current: "أرشف", correct: "أشرف" },
        { s: 71, current: "الصاق عل", correct: "الصافى على" },
        { s: 76, current: "عل", correct: "على" },
        { s: 77, current: "مرا جموس", correct: "مراد موسى" },
        { s: 81, current: "لطق", correct: "لطفى" },
        { s: 82, current: "مصطق", correct: "مصطفى" },
        { s: 85, current: "يح بحسي", correct: "يحيى حسين" },
        { s: 90, current: "موس كريم", correct: "موسى كريم" },
        { s: 91, current: "شوق فهم", correct: "شوقى فهمى" },
        { s: 92, current: "تها نحمدي عل", correct: "تهانى حمدى على" },
        { s: 94, current: "أرشف", correct: "أشرف" }
    ],
    "4": [
        { s: 3, current: "عل", correct: "على" },
        { s: 7, current: "جب", correct: "جنى" },
        { s: 8, current: "جب رجب", correct: "جنى رجب" },
        { s: 9, current: "جب", correct: "جنى" },
        { s: 11, current: "جب", correct: "جنى" },
        { s: 12, current: "جب", correct: "جنى" },
        { s: 13, current: "جب ياش", correct: "جنى ياسر" },
        { s: 14, current: "جب", correct: "جنى" },
        { s: 15, current: "جب", correct: "جنى" },
        { s: 20, current: "ها نوليم اسكندر", correct: "هانى وليم اسكندر" },
        { s: 24, current: "ياسي", correct: "ياسين" },
        { s: 31, current: "لطق", correct: "لطفى" },
        { s: 35, current: "إيها", correct: "إيهاب" },
        { s: 44, current: "عل", correct: "على" },
        { s: 53, current: "يح", correct: "يحيى" },
        { s: 54, current: "اكرامى", correct: "اكرامي" },
        { s: 55, current: "عني", correct: "عوض" },
        { s: 57, current: "إيها", correct: "إيهاب على" },
        { s: 60, current: "عبد الله", correct: "عبدالله" },
        { s: 65, current: "حسنی محمد حسنی", correct: "حسنى محمد حسنى" },
        { s: 70, current: "أرشف / موس", correct: "أشرف موسى" },
        { s: 72, current: "حني حارس", correct: "حنين حارس" },
        { s: 75, current: "حني سمي عل", correct: "حنين سمير على" },
        { s: 78, current: "ر سري", correct: "عشرى" },
        { s: 80, current: "عبدالراض طه", correct: "عبدالراضى طه" },
        { s: 81, current: "حني ماهر عل", correct: "حنين ماهر على" },
        { s: 84, current: "حني هاشم", correct: "حنين هاشم" },
        { s: 86, current: "حني ياش", correct: "حنين ياسر" },
        { s: 87, current: "سمي", correct: "سمير" },
        { s: 88, current: "سمي", correct: "سمير" },
        { s: 91, current: "خطا", correct: "خطاب" },
        { s: 96, current: "رشيف / مصطق", correct: "شريف مصطفى" },
        { s: 97, current: "خطا", correct: "خطاب" }
    ]
};

console.log('Applying bulk fixes...');
let updatedCount = 0;

for (const [sec, items] of Object.entries(sections)) {
    items.forEach(item => {
        const secStudents = students.filter(s => s.group === "1" && s.section === sec);

        // Find by serial (with potential shift for Sec 1)
        let potentialSerials = [item.s];
        if (sec === "1") potentialSerials = [item.s, item.s - 2];

        let match = secStudents.find(s => potentialSerials.includes(s.serial) && (!item.current || s.name.includes(item.current)));

        if (!match && item.current) {
            match = secStudents.find(s => s.name.includes(item.current));
        }

        if (match) {
            let finalName = item.correct;
            // If the user's correct name is a partial like "على", we should replace the fragment in the original name
            // But looking at the user's instructions, they often mean "the correct name should be X"
            // If it's a full name in my mapping above, I'll use it.
            // If it's a small fragment, I'll replace it in the original.

            // Actually, for most names I've put the full expected name in my 'correct' field.
            // Let's check some. 
            // Correct: "مصطفى" -> this is NOT a full name.
            // I should be smart here.

            if (finalName.length < 10 && match.name.length > 15) {
                // Replace fragment
                finalName = match.name.replace(new RegExp(item.current, 'g'), item.correct);
            }

            overrides[match.id] = finalName;
            updatedCount++;
        } else {
            console.log(`Failed to match: Section ${sec} Serial ${item.s} Name ${item.current}`);
        }
    });
}

// Special case for Group 1 Section 1 Serial 28 & 30 "عبدالله" -> "عبد الله"
// (Already in my list as full name corrections)

fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2));
console.log(`Updated ${updatedCount} students.`);
