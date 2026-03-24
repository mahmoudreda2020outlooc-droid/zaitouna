const fs = require('fs');

const db = JSON.parse(fs.readFileSync('src/data/lectures.json', 'utf-8'));

const jav5idx = db.findIndex(l => l.subjectId === 'JAV-110' && l.lectureId === 'lecture_5');
if (jav5idx !== -1) {
    db[jav5idx].title = 'المحاضرة 5: مبادئ الـ OOP في Java';
    db[jav5idx].summary = `تخيل إنك بتبني عالم من الأشياء الحقيقية جوا الكمبيوتر! محاضرة اليوم هي الأساس اللي كل برمجة Java بتتبنى عليه: الـ **Object-Oriented Programming (OOP)**، وهي طريقة تفكير بتخلي الكود أبسط وأكتر منطقية.

### 1. إيه هو الـ OOP ولماذا نستخدمه؟

- الـ **OOP** ببساطة هو إنك تنظّم البرنامج بتاعك كمجموعة "كائنات" (Objects) كل واحد فيهم عنده داتا وسلوك.
- بيحسّن **إعادة الاستخدام** (Code Reusability): اكتب الكود مرة واستخدمه في مكان تاني.
- بيسهّل الـ **Maintenance**: تعديل جزء من البرنامج مش بيأثر على الباقي.
- بيقرّبك من الواقع: عربية BMW كـ Object من Class اسمه Car.

### 2. الـ Class: المخطط (Blueprint)

- الـ **Class** هو "مخطط" أو "قالب" للإنشاء. مش الشيء نفسه، بس بيعرّف شكله.
- بنعرّفه بكلمة \`class\` في Java.
- مثال: \`Car\` هي الـ **Class**، و BMW و Mercedes كل واحدة فيهم **Object** (نسخة).

### 3. الـ Object: الكائن الحقيقي

- الـ **Object** هو النسخة الفعلية من الـ Class. بنعمله بكلمة \`new\`.
- كل Object عنده قيمه الخاصة للـ fields المعرّفة في الـ Class.
- ممكن تعمل أكتر من Object من نفس الـ Class وكل واحد مستقل عن التاني.

### 4. الـ Encapsulation: التغليف

- الـ **Encapsulation** يعني إنك تخبّي الداتا الداخلية للـ Object وتتحكم في الوصول ليها.
- بنعمل الـ fields \`private\` وبنوفّر \`getters/setters\` للوصول ليها بأمان.

### 5. الـ Inheritance: الوراثة

- الـ **Inheritance** بتخلي Class يرث Properties وMethodsمن Class تاني (Parent).
- بنستخدم كلمة \`extends\`.
- مثال: \`Dog extends Animal\` يعني الكلب بيرث خصائص الحيوان وبيضيف خصائصه الخاصة.
- بيوفّر وقت ومجهود لأن الكود المشترك بيتكتب مرة واحدة.

### 6. الـ Polymorphism: تعدد الأشكال

- الـ **Polymorphism** يعني إن Method واحدة بالاسم تتصرّف بشكل مختلف حسب الـ Object اللي بتنادي عليها.
- في نوعين: **Method Overloading** (نفس الاسم، بارامترات مختلفة) و**Method Overriding** (الابن بيغير سلوك الأب).

### 7. الـ Abstraction: التجريد

- الـ **Abstraction** يعني إنك تخبّي التفاصيل المعقدة وتظهر بس اللي المستخدم محتاجه.
- بنحققها بالـ **Abstract Classes** أو **Interfaces**.

### الزتونة 🫒
ذاكر الأربع مبادئ: **Encapsulation** (تغليف)، **Inheritance** (وراثة)، **Polymorphism** (تعدد أشكال)، **Abstraction** (تجريد). ودي هتيجي في كل امتحان. يلا بالتوفيق يا بطل!`;
}

fs.writeFileSync('src/data/lectures.json', JSON.stringify(db, null, 2), 'utf-8');
console.log('Done! JAV-110 lecture_5 fixed.');
