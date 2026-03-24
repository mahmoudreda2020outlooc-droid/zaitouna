const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/lectures.json');

const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const lecture = db.find(l => l.id === "db_202_lecture_1");
if (lecture) {
    // Manually fix first 5 questions for immediate results
    lecture.quiz[0] = {
        ...lecture.quiz[0],
        question: "What is the definition of Data based on the lecture?",
        options: [
            "Processed information ready for decision making",
            "Raw facts, numbers, or text with no meaning on their own",
            "Specialized programs for managing tables",
            "Physical storage devices like hard disks"
        ],
        answer: "Raw facts, numbers, or text with no meaning on their own",
        explanation: "Data is the raw material that hasn't undergone any processing yet, like the number 25 by itself having no meaning.",
        question_ar: "ما هو تعريف الـ Data بناءً على المحاضرة؟",
        options_ar: [
            "معلومات معالجة وجاهزة لاتخاذ القرار",
            "حقائق خام، أرقام، أو نصوص ليس لها معنى بمفردها",
            "برامج متخصصة في إدارة الجداول",
            "أجهزة تخزين فيزيائية مثل الهارد ديسك"
        ],
        answer_ar: "حقائق خام، أرقام، أو نصوص ليس لها معنى بمفردها",
        explanation_ar: "الـ Data هي المادة الخام اللي لسه متعملش عليها أي معالجة، زي رقم 25 لوحده كده ملوش معنى."
    };

    lecture.quiz[1] = {
        ...lecture.quiz[1],
        question: "The File System (File System) is characterized by the presence of strong and clear relationships between data.",
        options: [],
        answer: "false",
        explanation: "On the contrary, the file system's problems include the lack of relationships and the data in it remains lost from each other.",
        question_ar: "نظام الملفات (File System) يتميز بوجود علاقات قوية وواضحة بين البيانات.",
        answer_ar: "خطأ",
        explanation_ar: "بالعكس، نظام الملفات مشاكله إن مفيش روابط (No relationships) والبيانات فيه بتبقى تايهة عن بعضها."
    };

    lecture.quiz[2] = {
        ...lecture.quiz[2],
        question: "The use of the traditional file system leads to what is called _______ (data duplication).",
        options: [],
        answer: "Redundancy",
        explanation: "Redundancy means that data is duplicated in several files, which wastes space and causes confusion.",
        question_ar: "يؤدي استخدام نظام الملفات التقليدي إلى حدوث ما يسمى بـ _______ (تكرار البيانات).",
        answer_ar: "Redundancy",
        explanation_ar: "الـ Redundancy يعني إن البيانات متكررة في كذا ملف، وده بيضيع مساحة وبيعمل لخبطة."
    };

    lecture.quiz[3] = {
        ...lecture.quiz[3],
        question: "Which of the following is considered an example of Data Storage?",
        options: ["MySQL", "Oracle", "Cloud storage (Google Drive)", "Student Database"],
        answer: "Cloud storage (Google Drive)",
        explanation: "Storage is the place where files are physically saved, like google drive or hard disks.",
        question_ar: "أي من التالي يعتبر مثالاً على الـ Data Storage (مكان التخزين الفيزيائي)؟",
        options_ar: ["MySQL", "Oracle", "Cloud storage (Google Drive)", "Student Database"],
        answer_ar: "Cloud storage (Google Drive)",
        explanation_ar: "الـ Storage هو المكان اللي بنحفظ فيه الملفات فعلياً، سواء هارد ديسك أو سحابة إلكترونية."
    };

    lecture.quiz[4] = {
        ...lecture.quiz[4],
        question: "A Database is an organized collection of data stored electronically and allows for easy updates and retrieval.",
        options: [],
        answer: "true",
        explanation: "This is the definition of a database: organization and ease of access.",
        question_ar: "الـ Database هي مجموعة منظمة من البيانات المخزنة إلكترونياً وتسمح بالتحديث والاسترجاع السهل.",
        answer_ar: "صح",
        explanation_ar: "ده بالظبط تعريف قاعدة البيانات، تنظيم وسهولة في الوصول للبيانات."
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
    console.log("✅ Priority fix applied to first 5 questions of db_202_lecture_1.");
}
