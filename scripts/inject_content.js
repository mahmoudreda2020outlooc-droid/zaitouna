const fs = require('fs');
const path = require('path');

const lecturesPath = path.join(__dirname, '../src/data/lectures.json');
const lectures = JSON.parse(fs.readFileSync(lecturesPath, 'utf8'));

const fullContent = [
    {
        "id": "lecture_5",
        "subjectId": "WEB-201",
        "lectureId": "lecture_5",
        "title": "المحاضرة 5: الـ State Management وملفات PHP",
        "summary": "بص يا بطل، السيرفر بطبيعته بينسى! يعني بمجرد ما يخلص ويعرضلك الصفحة، بيمسح كل حاجة من الذاكرة (Server don't save any state). عشان كده ظهر مفهوم الـ **State Management**، وهو إزاي نخلي السيرفر يفتكر بيانات المستخدم (زي تسجيل الدخول أو المنتجات في السلة).\n\n### 1. إزاي بنحفظ الحالة (State)؟\nفيه كذا طريقة:\n- **URL Query string**: بنبعت البيانات في الرابط.\n- **HTTP Request**: باستخدام الميثودز زي POST.\n- **Hidden Input**: حقل مخفي في الـ HTML Form.\n- **Cookies**: ملفات صغيرة بتتحفظ في جهاز المستخدم.\n- **Sessions**: الذاكرة الخاصة بالسيرفر نفسه.\n\n### 2. الكوكيز (Cookies)\n- ملفات صغيرة بتتبعت من السيرفر لجهاز المستخدم عشان يتعرف عليه.\n- عشان نعمل كوكيز بنستخدم دالة `setcookie($cookie_name, $cookie_value, time() + time, \"/\");` لازم تتكتب قبل أي كود HTML.\n- عشان نقرأ كوكيز بنستخدم `$_COOKIE`.\n- عشان نعدلها بنكتب نفس الدالة بقيمة جديدة، وعشان نمسحها بنحط وقت في الماضي زي `time() - 3600`.\n\n### 3. الجلسات (Sessions)\n- طريقة أفضل وأكثر أماناً عشان بتحفظ الداتا في **السيرفر** مش جهاز العميل.\n- عشان تستخدمها لازم تكتب دالة `session_start();` في أول الصفحة خالص.\n- البيانات بتتحفظ في `$_SESSION['key']`.\n- عشان نمسح السيشن، بنستخدم `session_unset()` لفض المتغيرات، و `session_destroy()` لتدمير السيشن بالكامل.\n\n### 4. التعامل مع الملفات (File Handling)\n- **fopen:** لفتح ملف (وبنديها المود زي 'r' للـ read).\n- **fread:** لقراءة الملف.\n- **readfile:** بتقرأ وتطبع محتوى الملف فوراً.\n- **fgets:** عشان تقرأ سطر واحد بس.\n- لازم نقفل الملف بـ **fclose** عشان نوفر موارد السيرفر.\n\n### الزتونة 🫒\nالـ Session بيفضل على السيرفر لكن الـ Cookie على جهازك. استخدم السيشن دايما للمعلومات الحساسة زي الباسوردات وحالة تسجيل الدخول!",
        "quiz": [
            {
                "type": "mcq",
                "question": "Which of the following is used to store information on the server's memory rather than the user's computer?",
                "options": ["URL Query", "Cookie", "Hidden Input", "Session"],
                "answer": "Session",
                "explanation": "السؤال بيقول إيه اللي بيخزن الداتا على السيرفر؟ الإجابة هي Session، العكس في الكوكيز اللي بتتخزن عند اليوزر.",
                "topic": "State Management"
            },
            {
                "type": "mcq",
                "question": "What is the correct way to delete a PHP Cookie?",
                "options": [
                    "Use the delete() function",
                    "Set the expiration date to a past time",
                    "Set the cookie value to null",
                    "Use unset_cookie()"
                ],
                "answer": "Set the expiration date to a past time",
                "explanation": "الطريقة الصحيحة لمسح الـ Cookie هي تغيير وقت الانتهاء لزمن في الماضي، مثلاً time() - 3600.",
                "topic": "Cookies"
            },
            {
                "type": "tf",
                "question": "A session must be started with the session_start() function before $_SESSION variables can be used.",
                "answer": "true",
                "explanation": "أي صفحة عاوزه تتعامل مع الـ Session لازم تبدأ بمناداة دالة session_start."
            }
        ]
    },
    {
        "id": "lecture_6",
        "subjectId": "WEB-201",
        "lectureId": "lecture_6",
        "title": "المحاضرة 6: مقدمة قواعد البيانات وأوامر SQL",
        "summary": "البرمجة من غير داتا زي العربية من غير بنزين! المحاضرة دي بتدخلك لعالم **قواعد البيانات (Databases)** وازاي نخزن حجم كبير من المعلومات بطريقة منظمة (Structured Way) عشان نقدر نسترجعها ونعدلها بسهولة.\n\n### 1. أنواع أوامر SQL\nاللغة اللي بنكلم بيها الداتا بيز بتتقسم لأنواع:\n- **DDL (Data Definition):** لتعريف وبناء الهيكل زي (CREATE, ALTER, DROP).\n- **DML (Data Manipulation):** للتعامل مع الداتا نفسها زي (INSERT, UPDATE, DELETE).\n- **DQL (Data Query):** للاستعلام وسحب الداتا زي (SELECT).\n- وفي كمان DCL للتحكم و TCL للمعاملات.\n\n### 2. أوامر بناء الداتا بيز (DDL)\n- عشان نعمل דاتا بيز بنكتب: `CREATE DATABASE name;`.\n- عشان نختار داتا بيز نشتغل عليها: `USE name;`.\n- عشان نعمل جدول كامل (Table) بنستعمل `CREATE TABLE` وبنحدد اسم كل عمود ونوع البيانات اللي هيشيلها زي VARCHAR و INT.\n\n### 3. أوامر التغيير والتنظيف\n- **DROP:** بتمسح الجدول أو الداتا بيز من الجذور بكل محتواها وهيكلها.\n- **TRUNCATE:** بيفضي الجدول من كل الداتا اللي جواه لكن الهيكل بتاعه (الأعمدة) بيفضل موجود.\n- **ALTER:** بنستخدمها عشان نعدل على جدول موجود (زي إضافة عمود جديد).\n\n### 4. التعامل مع الداتا (DML & DQL)\n- **SELECT:** بنجيب بيها بيانات من الجدول، ولو کتبنا `SELECT *` هتجيب كل حاجة.\n- **INSERT INTO:** بندخل داتا جديدة جوه الجدول ونحدد أسماء الأعمدة والقيم.\n\n### الزتونة 🫒\nافهم الفرق بين DDL للتعامل مع الهياكل، و DML للتعامل مع البيانات الموجودة، واعرف الفرق الجوهري في إن الـ **DROP** بتطير الجدول بالكامل، بس الـ **TRUNCATE** بيفضيه بس من جواه كأنك عملت Delete لكل اللي فيه مرة واحدة.",
        "quiz": [
            {
                "type": "mcq",
                "question": "Which of the following SQL statements is used to empty a table completely without preserving the structure?",
                "options": ["TRUNCATE", "DROP", "DELETE", "ALTER"],
                "answer": "DROP",
                "explanation": "الـ DROP بتدمر الجدول بكل ما فيه والهيكل كمان، أما ה TRUNCATE بتشيل الداتا بس.",
                "topic": "SQL DDL"
            },
            {
                "type": "mcq",
                "question": "Which category does the SELECT statement belong to?",
                "options": ["DDL", "DCL", "DML", "DQL"],
                "answer": "DQL",
                "explanation": "دالة SELECT بتنتمي لـ Data Query Language (DQL) لأنها بتبحث وتستعلم.",
                "topic": "SQL Categorization"
            },
            {
                "type": "tf",
                "question": "The ALTER TABLE command can be used to add a new column to an already existing table.",
                "answer": "true",
                "explanation": "أمر ALTER مخصص للتعديل على هياكل الجداول زي إضافة أو حذف عمود."
            }
        ]
    },
    {
        "id": "lecture_7",
        "subjectId": "WEB-201",
        "lectureId": "lecture_7",
        "title": "المحاضرة 7: القيود (Constraints) والعلاقات",
        "summary": "عشان الداتا بيز بتاعتك متتبهدلش ويدخل فيها بيانات غلط، لازم تحط **قيود (Constraints)**! دي قواعد بتضمن سلامة وجودة البيانات.\n\n### 1. أنواع القيود (Constraints)\n- **NOT NULL:** بتجبر الخانة دي إنها متكونش فاضية ولازم يتسجل فيها حاجة.\n- **UNIQUE:** بتضمن إن المكتوب هنا ميتكررش أبداً (زي رقم البطاقة مثلاً).\n- **PRIMARY KEY:** هو الكينج! (مزيج من NOT NULL و UNIQUE). ده الرقم أو القيمة اللي بيميز كل صف عن التاني. كل جدول ليه برايمري كي **واحد بس**، بس ممكن يتكون من أكتر من عمود.\n- **FOREIGN KEY:** ده المفتاح الأجنبي! وهو الطريقة اللي بنربط بيها الجداول ببعض. بيكون حقل في جدول (الابن) بيشير إلى الـ Primary Key بتاع جدول تاني (الأب). بيمنعنا نمسح بيانات لسه مستخدمة في جدول تاني.\n\n### 2. الترقيم التلقائي (AUTO_INCREMENT)\n- ده حل سحري بيخلي الـ Id يزيد لوحده 1، 2، 3 كل ما تضيف صف جديد من غير ما تدخله بايدك.\n\n### 3. العلاقات بين الجداول (Relations - RDBMS)\nأنظمة قواعد البيانات العلائقية (Relational) بتعتمد على العلاقات دي:\n- **One-to-One:** زي المريض والتاريخ الطبي بتاعه، كل واحد ليه تاريخ واحد والملف لواحد بس.\n- **One-to-Many:** زي القسم والعمال. القسم فيه عمال كتير، بس العامل بينتمي لقسم واحد.\n- **Many-to-Many:** زي الطلاب والكورسات. الطالب ممكن يسجل في كذا كورس والكورس فيه طلبة كتير. (وبنحلها بإننا نعمل جدول وسيط Bridge!).\n\n### 4. رسم الـ ERD\nده الـ **Entity Relationship Diagram**. رسمة بتوضح الجداول والعلاقات والقيود اللي بينهم عشان نفهم الداتا بيز بعنينا قبل ما نكتب كود. و الـ **EER** هي نسخة مطورة بتدعم حاجات أعقد.\n\n### الزتونة 🫒\nفرق كويس جداً بين الـ Primary Key اللي بيعرف الجدول والـ Foreign Key اللي بيشاور على جدول برا عشان يعمل الـ Relation!\nلو جالك Many To Many لازم تكسرها لجدول جديد فالنص اسمه Pivot/Bridge.",
        "quiz": [
            {
                "type": "mcq",
                "question": "Which of the following constraints is essentially a combination of NOT NULL and UNIQUE?",
                "options": ["AUTO INCREMENT", "PRIMARY KEY", "FOREIGN KEY", "INDEX"],
                "answer": "PRIMARY KEY",
                "explanation": "المفتاح الأساسي لازم يكون موجود وميتكررش عشان يحدد الصف بدون لخبطة.",
                "topic": "Constraints"
            },
            {
                "type": "tf",
                "question": "A table can have multiple PRIMARY KEY constraints applied to different columns independently.",
                "answer": "false",
                "explanation": "الجدول ليه برايمري كي واحد بس، بس ممكن يكون متكون (مدمج) من كذا عمود.",
                "topic": "Constraints"
            },
            {
                "type": "mcq",
                "question": "The relationship between Students and Courses in a university Database is best described as:",
                "options": ["One-to-One", "One-to-Many", "Many-to-Many", "Zero-to-Many"],
                "answer": "Many-to-Many",
                "explanation": "الطلبة بتسجل ف كورسات كتير، والكورس موجود فيه طلبة كتير.",
                "topic": "RDBMS"
            }
        ]
    },
    {
        "id": "lecture_8",
        "subjectId": "WEB-201",
        "lectureId": "lecture_8",
        "title": "المحاضرة 8: التحكم وتتبع النسخ Git و Github",
        "summary": "إزاي تشتغل مع فريق برمجة من غير ما الكود بتاعكم يدخل في بعض وتبوظوا الدنيا؟ الإجابة: **Git**! المحاضرة دي بتعلمك أساسيات حفظ نسخ المشروع وإدارتها.\n\n### 1. إيه هو الـ Git؟\n- ده **Version Control System** (نظام التحكم فالنسخ). أداة بتسجل أي تغيير تعمله، عشان لو الكود باظ في أي لحظة تقدر ترجع للنسخة السليمة!\n- بيساعد تيم كامل يشتغل على نفس الملفات من غير مشاكل عن طريق الفروع (Branches).\n\n### 2. أهم الأوامر للـ Git (في الـ Local)\n- `git init`: بتشغل الـ git في الفولدر وبيعمل ملف مخفي `.git`.\n- `git status`: بتشوف حالة الملفات إيه اللي اتغير ومين متتبع ومين لسه.\n- `git add .`: بتحط كل التعديلات في مرحلة التجهيز (Staged) استعداداً لحفظهم.\n- `git commit -m \"msg\"`: بتاخد اللقطة وتحفظ التعديل ده للابد (Commit).\n- `git log`: بتشوف سجل التاريخ لكل الـ Commits اللي فاتت بـ id بتاعها.\n- `git checkout`: بترجعك لنسخة زمان.\n\n### 3. إيه الفرق بين Git و Github؟\n- **Git:** ده البرنامج نفسه اللي شغال عل جهازك (Local).\n- **Github:** الموقع السحابي (Remote) اللي التيم بيرفع عليه الكود عشان يتشاركوا. وفي بدايل ليه زي GitLab و Bitbucket.\n- بعد ما تعمل Commit عندك في الـ local، بتستخدم `git push` عشان ترميهم على جيت هب.\n- وصاحبك التاني بيستخدم `git pull` عشان يسحبهم عنده.\n\n### 4. الـ git ignore\nملف `.gitignore` ده بنعمله و بنكتب جواه أسماء الملفات اللي مش عايزين جيت هب يرفعها ولايتتبعها. زي باسوردات الداتا بيز (security) أو الملفات الضخمة أوي زي الفيديوهات.\n\n### الزتونة 🫒\nدورة حياة الملفات: في الأول Unmodified، بعد التعديل Modified، بعد ال add بتبقى Staged، ولما نعمل Commit ترجع Unmodified وتتحفظ كالـ HEAD. إحفظ أوامر الـ command line كويس!",
        "quiz": [
            {
                "type": "mcq",
                "question": "Which command is used to add all modified and new files to the staging area in Git?",
                "options": ["git init", "git status", "git add .", "git log"],
                "answer": "git add .",
                "explanation": "الأمر ده هو اللي بيضيف كل التحديثات للـ staging area تحضيراً لعمل اللقطة.",
                "topic": "Git Commands"
            },
            {
                "type": "mcq",
                "question": "What is the physical location that hosts remote Git repositories called?",
                "options": ["GitHup or GitLab", "Git local cache", "Git Terminal", "Git init"],
                "answer": "GitHup or GitLab",
                "explanation": "المتكلم هنا يقصد المنصات السحابية اللي بنرفع عليها الكود، والمحاضرة كاتباها GitHup (Github).",
                "topic": "Git vs Github"
            },
            {
                "type": "tf",
                "question": "If you want Git to completely ignore certain files (like security files), you should list their extensions or names inside the .gitignore file.",
                "answer": "true",
                "explanation": "ملف الـ gitignore وظيفته الأساسية منع تتبع أو رفع أنواع معينة من الملفات للحفاظ على الأمان.",
                "topic": "Git Ignore"
            }
        ]
    }
];

let updatedCount = 0;
fullContent.forEach(newContent => {
    const index = lectures.findIndex(l => l.subjectId === 'WEB-201' && l.lectureId === newContent.lectureId);
    if (index !== -1) {
        // Preserve resources
        const oldResources = lectures[index].resources;
        lectures[index] = { ...newContent, resources: oldResources };
        updatedCount++;
        console.log(`Updated ${newContent.lectureId}`);
    }
});

fs.writeFileSync(lecturesPath, JSON.stringify(lectures, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} lectures with summaries and quizzes!`);
